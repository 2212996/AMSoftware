const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'electron/index': './app/app-production.js',
    'react/index': './app/index.jsx',
  },

  output: {
    filename: './public/built/[name].js',
  },

  module: {
    loaders: [
      { test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(scss|sass)$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/, loader: 'url-loader' },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.woff', '.woff2', 'ttf', 'svg'],
  },

  target: 'electron-renderer',

  node: {
    __dirname: false,
    __filename: false,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index-production.html',
      filename: path.join(__dirname, 'public/', 'built/', 'index.html'),
      inject: false,
    }),
  ],
};
