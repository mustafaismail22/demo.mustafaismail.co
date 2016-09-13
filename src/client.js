import React from 'react'
import ReactDom from 'react-dom'
import App from './components/App'

import products from './data/products.json'

document.body.classList.remove('no-js')
document.body.classList.add('js')
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
  document.body.classList.add('ios')
}

ReactDom.render(
  <App products={products} />,
  document.getElementById('app')
)
