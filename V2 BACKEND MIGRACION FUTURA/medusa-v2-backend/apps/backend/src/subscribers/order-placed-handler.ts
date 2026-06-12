import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { deliverLicenseKeysWorkflow } from "../workflows/deliver-license-keys"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = data.id

  await deliverLicenseKeysWorkflow(container).run({
    input: orderId,
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
