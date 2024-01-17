const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    popup: path.resolve("./src/popup/popup.tsx"),
    options: path.resolve("./src/options/options.tsx"),
    background: path.resolve("./src/background/background.ts"),
    contentScript: path.resolve("./src/contentScript/contentScript.ts"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                indent: "postcss",
                plugins: ["tailwindcss", "autoprefixer"],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "index.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/static/manifest.json"),
          to: path.resolve("dist"),
        },
      ],
    }),
    ...getHtmlPlugins(["popup", "options"]),
  ],
  output: {
    filename: "[name].js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        filename: `${chunk}.html`,
        title: "Chrome Extension",
        chunks: [chunk],
      })
  );
}
