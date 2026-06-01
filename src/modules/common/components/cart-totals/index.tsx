"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_total?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const { currency_code, total, tax_total, subtotal, shipping_subtotal, discount_total } = totals

  return (
    <div className="flex flex-col gap-y-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-[#888888]">Subtotal (sin envío e impuestos)</span>
        <span className="text-white font-semibold" data-testid="cart-subtotal" data-value={subtotal || 0}>
          {convertToLocale({ amount: subtotal ?? 0, currency_code })}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#888888]">Envío</span>
        <span className="text-white font-semibold" data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
          {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
        </span>
      </div>
      {!!discount_total && (
        <div className="flex items-center justify-between">
          <span className="text-[#facc15]">Descuento</span>
          <span className="text-[#facc15] font-semibold" data-testid="cart-discount" data-value={discount_total || 0}>
            - {convertToLocale({ amount: discount_total ?? 0, currency_code })}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-[#888888]">Impuestos</span>
        <span className="text-white font-semibold" data-testid="cart-taxes" data-value={tax_total || 0}>
          {convertToLocale({ amount: tax_total ?? 0, currency_code })}
        </span>
      </div>
      <div className="h-px w-full bg-[#2a2a2a] my-1" />
      <div className="flex items-center justify-between">
        <span className="text-white font-black text-base">Total</span>
        <span className="text-[#facc15] font-black text-xl" data-testid="cart-total" data-value={total || 0}>
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals
