"use strict";

module.exports = (router, { aurapayService, orderService }) => {
  // Verificar si aurapayService está disponible
  if (!aurapayService) {
    throw new Error("Aurapay service not found");
  }

  // Endpoint para recibir webhooks de Aurapay
  router.post("/hooks/aurapay", async (req, res) => {
    const signature = req.headers["x-aurapay-signature"]; // Firma del webhook
    const payload = req.body;
    const { event, payment_id, order_id } = payload;

    try {
      // Verificar la firma del webhook (opcional)
      // const isValid = aurapayService.verifyWebhookSignature(signature, payload);
      // if (!isValid) throw new Error("Invalid webhook signature");

      switch (event) {
        case "payment_success":
          // Confirmar el pago en Medusa
          await orderService.capturePayment(order_id);
          break;
        case "payment_failed":
          // Marcar el pago como fallido
          await orderService.update(order_id, {
            payment_status: "failed",
          });
          break;
        case "refund_processed":
          // Actualizar reembolso
          await orderService.createRefund(order_id, {
            amount: payload.amount,
            reason: "Aurapay refund",
          });
          break;
        default:
          return res.status(200).json({ message: "Event ignored" });
      }

      res.status(200).json({ message: "Webhook processed successfully" });
    } catch (error) {
      console.error(`Aurapay webhook error: ${error.message}`);
      res.status(500).json({ error: "Failed to process webhook" });
    }
  });
};