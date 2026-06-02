import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import ShoppingCart from "@modules/common/icons/shopping-cart"
import CheckCircle from "@modules/common/icons/check-circle"
import Lightning from "@modules/common/icons/lightning"
import ShieldCheck from "@modules/common/icons/shield-check"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  if (!cart) return null

  const cartTotals = {
    total: cart.total,
    subtotal: cart.subtotal,
    tax_total: cart.tax_total,
    currency_code: cart.region?.currency_code || "USD",
    item_subtotal: cart.item_subtotal,
    shipping_subtotal: cart.shipping_subtotal,
    discount_total: cart.discount_total,
  }

  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-6 py-8 small:py-0">
      <div className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 flex flex-col gap-y-5">

        {/* Titulo */}
        <div className="flex items-center gap-2 pb-4 border-b border-[#2a2a2a]">
          <ShoppingCart size="20" color="#facc15" />
          <h2 className="text-white font-black text-lg">Tu Pedido</h2>
        </div>

        {/* Items */}
        <ItemsPreviewTemplate cart={cart} />

        {/* Divider */}
        <div className="w-full h-px bg-[#2a2a2a]" />

        {/* Totales */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
          <CartTotals totals={cartTotals} />
        </div>

        {/* Descuento */}
        <DiscountCode cart={cart} />

        {/* Garantias */}
        <div className="flex flex-col gap-2 pt-3 border-t border-[#2a2a2a]">
          {[
            { icon: CheckCircle, text: "Licencias 100% Originales" },
            { icon: Lightning, text: "Entrega Inmediata por Email" },
            { icon: ShieldCheck, text: "Pago 100% Seguro" },
          ].map((g) => (
            <div key={g.text} className="flex items-center gap-2">
              <g.icon size="16" color="#888888" />
              <span className="text-xs text-[#888888] font-medium">{g.text}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default CheckoutSummary
