import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, Index } from "typeorm";

export enum LicenseKeyStatus {
  AVAILABLE = "available",
  ASSIGNED = "assigned",
  REVOKED = "revoked",
}

export enum DeliveryStatus {
  PENDING = "pending",
  SENT = "sent",
  FAILED = "failed",
}

@Entity()
export class LicenseKey extends BaseEntity {
  @Index({ unique: true })
  @Column()
  key: string;

  @Column({ nullable: true })
  product_id: string;

  @Column({ nullable: true })
  variant_id: string;

  @Column({
    type: "enum",
    enum: LicenseKeyStatus,
    default: LicenseKeyStatus.AVAILABLE,
  })
  status: LicenseKeyStatus;

  @Column({ nullable: true })
  order_id: string;

  @Column({ nullable: true })
  customer_email: string;

  @Column({ type: "timestamp", nullable: true })
  assigned_at: Date;

  @Column({ default: DeliveryStatus.PENDING })
  delivery_status: DeliveryStatus;

  @Column({ nullable: true })
  delivery_error: string;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;
}
