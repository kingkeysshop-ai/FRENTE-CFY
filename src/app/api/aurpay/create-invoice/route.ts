import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@lib/rate-limit"

const AURPAY_API_BASE = process.env.AURPAY_API_BASE || "https://dashboard.aurpay.net"
const AURPAY_API_KEY = process.env.AURPAY_API_KEY!
const AURPAY_API_SECRET = process.env.AURPAY_API_SECRET
const AURPAY_WEBHOOK_SECRET = process.env.AURPAY_WEBHOOK_SECRET
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

export async function POST(req: NextRequest) {
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

    if (!AURPAY_API_KEY) {
      return NextResponse.json(
        { error: "AURPAY_API_KEY not configured" },
        { status: 500 }
      )
    }

    const webhookSecretParam = AURPAY_WEBHOOK_SECRET ? `&secret=${AURPAY_WEBHOOK_SECRET}` : ""

    const payload = {
      price: Number(amount),
      currency: currency.toUpperCase(),
      succeed_url: `${NEXT_PUBLIC_BASE_URL}/order/${orderId}/confirmed`,
      timeout_url: `${NEXT_PUBLIC_BASE_URL}/checkout?step=review&aurpay=timeout`,
      callback_url: `${NEXT_PUBLIC_BASE_URL}/api/aurpay/webhook?cart_id=${cartId}${webhookSecretParam}`,
      timeout_callback: `${NEXT_PUBLIC_BASE_URL}/api/aurpay/webhook?cart_id=${cartId}&timeout=1${webhookSecretParam}`,
      fixed_encrypt_price: false,
      enable_post_callback: true,
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "API-Key": AURPAY_API_KEY,
    }
    if (AURPAY_API_SECRET) {
      headers["API-Secret"] = AURPAY_API_SECRET
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
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
