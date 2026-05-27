import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import LicenseKeyService from "../../../../services/license-key";

export async function POST(
  req: MedusaRequest<{ license_key_id?: string }>,
  res: MedusaResponse
) {
  const licenseKeyService: LicenseKeyService = req.scope.resolve("licenseKeyService");
  const { license_key_id } = req.body;

  if (!license_key_id) {
    res.status(400).json({ message: "license_key_id is required" });
    return;
  }

  const result = await licenseKeyService.resendLicense(license_key_id);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
}
