import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL!
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const cartId = req.nextUrl.searchParams.get("cart_id")

    console.log("[Aurpay Webhook] POST received:", JSON.stringify(body))

    const { status, order_id } = body

    if (status === "SUCCEED" || status === "succeed") {
      if (!cartId) {
        console.error("[Aurpay Webhook] No cart_id in query params")
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
        console.error("[Aurpay Webhook] Failed to complete cart:", medusaData)
        return NextResponse.json(
          { error: "Failed to complete Medusa order" },
          { status: 500 }
        )
      }

      console.log(
        `[Aurpay Webhook] Order placed successfully: ${medusaData?.order?.id}`
      )
      return NextResponse.json({
        received: true,
        orderId: medusaData?.order?.id,
      })
    }

    console.log(`[Aurpay Webhook] Payment not succeeded (status: ${status})`)
    return NextResponse.json({ received: true, status })
  } catch (err: any) {
    console.error("[Aurpay Webhook] Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const cartId = req.nextUrl.searchParams.get("cart_id")

    console.log("[Aurpay Webhook] GET received, cart_id:", cartId)

    if (!cartId) {
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
      console.error("[Aurpay Webhook] Failed to complete cart via GET:", medusaData)
      return NextResponse.json(
        { error: "Failed to complete Medusa order" },
        { status: 500 }
      )
    }

    console.log(
      `[Aurpay Webhook] Order placed successfully via GET: ${medusaData?.order?.id}`
    )

    return NextResponse.json({
      received: true,
      orderId: medusaData?.order?.id,
    })
  } catch (err: any) {
    console.error("[Aurpay Webhook] GET Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
