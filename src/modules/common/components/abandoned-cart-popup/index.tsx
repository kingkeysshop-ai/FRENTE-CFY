"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ShoppingCart from "@modules/common/icons/shopping-cart"
import Gift from "@modules/common/icons/gift"

const POPUP_COOLDOWN_KEY = "kingkeys_abandoned_popup_last"
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

const canShow = (): boolean => {
  try {
    const last = localStorage.getItem(POPUP_COOLDOWN_KEY)
    return !last || Date.now() - Number(last) >= COOLDOWN_MS
  } catch {
    return false
  }
}

const markShown = (): void => {
  try {
    localStorage.setItem(POPUP_COOLDOWN_KEY, Date.now().toString())
  } catch {}
}

type AbandonedCartPopupProps = {
  itemCount: number
}

const AbandonedCartPopup = ({ itemCount }: AbandonedCartPopupProps) => {
  const [visible, setVisible] = useState(false)
  const listenerTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    setVisible(false)
    markShown()
  }, [])

  useEffect(() => {
    if (itemCount === 0 || !canShow()) return

    listenerTimer.current = setTimeout(() => {
      const handler = (e: MouseEvent) => {
        if (e.clientY > 0) return
        setVisible(true)
      }
      document.addEventListener("mouseleave", handler, { once: true })
    }, 15000)

    return () => {
      if (listenerTimer.current) {
        clearTimeout(listenerTimer.current)
        listenerTimer.current = null
      }
    }
  }, [itemCount])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-[#111111] border border-[#facc15]/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-yellow-400/10">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-[#888888] hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="text-center">
          <ShoppingCart size="48" color="#facc15" />
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">
            ¡No Te Vayas!
          </h2>
          <p className="text-[#888888] text-sm mb-4">
            Tienes <span className="text-[#facc15] font-bold">{itemCount} producto{itemCount !== 1 ? "s" : ""}</span> en tu carrito esperándote.
          </p>
          <div className="bg-[#facc15]/10 border border-[#facc15]/20 rounded-xl p-4 mb-6">
            <p className="text-[#facc15] text-xs uppercase tracking-widest font-bold mb-1 inline-flex items-center gap-1">
              <Gift size="14" color="#facc15" /> Oferta Exclusiva
            </p>
            <p className="text-white text-sm font-semibold">
              Completa tu compra ahora y obtén <span className="text-[#facc15]">5% de descuento</span> con tu primera orden.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <LocalizedClientLink
              href="/cart"
              onClick={dismiss}
              className="w-full py-3 bg-[#facc15] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#e6b800] transition-colors text-center"
            >
              Ver mi Carrito
            </LocalizedClientLink>
            <button
              onClick={dismiss}
              className="text-sm text-[#888888] hover:text-[#888888] transition-colors"
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
