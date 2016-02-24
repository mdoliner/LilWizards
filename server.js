/**
 * Created by Justin on 2016-02-23.
 */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');
const PORT = 3000;

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    color: true,
  },
});

server.listen(PORT, err => {
  if (err) console.log(err);

  console.log('Lil-Wizards webpack server started at localhost:' + PORT);
  console.log('Please open another tab and run `npm run electron`');
});
