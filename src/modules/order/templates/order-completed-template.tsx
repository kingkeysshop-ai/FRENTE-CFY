import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import LicenseKeysDisplay from "@modules/order/components/license-keys"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import Star from "@modules/common/icons/star"
import Lightning from "@modules/common/icons/lightning"
import ShieldCheck from "@modules/common/icons/shield-check"
import CheckCircle from "@modules/common/icons/check-circle"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({ order }: OrderCompletedTemplateProps) {
  // Extraer datos para CartTotals con currency_code
  const orderTotals = {
    total: order?.total ?? 0,
    subtotal: order?.subtotal ?? 0,
    tax_total: order?.tax_total ?? 0,
    currency_code: order?.currency_code || "USD",
    item_subtotal: order?.item_subtotal ?? 0,
    shipping_subtotal: order?.shipping_subtotal ?? 0,
    discount_total: order?.discount_total ?? 0,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10">
      <div className="content-container max-w-3xl mx-auto flex flex-col gap-6">

        {/* Banner exito */}
        <div className="bg-[#111111] border border-[#facc15]/40 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#facc15]/10 border-2 border-[#facc15] flex items-center justify-center">
            <Star size="40" color="#facc15" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Gracias por tu compra!</h1>
            <p className="text-[#888888] text-sm max-w-md">
              Tu pedido fue procesado exitosamente. Recibiras tu licencia digital en el correo electronico registrado.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            {[
              { icon: Lightning, text: "Entrega Inmediata" },
              { icon: ShieldCheck, text: "100% Seguro" },
              { icon: CheckCircle, text: "Original Garantizado" },
            ].map((b: any) => (
              <span key={b.text} className="px-3 py-1 bg-[#facc15]/10 border border-[#facc15]/40 text-[#facc15] text-xs rounded-full font-bold inline-flex items-center gap-1">
                <b.icon size="14" color="#facc15" /> {b.text}
              </span>
            ))}
          </div>
        </div>

        {/* Detalles del pedido */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-[#2a2a2a] bg-[#1a1a1a]/60">
            <Star size="18" color="#facc15" />
            <h2 className="text-white font-black text-base uppercase tracking-wide">Detalles del Pedido</h2>
          </div>
          <div className="p-6 flex flex-col gap-8">

            <OrderDetails order={order} />

            {/* Productos */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2a2a2a]">
                <span className="text-[#facc15] font-black text-sm uppercase tracking-wider">Productos</span>
              </div>
              <Items order={order} />
            </div>

            {/* Licencias */}
            <LicenseKeysDisplay orderId={order.id} />

            {/* Resumen */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2a2a2a]">
                <span className="text-[#facc15] font-black text-sm uppercase tracking-wider">Resumen del Costo</span>
              </div>
              <CartTotals totals={orderTotals} />
            </div>

            {/* Envio */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2a2a2a]">
                <span className="text-[#facc15] font-black text-sm uppercase tracking-wider">Envio</span>
              </div>
              <ShippingDetails order={order} />
            </div>

            {/* Pago */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2a2a2a]">
                <span className="text-[#facc15] font-black text-sm uppercase tracking-wider">Pago</span>
              </div>
              <PaymentDetails order={order} />
            </div>

          </div>
        </div>

        {/* Ayuda */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
          <Help />
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <LocalizedClientLink
            href="/account/orders"
            className="flex-1 py-3 text-center border border-[#facc15]/50 text-[#facc15] font-bold rounded-xl hover:bg-[#facc15] hover:text-[#0a0a0a] transition-all duration-200 text-sm"
          >
            Ver Mis Pedidos
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/store"
            className="flex-1 py-3 text-center bg-[#facc15] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#e6b800] transition-all duration-200 text-sm"
          >
            Seguir Comprando
          </LocalizedClientLink>
        </div>

      </div>
    </div>
  )
}
