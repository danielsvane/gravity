import webpack from "webpack";

export default {
  entry: "./src/client/client.js",
  output: {
    filename: "./dist/client.min.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
}
