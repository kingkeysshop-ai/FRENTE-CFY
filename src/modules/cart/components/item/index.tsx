"use client"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: any
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)
    await updateLineItem({ lineId: item.id, quantity })
      .catch((err: any) => setError(err.message))
      .finally(() => setUpdating(false))
  }

  const maxQuantity = item.variant?.manage_inventory
    ? Math.min(item.variant.inventory_quantity ?? 10, 10)
    : 10

  if (type === "preview") {
    return (
      <div
        className="flex gap-4 p-4 border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#1a1a1a]/40 transition-colors duration-200"
        data-testid="product-row"
      >
        <LocalizedClientLink href={`/products/${item.product_handle}`} className="w-16 shrink-0">
          <div className="rounded-lg overflow-hidden border border-[#2a2a2a]">
            <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
          </div>
        </LocalizedClientLink>
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <LocalizedClientLink href={`/products/${item.product_handle}`}>
            <p className="text-white font-semibold text-sm hover:text-[#facc15] transition-colors truncate" data-testid="product-title">
              {item.title || item.product_title}
            </p>
          </LocalizedClientLink>
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
          <span className="text-xs text-[#888888] bg-[#1a1a1a] px-2 py-0.5 rounded-md w-fit mt-1">Digital</span>
        </div>
        <div className="flex flex-col items-end justify-between shrink-0 gap-2">
          <span className="text-xs text-[#888888]">{item.quantity}x</span>
          <div className="text-[#facc15] font-bold text-sm">
            <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-wrap small:flex-nowrap items-start small:items-center gap-3 small:gap-4 px-4 small:px-6 py-4 hover:bg-[#1a1a1a]/40 transition-colors duration-200"
      data-testid="product-row"
    >
      {/* Thumbnail + info */}
      <div className="flex items-start gap-3 flex-1 min-w-0 w-full small:w-auto">
        <LocalizedClientLink href={`/products/${item.product_handle}`} className="w-16 shrink-0">
          <div className="rounded-lg overflow-hidden border border-[#2a2a2a] w-16 h-16">
            <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
          </div>
        </LocalizedClientLink>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <LocalizedClientLink href={`/products/${item.product_handle}`}>
            <p className="text-white font-semibold text-sm hover:text-[#facc15] transition-colors truncate" data-testid="product-title">
              {item.product_title}
            </p>
          </LocalizedClientLink>
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
          <span className="text-xs text-[#888888] bg-[#1a1a1a] px-2 py-0.5 rounded-md w-fit">Digital</span>
          {/* Unit price visible en mobile */}
          <span className="text-[#888888] text-xs small:hidden">
            <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
          </span>
        </div>
      </div>

      {/* Quantity + price */}
      <div className="flex items-center gap-3 w-full small:w-auto small:min-w-[180px] justify-between small:justify-end pl-[72px] small:pl-0">
        <div className="flex items-center gap-2">
          <DeleteButton id={item.id} data-testid="product-delete-button" />
          <CartItemSelect
            value={item.quantity}
            onChange={(value) => changeQuantity(parseInt(value.target.value))}
            className="w-14 h-9 small:h-8 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs rounded-lg text-center"
            data-testid="product-select-button"
          >
            {Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => (
              <option value={i + 1} key={i}>{i + 1}</option>
            ))}
          </CartItemSelect>
          {updating && <Spinner />}
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[#888888] text-xs">{item.quantity}x {convertToLocale({ amount: item.unit_price ?? 0, currency_code: currencyCode })}</span>
          <span className="text-[#facc15] font-bold text-sm whitespace-nowrap">
            <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
          </span>
        </div>
      </div>
      {error && <ErrorMessage error={error} data-testid="product-error-message" />}
    </div>
  )
}

export default Item
