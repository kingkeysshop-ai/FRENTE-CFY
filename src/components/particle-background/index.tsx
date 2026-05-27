"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseX: number
  baseY: number
  size: number
  alpha: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let particles: Particle[] = []

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }

    function init() {
      resize()
      const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 80)
      particles = []
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas!.width
        const y = Math.random() * canvas!.height
        particles.push({
          x,
          y,
          vx: 0,
          vy: 0,
          baseX: x,
          baseY: y,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.5 + 0.1,
        })
      }
      particlesRef.current = particles
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      for (const p of particles) {
        const dx = p.baseX - p.x
        const dy = p.baseY - p.y
        p.vx += dx * 0.01
        p.vy += dy * 0.01
        p.vx *= 0.96
        p.vy *= 0.96

        if (mouseRef.current.active) {
          const mx = mouseRef.current.x - p.x
          const my = mouseRef.current.y - p.y
          const dist = Math.sqrt(mx * mx + my * my)
          if (dist < 200) {
            const force = (200 - dist) / 200
            p.vx -= (mx / dist) * force * 3
            p.vy -= (my / dist) * force * 3
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
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(250, 204, 21, ${(1 - dist / 120) * 0.15})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    function handleClick(e: MouseEvent) {
      const cx = e.clientX
      const cy = e.clientY
      for (const p of particles) {
        const dx = p.x - cx
        const dy = p.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 300) {
          const force = (300 - dist) / 300
          p.vx += (dx / dist) * force * 10
          p.vy += (dy / dist) * force * 10
        }
      }
    }

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
    }

    function handleMouseLeave() {
      mouseRef.current.active = false
    }

    window.addEventListener("resize", init)
    document.addEventListener("click", handleClick)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    init()
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", init)
      document.removeEventListener("click", handleClick)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
