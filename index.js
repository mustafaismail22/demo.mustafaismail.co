#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname)
const babelrc = JSON.parse(fs.readFileSync(path.join(rootDir, '.babelrc')))

babelrc.presets.splice(babelrc.presets.indexOf('es2015'), 1)
babelrc.presets.unshift('node6')
require('babel-register')(babelrc)

const WebpackIsomorphicTools = require('webpack-isomorphic-tools')
const WebpackIsomorphicToolsConfig = require('./webpack/webpack-isomorphic-tools')

global.__CLIENT__ = false
global.__SERVER__ = true
global.__DISABLE_SSR__ = false
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production'

global.webpackIsomorphicTools = new WebpackIsomorphicTools(WebpackIsomorphicToolsConfig)
  .development(global.__DEVELOPMENT__)
  .server(rootDir, function () {
    require('./src/server.js')
  })
