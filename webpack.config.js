const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


const resolve = (...args) => path.resolve(__dirname, ...args);

const isDev = process.env.NODE_ENV !== 'production';
const output = resolve(isDev ? 'src/preview' : 'dist');

module.exports = {
  entry: {
    index: resolve(`src/${isDev ? 'preview' : 'explorer'}/index`),
  },

  output: Object.assign({
      path: output,
      filename: '[name].js'
    },
    !isDev && {
      library: 'ConfigExplorer',
      libraryTarget: 'umd',
    }),

  module: {
    loaders: isDev ? [] : [
        {
          test: /\.js/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            }
          }
        }
      ]
  },

  plugins: isDev ? [
      new webpack.HotModuleReplacementPlugin()
    ] : [
      new CleanWebpackPlugin(['dist']),
      new UglifyJSPlugin({
        comments: false,
        sourceMap: true,
      }),
    ],

  devServer: {
    contentBase: output,
    hot: true
  }
};