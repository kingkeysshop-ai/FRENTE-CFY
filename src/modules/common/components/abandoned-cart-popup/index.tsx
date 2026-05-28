"use client"

import { useEffect, useState, useCallback } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const POPUP_SEEN_KEY = "kingkeys_abandoned_popup_seen"

type AbandonedCartPopupProps = {
  itemCount: number
}

const AbandonedCartPopup = ({ itemCount }: AbandonedCartPopupProps) => {
  const [visible, setVisible] = useState(false)

  const dismiss = useCallback(() => {
    setVisible(false)
    sessionStorage.setItem(POPUP_SEEN_KEY, "true")
  }, [])

  useEffect(() => {
    if (itemCount === 0) return
    if (sessionStorage.getItem(POPUP_SEEN_KEY)) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0) return
      setVisible(true)
    }

    const delay = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave)
    }, 5000)

    return () => {
      clearTimeout(delay)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [itemCount])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-gray-900 border border-yellow-400/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-yellow-400/10">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="text-center">
          <span className="text-5xl block mb-4">🛒</span>
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">
            ¡No Te Vayas!
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Tienes <span className="text-yellow-400 font-bold">{itemCount} producto{itemCount !== 1 ? "s" : ""}</span> en tu carrito esperándote.
          </p>
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 mb-6">
            <p className="text-yellow-400 text-xs uppercase tracking-widest font-bold mb-1">
              🎁 Oferta Exclusiva
            </p>
            <p className="text-white text-sm font-semibold">
              Completa tu compra ahora y obtén <span className="text-yellow-400">5% de descuento</span> con tu primera orden.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <LocalizedClientLink
              href="/cart"
              onClick={dismiss}
              className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors text-center"
            >
              Ver mi Carrito
            </LocalizedClientLink>
            <button
              onClick={dismiss}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Seguir Navegando
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AbandonedCartPopup
