const path = require('path');
const { VueLoaderPlugin } = require("vue-loader");
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = ( env, argv ) => ({
  //軽量化のために外部入力にする。これをしておくとコンパイルが早い
  externals:{
    "vue":"Vue",
    "axios":"axios",
    "jquery":"jQuery"
  },
  plugins: [
    new VueLoaderPlugin(),
    // new HardSourceWebpackPlugin()
  ],
  // cache: true,
  entry: path.resolve(__dirname, 'src/'),
  output: {
    filename: 'bundle_user.js',
    path: path.resolve(__dirname, 'dist')
  },
  watch: true,
  module: {

    rules: [

      // babel-loaderの設定
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
        exclude: /node_modules/,
    },


      // css/sass-loaderの設定
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'sass-loader'
        ]
      }
    ],

  },

});