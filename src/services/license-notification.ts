import { TransactionBaseService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import axios from "axios";

type InjectedDependencies = {
  manager: EntityManager;
};

export type EmailResult = {
  success: boolean;
  error?: string;
};

class LicenseNotificationService extends TransactionBaseService {
  protected fromEmail_: string;
  protected resendApiKey_: string;

  constructor({ manager }: InjectedDependencies) {
    super(arguments[0]);
    this.fromEmail_ = process.env.LICENSE_FROM_EMAIL || "";
    this.resendApiKey_ = process.env.RESEND_API_KEY || "";
  }

  async sendLicenseEmail(
    toEmail: string,
    licenseKey: string,
    productName: string,
    orderId: string
  ): Promise<EmailResult> {
    if (!this.resendApiKey_) {
      console.warn(
        "RESEND_API_KEY not configured. License email NOT sent. Set RESEND_API_KEY and LICENSE_FROM_EMAIL environment variables."
      );
      return { success: false, error: "RESEND_API_KEY not configured" };
    }

    if (!this.fromEmail_) {
      console.error(
        "LICENSE_FROM_EMAIL not configured. Cannot send license email."
      );
      return { success: false, error: "LICENSE_FROM_EMAIL not configured" };
    }

    try {
      await axios.post(
        "https://api.resend.com/emails",
        {
          from: this.fromEmail_,
          to: toEmail,
          subject: `Tu licencia para ${productName}`,
          html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2 style="color: #333;">Tu Licencia Digital</h2>
<p>Gracias por tu compra. Aqui esta tu licencia:</p>
<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 16px 0;">
<p style="margin: 0; font-size: 14px; color: #666;">Producto:</p>
<p style="margin: 4px 0 16px; font-size: 18px; font-weight: bold;">${productName}</p>
<p style="margin: 0; font-size: 14px; color: #666;">Tu clave de licencia:</p>
<p style="margin: 4px 0; font-family: monospace; font-size: 18px; background: #fff; padding: 12px; border-radius: 4px; border: 1px solid #ddd; word-break: break-all;">${licenseKey}</p>
</div>
<p style="font-size: 12px; color: #999;">Orden: #${orderId}</p>
<p style="font-size: 12px; color: #999;">Guarda esta clave en un lugar seguro.</p>
</div>
`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.resendApiKey_}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true };
    } catch (error) {
      const msg = error.message || "Unknown error sending email";
      console.error("Error sending license email:", msg);
      return { success: false, error: msg };
    }
  }
}

export default LicenseNotificationService;
