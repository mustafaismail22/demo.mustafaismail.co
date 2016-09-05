import path from 'path'
import webpack from 'webpack'

import baseConfig from './base.config'

const projectRootPath = path.resolve(__dirname, '..')
const srcPath = path.join(projectRootPath, 'src')

const config = baseConfig({
  input: {
    client: [
      // 'webpack-hot-middleware/client?timeout=20000',
      path.join(srcPath, 'client.js')
    ]
  },
  globals: {
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true,
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  // reacthot: true,
  debug: true
})

export default config
