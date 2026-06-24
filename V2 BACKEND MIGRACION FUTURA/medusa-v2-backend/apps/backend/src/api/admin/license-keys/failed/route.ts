import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LICENSE_KEY_MODULE } from "../../../../modules/license-key"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)

  try {
    const failed = await licenseKeyService.listFailedDeliveries()
    res.status(200).json({ license_keys: failed })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch failed deliveries" })
  }
}
