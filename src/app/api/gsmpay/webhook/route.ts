import { NextRequest, NextResponse } from "next/server"

const GSMPAY_WEBHOOK_SECRET = process.env.GSMPAY_WEBHOOK_SECRET
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL!
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const signature = req.headers.get("x-gsmpay-signature")

    console.log("[GSMPay Webhook] Received:", JSON.stringify(body))

    if (GSMPAY_WEBHOOK_SECRET) {
      if (!signature) {
        console.warn("[GSMPay Webhook] Missing signature header")
        return NextResponse.json({ error: "Missing signature" }, { status: 401 })
      }
    }

    const { status, order_id, cart_id } = body

    const paidStatuses = ["paid", "completed", "success", "SUCCEED"]
    if (!paidStatuses.includes(status)) {
      console.log(`[GSMPay Webhook] Payment not completed (status: ${status})`)
      return NextResponse.json({ received: true, status })
    }

    const cartId = cart_id || req.nextUrl.searchParams.get("cart_id")
    if (!cartId) {
      console.error("[GSMPay Webhook] No cart_id in body or query params")
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
      console.error("[GSMPay Webhook] Failed to complete cart:", medusaData)
      return NextResponse.json(
        { error: "Failed to complete Medusa order" },
        { status: 500 }
      )
    }

    console.log(
      `[GSMPay Webhook] Order placed successfully: ${medusaData?.order?.id}`
    )
    return NextResponse.json({ received: true, orderId: medusaData?.order?.id })
  } catch (err: any) {
    console.error("[GSMPay Webhook] Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
