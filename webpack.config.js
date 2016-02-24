/**
 * Base config for Webpack (and development)
 */
'use strict';
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const srcPath = path.join(__dirname, './src');
function srcPathTo(dir) {
  return path.join(srcPath, dir);
}

module.exports = {
  conext: srcPath,
  target: 'electron',
  devtool: 'eval-cheap-module-source-map',
  entry: {
    bundle: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './src/js/core.js',
    ],
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: `http://localhost:3000/build/`,
    filename: 'bundle.js',
  },

  resolve: {
    alias: {
      styles: srcPathTo('styles/'),
      graphics: srcPathTo('graphics/'),
      data: srcPathTo('data/'),
      audio: srcPathTo('audio/'),
    },
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader?cacheDirectory,presets[]=es2015',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader!postcss-loader',
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?|png|jpg|gif|mp3|ogg)$/,
        loader: 'file-loader?name=[path][name].[ext]',
      },
    ],
  },

  postcss: function() {
    return [autoprefixer];
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ]
};
