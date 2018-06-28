const path = require('path');

const config = {
  entry: [
    './index.js',
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader',
        ]
      }
    ],
  },
};

module.exports = config;
