const fs = require("fs")
const path = require("path")
const babel = require("@babel/core")
const logger = require("@tilework/mosaic-dev-utils/logger")

function transformImports(code, transformer) {
  const parts = []
  let alias = []
  let configPath

  try {
    const extendconfigPath = path.join(process.cwd(), "extendconfig.json")
    let extendconfig = fs.readFileSync(extendconfigPath).toString()
    extendconfig = JSON.parse(extendconfig)
    if (extendconfig?.compilerOptions?.paths) {
      configPath = extendconfig?.compilerOptions?.paths
      for (pathKey in configPath) {
        alias.push(pathKey.replace("/*", ""))
      }
    } else {
      console.log("extendconfig.json is missing")
    }
  } catch (e) {
    console.log("Error in extendconfig.json ", e)
  }

  // console.log('transformImports -->' )
  // console.log('transformImports code -------------->', code)
  // Extract all import locations
  babel.transformSync(code, {
    babelrc: false,
    configFile: false,
    // presets: ['@babel/preset-react'],
    presets: [
      "@babel/preset-react",
      ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
    ],
    plugins: [
      // "@babel/plugin-transform-typescript",
      //  [
      //     "@babel/plugin-transform-spread",
      //     {
      //     "loose": true
      //     }
      // ],
      {
        visitor: {
          ImportDeclaration({
            node: {
              source: { start, end },
            },
          }) {
            parts.push({ start, end })
          },

          CallExpression({ node }) {
            // Import non-import calls
            if (
              node.callee.type !== "Import" &&
              node.callee.name !== "require"
            ) {
              return
            }

            // Get the argument
            const importable = node.arguments[0]

            // Warn about critical deps
            if (importable.type !== "StringLiteral") {
              const warningCode = logger.style.code(
                code.substring(node.start, node.end)
              )

              logger.warn(
                `Critical dependency found: "${warningCode}".`,
                "It is not recommended to import modules in such a manner, it may not work as expected."
              )

              return
            }

            // Store the importable
            parts.push({
              start: importable.start,
              end: importable.end,
            })
          },
        },
      },
    ],
  })

  // get fileName with extension
  const getFileNameWithExtn = (options) => {
    const { filePathPrefix, baseFileName } = options
    let fileNameWithExtn
    const fileNames = []

    fs.readdirSync(filePathPrefix).forEach((file) => {
      const parsedPath = path.parse(file)
      if (parsedPath?.ext) {
        fileNames.push(parsedPath?.base)
      }
    })

    if (fileNames?.length > 0) {
      fileNameWithExtn = fileNames.find((fileName) => {
        const baseName = path.parse(fileName)?.name
        return baseName == baseFileName
      })
    }
    return fileNameWithExtn
  }

  // Transform all
  const transformedPieces = parts.reduce(
    ({ lastIndex, result }, part) => {
      const { start, end } = part
      let importable = code.substring(start + 1, end - 1)
      const importUrl = importable.split("/")
      const importPrefix = importUrl?.[0]

      // checking if the import has any alias
      if (alias.length > 0 && alias.includes(importPrefix)) {
        const localPaths = configPath[`${importPrefix}/*`]

        // use all the available alias to construct absolute path
        for (var i = 0; i < localPaths.length; i++) {
          const commonPath = localPaths[i]
            ?.split(path.sep)
            ?.join(path.posix.sep)
            ?.replace("/*", "")
          const tempUrl = JSON.parse(JSON.stringify(importUrl))
          let absoluteFilePath = `${commonPath}/${tempUrl
            ?.splice(1)
            ?.join("/")}`
          const fileExtension = path.parse(absoluteFilePath)?.ext

          // If extension is not available we need to find the file with extension
          if (!fileExtension) {
            const baseFileName = path.parse(absoluteFilePath)?.base
            const filePathPrefix = absoluteFilePath.substring(
              0,
              absoluteFilePath.lastIndexOf("/")
            )

            // try to check if it has exact file import
            // eg: folder/sub-folder/fileName
            let fileNameWithExtn = getFileNameWithExtn({
              filePathPrefix,
              baseFileName,
            })

            if (fileNameWithExtn) {
              absoluteFilePath = `${filePathPrefix}/${fileNameWithExtn}`
            } else {
              // if the import is index file then getting index file with extension
              let fileNameWithExtn = getFileNameWithExtn({
                filePathPrefix: absoluteFilePath,
                baseFileName: "index",
              })

              absoluteFilePath = `${absoluteFilePath}/${fileNameWithExtn}`
            }
          }

          const isValidFilePath = fs.existsSync(absoluteFilePath)

          if (isValidFilePath) {
            importable = path.join(process.cwd(), absoluteFilePath)
            break
          }
        }
      }

      const transformed = transformer(importable)
        .split(path.sep)
        .join(path.posix.sep)

      return {
        lastIndex: end,
        result: [
          ...result,
          code.substring(lastIndex, start),
          `"${transformed}"`,
        ],
      }
    },
    {
      lastIndex: 0,
      result: [],
    }
  )

  return [
    ...transformedPieces.result,
    code.substr(transformedPieces.lastIndex),
  ].join("")
}

module.exports = transformImports
