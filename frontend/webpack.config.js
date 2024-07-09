const path = require("path");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/, // Handles CSS files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/, // Handles SVG files
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: false, // or customize your SVGO options
            },
          },
          "file-loader",
        ],
      },
    ],
  },
  plugins: [
    new Dotenv(), // Loads environment variables from .env file
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Path to your HTML file
      filename: "index.html",
      inject: "body",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"], // Resolves JavaScript and JSX files
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    historyApiFallback: true, // Ensures React Router works with the dev server
  },
};
