import { NextRequest, NextResponse } from "next/server"
import { validateWebhookSecret } from "@lib/webhook-auth"
import { checkRateLimit } from "@lib/rate-limit"

const AURPAY_WEBHOOK_SECRET = process.env.AURPAY_WEBHOOK_SECRET
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL!
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY!

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`aurpay-webhook:${ip}`, 20, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const auth = validateWebhookSecret(req, AURPAY_WEBHOOK_SECRET)
    if (!auth.valid) {
      console.warn("[Aurpay Webhook] Auth failed:", auth.reason)
      return NextResponse.json({ error: auth.reason }, { status: 403 })
    }

    const body = await req.json()
    const cartId = req.nextUrl.searchParams.get("cart_id")

    const { status, order_id } = body

    if (status === "SUCCEED" || status === "succeed") {
      if (!cartId) {
        console.error("[Aurpay Webhook] No cart_id in query params")
        return NextResponse.json({ error: "Missing cart_id" }, { status: 400 })
      }

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
        console.error("[Aurpay Webhook] Failed to complete cart:", medusaData)
        return NextResponse.json(
          { error: "Failed to complete Medusa order" },
          { status: 500 }
        )
      }

    console.error(
      `[Aurpay Webhook] Order placed successfully: ${medusaData?.order?.id}`
    )
      return NextResponse.json({
        received: true,
        orderId: medusaData?.order?.id,
      })
    }

    console.error(`[Aurpay Webhook] Payment not succeeded (status: ${status})`)
    return NextResponse.json({ received: true, status })
  } catch (err: any) {
    console.error("[Aurpay Webhook] Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`aurpay-webhook-get:${ip}`, 10, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const auth = validateWebhookSecret(req, AURPAY_WEBHOOK_SECRET)
    if (!auth.valid) {
      console.warn("[Aurpay Webhook] GET auth failed:", auth.reason)
      return NextResponse.json({ error: auth.reason }, { status: 403 })
    }

    const cartId = req.nextUrl.searchParams.get("cart_id")

    if (!cartId) {
      return NextResponse.json({ error: "Missing cart_id" }, { status: 400 })
    }

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
      console.error("[Aurpay Webhook] Failed to complete cart via GET:", medusaData)
      return NextResponse.json(
        { error: "Failed to complete Medusa order" },
        { status: 500 }
      )
    }

    console.error(
      `[Aurpay Webhook] Order placed successfully via GET: ${medusaData?.order?.id}`
    )

    return NextResponse.json({
      received: true,
      orderId: medusaData?.order?.id,
    })
  } catch (err: any) {
    console.error("[Aurpay Webhook] GET Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
