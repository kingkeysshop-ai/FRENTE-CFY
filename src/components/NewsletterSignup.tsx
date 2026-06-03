"use client"

import { useState, FormEvent } from "react"
import Mail from "@modules/common/icons/mail"
import CheckCircle from "@modules/common/icons/check-circle"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("success")
    setEmail("")
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#F5C518]/20 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-5 w-full max-w-md shadow-[0_0_25px_rgba(245,197,24,0.06)]">
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#F5C518]/5 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#F5C518]/3 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#F5C518]/10 border border-[#F5C518]/20 flex items-center justify-center shrink-0">
            <Mail size="16" color="#F5C518" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Ofertas exclusivas</p>
            <p className="text-gray-500 text-[11px]">Recibe descuentos y novedades antes que nadie.</p>
          </div>
        </div>

        {status === "success" ? (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2.5">
            <CheckCircle size="16" color="#22c55e" />
            <span className="text-green-400 text-sm font-medium">✓ ¡Gracias por suscribirte!</span>
          </div>
        ) : (
          <form onSubmit={submit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#F5C518]/50 focus:shadow-[0_0_12px_rgba(245,197,24,0.08)] transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#F5C518] text-[#0a0a0a] text-sm font-bold rounded-lg hover:brightness-110 transition-all shrink-0 shadow-[0_0_12px_rgba(245,197,24,0.2)]"
            >
              Suscribir
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
