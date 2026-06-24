import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LICENSE_KEY_MODULE } from "../../../../modules/license-key"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)
  const { order_id } = (req.body || {}) as { order_id?: string }

  if (!order_id) {
    res.status(400).json({ message: "order_id is required" })
    return
  }

  try {
    const result = await licenseKeyService.assignKeysToOrder(order_id, [])
    res.status(200).json({ assigned: result })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to retry order assignment" })
  }
}
