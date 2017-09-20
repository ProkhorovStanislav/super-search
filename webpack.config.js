const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/main.js'
  ],
  output: {
    path: path.join(__dirname, 'assets'),
    filename: 'main.js',
    publicPath: ''
  },
  module: {
    loaders: [
      {
        test: /\.js/,
        include: path.join(__dirname, 'src')
      }
    ]
  }
};