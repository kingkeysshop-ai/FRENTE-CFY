import { NextRequest, NextResponse } from "next/server"

const GSMPAY_API_KEY = process.env.GSMPAY_API_KEY!
const GSMPAY_API_URL = process.env.GSMPAY_API_URL || "https://gsmpay.net/api/v1"
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

    if (!GSMPAY_API_KEY) {
      return NextResponse.json(
        { error: "GSMPAY_API_KEY not configured" },
        { status: 500 }
      )
    }

    const payload = {
      amount: Number(amount),
      currency: currency.toUpperCase(),
      order_id: orderId,
      cart_id: cartId,
      return_url: `${NEXT_PUBLIC_BASE_URL}/checkout/payment-callback?order_id=${orderId}`,
      cancel_url: `${NEXT_PUBLIC_BASE_URL}/checkout?step=review&gsmpay=cancelled`,
      webhook_url: `${NEXT_PUBLIC_BASE_URL}/api/gsmpay/webhook`,
    }

    console.log("[GSMPay] Creating invoice for order:", orderId)

    const response = await fetch(`${GSMPAY_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GSMPAY_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[GSMPay] Error creating payment:", data)
      return NextResponse.json(
        { error: data.message || "Failed to create GSMPay payment" },
        { status: 500 }
      )
    }

    const paymentUrl = data.payment_url || data.url || data.data?.payment_url

    if (!paymentUrl) {
      console.error("[GSMPay] No payment URL in response:", data)
      return NextResponse.json(
        { error: "No payment URL returned from GSMPay" },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: paymentUrl })
  } catch (err: any) {
    console.error("[GSMPay] Unexpected error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
