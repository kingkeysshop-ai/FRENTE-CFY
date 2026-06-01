"use client"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: any[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  const itemsSubtotal = cart.items?.reduce((sum: number, item: any) => sum + (item.total ?? 0), 0) ?? 0

  const cartTotals = {
    total: cart.total,
    subtotal: cart.subtotal ?? cart.item_subtotal ?? itemsSubtotal,
    tax_total: cart.tax_total,
    currency_code: cart.region?.currency_code || "USD",
    shipping_subtotal: cart.shipping_subtotal,
    discount_total: cart.discount_total,
  }

  return (
    <div className="flex flex-col gap-y-5">

      {/* Titulo */}
      <div className="flex items-center gap-2 pb-4 border-b border-[#2a2a2a]">
        <span className="text-[#facc15] text-lg">👑</span>
        <h2 className="text-white font-black text-xl">Resumen del Pedido</h2>
      </div>

      {/* Codigo descuento */}
      <DiscountCode cart={cart} />

      {/* Totales */}
      <div className="bg-[#1a1a1a]/50 rounded-lg p-4">
        <CartTotals totals={cartTotals} />
      </div>

      {/* Boton checkout */}
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <button className="w-full py-4 bg-[#facc15] text-[#0a0a0a] font-black text-base rounded-xl hover:bg-[#e6b800] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
          🔒 Ir al Checkout
        </button>
      </LocalizedClientLink>

      {/* Metodos de pago */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {["💳", "🏦", "💰"].map((icon, i) => (
          <span key={i} className="text-lg">{icon}</span>
        ))}
        <span className="text-xs text-[#888888] ml-1">Pago 100% seguro</span>
      </div>

    </div>
  )
}

export default Summary
