const fs = require('fs');
const path = require('path');
const { rspack } = require('@rspack/core');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// We need to generate a list of locales that Shoelace supports for out localization logic
const shoelaceLocalesDirectory = path.resolve(__dirname, "./node_modules/@shoelace-style/shoelace/dist/translations");
const shoelaceLocales = [];
fs.readdirSync(shoelaceLocalesDirectory).forEach(file => {
  if (file.endsWith('.js')) {
    const locale = file.split('.')[0];
    shoelaceLocales.push(locale);
  }
});

module.exports = (env, argv) => {
  let devtool = false;
  if (argv.mode && argv.mode === 'development') {
    devtool = 'eval';
  }
  /** @type {import('@rspack/cli').Configuration} */
  const config = {
    mode: argv.mode,
    entry: {
      extension: [path.resolve(__dirname, "./src/overlay/index.ts")],
      config: [path.resolve(__dirname, "./src/config/index.ts")]
    },
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "[name].[contenthash].bundle.js",
      publicPath: "",
      assetModuleFilename: "assets/[name].[contenthash].[ext]"
    },
    optimization: {
      minimize: devtool ? true : false,
    },
    module: {
      rules: [
        // Loading TypeScript
        {
          test: /\.ts?$/,
          type: 'javascript/auto',
          use: [
            {
              loader: 'minify-html-literals-loader'
            },
            {
              loader: 'builtin:swc-loader',
              /** @type {import('@rspack/core').SwcLoaderOptions} */
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                    decorators: true,
                  },
                  transform: {
                    legacyDecorator: true,
                    useDefineForClassFields: false
                  },
                },
              }
            }
          ],
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
                  api: 'modern-compiler',
                  implementation: require.resolve('sass-embedded')
                },
              },
            },
          ],
        },
        // Loading images
        {
          test: /\.(png|svg|jpg|gif|ico|webp)$/,
          type: 'asset/resource',
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
      open: env.page ? [`/${env.page}`] : ['/'],
      compress: true,
      devMiddleware: {
        index: "index.html",
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new rspack.DefinePlugin({
        VERSION: JSON.stringify(process.env.npm_package_version),
        SHOELACE_LOCALES: JSON.stringify(shoelaceLocales)
      }),
      new rspack.HtmlRspackPlugin({
        template: "./src/overlay/index.html",
        filename: "index.html",
        hash: true,
        inject: "head",
        chunks: ["extension"],
      }),
      new rspack.HtmlRspackPlugin({
        template: "./src/config/index.html",
        filename: "config.html",
        hash: true,
        inject: "head",
        chunks: ["config"],
      }),
      new rspack.CopyRspackPlugin({
        patterns: [
          // Used to ensure Webcomponent compatibility for older browsers
          {
            context: "node_modules/@webcomponents/webcomponentsjs",
            from: "webcomponents-loader.js",
            to: "webcomponents",
          },
          // Copy theme css for Shoelace
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
  return config;
};
