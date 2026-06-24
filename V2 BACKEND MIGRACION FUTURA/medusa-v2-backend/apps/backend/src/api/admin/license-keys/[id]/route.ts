import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LICENSE_KEY_MODULE } from "../../../../modules/license-key"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)
  const { id } = req.params

  try {
    const keys = await licenseKeyService.listLicenseKeys({ id })
    if (!keys || keys.length === 0) {
      res.status(404).json({ message: "License key not found" })
      return
    }
    res.status(200).json({ license_key: keys[0] })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch license key" })
  }
}

export async function PATCH(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)
  const { id } = req.params

  try {
    const updated = await licenseKeyService.revokeKey(id)
    res.status(200).json({ license_key: updated })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to revoke license key" })
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)
  const { id } = req.params

  try {
    await licenseKeyService.deleteLicenseKeys(id)
    res.status(200).json({ id, deleted: true })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to delete license key" })
  }
}
