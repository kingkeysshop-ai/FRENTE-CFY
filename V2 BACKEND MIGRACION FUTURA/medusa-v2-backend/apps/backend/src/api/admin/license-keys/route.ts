import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LICENSE_KEY_MODULE } from "../../../modules/license-key"

export async function PATCH(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  // Accept { id } in body for revoke (v1 admin UI compatibility)
  const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)
  const { id } = (req.body || {}) as { id?: string }

  if (!id) {
    res.status(400).json({ message: "id is required" })
    return
  }

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
  // Accept ?id=xxx query param (v1 admin UI compatibility)
  const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)
  const id = req.query.id as string | undefined

  if (!id) {
    res.status(400).json({ message: "id query param is required" })
    return
  }

  try {
    await licenseKeyService.deleteLicenseKeys(id)
    res.status(200).json({ id, deleted: true })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to delete license key" })
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)
  const product_id = req.query.product_id as string | undefined

  try {
    if (product_id) {
      const keys = await licenseKeyService.listByProduct(product_id)
      res.status(200).json({ license_keys: keys })
      return
    }

    const keys = await licenseKeyService.listAll()
    const stats = await licenseKeyService.getStats()
    res.status(200).json({ license_keys: keys, stats })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch license keys" })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const licenseKeyService: any = req.scope.resolve(LICENSE_KEY_MODULE)
  const body = (req.body || {}) as {
    keys?: string[] | Array<{ key: string; product_id?: string }>
    product_id?: string
    count?: number
  }

  try {
    // Format 1: { keys: [{ key, product_id }, ...] } — from admin UI
    if (Array.isArray(body.keys) && body.keys.length > 0 && typeof body.keys[0] === "object") {
      const keyObjects = body.keys as Array<{ key: string; product_id?: string }>
      const created: any[] = []
      const skipped: string[] = []

      for (const entry of keyObjects) {
        const pid = entry.product_id || body.product_id
        if (!entry.key || !pid) {
          skipped.push(entry.key || "(empty)")
          continue
        }
        try {
          const k = await licenseKeyService.generateKeys(pid, 0, [entry.key])
          created.push(...k)
        } catch {
          skipped.push(entry.key)
        }
      }

      res.status(201).json({ created, skipped })
      return
    }

    // Format 2: { keys: [...string] } — raw key strings
    if (Array.isArray(body.keys) && typeof body.keys[0] === "string") {
      const keyStrings = body.keys as string[]
      const generated = await licenseKeyService.generateKeys(body.product_id || "", keyStrings.length, keyStrings)
      res.status(201).json({ license_keys: generated })
      return
    }

    // Format 3: { product_id, count } — auto-generate
    if (body.product_id && body.count) {
      const generated = await licenseKeyService.generateKeys(body.product_id, body.count)
      res.status(201).json({ license_keys: generated })
      return
    }

    res.status(400).json({ message: "Provide keys array, product_id + count, or keys with product_id" })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to create license keys" })
  }
}
