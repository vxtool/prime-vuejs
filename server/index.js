'use strict';
const PORT = process.env.PORT || 8000;
const path = require('path');
const dnscache = require('dnscache');

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const config = require('../internals/webpack/webpack.config');

  new WebpackDevServer(webpack(config), {
    contentBase: './',
    publicPath: config.output.publicPath,
    hot: true,
    inline: false,
    historyApiFallback: true,
    stats: { colors: true },
    headers: { 'Access-Control-Allow-Origin': '*' },
  }).listen(PORT, err => {
    if (err) {
      return console.log(err);
    }
    console.log('Server running on http://localhost:', PORT);
  });
} else {
  const express = require('express');
  const app = express();

  app.engine('html', require('ejs').__express);
  app.set('views', path.join(__dirname, '../dist'));
  app.set('view engine', 'html');

  app.use(express.static('dist'));

  app.get('*', (req, res) => {
    res.render('index', {});
  });

  const server = app.listen(PORT, () => {
    const host = server.address().address;
    const { port } = server.address();
    console.log('Server running on http://%s:%s', host, port);
  });
}
