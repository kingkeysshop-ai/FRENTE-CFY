import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LICENSE_KEY_MODULE } from "../../../../modules/license-key"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { orderId } = req.params

  try {
    const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)
    const licenseKeys = await licenseKeyService.getKeysByOrder(orderId)

    res.json({ license_keys: licenseKeys })
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch license keys",
      license_keys: [],
    })
  }
}
