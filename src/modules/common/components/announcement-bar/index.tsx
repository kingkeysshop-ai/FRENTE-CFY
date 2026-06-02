"use client"

import { useEffect, useState } from "react"
import Lightning from "@modules/common/icons/lightning"
import CheckCircle from "@modules/common/icons/check-circle"
import ShieldCheck from "@modules/common/icons/shield-check"

const ANNOUNCEMENT_KEY = "kingkeys_announcement_closed"

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const closed = localStorage.getItem(ANNOUNCEMENT_KEY)
    if (closed !== "true") setVisible(true)
  }, [])

  const dismiss = () => {
    setVisible(false)
    try { localStorage.setItem(ANNOUNCEMENT_KEY, "true") } catch {}
  }

  if (!visible) return null

  return (
    <div className="relative bg-[#facc15] border-b border-[#e6b800]">
      <div className="content-container flex items-center justify-between py-2 px-4">
        <div className="flex flex-1 items-center justify-center gap-2 md:gap-6 text-xs md:text-sm text-black font-semibold">
          <div className="flex items-center gap-1.5 shrink-0">
            <Lightning size="16" color="black" />
            <span className="whitespace-nowrap">ENTREGA INSTANTÁNEA</span>
          </div>

          <span className="hidden sm:block text-black/20 select-none">|</span>

          <div className="flex items-center gap-1.5 shrink-0">
            <CheckCircle size="16" color="black" />
            <span className="whitespace-nowrap">100% ORIGINALES</span>
          </div>

          <span className="hidden sm:block text-black/20 select-none">|</span>

          <div className="flex items-center gap-1.5 shrink-0">
            <ShieldCheck size="16" color="black" />
            <span className="whitespace-nowrap">PAGO SEGURO</span>
          </div>
        </div>

        <button
          onClick={dismiss}
          className="shrink-0 text-black/50 hover:text-black transition-colors ml-4"
          aria-label="Cerrar anuncio"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default AnnouncementBar
