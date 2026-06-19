import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@lib/rate-limit"
import { getResetTokenData, deleteResetToken } from "@lib/reset-token-store"

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const MEDUSA_ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL
const MEDUSA_ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD

async function getAdminToken(): Promise<string> {
  if (!MEDUSA_ADMIN_EMAIL || !MEDUSA_ADMIN_PASSWORD) {
    throw new Error("MEDUSA_ADMIN_EMAIL y MEDUSA_ADMIN_PASSWORD no configurados en .env")
  }

  const res = await fetch(`${MEDUSA_BACKEND_URL}/admin/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: MEDUSA_ADMIN_EMAIL, password: MEDUSA_ADMIN_PASSWORD }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Error al autenticar admin: ${err.message || res.status}`)
  }

  const data = await res.json()
  return data.token || data.access_token
}

async function getCustomerByEmail(adminToken: string, email: string): Promise<any> {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}/admin/customers?email=${encodeURIComponent(email)}&limit=1`,
    { headers: { Authorization: `Bearer ${adminToken}` } }
  )

  if (!res.ok) return null
  const data = await res.json()
  const customers = data.customers || []
  return customers[0] || null
}

async function updateCustomerPassword(adminToken: string, customerId: string, password: string): Promise<boolean> {
  const res = await fetch(`${MEDUSA_BACKEND_URL}/admin/customers/${customerId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ password }),
  })
  return res.ok
}

export async function POST(req: NextRequest) {
  if (!MEDUSA_BACKEND_URL) {
    return NextResponse.json({ error: "MEDUSA_BACKEND_URL no configurado" }, { status: 500 })
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`resend-reset:${ip}`, 5, 60000)) {
      return NextResponse.json({ error: "Demasiadas solicitudes. Intenta en 1 minuto." }, { status: 429 })
    }

    const { email, token, password } = await req.json()

    if (!email || !token || !password) {
      return NextResponse.json({ error: "Email, token y contrasena son obligatorios" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "La contrasena debe tener al menos 8 caracteres" }, { status: 400 })
    }

    const tokenData = getResetTokenData(token)
    if (!tokenData) {
      return NextResponse.json({ error: "Token invalido o expirado. Solicita un nuevo enlace." }, { status: 400 })
    }

    if (tokenData.email !== email.toLowerCase()) {
      return NextResponse.json({ error: "Token invalido para este email" }, { status: 400 })
    }

    const adminToken = await getAdminToken()
    const customer = await getCustomerByEmail(adminToken, email)

    if (!customer) {
      deleteResetToken(token)
      return NextResponse.json({ error: "No se encontro una cuenta con este email" }, { status: 404 })
    }

    const updated = await updateCustomerPassword(adminToken, customer.id, password)

    if (!updated) {
      return NextResponse.json({ error: "Error al actualizar la contrasena en el servidor" }, { status: 500 })
    }

    deleteResetToken(token)
    console.log(`[Resend] Password reset successful for ${email}`)

    return NextResponse.json({ ok: true, message: "Contrasena actualizada exitosamente" })
  } catch (err: any) {
    console.error("[Resend] reset-password error:", err.message)
    return NextResponse.json({ error: err.message || "Error interno" }, { status: 500 })
  }
}
