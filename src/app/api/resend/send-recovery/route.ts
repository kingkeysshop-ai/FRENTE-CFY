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

    const emailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#000;">
<tr>
<td align="center" style="padding:40px 16px;">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
<tr>
<td style="background:#0a0a0a;border-radius:20px;padding:40px 32px;border:1px solid #1a1a1a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="padding-bottom:32px;border-bottom:1px solid #1a1a1a;">
<h1 style="margin:0;color:#facc15;font-size:26px;font-weight:900;letter-spacing:-0.5px;">KING KEYS</h1>
<p style="margin:4px 0 0 0;color:#555;font-size:13px;">El Reino Digital</p>
</td>
</tr>
<tr>
<td style="padding:32px 0 24px;">
<h2 style="margin:0 0 8px;color:#fff;font-size:20px;font-weight:800;">Recuper\u00e1 tu contrase\u00f1a</h2>
<p style="margin:0;color:#888;font-size:14px;line-height:1.6;">
Recibimos una solicitud para restablecer la contrase\u00f1a de tu cuenta.<br/>
Hac\u00e9 clic en el bot\u00f3n de abajo para crear una nueva:
</p>
</td>
</tr>
<tr>
<td style="padding:8px 0 32px;">
<a href="${resetUrl}"
style="display:inline-block;background:#facc15;color:#0a0a0a;font-size:15px;font-weight:900;padding:16px 36px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
Restablecer contrase\u00f1a
</a>
</td>
</tr>
<tr>
<td style="background:#111;border-radius:12px;padding:16px 20px;">
<p style="margin:0;color:#666;font-size:13px;line-height:1.5;">
\u26a0 Este enlace expira en <strong style="color:#888;">1 hora</strong>.<br/>
Si no solicitaste este cambio, ignor\u00e1 este correo.
</p>
</td>
</tr>
<tr>
<td style="padding-top:32px;border-top:1px solid #1a1a1a;">
<p style="margin:0 0 6px;color:#444;font-size:12px;">
KING KEYS &mdash; El Reino Digital
</p>
<p style="margin:0;color:#333;font-size:11px;">
Si ten\u00e9s problemas con el bot\u00f3n, copi\u00e1 y peg\u00e1 este enlace:<br/>
<span style="color:#666;word-break:break-all;font-size:10px;">${resetUrl}</span>
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`

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
        html: emailHtml,
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
