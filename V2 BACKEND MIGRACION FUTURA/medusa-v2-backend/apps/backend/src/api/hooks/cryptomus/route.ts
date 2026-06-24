import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, PaymentWebhookEvents } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const provider = "cryptomus"

  try {
    const eventBus = req.scope.resolve(Modules.EVENT_BUS)

    const event = {
      provider,
      payload: {
        data: req.body,
        rawData: req.rawBody,
        headers: req.headers,
      },
    }

    await eventBus.emit({
      name: PaymentWebhookEvents.WebhookReceived,
      data: event,
    }, {
      delay: 5000,
      attempts: 3,
    })

    res.status(200).json({ message: "Webhook received" })
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Webhook processing failed" })
  }
}
