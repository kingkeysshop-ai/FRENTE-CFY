"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LicenseKeysDisplay from "@modules/order/components/license-keys"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Star from "@modules/common/icons/star"
import Lightning from "@modules/common/icons/lightning"
import ShieldCheck from "@modules/common/icons/shield-check"
import CheckCircle from "@modules/common/icons/check-circle"
import Refresh from "@modules/common/icons/refresh"

type Props = {
  orderId: string
}

export default function OrderConfirmedFallback({ orderId }: Props) {
  const router = useRouter()
  const [retrying, setRetrying] = useState(false)

  const handleRetry = () => {
    setRetrying(true)
    router.refresh()
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

        {/* Licencias */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
          <LicenseKeysDisplay orderId={orderId} />
        </div>

        {/* Aviso: detalles no disponibles */}
        <div className="bg-[#1a1a1a]/60 border border-yellow-500/20 rounded-xl p-5 flex flex-col items-center text-center gap-3">
          <p className="text-[#888888] text-sm">
            Los detalles completos del pedido no estan disponibles en este momento.
            <br />
            Tus licencias apareceran arriba cuando sean asignadas.
          </p>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="px-4 py-2 bg-[#2a2a2a] text-white font-bold text-xs rounded-lg hover:bg-[#3a3a3a] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Refresh size="14" color="currentColor" />
            {retrying ? "Recargando..." : "Reintentar carga"}
          </button>
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
