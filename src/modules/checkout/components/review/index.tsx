"use client"

import { clx } from "@medusajs/ui"
import { CheckCircleSolid } from "@medusajs/icons"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import CheckCircle from "@modules/common/icons/check-circle"
import Lightning from "@modules/common/icons/lightning"
import ShieldCheck from "@modules/common/icons/shield-check"
import { isCartAllDigital } from "@lib/util/is-digital-cart"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const isOpen = searchParams.get("step") === "review"
  const isDigital = isCartAllDigital(cart)

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const hasShippingAddress = !!cart?.shipping_address
  const hasShippingMethods = (cart?.shipping_methods?.length ?? 0) > 0
  const hasPaymentSession = !!cart?.payment_session
  const hasPaymentSessions = (cart?.payment_sessions?.length ?? 0) > 0
  const hasPaymentCollection = !!cart?.payment_collection

  if (typeof window !== "undefined") {
    console.log("[Review] cart.payment_session:", cart?.payment_session)
    console.log("[Review] cart.payment_sessions:", cart?.payment_sessions)
    console.log("[Review] cart.payment_collection:", cart?.payment_collection)
  }

  const previousStepsCompleted =
    hasShippingAddress &&
    (isDigital || hasShippingMethods) &&
    (hasPaymentSession || hasPaymentSessions || hasPaymentCollection || paidByGiftcard)

  return (
    <div className="bg-transparent">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className={clx("text-xl font-black text-white flex items-center gap-2", {
          "opacity-40 pointer-events-none select-none": !isOpen,
        })}>
          Revisar y Confirmar
          {isOpen && previousStepsCompleted && (
            <CheckCircleSolid className="text-[#facc15]" />
          )}
        </h2>
      </div>

      {isOpen && previousStepsCompleted && (
        <div className="flex flex-col gap-6">

          {/* Resumen de garantías */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: CheckCircle, title: "Licencia Original", desc: "100% auténtica y activable" },
              { icon: Lightning, title: "Entrega Inmediata", desc: "Por correo electrónico" },
              { icon: ShieldCheck, title: "Pago Seguro", desc: "Transacción cifrada" },
            ].map((g) => (
              <div key={g.title} className="bg-[#1a1a1a]/60 border border-[#2a2a2a] rounded-xl p-4 flex flex-col gap-1">
                <g.icon size="24" color="#facc15" />
                <p className="text-white font-bold text-sm">{g.title}</p>
                <p className="text-[#888888] text-xs">{g.desc}</p>
              </div>
            ))}
          </div>

          {/* Texto legal */}
          <div className="bg-[#facc15]/5 border border-[#facc15]/20 rounded-xl p-4">
            <p className="text-[#888888] text-sm leading-relaxed">
              Al hacer clic en{" "}
              <span className="text-[#facc15] font-bold">Realizar Pedido</span>
              , confirmas que has leído y aceptas nuestros{" "}
              <span className="text-[#facc15] font-semibold">Términos de Uso</span>,{" "}
              <span className="text-[#facc15] font-semibold">Términos de Venta</span>{" "}
              y{" "}
              <span className="text-[#facc15] font-semibold">Política de Privacidad</span>.
            </p>
          </div>

          {/* Boton */}
          <PaymentButton cart={cart} data-testid="submit-order-button" />

        </div>
      )}
    </div>
  )
}

export default Review
