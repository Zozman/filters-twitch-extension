const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => {
  let devtool = false;
  if (argv.mode && argv.mode === 'development') {
    devtool = 'eval';
  }
  return {
    mode: argv.mode,
    entry: {
      extension: [path.resolve(__dirname, "./src/overlay/index.ts")]
    },
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "[name].[contenthash].bundle.js",
      publicPath: "",
    },
    optimization: {
      minimize: false,
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        // Used for loading scss files
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "lit-css-loader",
            },
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  outputStyle: "compressed",
                },
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif|ico|webp)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/[name].[contenthash].[ext]',
              },
            }
          ],
        }
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    devServer: {
      port: 8083,
      host: "localhost",
      hot: true,
      compress: true,
      devMiddleware: {
        index: "index.html",
      },
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(process.env.npm_package_version),
      }),
      new HtmlWebpackPlugin({
        template: "./src/overlay/index.html",
        filename: "index.html",
        hash: true,
        inject: "head",
        chunks: ["extension"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            context: "node_modules/@webcomponents/webcomponentsjs",
            from: "webcomponents-loader.js",
            to: "webcomponents",
          },
          {
            context: 'node_modules/@shoelace-style/shoelace/dist/themes',
            from: '*.css',
            to: 'shoelace/themes',
          }
        ],
      }),
    ],
    devtool,
  };
};