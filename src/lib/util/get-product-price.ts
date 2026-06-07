import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-percentage-diff"
import { convertToLocale } from "./money"

export function getVariantPrice(variant: any, regionId?: string) {
  if (!variant?.prices?.length) {
    return null
  }

  const price =
    variant.prices.find((p: any) => p.region_id === regionId) ||
    variant.prices[0]

  if (!price) {
    return null
  }

  return price
}

export const getPricesForVariant = (variant: any, regionId?: string) => {
  const price = getVariantPrice(variant, regionId)

  if (!price) {
    return null
  }

  const amount = price.amount ?? 0
  const currency_code = price.currency_code ?? "USD"

  const originalAmount = typeof price.original_amount === "number" ? price.original_amount : amount

  return {
    calculated_price_number: amount,
    calculated_price: convertToLocale({
      amount,
      currency_code,
    }),
    original_price_number: originalAmount,
    original_price: convertToLocale({
      amount: originalAmount,
      currency_code,
    }),
    currency_code,
    price_type: amount < originalAmount ? "sale" : "regular",
    percentage_diff: getPercentageDiff(originalAmount, amount),
  }
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const cheapestVariant: any = product.variants
      .filter((v: any) => getVariantPrice(v, undefined))
      .sort((a: any, b: any) => {
        const aPrice = getVariantPrice(a, undefined)?.amount ?? 0
        const bPrice = getVariantPrice(b, undefined)?.amount ?? 0
        return aPrice - bPrice
      })[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variantId) {
      return null
    }

    const variant: any = product.variants?.find(
      (v: any) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
