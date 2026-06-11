import { retrieveOrder } from "@lib/data/orders"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import OrderConfirmedFallback from "@modules/order/templates/order-confirmed-fallback"
import { Metadata } from "next"

type Props = {
  params: Promise<{ id: string }>
}
export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    return <OrderConfirmedFallback orderId={params.id} />
  }

  return <OrderCompletedTemplate order={order} />
}
