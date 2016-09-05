import path from 'path'
import express from 'express'
import compression from 'compression'
import serveStatic from 'serve-static'
import serveFavicon from 'serve-favicon'
import morgan from 'morgan'

import React from 'react'
import ReactDOM from 'react-dom/server'
import Lru from 'lru-cache'
import Helmet from 'react-helmet'

import products from './data/products.json'

import Html from './helpers/Html'
import App from './components/App'

const markupCache = new Lru({ max: 100 })
const render = function (component, assets, key = JSON.stringify(component)) {
  try {
    const startTime = Date.now()
    let renderedMarkup = markupCache.get(key)

    if (!renderedMarkup) {
      renderedMarkup = '<!doctype html> \n' + ReactDOM.renderToString(
        <Html
          assets={assets}
          content={ component ? ReactDOM.renderToString(component) : null }
          helmet={Helmet.rewind()} />
      )
      markupCache.set(key, renderedMarkup)
    }

    const rtsTimeMs = Date.now() - startTime
    console.info('render time:', rtsTimeMs)

    return renderedMarkup
  } catch (err) {
    console.error(err)
    return null
  }
}

export function boot (callback = (server) => {}) {
  const server = express()

  server.set('env', process.env.NODE_ENV || 'development')
  server.set('host', process.env.HOST || '127.0.0.1')
  server.set('port', process.env.PORT || 3000)

  server.enable('trust proxy')
  server.disable('x-powered-by')

  server.use(morgan(server.get('env') === 'production' ? 'combined' : 'dev'))
  server.use(compression())
  server.use(serveFavicon(path.join(__dirname, 'assets', 'favicon.ico')))

  // Use the `dist` dir for serving static assets. On production, it contains the js
  // files built with webpack
  server.use(serveStatic(path.join(__dirname, '..', 'dist'), {
    maxAge: '200d'
  }))

  // if (global.__DEVELOPMENT__) {
  //  const { webpackMiddleware } = require('./helpers/webpackMiddleware')
  //  webpackMiddleware(server)
  // }

  server.use((req, res) => {
    if (global.__DEVELOPMENT__) {
      // Do not cache webpack stats: the script file would change since
      // hot module replacement is enabled in the development env
      global.webpackIsomorphicTools.refresh()
      markupCache.reset()
    }

    if (global.__DISABLE_SSR__) {
      res.send(render(null, global.webpackIsomorphicTools.assets()))
      return
    }

    let theme = req.query.theme && req.query.theme.toString().toLowerCase()
    if (!theme || !products.hasOwnProperty(theme)) {
      theme = Object.keys(products).shift()
    }

    const location = {
      search: `?theme=${theme}`
    }

    res.send(render(
      <App products={products} location={location} />, // Component
      global.webpackIsomorphicTools.assets(), // Assets
      JSON.stringify(location) // Cache Key
    ))
  })

  // Generic server errors (e.g. not caught by components)
  server.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!')
  })

  server.use((err, req, res, next) => {
    console.error('Error on request %s %s', req.method, req.url)
    console.error(err)
    console.error(err.stack)
    res.status(500).send('Something broke :(')
  })

  // Finally, start the express server
  return server.listen(server.get('port'), () => callback(server))
}

boot(app => {
  console.info('Express %s server listening on %s:%s', app.get('env'), app.get('host'), app.get('port'))
})
