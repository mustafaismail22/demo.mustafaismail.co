import style from './Iframe.scss'

import React, { Component } from 'react'
import classnames from 'classnames'

class Iframe extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      height: null,
      width: null
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleWindowResize.bind(this))
    this.setState(this.iframeDimensions())
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleWindowResize.bind(this))
  }

  componentWillReceiveProps (nextProps) {
    const { currentProduct } = this.props
    let { loading } = this.state

    if ((currentProduct && nextProps.currentProduct) && (currentProduct.url !== nextProps.currentProduct.url)) {
      loading = true
    }

    this.setState({
      loading,
      ...this.iframeDimensions(nextProps)
    })
  }

  iframeDimensions (props = this.props) {
    const { viewport, currentProduct } = props
    let height = window.innerHeight - 60
    let width = window.innerWidth

    if (currentProduct.responsive) {
      switch (viewport) {
        case 'mobile':
          width = width < 480 ? width : 480
          break
        case 'tablet':
          width = width < 768 ? width : 768
          break
        case 'desktop':
          break
      }
    }

    return {
      height,
      width
    }
  }

  handleOnLoad (e) {
    this.setState({
      loading: false
    })
  }

  handleWindowResize () {
    this.setState(this.iframeDimensions())
  }

  render () {
    const { height, width, loading } = this.state
    const className = classnames(style.root, {
      [style.loading]: loading
    })

    return (
      <iframe
        src={this.props.currentProduct.url}
        onLoad={this.handleOnLoad.bind(this)}
        onError={this.handleOnLoad.bind(this)}
        className={className}
        height={height}
        width={width}>
      </iframe>
    )
  }
}

export default Iframe
