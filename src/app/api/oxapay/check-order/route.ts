import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY || process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export async function GET(req: NextRequest) {
  const cartId = req.nextUrl.searchParams.get("cart_id")

  if (!cartId || !MEDUSA_BACKEND_URL || !MEDUSA_API_KEY) {
    return NextResponse.json({ orderId: null })
  }

  try {
    const headers = { "x-publishable-api-key": MEDUSA_API_KEY, "Content-Type": "application/json" }

    const completeRes = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`,
      { method: "POST", headers }
    )

    const completeData = await completeRes.json()

    // If complete succeeds or returns order data
    if (completeData?.type === "order" && completeData?.data?.id) {
      return NextResponse.json({ orderId: completeData.data.id })
    }

    // If cart is already completed but we couldn't get order from complete
    if (completeData?.cart?.completed_at) {
      return NextResponse.json({ orderId: "completed" })
    }

    // Order not ready yet
    return NextResponse.json({ orderId: null })
  } catch {
    return NextResponse.json({ orderId: null })
  }
}
