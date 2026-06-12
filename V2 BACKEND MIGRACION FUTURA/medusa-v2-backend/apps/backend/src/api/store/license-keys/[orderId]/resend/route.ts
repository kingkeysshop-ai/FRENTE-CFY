import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LICENSE_KEY_MODULE } from "../../../../../modules/license-key"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { orderId } = req.params
  const body = (req.body || {}) as { key_ids?: string[] }
  const keyIds = body.key_ids

  try {
    const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)
    const results = await licenseKeyService.resendKeys(orderId, keyIds)

    res.json({ results })
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to resend license keys",
      results: [],
    })
  }
}
