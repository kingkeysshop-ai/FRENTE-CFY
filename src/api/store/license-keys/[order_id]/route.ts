import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import LicenseKeyService from "../../../../services/license-key";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const licenseKeyService: LicenseKeyService =
    req.scope.resolve("licenseKeyService");

  const { order_id } = req.params;

  if (!order_id) {
    res.status(400).json({ message: "order_id is required" });
    return;
  }

  const keys = await licenseKeyService.listByOrder(order_id);

  res.status(200).json({ license_keys: keys });
}
