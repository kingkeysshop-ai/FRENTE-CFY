"use client"

import { useEffect, useState } from "react"

export default function ScrollAwareHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setScrolled(window.scrollY > 30)
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`sticky top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/60 backdrop-blur-md shadow-lg shadow-black/30 border-b border-[#facc15]/10"
          : "bg-transparent"
      }`}
    >
      <header
        className={`relative h-16 mx-auto transition-all duration-500 border-b ${
          scrolled ? "border-transparent" : "border-transparent"
        }`}
      >
        {children}
      </header>
    </div>
  )
}
