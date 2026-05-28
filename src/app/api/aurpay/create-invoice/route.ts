import { NextRequest, NextResponse } from "next/server"

const AURPAY_API_BASE = process.env.AURPAY_API_BASE || "https://dashboard.aurpay.net"
const AURPAY_API_KEY = process.env.AURPAY_API_KEY!
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

export async function POST(req: NextRequest) {
  try {
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

    const payload = {
      price: Number(amount),
      currency: currency.toUpperCase(),
      succeed_url: `${NEXT_PUBLIC_BASE_URL}/order/${orderId}/confirmed`,
      timeout_url: `${NEXT_PUBLIC_BASE_URL}/checkout?step=review&aurpay=timeout`,
      callback_url: `${NEXT_PUBLIC_BASE_URL}/api/aurpay/webhook?cart_id=${cartId}`,
      timeout_callback: `${NEXT_PUBLIC_BASE_URL}/api/aurpay/webhook?cart_id=${cartId}&timeout=1`,
      fixed_encrypt_price: false,
      enable_post_callback: true,
    }

    const response = await fetch(`${AURPAY_API_BASE}/api/order/pay-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": AURPAY_API_KEY,
      },
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
