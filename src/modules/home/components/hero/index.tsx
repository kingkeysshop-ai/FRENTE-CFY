"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useEffect, useState, useRef, useCallback } from "react"
import Windows from "@modules/common/icons/windows"
import Office from "@modules/common/icons/office"
import Xbox from "@modules/common/icons/xbox"
import Playstation from "@modules/common/icons/playstation"
import Steam from "@modules/common/icons/steam"
import Antivirus from "@modules/common/icons/antivirus"
import Key from "@modules/common/icons/key"

const PLATFORMS = [
  { name: "Windows", icon: Windows },
  { name: "Office", icon: Office },
  { name: "Xbox", icon: Xbox },
  { name: "PlayStation", icon: Playstation },
  { name: "Steam", icon: Steam },
  { name: "Antivirus", icon: Antivirus },
]

const HERO_PRODUCTS = [
  { icon: Windows, name: "Windows 11 Pro", tags: "#licencia #vitalicia #1pc", price: "$12.90", old: "$89.99" },
  { icon: Office, name: "Office 2024 Pro", tags: "#word #excel #ppt #1pc", price: "$18.50", old: "$119.99" },
  { icon: Antivirus, name: "AVG Internet Security", tags: "#antivirus #3devices #1year", price: "$9.90", old: "$39.99" },
]

const TERMINAL_LINES = [
  { prompt: "$", cmd: "./productos --list --top-sellers" },
  { prompt: "", cmd: "Cargando catálogo...", isOutput: true, ok: true },
  { prompt: "", cmd: "Mostrando 3 de 24 productos", isOutput: true, highlight: true },
  { prompt: "$", cmd: "./comprar --id windows-11-pro" },
  { prompt: "", cmd: "Procesando pago seguro... listo", isOutput: true, done: true },
]

type HeroProps = {
  productCount?: number
}

