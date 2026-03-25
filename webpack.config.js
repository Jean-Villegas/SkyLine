const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/js/app.js',
<<<<<<< HEAD

=======
    
>>>>>>> 830b9d1b8993e200baa0eef89eb623a3581f7f75
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      assetModuleFilename: 'assets/[name].[ext]'
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource'
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        } : false
      }),
      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css'
        })
      ] : [])
    ],

    devServer: {
<<<<<<< HEAD
      server: 'https', // Necesario para que el móvil permita Geolocalización
      host: '0.0.0.0',
      allowedHosts: 'all',
      static: './dist',
      port: 3000,
=======
      static: './dist',
      port: 3001,
>>>>>>> 830b9d1b8993e200baa0eef89eb623a3581f7f75
      hot: true,
      open: true,
      historyApiFallback: true,
      watchFiles: ['src/**/*']
    },

    resolve: {
      extensions: ['.js', '.css'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@js': path.resolve(__dirname, 'src/js'),
        '@css': path.resolve(__dirname, 'src/css'),
        '@utils': path.resolve(__dirname, 'src/utils')
      }
    },

    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },

    devtool: isProduction ? 'source-map' : 'eval-source-map'
  };
};
