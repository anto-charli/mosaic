// import getData from "../zutil/get-data"
// import page from "@tilework/mosaic-sample-page";

console.log({ works: process.env.IS_WORKING })

/* @namespace Pages/sample/Page*/
function SamplePage() {
  /* @namespace Pages/sample/description*/
  const renderDescription = () => {
    return "This is the description"
  }

  /* @namespace Pages/sample/rating*/
  const renderRating = () => {
    return "This is the rating"
  }

  return (
    <div>
      <img src="/picture.jpeg" alt="picture" />
      <h1>Homepage</h1>
      <p>Welcome to the webpage!</p>
      {/* <p>Data: {getData()}</p> */}
      <div>{renderDescription()}</div>
      <div>{renderRating()}</div>
    </div>
  )
}

export default SamplePage
