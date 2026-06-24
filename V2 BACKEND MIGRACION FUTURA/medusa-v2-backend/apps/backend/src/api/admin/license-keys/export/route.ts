import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LICENSE_KEY_MODULE } from "../../../../modules/license-key"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)

  try {
    const keys = await licenseKeyService.exportAll()
    const stats = await licenseKeyService.getStats()

    res.setHeader("Content-Type", "application/json")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="license-backup-${new Date().toISOString().split("T")[0]}.json"`
    )
    res.status(200).json({
      exported_at: new Date().toISOString(),
      stats,
      license_keys: keys,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to export license keys" })
  }
}
