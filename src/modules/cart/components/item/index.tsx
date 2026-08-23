"use client"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Image from "next/image"
import { useState } from "react"

type ItemProps = {
  item: any
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleQuantityChange = async (value: string) => {
    const quantity = parseInt(value)
    if (isNaN(quantity)) return
    setError(null)
    setUpdating(true)
    await updateLineItem({ lineId: item.id, quantity })
      .catch((err: any) => setError(err.message))
      .finally(() => setUpdating(false))
  }

  const maxQuantity = item.variant?.manage_inventory
    ? Math.min(item.variant.inventory_quantity ?? 10, 10)
    : 10

  const quantityOptions = Array.from(
    { length: Math.min(maxQuantity, 10) },
    (_, i) => ({
      value: String(i + 1),
      label: String(i + 1),
    })
  )

  const imgUrl = item.thumbnail || item.variant?.product?.images?.[0]?.url

  if (type === "preview") {
    return (
      <div
        className="flex gap-4 p-4 border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#1a1a1a]/40 transition-colors duration-200"
        data-testid="product-row"
      >
        <LocalizedClientLink href={`/products/${item.product_handle}`} className="w-20 shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 bg-[#1a1a1a] relative">
            {imgUrl ? (
              <Image
                src={imgUrl}
                alt=""
                className="object-cover"
                fill
                sizes="80px"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🔑</div>
            )}
          </div>
        </LocalizedClientLink>
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <LocalizedClientLink href={`/products/${item.product_handle}`}>
            <p className="text-white font-medium text-sm hover:text-[#facc15] transition-colors truncate" data-testid="product-title">
              {item.title}
            </p>
          </LocalizedClientLink>
          {item.variant?.title && (
            <p className="text-gray-400 text-xs truncate">{item.variant.title}</p>
          )}
          {!item.variant?.title && <LineItemOptions variant={item.variant} data-testid="product-variant" />}
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
      <div className="flex items-start gap-3 flex-1 min-w-0 w-full small:w-auto">
        <LocalizedClientLink href={`/products/${item.product_handle}`} className="w-20 shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 bg-[#1a1a1a] relative">
            {imgUrl ? (
              <Image
                src={imgUrl}
                alt=""
                className="object-cover"
                fill
                sizes="80px"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🔑</div>
            )}
          </div>
        </LocalizedClientLink>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <LocalizedClientLink href={`/products/${item.product_handle}`}>
            <p className="text-white font-medium text-sm hover:text-[#facc15] transition-colors truncate" data-testid="product-title">
              {item.title}
            </p>
          </LocalizedClientLink>
          {item.variant?.title && (
            <p className="text-gray-400 text-xs truncate">{item.variant.title}</p>
          )}
          {!item.variant?.title && <LineItemOptions variant={item.variant} data-testid="product-variant" />}
          <span className="text-xs text-[#888888] small:hidden">
            {convertToLocale({ amount: item.unit_price ?? 0, currency_code: currencyCode })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full small:w-auto small:min-w-[180px] justify-between small:justify-end pl-[92px] small:pl-0">
        <div className="flex items-center gap-2">
          <DeleteButton id={item.id} data-testid="product-delete-button" />
          <CartItemSelect
            value={String(item.quantity)}
            onValueChange={handleQuantityChange}
            options={quantityOptions}
            className="w-14 h-9 small:h-8"
            data-testid="product-select-button"
          />
          {updating && <Spinner />}
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[#888888] text-xs whitespace-nowrap">
            {item.quantity}x {convertToLocale({ amount: item.unit_price ?? 0, currency_code: currencyCode })}
          </span>
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
