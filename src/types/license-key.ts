import { LicenseKeyStatus, DeliveryStatus } from "../models/license-key";

export type CreateLicenseKeyInput = {
  key: string;
  product_id?: string;
  variant_id?: string;
  metadata?: Record<string, unknown>;
};

export type AssignLicenseKeyInput = {
  order_id: string;
  customer_email: string;
  product_id: string;
  variant_id?: string;
};

export type LicenseKeyResponse = {
  id: string;
  key: string;
  product_id: string;
  status: LicenseKeyStatus;
  assigned_at: Date | null;
  delivery_status: DeliveryStatus;
  delivery_error: string | null;
};

export type ResendLicenseInput = {
  license_key_id: string;
};

export type BatchCreateResult = {
  created: LicenseKeyResponse[];
  skipped: { key: string; reason: string }[];
};
