"use client"

import { useState, FormEvent } from "react"

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
    <div className="bg-gray-900/50 border border-yellow-400/10 rounded-xl p-6 w-full max-w-md">
      <p className="text-white font-bold text-sm mb-1">📬 Ofertas exclusivas</p>
      <p className="text-gray-500 text-xs mb-4">Recibe descuentos y novedades antes que nadie.</p>

      {status === "success" ? (
        <p className="text-green-400 text-sm font-medium">✓ ¡Gracias por suscribirte!</p>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/60 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors shrink-0"
          >
            Suscribir
          </button>
        </form>
      )}
    </div>
  )
}
