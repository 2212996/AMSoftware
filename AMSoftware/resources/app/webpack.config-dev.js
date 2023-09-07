const webpack = require('webpack');
//

module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './app/index.jsx'],
    // app: './app/index.jsx',
  },

  output: {
    // path: './public/built',
    path: '/',
    filename: 'mainBundle.js',
    publicPath: 'http://localhost:8080/built/',
  },

  node: {
    __dirname: false,
    __filename: false,
    fs: 'empty',
  },

  externals: [
    { './cptable': 'var cptable' },
    { './jszip': 'jszip' },
  ],

  target: 'electron-renderer',

  //
  devServer: {
    contentBase: './public',
    publicPath: 'http://localhost:8080/built/',
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    noParse: [/jszip.js$/],
    loaders: [
      { test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(scss|sass)$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/, loader: 'url-loader' },
    ],
  },

  //
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};
