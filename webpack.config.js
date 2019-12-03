const path = require('path');  //require is used to import
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill','./src/js/index.js'],
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/bundle.js'
  },
  devServer :{
    contentBase:'./dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',       //file will be created
      template: './src/index.html'  //where we copy to dist folder(production)
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,           // test for all javascript files
        exclude: /node_modules/, // exclude all files in node_modules folder
        use:{
          loader: 'babel-loader' // using packages apply babel-loader that we installed before
        }
      }
    ]
  }
};
