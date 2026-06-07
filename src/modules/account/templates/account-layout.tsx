"use client"

import React from "react"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"
import ShieldCheck from "@modules/common/icons/shield-check"
import Lightning from "@modules/common/icons/lightning"
import Headset from "@modules/common/icons/headset"
import User from "@modules/common/icons/user"

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: (i % 3) * 2 + 3,
  x: (i * 17 + 5) % 100,
  y: (i * 23 + 10) % 100,
  duration: (i % 4) + 6,
  delay: (i % 5) * 1.2,
  opacity: (i % 4) * 0.08 + 0.08,
}))

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ customer, children }) => {

  if (!customer) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-16 overflow-hidden">

        {/* Brillo dorado */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#facc15] opacity-[0.05] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-[-10%] w-[350px] h-[350px] rounded-full bg-[#facc15] opacity-[0.04] blur-[100px] pointer-events-none" />

        {/* Grid de puntos */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #facc15 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Particulas flotantes */}
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-[#facc15] pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
              animation: `accountFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}

        {/* Contenido */}
        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-8">
          <a href="/" className="text-3xl font-black tracking-normal uppercase">
            <span className="text-white">KING</span>
            <span className="text-[#facc15]"> KEYS</span>
          </a>
          <div className="w-full bg-[#111111]/80 backdrop-blur-sm border border-[#facc15]/20 rounded-2xl overflow-hidden shadow-2xl shadow-black">
            {children}
          </div>
          <div className="flex gap-10">
            {[
              { icon: ShieldCheck, text: "Acceso Seguro" },
              { icon: Lightning, text: "Entrega Inmediata" },
              { icon: Headset, text: "Soporte 24/7" },
            ].map((g) => (
              <div key={g.text} className="flex flex-col items-center gap-1">
                <g.icon size="28" color="#888888" />
                <span className="text-xs text-[#888888]">{g.text}</span>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes accountFloat {
            0%   { transform: translateY(0px) translateX(0px) scale(1); }
            50%  { transform: translateY(-18px) translateX(8px) scale(1.15); }
            100% { transform: translateY(-30px) translateX(-6px) scale(0.85); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden" data-testid="account-page">

      {/* Brillo dorado */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#facc15] opacity-[0.04] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-5%] w-[400px] h-[400px] rounded-full bg-[#facc15] opacity-[0.03] blur-[100px] pointer-events-none" />

      {/* Grid de puntos */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, #facc15 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Particulas flotantes */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-[#facc15] pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity * 0.6,
            animation: `accountFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Header */}
      <div className="relative z-10 border-b border-[#facc15]/20 bg-[#111111]/80 backdrop-blur-sm">
        <div className="content-container py-8 flex flex-col gap-1">
          <span className="text-xs text-[#facc15] font-bold uppercase tracking-widest inline-flex items-center gap-1"><User size="14" color="#facc15" /> King Keys</span>
          <h1 className="text-3xl font-black text-white">Mi <span className="text-[#facc15]">Cuenta</span></h1>
        </div>
      </div>

      <div className="relative z-10 content-container py-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 small:grid-cols-[260px_1fr] gap-8">

          {/* Sidebar */}
          <div className="bg-[#111111]/80 backdrop-blur-sm border border-[#2a2a2a] rounded-xl p-4 h-fit small:sticky small:top-20">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#2a2a2a]">
              <div className="w-10 h-10 rounded-full bg-[#facc15] flex items-center justify-center text-[#0a0a0a] font-black text-lg">
                {customer.first_name?.[0]?.toUpperCase() ?? <User size="20" color="#0a0a0a" />}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{customer.first_name ?? ""} {customer.last_name ?? ""}</p>
                <p className="text-[#888888] text-xs truncate max-w-[160px]">{customer.email}</p>
              </div>
            </div>
            <AccountNav customer={customer} />
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>

        {/* Footer soporte */}
        <div className="mt-12 pt-8 border-t border-[#2a2a2a] flex flex-col small:flex-row items-start small:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">¿Necesitas ayuda?</h3>
            <p className="text-[#888888] text-sm">Nuestro equipo está disponible 24/7 para ayudarte.</p>
          </div>
          <a
            href="/support"
            className="px-6 py-3 bg-[#facc15] text-[#0a0a0a] font-bold rounded-lg text-sm hover:bg-[#e6b800] transition-all duration-200 whitespace-nowrap inline-flex items-center gap-2"
          >
            <Headset size="18" color="#0a0a0a" /> Contactar Soporte
          </a>
        </div>
      </div>

      <style>{`
        @keyframes accountFloat {
          0%   { transform: translateY(0px) translateX(0px) scale(1); }
          50%  { transform: translateY(-18px) translateX(8px) scale(1.15); }
          100% { transform: translateY(-30px) translateX(-6px) scale(0.85); }
        }
      `}</style>
    </div>
  )
}

export default AccountLayout
