const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'source/index.js'),
  output: {
      publicPath: '/',
      path: __dirname,
      filename: 'dist/bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.vue$/, loader: 'vue', exclude: /node_modules/ },
      { test: /\.html$/, loader: 'vue-html', exclude: /node_modules/ }
    ]
  },
  worker: { output: { filename: 'dist/worker.js' } },
  devServer: { contentBase: __dirname },
  devtool: 'source-map',
  cache: true,
  debug: false
};
