import style from './ProductsList.scss'

import React from 'react'
import Slider from 'react-slick'
import classnames from 'classnames'

import { ArrowRightIcon, ArrowLeftIcon } from './Icons'

const imagesReq = require.context('../assets/images/', true, /.*\.png$/)

const sliderSettings = {
  dots: false,
  draggable: false,
  arrows: true,
  infinite: false,
  speed: 250,
  slidesToShow: 4,
  nextArrow: <ArrowRightIcon />,
  prevArrow: <ArrowLeftIcon />,
  className: style['products-list'],
  responsive: [
    {
      breakpoint: 468,
      settings: {
        slidesToShow: 1
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3
      }
    }
  ]
}

function renderProducts ({products, toggleSwitcher, history}) {
  return Object.keys(products).map(i => {
    const product = products[i]
    return (
      <div key={i}>
        <a href={product.url} onClick={e => {
          e.preventDefault()

          history.push({
            pathname: '/',
            search: '?theme=' + i
          })

          toggleSwitcher()
        }} className={style.product}>
          <img src={imagesReq(product.img)} alt={product.title}/>
          <span className={style.product__badge}>{product.tag}</span>
          <div className={style.product__title}>
            {product.name}
          </div>
        </a>
      </div>
    )
  })
}

function ProductsList (props) {
  return (
    <div className={classnames(style.root, 'clearfix', {[style['root--show']]: props.switcher})}>
      <Slider {...sliderSettings} >
        { renderProducts(props) }
      </Slider>
    </div>
  )
}

export default ProductsList
