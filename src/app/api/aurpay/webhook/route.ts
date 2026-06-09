import { NextRequest, NextResponse } from "next/server"
import { validateWebhookSecret } from "@lib/webhook-auth"
import { checkRateLimit } from "@lib/rate-limit"

const AURPAY_ENV_SECRET = process.env.AURPAY_WEBHOOK_SECRET
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY

async function completeCart(cartId: string): Promise<{ ok: boolean; orderId?: string; alreadyCompleted?: boolean }> {
  // First check if order already exists for this cart
  try {
    const checkRes = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}`,
      { headers: { "x-publishable-api-key": MEDUSA_API_KEY! } }
    )
    if (checkRes.ok) {
      const { cart } = await checkRes.json()
      // If cart has completed_at, an order already exists
      if (cart?.completed_at) {
        const orderCheck = await fetch(
          `${MEDUSA_BACKEND_URL}/store/orders?cart_id=${cartId}`,
          { headers: { "x-publishable-api-key": MEDUSA_API_KEY! } }
        )
        if (orderCheck.ok) {
          const { orders } = await orderCheck.json()
          if (orders?.length > 0) {
            console.log(`[Aurpay Webhook] Cart ${cartId} already completed (order ${orders[0].id})`)
            return { ok: true, orderId: orders[0].id, alreadyCompleted: true }
          }
        }
      }
    }
  } catch (e: any) {
    console.warn(`[Aurpay Webhook] Could not check cart status for ${cartId}: ${e.message}`)
  }

  // Proceed to complete
  try {
    const medusaRes = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": MEDUSA_API_KEY!,
        },
      }
    )

    const medusaData = await medusaRes.json()

    if (!medusaRes.ok) {
      const isCompleted = medusaData?.type === "order"
      if (isCompleted) {
        console.log(`[Aurpay Webhook] Cart ${cartId} completed on retry (order ${medusaData?.data?.id})`)
        return { ok: true, orderId: medusaData?.data?.id }
      }
      console.error(`[Aurpay Webhook] Failed to complete cart ${cartId}: ${JSON.stringify(medusaData)}`)
      return { ok: false }
    }

    console.log(`[Aurpay Webhook] Cart ${cartId} completed successfully (order ${medusaData?.data?.id})`)
    return { ok: true, orderId: medusaData?.data?.id }
  } catch (e: any) {
    console.error(`[Aurpay Webhook] Error completing cart ${cartId}: ${e.message}`)
    return { ok: false }
  }
}

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
      console.warn(`[Aurpay Webhook] Auth failed: ${auth.reason}`)
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

    console.log(`[Aurpay Webhook] Received payment ${status} for cart ${cartId}`)

    if (status === "SUCCEED" || status === "succeed") {
      const result = await completeCart(cartId)

      if (result.ok) {
        return NextResponse.json({ received: true, orderId: result.orderId })
      }

      return NextResponse.json(
        { error: "Failed to complete order" },
        { status: 500 }
      )
    }

    if (status === "FAILED" || status === "failed" || status === "CANCELED" || status === "canceled") {
      console.log(`[Aurpay Webhook] Payment ${status} for cart ${cartId} — no action needed`)
      return NextResponse.json({ received: true, status })
    }

    return NextResponse.json({ received: true, status })
  } catch (err: any) {
    console.error(`[Aurpay Webhook] Internal error:`, err.message)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
