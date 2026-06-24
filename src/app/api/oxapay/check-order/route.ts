import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY || process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export async function GET(req: NextRequest) {
  const cartId = req.nextUrl.searchParams.get("cart_id")

  if (!cartId || !MEDUSA_BACKEND_URL || !MEDUSA_API_KEY) {
    return NextResponse.json({ orderId: null })
  }

  try {
    const orderRes = await fetch(
      `${MEDUSA_BACKEND_URL}/store/orders?cart_id=${cartId}`,
      { headers: { "x-publishable-api-key": MEDUSA_API_KEY } }
    )

    if (orderRes.ok) {
      const { orders } = await orderRes.json()
      if (orders?.length > 0) {
        return NextResponse.json({ orderId: orders[0].id })
      }
    }

    const cartRes = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}`,
      { headers: { "x-publishable-api-key": MEDUSA_API_KEY } }
    )

    if (cartRes.ok) {
      const { cart } = await cartRes.json()
      if (cart?.completed_at) {
        const orderRes2 = await fetch(
          `${MEDUSA_BACKEND_URL}/store/orders?cart_id=${cartId}`,
          { headers: { "x-publishable-api-key": MEDUSA_API_KEY } }
        )
        if (orderRes2.ok) {
          const { orders: orders2 } = await orderRes2.json()
          if (orders2?.length > 0) {
            return NextResponse.json({ orderId: orders2[0].id })
          }
        }
      }
    }

    return NextResponse.json({ orderId: null })
  } catch {
    return NextResponse.json({ orderId: null })
  }
}
