import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { checkRateLimit } from "@lib/rate-limit"

const CRYPTOMUS_MERCHANT_ID = process.env.CRYPTOMUS_MERCHANT_ID
const CRYPTOMUS_PAYMENT_KEY = process.env.CRYPTOMUS_PAYMENT_KEY
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

function generateSign(data: Record<string, unknown>, apiKey: string): string {
  const jsonStr = JSON.stringify(data)
  const base64 = Buffer.from(jsonStr).toString("base64")
  return crypto.createHash("md5").update(base64 + apiKey).digest("hex")
}

export async function POST(req: NextRequest) {
  if (!CRYPTOMUS_MERCHANT_ID || !CRYPTOMUS_PAYMENT_KEY || !NEXT_PUBLIC_BASE_URL) {
    return NextResponse.json(
      { error: "Cryptomus env vars not configured" },
      { status: 500 }
    )
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`cryptomus-create-invoice:${ip}`, 5, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { amount, currency, orderId, cartId } = await req.json()

    if (!amount || !currency || !orderId || !cartId) {
      return NextResponse.json(
        { error: "Missing required fields: amount, currency, orderId, cartId" },
        { status: 400 }
      )
    }

    if (MEDUSA_BACKEND_URL && MEDUSA_API_KEY) {
      try {
        const cartRes = await fetch(
          `${MEDUSA_BACKEND_URL}/store/carts/${cartId}`,
          { headers: { "x-publishable-api-key": MEDUSA_API_KEY } }
        )
        if (cartRes.ok) {
          const { cart: actualCart } = await cartRes.json()
          const expectedAmount = actualCart?.total != null
            ? (actualCart.total / 100).toFixed(2)
            : null
          if (expectedAmount && Number(amount).toFixed(2) !== expectedAmount) {
            return NextResponse.json(
              { error: "Amount does not match cart total" },
              { status: 400 }
            )
          }
        }
      } catch {} // cart verification is optional
    }

    const payload: Record<string, unknown> = {
      merchant_id: CRYPTOMUS_MERCHANT_ID,
      amount: String(amount),
      currency: currency.toUpperCase(),
      order_id: orderId,
      url_return: `${NEXT_PUBLIC_BASE_URL}/checkout?step=review&cryptomus=return`,
      url_success: `${NEXT_PUBLIC_BASE_URL}/payment/success?cart_id=${cartId}`,
      url_callback: `${NEXT_PUBLIC_BASE_URL}/api/cryptomus/webhook`,
      is_payment_multiple: false,
      lifetime: 3600,
      additional_data: cartId,
    }

    const sign = generateSign(payload, CRYPTOMUS_PAYMENT_KEY)

    const response = await fetch("https://api.cryptomus.com/v1/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        merchant: CRYPTOMUS_MERCHANT_ID,
        sign,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok || data.state !== 0) {
      return NextResponse.json(
        { error: data.message || "Failed to create Cryptomus invoice" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: data.result.url,
      uuid: data.result.uuid,
      orderId: data.result.order_id,
    })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
