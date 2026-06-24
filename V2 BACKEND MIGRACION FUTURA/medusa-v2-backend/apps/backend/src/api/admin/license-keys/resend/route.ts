import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LICENSE_KEY_MODULE } from "../../../../modules/license-key"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)
  const { license_key_id } = (req.body || {}) as { license_key_id?: string }

  if (!license_key_id) {
    res.status(400).json({ message: "license_key_id is required" })
    return
  }

  try {
    const keys = await licenseKeyService.listLicenseKeys({ id: license_key_id })
    if (!keys || keys.length === 0) {
      res.status(404).json({ message: "License key not found" })
      return
    }

    const result = await licenseKeyService.resendKeys(keys[0].order_id, [license_key_id])
    const entry = result[0]
    if (entry?.success) {
      res.status(200).json({ success: true, message: "License email resent successfully" })
    } else {
      res.status(400).json({ success: false, message: entry?.error || "Failed to resend" })
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to resend license" })
  }
}
