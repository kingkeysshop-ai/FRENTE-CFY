"use client"

import ErrorMessage from "@modules/checkout/components/error-message"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState, FormEvent } from "react"

const ResetPassword = ({
  email: initialEmail,
  token,
}: {
  email: string
  token: string
}) => {
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const data = new FormData(form)
    const email = data.get("email") as string
    const token = data.get("token") as string
    const password = data.get("password") as string
    const passwordConfirm = data.get("password_confirm") as string

    if (!email || !token || !password) {
      setError("Todos los campos son obligatorios")
      setLoading(false)
      return
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      setLoading(false)
      return
    }
    if (password !== passwordConfirm) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/resend/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        setError(responseData.error || "Error al restablecer la contraseña")
        setLoading(false)
        return
      }

      setSubmitted(true)
    } catch {
      setError("Error al restablecer la contraseña. El token puede haber expirado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center" data-testid="reset-password-page">
      <h1 className="text-2xl font-black text-white uppercase mb-2 tracking-tight">
        Nueva Contraseña 🔑
      </h1>
      <p className="text-center text-sm text-[#888888] mb-8">
        Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.
      </p>

      {submitted && !error ? (
        <div className="w-full bg-[#1a1a1a]/60 border border-green-500/30 rounded-xl p-6 text-center">
          <span className="text-4xl block mb-3">✅</span>
          <p className="text-white font-bold text-sm mb-2">Contraseña actualizada</p>
          <p className="text-[#888888] text-sm mb-4">
            Tu contraseña se ha restablecido correctamente.
          </p>
          <LocalizedClientLink href="/account">
            <button className="w-full py-3 bg-[#facc15] text-[#0a0a0a] font-black rounded-xl hover:bg-[#e6b800] transition-all text-sm">
              Iniciar sesión
            </button>
          </LocalizedClientLink>
        </div>
      ) : (
        <form className="w-full" onSubmit={handleSubmit}>
          <input type="hidden" name="email" value={initialEmail} />
          <input type="hidden" name="token" value={token} />
          <div className="flex flex-col w-full gap-y-3">
            <Input
              label="Nueva contraseña"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
            <Input
              label="Confirmar contraseña"
              name="password_confirm"
              type="password"
              autoComplete="new-password"
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
              "Restablecer contraseña"
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

export default ResetPassword
