"use client"

import { useEffect, useState } from "react"

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
      <div className="content-container flex items-center justify-between py-1.5 px-4">
        <div className="flex items-center gap-2 text-xs md:text-sm text-black font-semibold mx-auto">
          <span>⚡</span>
          <span>
            ENTREGA INSTANTÁNEA · ✅ 100% ORIGINALES · 🔒 PAGO SEGURO
          </span>
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
