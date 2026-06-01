"use client"

import { useEffect, useRef, useState } from "react"
import { Key, Zap, Headphones, Shield, Gem, RefreshCw, CheckCircle, Star, Package, MapPin } from "lucide-react"

const REASONS = [
  {
    icon: Key,
    title: "100% Originales",
    desc: "Todas nuestras licencias provienen directamente de distribuidores oficiales. Sin activadores, sin riesgos.",
    fn: "originalidad.verify()",
    ret: "// retorna: true",
  },
  {
    icon: Zap,
    title: "Entrega Inmediata",
    desc: "Recibes tu clave de activación por correo en segundos tras confirmar el pago. Sin esperas.",
    fn: "entrega.status()",
    ret: "// retorna: instant",
  },
  {
    icon: Headphones,
    title: "Soporte 24/7",
    desc: "Nuestro equipo está disponible todos los días del año para resolver cualquier problema con tu licencia.",
    fn: "soporte.ping()",
    ret: "// retorna: 24/7",
  },
  {
    icon: Shield,
    title: "Pago Seguro",
    desc: "Procesamos tus pagos con cifrado SSL. Tus datos bancarios nunca se almacenan en nuestros servidores.",
    fn: "pago.ssl()",
    ret: "// retorna: cifrado",
  },
  {
    icon: Gem,
    title: "Mejor Precio",
    desc: "Ofrecemos los precios más competitivos del mercado sin sacrificar la autenticidad del producto.",
    fn: "precio.compare()",
    ret: "// retorna: -70%",
  },
  {
    icon: RefreshCw,
    title: "Garantía de Reemplazo",
    desc: "Si tu licencia falla por causas ajenas a ti, la reemplazamos sin costo adicional ni preguntas.",
    fn: "garantia.check()",
    ret: "// retorna: ilimitado",
  },
]

const WhyUs = () => {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#F5C518] opacity-[0.04] blur-[120px] pointer-events-none" />

      <div className="content-container relative z-10 flex flex-col gap-12">

        <div
          className="flex flex-col items-center text-center gap-3"
          style={{
            transition: "opacity 700ms ease-out, transform 700ms ease-out",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <span className="px-4 py-1.5 rounded-full bg-[#F5C518]/10 border border-[#F5C518]/30 text-[#F5C518] text-xs font-bold tracking-widest uppercase">
            ¿Por qué elegirnos?
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            La elección <span className="text-[#F5C518]">inteligente</span>
          </h2>
          <div className="w-16 h-0.5 bg-[#F5C518] mx-auto mt-1" />
          <p className="text-gray-400 max-w-lg text-sm leading-relaxed">
            Miles de clientes ya confiaron en King Keys. Estas son las razones por las que nos eligen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="relative bg-[#0d0d0d] border border-white/10 rounded-lg p-6 flex flex-col gap-3 hover:border-[#F5C518]/40 transition-all duration-300"
              style={{
                boxShadow: visible ? "0 0 20px rgba(245,197,24,0.08)" : "none",
                transition: `opacity 600ms ease-out ${i * 100}ms, transform 600ms ease-out ${i * 100}ms, border-color 300ms, box-shadow 300ms`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
              }}
            >
              <div className="flex items-start gap-3">
                <r.icon className="w-5 h-5 text-[#F5C518] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <code className="text-[#F5C518]/70 font-mono text-sm">&gt; {r.fn}</code>
                  <code className="text-green-400 font-mono text-xs">{r.ret} ✓</code>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-white font-semibold text-lg">{r.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-white/10"
          style={{
            transition: "opacity 700ms ease-out 700ms, transform 700ms ease-out 700ms",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {[
            { icon: CheckCircle, text: "+5,000 clientes satisfechos" },
            { icon: Star, text: "4.9/5 valoración media" },
            { icon: Package, text: "+10,000 licencias entregadas" },
            { icon: MapPin, text: "Operamos desde Colombia" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2 text-sm text-gray-400">
              <b.icon className="w-4 h-4 text-[#F5C518]" />
              <span>{b.text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default WhyUs
