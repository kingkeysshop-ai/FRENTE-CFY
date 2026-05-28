import { Metadata } from "next"
import ForgotPassword from "@modules/account/components/forgot-password"

export const metadata: Metadata = {
  title: "Recuperar Contraseña",
  description: "Recupera el acceso a tu cuenta de KING KEYS.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <ForgotPassword />
    </div>
  )
}
