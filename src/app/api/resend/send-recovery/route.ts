import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { checkRateLimit } from "@lib/rate-limit"
import { setResetToken } from "@lib/reset-token-store"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"

export async function POST(req: NextRequest) {
  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY no configurada" }, { status: 500 })
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`resend-recovery:${ip}`, 3, 60000)) {
      return NextResponse.json({ error: "Demasiadas solicitudes. Intenta en 1 minuto." }, { status: 429 })
    }

    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    const token = crypto.randomBytes(32).toString("hex")
    setResetToken(token, email.toLowerCase())

    const countryCode = "co"
    const resetUrl = `${NEXT_PUBLIC_BASE_URL}/${countryCode}/reset-password?token=${token}&email=${encodeURIComponent(email)}`

    console.log(`[Resend] Sending recovery email to ${email}...`)

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "KING KEYS <noreply@elreino.digital>",
        to: email,
        subject: "Recupera tu contraseña - KING KEYS",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #fff; border-radius: 16px;">
            <h1 style="color: #facc15; font-size: 22px; margin: 0 0 8px;">KING KEYS</h1>
            <p style="color: #888; font-size: 14px; margin: 0 0 24px;">Recuperacion de contrasena</p>
            <p style="color: #ccc; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
              Recibimos una solicitud para restablecer tu contrasena.<br/>
              Hace clic en el boton de abajo para crear una nueva:
            </p>
            <a href="${resetUrl}" style="display: inline-block; background: #facc15; color: #0a0a0a; font-weight: 900; font-size: 14px; padding: 14px 32px; border-radius: 12px; text-decoration: none;">
              Restablecer contrasena
            </a>
            <p style="color: #666; font-size: 12px; margin-top: 24px; line-height: 1.5;">
              Si no solicitaste esto, ignora este correo.<br/>
              El enlace expira en 1 hora.
            </p>
          </div>
        `,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("[Resend] Error sending email:", data)
      return NextResponse.json({ error: "Error al enviar el correo. Verifica tu API key de Resend." }, { status: 500 })
    }

    console.log(`[Resend] Recovery email sent to ${email} (id: ${data.id})`)
    return NextResponse.json({ ok: true, message: "Correo enviado" })
  } catch (err: any) {
    console.error("[Resend] send-recovery error:", err.message)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
