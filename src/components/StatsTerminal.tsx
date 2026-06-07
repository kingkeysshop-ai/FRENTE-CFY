"use client"

import { useEffect, useRef, useState } from "react"

const LINES = [
  { label: "productos_activos", value: 2847, suffix: "licencias vendidas hoy" },
  { label: "office_365", value: 1203, suffix: "activaciones exitosas" },
  { label: "windows_pro", value: 891, suffix: "clientes satisfechos" },
  { label: "excel_premium", value: 456, suffix: "pedidos completados" },
  { label: "clientes_totales", value: 5000, suffix: "clientes totales" },
]

function Counter({ target, active }: { target: number; active: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    const duration = 2000
    const start = performance.now()
    let raf: number

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target])

  return <>{target >= 5000 ? `${count.toLocaleString()}+` : count.toLocaleString()}</>
}

function Line({
  label,
  value,
  suffix,
  index,
  visible,
}: {
  label: string
  value: number
  suffix: string
  index: number
  visible: boolean
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setShow(true), index * 200)
    return () => clearTimeout(t)
  }, [visible, index])

  if (!show) return null

  return (
    <div className="flex items-center gap-2 text-sm sm:text-base leading-relaxed animate-fadeIn">
      <span className="text-[#facc15]/70 shrink-0">$</span>
      <span className="text-yellow-300/90 font-mono">{label}</span>
      <span className="text-[#888888] flex-1 min-w-[20px] text-center">..</span>
      <span className="text-[#facc15] font-mono font-bold tabular-nums shrink-0">
        [{<Counter target={value} active={show} />}]
      </span>
      <span className="text-[#facc15]/60 font-mono text-xs hidden sm:inline">
        {suffix}
      </span>
    </div>
  )
}

export default function StatsTerminal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 530)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-16 sm:py-24 flex justify-center px-4">
      <div
        ref={ref}
        className="w-full max-w-2xl bg-[#0a0a0a] border border-yellow-900/50 rounded-xl shadow-[0_0_30px_rgba(250,204,21,0.06)] overflow-hidden"
      >
        {/* Terminal bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-yellow-900/30">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <span className="ml-3 text-xs font-mono text-[#facc15]/60">licenses.sh — bash</span>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-1.5">
          <p className="text-[#facc15]/50 font-mono text-xs mb-4">
            <span className="text-yellow-300">root</span>
            <span className="text-[#888888]">@</span>
            <span className="text-[#facc15]">king-keys</span>
            <span className="text-[#888888]">:~$</span> ./licenses.sh --stats
          </p>

          {LINES.map((line, i) => (
            <Line key={line.label} {...line} index={i} visible={visible} />
          ))}

          <div className="flex items-center gap-2 mt-4 text-sm">
            <span className="text-[#facc15] font-mono">root@king-keys:~$</span>
            <span className={`font-mono text-yellow-300/90 ${cursor ? "opacity-100" : "opacity-0"}`}>_</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
