import React from 'react'
import ReactDom from 'react-dom'
import App from './components/App'

import products from './data/products.json'

ReactDom.render(
  <App products={products} />,
  document.getElementById('app')
)
