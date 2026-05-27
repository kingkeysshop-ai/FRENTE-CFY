import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import LicenseKeyService from "../../../../services/license-key";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const licenseKeyService: LicenseKeyService =
    req.scope.resolve("licenseKeyService");

  const failed = await licenseKeyService.listFailedDeliveries();

  res.status(200).json({ license_keys: failed });
}
