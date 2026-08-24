import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import TrendingCarousel from "./trending-carousel"

export type TrendingProduct = {
  id: string
  handle: string
  title: string
  thumbnail: string | null
  variantId?: string
  priceNow: string
  priceBefore: string | null
}

const TRENDING_TAGS = ["trending", "best-seller", "mas-vendido"]

export default async function Trending({
  countryCode,
}: {
  countryCode: string
}) {
  const { response: { products } } = await listProducts({
    countryCode,
    queryParams: { limit: 24 },
  }).catch(() => ({ response: { products: [] as HttpTypes.StoreProduct[] }, nextPage: null }))

  if (!products?.length) return null

  const tagged = products.filter((p: HttpTypes.StoreProduct) =>
    p.tags?.some((t: any) => TRENDING_TAGS.includes(t.value?.toLowerCase()))
  )

  const selected = (tagged.length >= 5 ? tagged : products).slice(0, 10)

  const items: TrendingProduct[] = selected.map((p: HttpTypes.StoreProduct) => {
    let cheapest: any = null
    try {
      cheapest = getProductPrice({ product: p }).cheapestPrice
    } catch {
      cheapest = null
    }

    return {
      id: p.id,
      handle: p.handle ?? "",
      title: p.title ?? "",
      thumbnail: p.thumbnail ?? null,
      variantId: p.variants?.[0]?.id,
      priceNow: cheapest?.calculated_price ?? "",
      priceBefore:
        cheapest && cheapest.price_type === "sale" ? cheapest.original_price : null,
    }
  })

  return <TrendingCarousel products={items} />
}
