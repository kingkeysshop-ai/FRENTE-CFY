export function isCartAllDigital(cart: any): boolean {
  if (!cart?.items?.length) return false

  return cart.items.every((item: any) => {
    const product = item.variant?.product
    if (!product) return false
    return (
      product.weight === null ||
      product.weight === undefined ||
      product.metadata?.is_digital === true
    )
  })
}
