import React from 'react'
import ReactDom from 'react-dom'
import App from './components/App'
import { isIOSDevice, getActiveProduct } from './helpers'

import products from './data/products.json'

document.body.classList.remove('no-js')
document.body.classList.add('js')

if (isIOSDevice()) {
  window.location.replace(products[ getActiveProduct(products) ].url)
}

ReactDom.render(
  <App products={products} />,
  document.getElementById('app')
)
