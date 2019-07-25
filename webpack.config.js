const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BrotliGzipPlugin = require('brotli-gzip-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const outputDir = path.join(__dirname, 'dist');
// const darkTheme = require('@ant-design/dark-theme');

module.exports = {
  mode: 'production',
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: outputDir,
    filename: '[name].[hash].js',
    chunkFilename: '[name].bundle.[chunkhash].js',
    publicPath: '/static/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.(png|gif|wav|mp3)$/,
        loader: 'file-loader'
      },
      {
        test: /\.less$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'less-loader',
          options: {
            // modifyVars: darkTheme.default,
            javascriptEnabled: true
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      useGzip: true
    }),
    // new BrotliGzipPlugin({
    //   asset: '[path].br[query]',
    //   algorithm: 'brotli',
    //   test: /\.(js|css|html|svg)$/,
    //   threshold: 10240,
    //   minRatio: 0.7,
    //   quality: 11
    // }),
    // new BrotliGzipPlugin({
    //   asset: '[path].gz[query]',
    //   algorithm: 'gzip',
    //   test: /\.(js|css|html|svg)$/,
    //   threshold: 10240,
    //   minRatio: 0.7
    // })
    // new BundleAnalyzerPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      new UglifyJSPlugin({
        parallel: true,
        uglifyOptions: {
          compress: { inline: false }
        }
      })
    ]
  }
}