import { retrieveOrder } from "@lib/data/orders"
import OrderKingKeysConfirmed from "@modules/order/templates/order-king-keys-confirmed"
import OrderConfirmedFallback from "@modules/order/templates/order-confirmed-fallback"
import { Metadata } from "next"

type Props = {
  params: Promise<{ id: string }>
}
export const metadata: Metadata = {
  title: "Orden Confirmada | KING KEYS",
  description: "Tu licencia digital esta lista para ser activada",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    return <OrderConfirmedFallback orderId={params.id} />
  }

  return <OrderKingKeysConfirmed order={order} />
}
