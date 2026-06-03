// In webpack.config.js under module.rules
{
  test: /\.js$/,
  enforce: 'pre',
  use: ['source-map-loader'],
  exclude: [
    /node_modules\/react-datepicker/ // ⛔ exclude this package
  ],
}
