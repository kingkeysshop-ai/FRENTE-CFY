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
          ? "bg-[#0a0a0a]/90 backdrop-blur-md shadow-lg shadow-black/50 border-b border-[#2a2a2a]"
          : "bg-transparent"
      }`}
    >
      <header
        className={`relative h-16 mx-auto transition-all duration-500 border-b ${
          scrolled ? "border-[#2a2a2a]" : "border-transparent"
        }`}
      >
        {children}
      </header>
    </div>
  )
}
