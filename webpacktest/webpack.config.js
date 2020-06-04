const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpakPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'js/built.[contenthash:10].js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '',
    // chunckFilename: '',
    // library: '',
    // libraryTarget: 'window'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: {
                  version: 3
                },
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17',
                }
              }
            ]
          ],
          cacheDirectory: true
        }
      },
     {
       oneOf: [
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    postcssPresetEnv()
                  ]
                }
              }
            ]
          }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'eslint-loader',
            enforce: 'pre',
            options: {
              fix: true
            }
          },  {
            test: /\.html$/,
            loader: 'html-loader'
          }, {
            exclude: /\.(html|js|css)$/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              name: '[hash:10].[ext]',
              outputPath: 'assets'
            }
          }
       ]
     }
    ]
  },
  plugins: [
    new HtmlWebpakPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/base.[contenthash:10].css'
    }),
    new OptimizeCssAssetsWebpackPlugin()
  ],
  resolve: {
      alias: {
        assets: path.resolve(__dirname, 'src/assets')
      },
      extensions: ['.js', '.css'],
      modules: [path.resolve(__dirname, './'), 'node_modules']
    },
  
  mode: 'development',
  devtool: 'eval-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 3306,
    hot: true,
    open: true,

    // 实时监听
    inline: true,

    // 在SPA页面中，依赖HTML5的history路由模式
    historyApiFallback: true,

    // 监视contentBase下的所有文件，一旦改变就会reload
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/
    },

    host: 'localhost',

    // 不显示启动服务日志
    clientLogLevel: 'none',

    // 除了基本启动信息外，其他信息不显示
    quiet: true,

    // 如果出错了，不要全屏提示
    overlay: false,

    // 服务器代理,解决开发环境跨域配置
    proxy: {
      // 一旦devserver接收到/api/xxx的请求，就会把请求转发到另一个服务器
      '/api': {
        target: 'http://localhost:3000',

        // 发送请求时，请求路径重写：将/api/xxx改成/xxx
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
