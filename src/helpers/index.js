
export function isIOSDevice () {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

export function getActiveProduct (products, location = window.location) {
  let product = location.search.replace('?theme=', '').toLowerCase()

  if (!products.hasOwnProperty(product)) {
    product = location.hash.replace('#', '').toLowerCase()
    if (!products.hasOwnProperty(product)) {
      product = Object.keys(products).shift()
    }
  }

  return product
}
