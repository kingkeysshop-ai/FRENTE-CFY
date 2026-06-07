import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@lib/rate-limit"

const AURPAY_API_BASE = process.env.AURPAY_API_BASE || "https://dashboard.aurpay.net"
const AURPAY_API_KEY = process.env.AURPAY_API_KEY
const AURPAY_WEBHOOK_SECRET = process.env.AURPAY_WEBHOOK_SECRET
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export async function POST(req: NextRequest) {
  if (!AURPAY_API_KEY || !NEXT_PUBLIC_BASE_URL) {
    return NextResponse.json(
      { error: "AURPAY_API_KEY or NEXT_PUBLIC_BASE_URL not configured" },
      { status: 500 }
    )
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`aurpay-create-invoice:${ip}`, 5, 60000)) {
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
      } catch {
        console.warn("[Aurpay] Could not verify cart amount against backend")
      }
    }

    const webhookToken = AURPAY_WEBHOOK_SECRET
      ? crypto.createHmac("sha256", AURPAY_WEBHOOK_SECRET).update(cartId).digest("hex")
      : ""

    const payload = {
      price: Number(amount),
      currency: currency.toUpperCase(),
      succeed_url: `${NEXT_PUBLIC_BASE_URL}/payment/success?cart_id=${cartId}`,
      timeout_url: `${NEXT_PUBLIC_BASE_URL}/checkout?step=review&aurpay=timeout`,
      callback_url: `${NEXT_PUBLIC_BASE_URL}/api/aurpay/webhook?cart_id=${cartId}&token=${webhookToken}`,
      timeout_callback: `${NEXT_PUBLIC_BASE_URL}/api/aurpay/webhook?cart_id=${cartId}&timeout=1&token=${webhookToken}`,
      fixed_encrypt_price: false,
      enable_post_callback: true,
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "API-Key": AURPAY_API_KEY,
    }

    const response = await fetch(`${AURPAY_API_BASE}/api/order/pay-url`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok || data.code !== 0) {
      console.error("[Aurpay] Error creating payment:", data)
      return NextResponse.json(
        { error: data.message || "Failed to create Aurpay payment" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: data.data.pay_url,
    })
  } catch (err: any) {
    console.error("[Aurpay] Unexpected error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
