import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { checkRateLimit } from "@lib/rate-limit"

const CRYPTOMUS_PAYMENT_KEY = process.env.CRYPTOMUS_PAYMENT_KEY
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY

function verifyWebhookSign(
  body: Record<string, unknown>,
  receivedSign: string,
  apiKey: string
): boolean {
  const bodyCopy = { ...body }
  delete bodyCopy.sign
  const jsonStr = JSON.stringify(bodyCopy)
  const base64 = Buffer.from(jsonStr).toString("base64")
  const expectedSign = crypto
    .createHash("md5")
    .update(base64 + apiKey)
    .digest("hex")
  return expectedSign === receivedSign
}

async function completeCart(cartId: string): Promise<{ ok: boolean; orderId?: string; alreadyCompleted?: boolean }> {
  // Check if cart already completed
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
            console.log(`[Cryptomus Webhook] Cart ${cartId} already completed (order ${orders[0].id})`)
            return { ok: true, orderId: orders[0].id, alreadyCompleted: true }
          }
        }
      }
    }
  } catch (e: any) {
    console.warn(`[Cryptomus Webhook] Could not check cart status for ${cartId}: ${e.message}`)
  }

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
      console.error(`[Cryptomus Webhook] Failed to complete cart ${cartId}: ${JSON.stringify(medusaData)}`)
      return { ok: false }
    }

    console.log(`[Cryptomus Webhook] Cart ${cartId} completed (order ${medusaData?.data?.id})`)
    return { ok: true, orderId: medusaData?.data?.id }
  } catch (e: any) {
    console.error(`[Cryptomus Webhook] Error completing cart ${cartId}: ${e.message}`)
    return { ok: false }
  }
}

export async function POST(req: NextRequest) {
  if (!CRYPTOMUS_PAYMENT_KEY || !MEDUSA_BACKEND_URL || !MEDUSA_API_KEY) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`cryptomus-webhook:${ip}`, 20, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const body = await req.json()
    const { sign, status, order_id, additional_data } = body

    if (!sign || !verifyWebhookSign(body, sign, CRYPTOMUS_PAYMENT_KEY)) {
      console.warn(`[Cryptomus Webhook] Invalid signature for order ${order_id}`)
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const paidStatuses = ["paid", "paid_over", "wrong_amount_waiting", "confirm_check"]

    console.log(`[Cryptomus Webhook] Received payment status="${status}" order_id="${order_id}"`)

    if (!paidStatuses.includes(status)) {
      return NextResponse.json({ received: true, status })
    }

    const cartId = additional_data
    if (!cartId) {
      return NextResponse.json({ error: "Missing cartId" }, { status: 400 })
    }

    const result = await completeCart(cartId)

    if (result.ok) {
      return NextResponse.json({ received: true, orderId: result.orderId })
    }

    return NextResponse.json(
      { error: "Failed to complete order" },
      { status: 500 }
    )
  } catch (err: any) {
    console.error(`[Cryptomus Webhook] Internal error:`, err.message)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
