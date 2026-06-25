"use client"

import ErrorMessage from "@modules/checkout/components/error-message"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState, FormEvent } from "react"
import Lock from "@modules/common/icons/lock"

const ForgotPassword = () => {
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const email = new FormData(form).get("email") as string

    if (!email) {
      setError("El correo electrónico es obligatorio")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/resend/send-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      let data: any
      try {
        data = await res.json()
      } catch {
        const text = await res.text().catch(() => "")
        console.error("[forgot-password] Non-JSON response:", res.status, text.slice(0, 500))
        setError(`Error del servidor (${res.status}). Revisa la consola para más detalles.`)
        setLoading(false)
        return
      }

      if (!res.ok) {
        setError(data.error || `Error del servidor (${res.status})`)
        setLoading(false)
        return
      }

      setSubmitted(true)
    } catch (err) {
      console.error("[forgot-password] fetch error:", err)
      setError("No se pudo conectar con el servidor. Verifica que el servidor esté corriendo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center" data-testid="forgot-password-page">
      <h1 className="text-2xl font-black text-white uppercase mb-2 tracking-tight">
        Recuperar Contraseña <Lock size="18" color="#facc15" />
      </h1>
      <p className="text-center text-sm text-[#888888] mb-8">
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      {submitted && !error ? (
        <div className="w-full bg-[#1a1a1a]/60 border border-green-500/30 rounded-xl p-6 text-center">
          <span className="text-4xl block mb-3">📧</span>
          <p className="text-white font-bold text-sm mb-2">Correo enviado</p>
          <p className="text-[#888888] text-sm">
            Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.
          </p>
        </div>
      ) : (
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col w-full gap-y-3">
            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              title="Ingresa un correo válido."
              autoComplete="email"
              required
            />
          </div>
          <ErrorMessage error={error} />
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-4 bg-[#facc15] text-[#0a0a0a] font-black text-base rounded-xl hover:bg-[#e6b800] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Enviar enlace de recuperación"
            )}
          </button>
        </form>
      )}

      <LocalizedClientLink
        href="/account"
        className="text-[#888888] text-sm mt-6 hover:text-[#facc15] transition-colors"
      >
        ← Volver a iniciar sesión
      </LocalizedClientLink>
    </div>
  )
}

export default ForgotPassword
