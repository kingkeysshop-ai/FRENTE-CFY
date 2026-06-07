import { Metadata } from "next"
import ResetPassword from "@modules/account/components/reset-password"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Restablecer Contraseña",
  description: "Restablece tu contraseña de KING KEYS.",
}

export default async function ResetPasswordPage(props: {
  searchParams: Promise<{ token?: string; email?: string }>
}) {
  const { token, email } = await props.searchParams

  if (!token || !email) {
    redirect("/forgot-password")
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <ResetPassword email={decodeURIComponent(email)} token={token} />
    </div>
  )
}
