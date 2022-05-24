const fs = require("fs")
const path = require("path")
fs.rmSync(path.resolve("./dist"), { recursive: true, force: true })
