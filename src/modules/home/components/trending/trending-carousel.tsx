"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { TrendingProduct } from "./index"
import TrendingCard from "./trending-card"

export default function TrendingCarousel({
  products,
}: {
  products: TrendingProduct[]
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(0)
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 530)
    return () => clearInterval(t)
  }, [])

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 10)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
    const pc = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth))
    setPages(pc)
    setPage(Math.min(pc - 1, Math.round(el.scrollLeft / el.clientWidth)))
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    update()
    el.addEventListener("scroll", update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)

    return () => {
      el.removeEventListener("scroll", update)
      ro.disconnect()
    }
  }, [update])

  const scrollByCards = (dir: "left" | "right") => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-trending-card]")
    const gap = 12
    const step = ((card?.offsetWidth ?? el.clientWidth / 4) + gap) * 2
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" })
  }

  const goToPage = (i: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" })
  }

  const arrowBase =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-[#111111]/90 backdrop-blur border border-[#eab308]/30 text-[#facc15] opacity-70 drop-shadow-lg transition-all duration-200 hover:opacity-100 hover:bg-[#eab308] hover:text-black hover:border-[#eab308] disabled:opacity-30 disabled:cursor-not-allowed"

  return (
    <section className="py-16 sm:py-20 flex justify-center px-4" role="region" aria-label="Trending">
      <div className="w-full max-w-3xl bg-[#0a0a0a] border border-[#eab308]/20 rounded-xl shadow-[0_0_30px_rgba(250,204,21,0.06)] overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#111111] border-b border-[#eab308]/15">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <span className="ml-3 text-xs font-mono text-[#facc15]/60">products.sh — bash</span>
          <LocalizedClientLink
            href="/store"
            data-testid="trending-view-all"
            className="ml-auto font-mono text-[11px] text-[#888888] hover:text-[#facc15] transition-colors duration-200"
          >
            $ VER_TODO
          </LocalizedClientLink>
        </div>

        {/* Prompt */}
        <div className="px-4 sm:px-6 pt-5">
          <p className="font-mono text-xs sm:text-sm">
            <span className="text-yellow-300">root</span>
            <span className="text-[#888888]">@</span>
            <span className="text-[#facc15]">king-keys</span>
            <span className="text-[#888888]">:~$</span>{" "}
            <span className="text-white/90">./products.sh</span>{" "}
            <span className="text-[#facc15]">--trending</span>
            <span className={`text-[#facc15] ${cursor ? "opacity-100" : "opacity-0"}`}>_</span>
          </p>
        </div>

        {/* Carousel dentro del marco */}
        <div className="relative mt-4 mb-1">
          <button
            onClick={() => scrollByCards("left")}
            disabled={!canLeft}
            aria-label="Anterior"
            data-testid="trending-arrow-left"
            className={`${arrowBase} left-1.5`}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <div
            ref={trackRef}
            className="overflow-x-auto snap-x snap-mandatory px-3 sm:px-6 pb-3 hide-scrollbar"
          >
            <div className="flex gap-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  data-trending-card
                  className="snap-start shrink-0 w-[58vw] sm:w-[calc((100%-1.5rem)/3)] md:w-[calc((100%-3rem)/4)]"
                >
                  <TrendingCard product={p} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scrollByCards("right")}
            disabled={!canRight}
            aria-label="Siguiente"
            data-testid="trending-arrow-right"
            className={`${arrowBase} right-1.5`}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Dots */}
        {pages > 1 && (
          <div className="flex justify-center items-center gap-2 pb-3">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                aria-label={`Ir a página ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === page
                    ? "w-5 bg-[#eab308]"
                    : "w-1 bg-[#2a2a2a] hover:bg-[#3a3a3a]"
                }`}
              />
            ))}
          </div>
        )}

        {/* Footer prompt */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-t border-[#eab308]/10">
          <span className="font-mono text-xs text-[#facc15]/70">root@king-keys:~$</span>
          <LocalizedClientLink
            href="/store"
            className="font-mono text-xs text-[#888888] hover:text-[#facc15] transition-colors duration-200"
          >
            ./ver_catalogo_completo
          </LocalizedClientLink>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}
