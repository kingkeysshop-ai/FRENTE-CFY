import { DeliveryStatus } from "../models/license-key";

export const config = { event: "order.placed" };

export default async function LicenseKeySubscriber({
  data,
  container,
}: {
  data: Record<string, any>;
  container: any;
}) {
  // Old loader calls this via `new Subscriber(cradle)` — skip silently
  if (new.target) return;

  const order = data;
  const customerEmail = order.email;

  if (!customerEmail) {
    console.warn("Order has no email, skipping license key assignment");
    return;
  }

  const licenseKeyService = container.resolve("licenseKeyService");
  const licenseNotificationService = container.resolve("licenseNotificationService");
  const productVariantService = container.resolve("productVariantService");

  const items = order.items || [];

  for (const item of items) {
    const variantId = item.variant_id;
    const productId = item.product_id;

    if (!productId) continue;

    const isDigital =
      item.metadata?.is_digital === true ||
      item.metadata?.is_digital === "true";

    if (!isDigital) {
      try {
        const variant = variantId
          ? await productVariantService
              .retrieve(variantId)
              .catch(() => null)
          : null;
        const productMetadata = variant?.product?.metadata || item.metadata;
        const productIsDigital =
          productMetadata?.is_digital === true ||
          productMetadata?.is_digital === "true";

        if (!productIsDigital) continue;
      } catch {
        continue;
      }
    }

    let licenseKey: any = null;

    try {
      licenseKey = await licenseKeyService.assignToOrder({
        order_id: order.id,
        customer_email: customerEmail,
        product_id: productId,
        variant_id: variantId,
      });

      if (!licenseKey) {
        console.warn(
          `No available license key for product ${productId} in order ${order.id}`
        );
        continue;
      }

      console.log(
        `License key ${licenseKey.id} assigned to order ${order.id}`
      );
    } catch (error: any) {
      console.error(
        `Error assigning license key for product ${productId}:`,
        error.message
      );
      continue;
    }

    try {
      const result = await licenseNotificationService.sendLicenseEmail(
        customerEmail,
        licenseKey.key,
        item.title || productId,
        order.id
      );

      if (result.success) {
        await licenseKeyService.updateDeliveryStatus(
          licenseKey.id,
          DeliveryStatus.SENT
        );
        console.log(
          `License email sent for key ${licenseKey.id} to ${customerEmail}`
        );
      } else {
        await licenseKeyService.updateDeliveryStatus(
          licenseKey.id,
          DeliveryStatus.FAILED,
          result.error
        );
        console.error(
          `License email FAILED for key ${licenseKey.id} to ${customerEmail}: ${result.error}`
        );
      }
    } catch (error: any) {
      await licenseKeyService.updateDeliveryStatus(
        licenseKey.id,
        DeliveryStatus.FAILED,
        error.message
      );
      console.error(
        `Unexpected error sending license email for key ${licenseKey.id}:`,
        error.message
      );
    }
  }
}