const Hero = ({ productCount }: HeroProps) => {
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [typewriterDone, setTypewriterDone] = useState(false)
  const [visibleLines, setVisibleLines] = useState(0)
  const [hoverBtn, setHoverBtn] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleLines(i)
      if (i >= TERMINAL_LINES.length) {
        clearInterval(interval)
        setTimeout(() => setTypewriterDone(true), 300)
      }
    }, 350)
    return () => clearInterval(interval)
  }, [mounted])

  return (
    <div className="relative w-full min-h-[90vh] bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-black overflow-hidden flex items-center justify-center">

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 70%)",
        }}
      />

      {/* Corner gold particles */}
      <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 0% 0%, rgba(250,204,21,0.04) 0%, transparent 60%)",
        }}
      />
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 100% 0%, rgba(250,204,21,0.03) 0%, transparent 60%)",
        }}
      />
      <div className="absolute bottom-0 left-1/4 w-96 h-64 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 100%, rgba(250,204,21,0.025) 0%, transparent 60%)",
        }}
      />

      {/* Section glow divs */}
      <div
        className="absolute top-[-15%] left-1/2 w-[700px] h-[700px] rounded-full bg-[#facc15] opacity-[0.06] blur-[120px] pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.25}px) translateX(-50%)` }}
      />
      <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] rounded-full bg-[#facc15] opacity-[0.04] blur-[100px] pointer-events-none" />

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Grid de puntos */}
      <div className="absolute inset-0 hero-grid-bg" />

      {/* Contenido - split layout con terminal */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center py-16 sm:py-24 lg:py-0 min-h-[90vh]">

        {/* LEFT: Brand copy */}
        <div
          className="flex flex-col gap-4 sm:gap-5"
          style={{
            transition: "opacity 700ms ease-out, transform 700ms ease-out",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
          }}
        >
          {/* Badge tipo terminal */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#0a0a0a]/40 border border-[#facc15]/20 text-white text-xs font-mono tracking-wider backdrop-blur-md w-fit shadow-glow-yellow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
            <span className="text-[#facc15] font-medium">$</span>
            <span>KING KEYS v2.0 · ONLINE</span>
          </div>

          {/* Platform badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {PLATFORMS.map((p, i) => {
              const Icon = p.icon
              return (
                <span
                  key={p.name}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#888888] text-[11px] font-semibold hover:bg-[#facc15]/10 hover:border-[#facc15]/30 hover:text-[#facc15] transition-all duration-300 cursor-default"
                  style={{ animation: mounted ? `heroFloat 4s ease-in-out ${i * 0.3}s infinite` : "none" }}
                >
                  <Icon size="14" color="currentColor" /> {p.name}
                </span>
              )
            })}
          </div>

          {/* Titulo */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
              Terminal <span className="text-gold">de Licencias</span>
            </h1>
          </div>

          {/* Subtitulo */}
          <p className="text-sm md:text-base text-[#888888] max-w-lg leading-relaxed font-mono">
            <span className="text-[#facc15]/70">$</span> Sistema de activación inmediata — licencias originales{" "}
            <span className="text-[#facc15]/90 font-semibold">Windows, Office, antivirus y gaming</span>
            {" "}al mejor precio garantizado.
          </p>

          {/* Product count */}
          {productCount !== null && (
            <div className="flex items-center gap-2 text-xs text-[#888888] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {productCount}+ productos disponibles · Envío instantáneo
            </div>
          )}

          {/* Botones con prefijo $ */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-1">
            <LocalizedClientLink
              href="/store"
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              className="group relative px-8 py-3.5 bg-gradient-to-r from-[#facc15] to-[#f59e0b] text-gray-900 font-black rounded-[10px] text-sm overflow-hidden hover:-translate-y-0.5 transition-all duration-300 font-mono tracking-wide shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_-1px_0_rgba(0,0,0,0.2)_inset,0_4px_16px_rgba(250,204,21,0.25)] hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_-1px_0_rgba(0,0,0,0.2)_inset,0_8px_32px_rgba(250,204,21,0.45)] active:shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_-1px_0_rgba(0,0,0,0.3)_inset,0_2px_8px_rgba(250,204,21,0.15)]"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
              <span className="relative flex items-center gap-1.5">
                <span className="opacity-70">$</span>
                <span>./explorar-tienda</span>
                {hoverBtn && <span className="w-[3px] h-4 bg-gray-900/60 animate-pulse" />}
              </span>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store?sortBy=price_asc"
              className="group relative px-8 py-3.5 border border-[#facc15]/30 text-[#facc15] font-bold rounded-[10px] text-sm hover:border-[#facc15] hover:bg-[#facc15]/10 hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center justify-center gap-2 font-mono tracking-wide"
            >
              <span className="opacity-70">$</span>
              <span>./ofertas --today</span>
              <span className="w-[3px] h-4 bg-[#facc15] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
            </LocalizedClientLink>
          </div>

          {/* Stats como comandos */}
          <div className="flex gap-8 md:gap-12 pt-4 border-t border-white/5">
            <div className="flex flex-col items-start gap-0.5 group cursor-default">
              <span className="text-[10px] text-[#555] font-mono tracking-tight">&gt; garantia.check()</span>
              <span className="text-xl font-black text-gold group-hover:scale-110 transition-transform duration-200">100%</span>
            </div>
            <div className="flex flex-col items-start gap-0.5 group cursor-default">
              <span className="text-[10px] text-[#555] font-mono tracking-tight">&gt; soporte.status()</span>
              <span className="text-xl font-black text-gold group-hover:scale-110 transition-transform duration-200">24/7</span>
            </div>
            <div className="flex flex-col items-start gap-0.5 group cursor-default">
              <span className="text-[10px] text-[#555] font-mono tracking-tight">&gt; clientes.total()</span>
              <span className="text-xl font-black text-gold group-hover:scale-110 transition-transform duration-200">5K+</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Terminal window */}
        <div
          className="flex items-center justify-center"
          style={{
            transition: "opacity 800ms ease-out 200ms, transform 800ms ease-out 200ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div
            className="terminal-win w-full max-w-[480px] relative"
            style={{
              animation: "heroFloatCard 6s ease-in-out infinite",
              boxShadow: "0 0 40px rgba(250,204,21,0.06), 0 0 80px rgba(0,255,136,0.02)",
            }}
          >
            {/* Title bar */}
            <div className="terminal-bar">
              <div className="terminal-dots">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
              </div>
              <span className="terminal-title">king@keys:<span className="text-[#facc15]">~</span>$ bash productos.sh</span>
              <span className="w-[52px]" />
            </div>

            {/* Body with typewriter */}
            <div className="terminal-body min-h-[200px] lg:min-h-[280px]">
              {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => {
                if (line.isOutput) {
                  return (
                    <div key={i} className="terminal-out" style={{ marginBottom: line.done ? 0 : 12 }}>
                      {line.ok && <span className="text-green-400">✔</span>}
                      {line.highlight && <span className="text-[#facc15]">▶</span>}
                      {" "}{line.cmd}
                      {line.done && <span className="text-green-400"> listo</span>}
                    </div>
                  )
                }
                return (
                  <div key={i} className="terminal-line">
                    <span className="terminal-prompt">{line.prompt}</span>
                    <span className="terminal-cmd">{line.cmd}</span>
                    {i === visibleLines - 1 && !typewriterDone && i < TERMINAL_LINES.length - 1 && (
                      <span className="terminal-cursor" />
                    )}
                    {i === TERMINAL_LINES.length - 1 && typewriterDone && (
                      <span className="terminal-cursor" />
                    )}
                  </div>
                )
              })}

              {/* Product rows after typewriter */}
              {typewriterDone && (
                <div className="flex flex-col gap-2 mt-3 mb-3">
                  {HERO_PRODUCTS.map((p, i) => {
                    const Icon = p.icon
                    return (
                    <div
                      key={p.name}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[rgba(250,204,21,0.08)] bg-[rgba(250,204,21,0.02)] hover:bg-[rgba(250,204,21,0.04)] hover:border-[rgba(250,204,21,0.15)] hover:translate-x-1 transition-all duration-300 cursor-default"
                      style={{ animation: `fadeSlideUp 0.5s ${i * 0.12}s both` }}
                    >
                      <span className="flex-shrink-0"><Icon size="24" color="#facc15" /></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{p.name}</div>
                        <div className="text-xs text-[#555] font-mono">{p.tags}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-base font-bold font-mono text-gold">{p.price}</div>
                        <div className="text-[11px] text-[#444] font-mono line-through">{p.old}</div>
                      </div>
                    </div>
                  )
                })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20"
        style={{
          transition: "opacity 700ms ease-out 900ms",
          opacity: mounted && scrollY < 80 ? 1 : 0,
        }}
      >
        <span className="text-[10px] text-[#555] uppercase tracking-[0.2em] font-medium font-mono">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
          <div
            className="w-1 h-2 rounded-full"
            style={{ background: "#facc15", animation: "scrollDot 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>

      {/* Linea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#facc15]/20 to-transparent z-20" />

      {/* Keyframes */}
      <style>{`
        @keyframes heroFloat {
          0%   { transform: translateY(0px) translateX(0px) scale(1); }
          50%  { transform: translateY(-18px) translateX(8px) scale(1.15); }
          100% { transform: translateY(-30px) translateX(-6px) scale(0.85); }
        }
        @keyframes heroFloatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes scrollDot {
          0%   { transform: translateY(0); opacity: 1; }
          80%  { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let particles: { x: number; y: number; vx: number; vy: number; baseX: number; baseY: number; size: number; alpha: number; driftX: number; driftY: number; born: number }[] = []
    let mouseX = -1e4, mouseY = -1e4, mouseActive = false

    function resize() {
      const rect = parent!.getBoundingClientRect()
      canvas!.width = rect.width
      canvas!.height = rect.height
    }

    function init() {
      resize()
      const count = Math.min(Math.floor((canvas!.width * canvas!.height) / 7000), 80)
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: 0,
        vy: 0,
        baseX: Math.random() * canvas!.width,
        baseY: Math.random() * canvas!.height,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        driftX: (i % 3 - 1) * (Math.random() * 0.08 + 0.04),
        driftY: (i % 5 - 2) * (Math.random() * 0.06 + 0.02),
        born: Date.now(),
      }))
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      for (const p of particles) {
        p.vx += (p.baseX - p.x) * 0.002 + p.driftX + Math.sin(Date.now() * 0.0008 + p.baseX) * 0.02
        p.vy += (p.baseY - p.y) * 0.002 + p.driftY + Math.cos(Date.now() * 0.0006 + p.baseY) * 0.02
        p.vx *= 0.98
        p.vy *= 0.98

        p.baseX += (p.x - p.baseX) * 0.0005
        p.baseY += (p.y - p.baseY) * 0.0005

        if (mouseActive) {
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150
            p.vx -= (dx / dist) * force * 3.5
            p.vy -= (dy / dist) * force * 3.5
          }
        }

        p.x += p.vx
        p.y += p.vy

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(250, 204, 21, ${p.alpha})`
        ctx!.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < 12000) {
            const d = Math.sqrt(d2)
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(250, 204, 21, ${(1 - d / 110) * 0.15})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    function cleanup() {
      const now = Date.now()
      particles = particles.filter((p) => now - p.born < 30000)
    }
    const cleanupInterval = setInterval(cleanup, 5000)

    function onClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top

      for (const p of particles) {
        const dx = p.x - cx
        const dy = p.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 300 && dist > 0) {
          const force = (300 - dist) / 300
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.8
          p.vx += Math.cos(angle) * force * (12 + Math.random() * 8)
          p.vy += Math.sin(angle) * force * (12 + Math.random() * 8)
        }
      }

      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i + (Math.random() - 0.5) * 0.5
        const speed = 3 + Math.random() * 4
        particles.push({
          x: cx + Math.cos(angle) * 5,
          y: cy + Math.sin(angle) * 5,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseX: cx + Math.cos(angle) * (30 + Math.random() * 40),
          baseY: cy + Math.sin(angle) * (30 + Math.random() * 40),
          size: Math.random() * 3 + 2,
          alpha: 0.6 + Math.random() * 0.4,
          driftX: 0,
          driftY: 0,
          born: Date.now(),
        })
      }
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
      mouseActive = true
    }

    function onLeave() { mouseActive = false }

    const observer = new ResizeObserver(() => resize())
    observer.observe(parent)

    init()
    draw()
    canvas.addEventListener("click", onClick)
    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("mouseleave", onLeave)

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(cleanupInterval)
      observer.disconnect()
      canvas.removeEventListener("click", onClick)
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  )
}

export default Hero
