var path = require('path');
module.exports = {
  devtool: 'source-map',
  entry: {
    app: ['./js/core.js'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build/',
    filename: 'bundle.js',
  },
};