import { TransactionBaseService } from "@medusajs/medusa";
import LicenseKeyRepository from "../repositories/license-key";
import { EntityManager, In, IsNull } from "typeorm";
import {
  CreateLicenseKeyInput,
  AssignLicenseKeyInput,
  LicenseKeyResponse,
  BatchCreateResult,
} from "../types/license-key";
import { LicenseKey, LicenseKeyStatus, DeliveryStatus } from "../models/license-key";
import LicenseNotificationService from "./license-notification";

type InjectedDependencies = {
  manager: EntityManager;
  licenseKeyRepository: typeof LicenseKeyRepository;
  licenseNotificationService: LicenseNotificationService;
};

class LicenseKeyService extends TransactionBaseService {
  protected licenseKeyRepository_: typeof LicenseKeyRepository;
  protected licenseNotificationService_: LicenseNotificationService;

  constructor({
    licenseKeyRepository,
    licenseNotificationService,
    manager,
  }: InjectedDependencies) {
    super(arguments[0]);
    this.licenseKeyRepository_ = licenseKeyRepository;
    this.licenseNotificationService_ = licenseNotificationService;
  }

  async retrieve(id: string): Promise<LicenseKey> {
    const repo = this.activeManager_.withRepository(this.licenseKeyRepository_);
    return await repo.findOne({ where: { id } });
  }

  async listByOrder(orderId: string): Promise<LicenseKeyResponse[]> {
    const repo = this.activeManager_.withRepository(this.licenseKeyRepository_);
    const keys = await repo.find({ where: { order_id: orderId } });
    return keys.map((k) => ({
      id: k.id,
      key: k.key,
      product_id: k.product_id,
      status: k.status as LicenseKeyResponse["status"],
      assigned_at: k.assigned_at,
      delivery_status: k.delivery_status,
      delivery_error: k.delivery_error,
    }));
  }

  async listFailedDeliveries(): Promise<LicenseKeyResponse[]> {
    const repo = this.activeManager_.withRepository(this.licenseKeyRepository_);
    const keys = await repo.find({
      where: { delivery_status: DeliveryStatus.FAILED },
      order: { updated_at: "DESC" },
    });
    return keys.map((k) => ({
      id: k.id,
      key: k.key,
      product_id: k.product_id,
      status: k.status as LicenseKeyResponse["status"],
      assigned_at: k.assigned_at,
      delivery_status: k.delivery_status,
      delivery_error: k.delivery_error,
    }));
  }

  async listAvailable(productId: string): Promise<LicenseKey[]> {
    const repo = this.activeManager_.withRepository(this.licenseKeyRepository_);
    return await repo.find({
      where: { product_id: productId, status: LicenseKeyStatus.AVAILABLE },
    });
  }

  async listByProduct(productId: string): Promise<LicenseKey[]> {
    const repo = this.activeManager_.withRepository(this.licenseKeyRepository_);
    return await repo.find({ where: { product_id: productId } });
  }

  async create(data: CreateLicenseKeyInput): Promise<LicenseKey> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const repo = manager.withRepository(this.licenseKeyRepository_);
      const licenseKey = repo.create({
        key: data.key,
        product_id: data.product_id || null,
        variant_id: data.variant_id || null,
        status: LicenseKeyStatus.AVAILABLE,
        delivery_status: DeliveryStatus.PENDING,
        metadata: data.metadata || null,
      });
      return await repo.save(licenseKey);
    });
  }

  async createBatch(keys: CreateLicenseKeyInput[]): Promise<BatchCreateResult> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const repo = manager.withRepository(this.licenseKeyRepository_);

      const existing = await repo.find({
        where: { key: In(keys.map((k) => k.key)) },
        select: ["key"],
      });
      const existingKeys = new Set(existing.map((e) => e.key));

      const toCreate = keys.filter((k) => !existingKeys.has(k.key));
      const skipped = keys
        .filter((k) => existingKeys.has(k.key))
        .map((k) => ({ key: k.key, reason: "already exists" }));

      if (toCreate.length === 0) {
        return { created: [], skipped };
      }

      const entities = toCreate.map((k) =>
        repo.create({
          key: k.key,
          product_id: k.product_id || null,
          variant_id: k.variant_id || null,
          status: LicenseKeyStatus.AVAILABLE,
          delivery_status: DeliveryStatus.PENDING,
          metadata: k.metadata || null,
        })
      );

      const saved = await repo.save(entities);

      const created: LicenseKeyResponse[] = saved.map((k) => ({
        id: k.id,
        key: k.key,
        product_id: k.product_id,
        status: k.status as LicenseKeyResponse["status"],
        assigned_at: k.assigned_at,
        delivery_status: k.delivery_status,
        delivery_error: k.delivery_error,
      }));

      return { created, skipped };
    });
  }

  async assignToOrder(
    data: AssignLicenseKeyInput
  ): Promise<LicenseKey | null> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const repo = manager.withRepository(this.licenseKeyRepository_);

      const findWhere: Record<string, any> = {
        product_id: data.product_id,
        status: LicenseKeyStatus.AVAILABLE,
      };

      if (data.variant_id) {
        findWhere.variant_id = data.variant_id;
      } else {
        findWhere.variant_id = IsNull();
      }

      const available = await repo.findOne({
        where: findWhere,
      });

      if (!available) {
        console.warn(
          `No available license key for product ${data.product_id}`
        );
        return null;
      }

      available.status = LicenseKeyStatus.ASSIGNED;
      available.order_id = data.order_id;
      available.customer_email = data.customer_email;
      available.assigned_at = new Date();
      available.delivery_status = DeliveryStatus.PENDING;
      available.delivery_error = null as any;

      return await repo.save(available);
    });
  }

  async updateDeliveryStatus(
    id: string,
    status: DeliveryStatus,
    error?: string
  ): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const repo = manager.withRepository(this.licenseKeyRepository_);
      await repo.update(id, {
        delivery_status: status,
        delivery_error: error || (null as any),
      });
    });
  }

  async resendLicense(licenseKeyId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const licenseKey = await this.retrieve(licenseKeyId);

    if (!licenseKey) {
      return { success: false, message: "License key not found" };
    }

    if (
      licenseKey.status !== LicenseKeyStatus.ASSIGNED ||
      !licenseKey.customer_email
    ) {
      return {
        success: false,
        message:
          "License key is not assigned to any order or has no customer email",
      };
    }

    const result =
      await this.licenseNotificationService_.sendLicenseEmail(
        licenseKey.customer_email,
        licenseKey.key,
        `Product ${licenseKey.product_id}`,
        licenseKey.order_id
      );

    if (result.success) {
      await this.updateDeliveryStatus(
        licenseKey.id,
        DeliveryStatus.SENT
      );
      return { success: true, message: "License email resent successfully" };
    } else {
      await this.updateDeliveryStatus(
        licenseKey.id,
        DeliveryStatus.FAILED,
        result.error
      );
      return {
        success: false,
        message: `Failed to resend: ${result.error}`,
      };
    }
  }

  async revoke(id: string): Promise<LicenseKey> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const repo = manager.withRepository(this.licenseKeyRepository_);
      const licenseKey = await repo.findOne({ where: { id } });
      if (!licenseKey) {
        throw new Error("License key not found");
      }
      licenseKey.status = LicenseKeyStatus.REVOKED;
      return await repo.save(licenseKey);
    });
  }

  async delete(id: string): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const repo = manager.withRepository(this.licenseKeyRepository_);
      await repo.delete({ id });
    });
  }
}

export default LicenseKeyService;
