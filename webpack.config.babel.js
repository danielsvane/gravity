import webpack from "webpack";
import path from "path";

console.log(path.join(__dirname, "src"));

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
          loader: "babel-loader",
          include: path.join(__dirname, "src")
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
