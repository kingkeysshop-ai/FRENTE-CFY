"use client"

import { resetPassword } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useActionState } from "react"

const ResetPassword = ({
  email: initialEmail,
  token,
}: {
  email: string
  token: string
}) => {
  const [state, formAction] = useActionState(resetPassword, { error: null, submitted: false })
  const isSuccess = state.submitted && !state.error

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center" data-testid="reset-password-page">
      <h1 className="text-2xl font-black text-white uppercase mb-2 tracking-tight">
        Nueva Contraseña 🔑
      </h1>
      <p className="text-center text-sm text-[#888888] mb-8">
        Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.
      </p>

      {isSuccess ? (
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
        <form className="w-full" action={formAction}>
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
          <ErrorMessage error={state.error} />
          <SubmitButton className="w-full mt-6">
            Restablecer contraseña
          </SubmitButton>
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
