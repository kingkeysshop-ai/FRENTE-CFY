"use client"

import { useRef, useState, useEffect } from "react"

export default function CarouselArrows({ containerId }: { containerId: string }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const el = document.getElementById(containerId)
    if (!el) return

    const check = () => {
      setCanScrollLeft(el.scrollLeft > 10)
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
    }

    check()
    el.addEventListener("scroll", check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)

    return () => {
      el.removeEventListener("scroll", check)
      ro.disconnect()
    }
  }, [containerId])

  const scroll = (dir: "left" | "right") => {
    const el = document.getElementById(containerId)
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  if (!canScrollRight && !canScrollLeft) return null

  return (
    <>
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#111111]/80 border border-[#facc15]/30 rounded-full flex items-center justify-center text-[#facc15] hover:bg-[#1a1a1a] hover:border-[#facc15]/60 transition-all duration-200 z-10 -translate-x-1/2"
        >
          ‹
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#111111]/80 border border-[#facc15]/30 rounded-full flex items-center justify-center text-[#facc15] hover:bg-[#1a1a1a] hover:border-[#facc15]/60 transition-all duration-200 z-10 translate-x-1/2"
        >
          ›
        </button>
      )}
    </>
  )
}
