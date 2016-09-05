import path from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin'

const projectRootPath = path.resolve(__dirname, '..')
const assetsPath = path.join(projectRootPath, 'dist')
const srcPath = path.join(projectRootPath, 'src')

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'))

const baseConfig = (params) => ({
  context: projectRootPath,
  entry: params.input || {
    client: path.join(srcPath, 'client.js'),
    ...params.inputExtra
  },
  output: {
    path: assetsPath,
    publicPath: '/',
    filename: 'js/[name].[chunkhash:6].js',
    chunkFilename: 'js/[name].[id].[chunkhash:6].chunk.js',
    ...params.output
  },
  plugins: [
    new webpack.DefinePlugin(params.globals),
    ...(params.plugins ? params.plugins : [
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //  comments: false,
        //  compressor: {
        //    warnings: false
        //  }
        // })
    ]),
    params.debug ? webpackIsomorphicToolsPlugin.development() : webpackIsomorphicToolsPlugin
  ],
  resolve: {
    alias: {},
    extensions: ['', '.js', '.jsx', '.json'],
    ...params.resolve
  },
  module: {
    preLoaders: [
      {
        test: /\.(jsx|js)?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.(jsx|js)?$/,
        loaders: params.reacthot ? ['react-hot-loader', 'babel-loader'] : ['babel-loader'],
        exclude: /(node_modules)/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'file-loader?name=images/[hash:base64:10].[ext]'
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('fonts'),
        loader: 'file-loader?name=fonts/[hash:base64:10].[ext]'
      },
      ...(params.loaders ? params.loaders : [{
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:6]',
          'postcss-loader',
          'sass-loader?outputStyle=expanded'
        ]
      }])
    ]
  },
  postcss: () => {
    return [
      autoprefixer({ browsers: ['last 5 versions'] })
    ]
  },
  stats: {
    colors: true,
    hash: true,
    version: false,
    timings: true,
    assets: true,
    chunks: true,
    chunkModules: false,
    modules: false,
    cached: false,
    reasons: false,
    source: false,
    errorDetails: true
  },
  debug: params.debug || false
})

export default baseConfig
