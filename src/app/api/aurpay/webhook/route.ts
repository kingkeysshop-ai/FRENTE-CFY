import { NextRequest, NextResponse } from "next/server"
import { validateWebhookSecret } from "@lib/webhook-auth"
import { checkRateLimit } from "@lib/rate-limit"

const AURPAY_ENV_SECRET = process.env.AURPAY_WEBHOOK_SECRET
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY

export async function POST(req: NextRequest) {
  if (!MEDUSA_BACKEND_URL || !MEDUSA_API_KEY) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`aurpay-webhook:${ip}`, 20, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const auth = validateWebhookSecret(req, AURPAY_ENV_SECRET)
    if (!auth.valid) {
      return NextResponse.json({ error: auth.reason }, { status: 403 })
    }

    const cartId = req.nextUrl.searchParams.get("cart_id")
    if (!cartId) {
      return NextResponse.json({ error: "Missing cart_id" }, { status: 400 })
    }

    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const { status } = body || {}

    if (status === "SUCCEED" || status === "succeed") {
      const medusaRes = await fetch(
        `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": MEDUSA_API_KEY,
          },
        }
      )

      const medusaData = await medusaRes.json()

      if (!medusaRes.ok) {
        const isCompleted = medusaData?.type === "order"
        if (isCompleted) {
          return NextResponse.json({ received: true, orderId: medusaData?.order?.id })
        }
        return NextResponse.json(
          { error: "Failed to complete Medusa order" },
          { status: 500 }
        )
      }

      return NextResponse.json({ received: true, orderId: medusaData?.order?.id })
    }

    return NextResponse.json({ received: true, status })
  } catch (err: any) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
