const path = require('path');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

process.traceDeprecation = true;
process.noDeprecation = true;

const { NODE_ENV } = process.env;
const isProd = () => NODE_ENV === 'production';

const hash = (type = '') => (isProd() ? `.[${type}hash]` : '');
const getEntryApp = () => {
  if (isProd()) {
    return [path.resolve(__dirname, '../../source/main')];
  }
  return [
    'webpack-hot-middleware/client',
    path.resolve(__dirname, '../../source/main'),
  ];
};

const config = {
  mode: isProd() ? 'production' : 'development',
  entry: {
    polyfill: '@babel/polyfill',
    main: getEntryApp(),
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: `[name]${hash('chunk')}.js`,
    chunkFilename: `chunk.[id]${hash('chunk')}.js`,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.vue', '.scss', '.css'],
    alias: {
      'vue$': isProd ? 'vue/dist/vue.runtime.min.js' : 'vue/dist/vue.runtime.js',
      '@': path.resolve(__dirname, '../../source')
  }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        include: [ path.resolve(__dirname, '../../source') ],
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [ path.resolve(__dirname, '../../source') ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          isProd() ? MiniCSSExtractPlugin.loader : 'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: true,
              modules: {
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')
              ],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline'
      },
      {
        test: /\.(jpe?g|jpg|gif|ico|png|woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'main.min.css',
      chunkFilename: '[id].css',
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.EnvironmentPlugin({
      APP_BROWSER: true,
      NODE_ENV: isProd() ? 'production' : 'development',
    }),
    isProd() ? '' : new webpack.HotModuleReplacementPlugin(),
  ],
  stats: {
    children: false,
  }
};

if (isProd()) {
  config.devtool = 'source-map';
  config.optimization.minimizer = [
    new OptimizeCssAssetsPlugin(),
    new UglifyJSPlugin({
      cache: true,
      parallel: true,
      sourceMap: !isProd
    })
  ];
  config.optimization.splitChunks = {
    chunks: 'all',
    maxInitialRequests: Infinity,
    minSize: 0,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name (module) {
          const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
          return `npm.${packageName.replace('@', '')}`;
        }
      },
      styles: {
        test: /\.css$/,
        name: 'styles',
        chunks: 'all',
        enforce: true
      }
    }
  };
}

module.exports = config;
