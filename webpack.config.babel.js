import webpack from "webpack";
import path from "path";

export default [
  {
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
  },
  {
    entry: "./src/server/server.js",
    target: "node",
    output: {
      libraryTarget: "commonjs",
      filename: "./dist/server.js"
    },
    externals: [ /^(?!\.|\/).+/i, ],
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
]
