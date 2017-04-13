const path = require('path');
const webpack = require('webpack');

const resolve = (...args) => path.resolve(__dirname, ...args);

const isDev = process.env.NODE_ENV !== 'production';
const output = resolve(`src/${isDev ? 'preview' : 'dist'}`);

module.exports = {
  entry: {
    index: resolve(`src/${isDev ? 'preview' : 'explorer'}/index`),
  },

  output: {
    path: output,
    filename: '[name].js'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  
  devServer: {
    contentBase: output,
    hot: true
  }
};