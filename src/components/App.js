import './App.scss'

import React, { Component, PropTypes } from 'react'
import { createHistory, createMemoryHistory } from 'history'
import Helmet from 'react-helmet'

import SwitcherBar from './SwitcherBar'
import Iframe from './Iframe'
import ProductsList from './ProductsList'

import { getActiveProduct } from '../helpers'

class App extends Component {
  constructor (props) {
    super(props)

    this.history = typeof document !== 'undefined' ? createHistory() : createMemoryHistory()
    this.state = {
      active: getActiveProduct(props.products, props.location),
      viewport: 'desktop',
      switcher: false
    }
  }

  toggleViewport (type) {
    this.setState({
      viewport: type
    })
  }

  toggleSwitcher () {
    this.setState({
      switcher: !this.state.switcher
    })
  }

  componentDidMount () {
    this.historyUnlisten = this.history.listen(location => this.setState({
      active: getActiveProduct(this.props.products, location)
    }))
  }

  componentWillUnmount () {
    this.historyUnlisten && this.historyUnlisten()
  }

  render () {
    const { products } = this.props
    const { active, viewport, switcher } = this.state
    const currentProduct = products[active] ? products[active] : {}

    return (
      <div className="app">
        <Helmet
          defaultTitle="Mustafa Ismail"
          titleTemplate="%s | Mustafa Ismail"
          title={currentProduct.title} />
        <SwitcherBar
          viewport={viewport}
          products={products}
          switcher={switcher}
          currentProduct={currentProduct}
          toggleViewport={this.toggleViewport.bind(this)}
          toggleSwitcher={this.toggleSwitcher.bind(this)} />
        <ProductsList
          history={this.history}
          products={products}
          switcher={switcher}
          currentProduct={currentProduct}
          toggleSwitcher={this.toggleSwitcher.bind(this)} />
        <Iframe
          viewport={viewport}
          currentProduct={currentProduct} />
      </div>
    )
  }
}

App.propTypes = {
  products: PropTypes.object.isRequired,
  location: PropTypes.object
}

export default App
