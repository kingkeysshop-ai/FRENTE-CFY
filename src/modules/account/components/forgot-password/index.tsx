"use client"

import { generatePasswordToken } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useActionState } from "react"
import Lock from "@modules/common/icons/lock"

const ForgotPassword = () => {
  const [state, formAction] = useActionState(generatePasswordToken, { error: null, submitted: false })
  const isSuccess = state.submitted && !state.error

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center" data-testid="forgot-password-page">
      <h1 className="text-2xl font-black text-white uppercase mb-2 tracking-tight">
        Recuperar Contraseña <Lock size="18" color="#facc15" />
      </h1>
      <p className="text-center text-sm text-[#888888] mb-8">
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      {isSuccess ? (
        <div className="w-full bg-[#1a1a1a]/60 border border-green-500/30 rounded-xl p-6 text-center">
          <span className="text-4xl block mb-3">📧</span>
          <p className="text-white font-bold text-sm mb-2">Correo enviado</p>
          <p className="text-[#888888] text-sm">
            Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.
          </p>
        </div>
      ) : (
        <form className="w-full" action={formAction}>
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
          <ErrorMessage error={state.error} />
          <SubmitButton className="w-full mt-6">
            Enviar enlace de recuperación
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

export default ForgotPassword
