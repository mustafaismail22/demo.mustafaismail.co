import React, { Component, PropTypes } from 'react'

class Html extends Component {
  render () {
    const {
      helmet,
      assets,
      content,
      googleAnalyticsId
    } = this.props

    return (
      <html lang="en-us">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          { helmet.base.toComponent() }
          { helmet.meta.toComponent() }
          { helmet.title.toComponent() }
          { helmet.link.toComponent() }

          <link rel="shortcut icon" href="/favicon.ico" />

          {/* styles (will be present only in production with webpack extract text plugin) */}
          { Object.keys(assets.styles).map((style, key) =>
            <link href={assets.styles[style]} key={key} media="screen, projection"
              rel="stylesheet" type="text/css" charSet="UTF-8" />
          ) }

          {/* (will be present only in development mode) */}
          { Object.keys(assets.styles).length === 0 ? Object.keys(assets.assets)
            .filter(i => !!assets.assets[i]._style)
            .map((style, key) =>
              <style dangerouslySetInnerHTML={{ __html: assets.assets[style]._style }} key={key} />) : null }

          { helmet.script.toComponent() }
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{ __html: content || 'Loading...' }} />

          { Object.keys(assets.javascript).map((i, key) =>
            <script src={assets.javascript[i]} key={key} charSet="UTF-8" />) }
          <script charSet="UTF-8" dangerouslySetInnerHTML={{ __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga'); ga('create', '${googleAnalyticsId}'); ga('send', 'pageview');` }} />
        </body>
      </html>
    )
  }
}

Html.propTypes = {
  content: PropTypes.string.isRequired,
  assets: PropTypes.object.isRequired,
  helmet: PropTypes.object.isRequired,
  googleAnalyticsId: PropTypes.string
}

Html.defaultProps = {
  googleAnalyticsId: 'UA-43653001-4'
}

export default Html
