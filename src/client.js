import React from 'react'
import ReactDom from 'react-dom'
import App from './components/App'

import products from './data/products.json'

document.body.className = document.body.className.replace('no-js', 'js')

ReactDom.render(
  <App products={products} />,
  document.getElementById('app')
)
