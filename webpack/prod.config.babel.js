import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

import baseConfig from './base.config'

const config = baseConfig({
  globals: {
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false,
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  },
  plugins: [
    new ExtractTextPlugin('css/style.[chunkhash:6].css', {
      allChunks: false
    }),

    // optimizations
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compressor: {
        warnings: false
      }
    })
  ],
  loaders: [
    {
      test: /\.s?css$/,
      loader: ExtractTextPlugin.extract([
        'css-loader?modules&localIdentName=[hash:base64:6]',
        'postcss-loader',
        'sass-loader?outputStyle=expanded'
      ].join('!'))
    }
  ],
  debug: false
})

export default config
