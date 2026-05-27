import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import LicenseKeyService from "../../../services/license-key";
import { CreateLicenseKeyInput } from "../../../types/license-key";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const licenseKeyService: LicenseKeyService = req.scope.resolve("licenseKeyService");
  const product_id = req.query.product_id as string;

  if (product_id) {
    const keys = await licenseKeyService.listByProduct(product_id);
    res.status(200).json({ license_keys: keys });
    return;
  }

  res.status(400).json({ message: "product_id query param is required" });
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const licenseKeyService: LicenseKeyService = req.scope.resolve("licenseKeyService");
  const { keys } = req.body as { keys?: CreateLicenseKeyInput[] };

  if (!keys || !Array.isArray(keys) || keys.length === 0) {
    res.status(400).json({ message: "keys array is required" });
    return;
  }

  const result = await licenseKeyService.createBatch(keys);

  res.status(201).json({
    created: result.created,
    skipped: result.skipped,
    created_count: result.created.length,
    skipped_count: result.skipped.length,
  });
}

export async function PATCH(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const licenseKeyService: LicenseKeyService = req.scope.resolve("licenseKeyService");
  const { id } = req.body as { id?: string };

  if (!id) {
    res.status(400).json({ message: "id is required" });
    return;
  }

  const revoked = await licenseKeyService.revoke(id);
  res.status(200).json({ license_key: revoked });
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const licenseKeyService: LicenseKeyService = req.scope.resolve("licenseKeyService");
  const id = req.query.id as string;

  if (!id) {
    res.status(400).json({ message: "id query param is required" });
    return;
  }

  await licenseKeyService.delete(id);
  res.status(200).json({ id, deleted: true });
}
