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
      console.warn("[Cryptomus Webhook] Invalid signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    console.log(`[Cryptomus Webhook] Payment status: ${status} | Order: ${order_id}`)

    const paidStatuses = ["paid", "paid_over", "wrong_amount_waiting", "confirm_check"]
    if (!paidStatuses.includes(status)) {
      return NextResponse.json({ received: true, status })
    }

    const cartId = additional_data
    if (!cartId) {
      console.error("[Cryptomus Webhook] No cartId in additional_data")
      return NextResponse.json({ error: "Missing cartId" }, { status: 400 })
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
      const isCompleted = medusaData?.type === "order"
      if (isCompleted) {
        console.log(`[Cryptomus Webhook] Cart already completed: ${medusaData?.order?.id}`)
        return NextResponse.json({ received: true, orderId: medusaData?.order?.id })
      }
      console.error("[Cryptomus Webhook] Failed to complete cart:", medusaData)
      return NextResponse.json(
        { error: "Failed to complete Medusa order" },
        { status: 500 }
      )
    }

    console.log(
      `[Cryptomus Webhook] Order placed successfully: ${medusaData?.order?.id}`
    )

    return NextResponse.json({ received: true, orderId: medusaData?.order?.id })
  } catch (err: any) {
    console.error("[Cryptomus Webhook] Error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
