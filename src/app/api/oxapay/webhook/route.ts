import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { checkRateLimit } from "@lib/rate-limit"

const OXAPAY_MERCHANT_API_KEY = process.env.OXAPAY_MERCHANT_API_KEY
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY || process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

function verifyWebhookSignature(rawBody: string, receivedHmac: string, apiKey: string): boolean {
  try {
    const expectedHmac = crypto
      .createHmac("sha512", apiKey)
      .update(rawBody)
      .digest("hex")
    if (expectedHmac.length !== receivedHmac.length) return false
    return crypto.timingSafeEqual(Buffer.from(expectedHmac), Buffer.from(receivedHmac))
  } catch {
    return false
  }
}

async function createPaymentSession(cartId: string): Promise<boolean> {
  const providers = [
    "pp_cryptomus_cryptomus",
    "pp_bold_bold",
    "pp_aurpay_aurpay",
    "pp_stripe_stripe",
  ]
  const headers = {
    "Content-Type": "application/json",
    "x-publishable-api-key": MEDUSA_API_KEY!,
  }

  // First initialize all payment sessions
  await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/payment-sessions`, {
    method: "POST",
    headers,
    body: JSON.stringify({}),
  }).catch(() => {})

  // Then try to select one that works
  for (const provider of providers) {
    try {
      const res = await fetch(
        `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/payment-session`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ provider_id: provider }),
        }
      )
      if (res.ok) {
        console.log(`[Oxapay Webhook] Payment session created with provider: ${provider}`)
        return true
      }
    } catch {}
  }

  console.warn(`[Oxapay Webhook] Could not create any payment session for cart ${cartId}`)
  return false
}

async function completeCart(cartId: string): Promise<{ ok: boolean; orderId?: string; alreadyCompleted?: boolean }> {
  try {
    const checkRes = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}`,
      { headers: { "x-publishable-api-key": MEDUSA_API_KEY! } }
    )
    if (checkRes.ok) {
      const { cart } = await checkRes.json()
      if (cart?.completed_at) {
        const orderCheck = await fetch(
          `${MEDUSA_BACKEND_URL}/store/orders?cart_id=${cartId}`,
          { headers: { "x-publishable-api-key": MEDUSA_API_KEY! } }
        )
        if (orderCheck.ok) {
          const { orders } = await orderCheck.json()
          if (orders?.length > 0) {
            console.log(`[Oxapay Webhook] Cart ${cartId} already completed (order ${orders[0].id})`)
            return { ok: true, orderId: orders[0].id, alreadyCompleted: true }
          }
        }
      }
    }
  } catch (e: any) {
    console.warn(`[Oxapay Webhook] Could not check cart status for ${cartId}: ${e.message}`)
  }

  // Create payment session before completing
  await createPaymentSession(cartId)

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
        return { ok: true, orderId: medusaData?.data?.id }
      }
      console.error(`[Oxapay Webhook] Failed to complete cart ${cartId}: ${JSON.stringify(medusaData)}`)
      return { ok: false }
    }

    console.log(`[Oxapay Webhook] Cart ${cartId} completed (order ${medusaData?.data?.id})`)
    return { ok: true, orderId: medusaData?.data?.id }
  } catch (e: any) {
    console.error(`[Oxapay Webhook] Error completing cart ${cartId}: ${e.message}`)
    return { ok: false }
  }
}

export async function POST(req: NextRequest) {
  if (!OXAPAY_MERCHANT_API_KEY || !MEDUSA_BACKEND_URL || !MEDUSA_API_KEY) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`oxapay-webhook:${ip}`, 20, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const rawBody = await req.text()
    const hmacHeader = req.headers.get("hmac") || ""

    if (!hmacHeader || !verifyWebhookSignature(rawBody, hmacHeader, OXAPAY_MERCHANT_API_KEY)) {
      console.warn(`[Oxapay Webhook] Invalid HMAC signature`)
      return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
    const { status, order_id, track_id, description } = body

    console.log(`[Oxapay Webhook] Received status="${status}" order_id="${order_id}" track_id="${track_id}"`)

    const cartId = order_id || description

    if (status === "Paid") {
      if (!cartId) {
        return NextResponse.json({ error: "Missing cart reference" }, { status: 400 })
      }

      const result = await completeCart(cartId)
      if (result.ok) {
        return new NextResponse("ok", { status: 200 })
      }

      return NextResponse.json(
        { error: "Failed to complete order" },
        { status: 500 }
      )
    }

    return new NextResponse("ok", { status: 200 })
  } catch (err: any) {
    console.error(`[Oxapay Webhook] Internal error:`, err.message)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
