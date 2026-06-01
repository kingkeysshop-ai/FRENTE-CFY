"use client"

import { useEffect, useState } from "react"

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#facc15] text-[#0a0a0a] rounded-full shadow-lg shadow-yellow-400/25 flex items-center justify-center font-bold text-xl hover:bg-[#e6b800] hover:-translate-y-1 hover:shadow-yellow-400/40 transition-all duration-200"
      aria-label="Volver arriba"
    >
      ↑
    </button>
  )
}
