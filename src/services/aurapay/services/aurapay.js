const axios = require("axios");
const { PaymentService } = require("medusa-interfaces");

class AurapayService extends PaymentService {
  static identifier = "aurapay";

  constructor(container, config) {
    super(container, config);
    this.logger_ = container.logger;
    this.api_key_ = config.api_key;
    this.webhook_secret_ = config.webhook_secret;
    this.api_url_ = config.api_url || "https://api.aurapay.com";
  }

  async getStatus(paymentData) {
    const { id } = paymentData;
    try {
      const response = await axios.get(`${this.api_url_}/payments/${id}`, {
        headers: { Authorization: `Bearer ${this.api_key_}` },
      });
      return response.data.status;
    } catch (error) {
      this.logger_.error(`Aurapay getStatus error: ${error.message}`);
      throw error;
    }
  }

  async createPayment(cart) {
    const { total, email, id } = cart;
    try {
      const response = await axios.post(
        `${this.api_url_}/payments`,
        {
          amount: total,
          currency: cart.region?.currency_code || "usd",
          order_id: id,
          customer_email: email,
          success_url: `${process.env.STORE_CORS}/payment/success`,
          cancel_url: `${process.env.STORE_CORS}/payment/cancel`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.api_key_}`,
            "Content-Type": "application/json",
          },
        }
      );
      this.logger_.info(`Aurapay payment created: ${response.data.id}`);
      return {
        id: response.data.id,
        status: response.data.status,
        redirect_url: response.data.redirect_url,
        data: response.data,
      };
    } catch (error) {
      this.logger_.error(`Aurapay createPayment error: ${error.message}`);
      throw new Error("Failed to create Aurapay payment");
    }
  }

  async retrievePayment(data) {
    const paymentId = data.id || data;
    try {
      const response = await axios.get(`${this.api_url_}/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${this.api_key_}` },
      });
      return response.data;
    } catch (error) {
      this.logger_.error(`Aurapay retrievePayment error: ${error.message}`);
      throw error;
    }
  }

  async authorizePayment(sessionData, context) {
    try {
      const response = await axios.post(
        `${this.api_url_}/payments/${sessionData.id}/authorize`,
        {},
        { headers: { Authorization: `Bearer ${this.api_key_}` } }
      );
      return {
        status: response.data.status,
        data: response.data,
      };
    } catch (error) {
      this.logger_.error(`Aurapay authorizePayment error: ${error.message}`);
      return { status: "error", data: { error: error.message } };
    }
  }

  async updatePayment(sessionData) {
    return sessionData;
  }

  async updatePaymentData(sessionData, update) {
    return { ...sessionData, ...update.data };
  }

  async deletePayment() {
    return;
  }

  async capturePayment(paymentData) {
    const paymentId = paymentData.id || paymentData;
    try {
      const response = await axios.post(
        `${this.api_url_}/payments/${paymentId}/capture`,
        {},
        { headers: { Authorization: `Bearer ${this.api_key_}` } }
      );
      return {
        status: response.data.status,
        data: response.data,
      };
    } catch (error) {
      this.logger_.error(`Aurapay capturePayment error: ${error.message}`);
      throw error;
    }
  }

  async refundPayment(paymentData, refundAmount) {
    const paymentId = paymentData.id || paymentData;
    try {
      const response = await axios.post(
        `${this.api_url_}/refunds`,
        {
          payment_id: paymentId,
          amount: refundAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${this.api_key_}`,
            "Content-Type": "application/json",
          },
        }
      );
      this.logger_.info(`Aurapay refund processed: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger_.error(`Aurapay refundPayment error: ${error.message}`);
      throw new Error("Failed to process Aurapay refund");
    }
  }

  async cancelPayment(paymentData) {
    const paymentId = paymentData.id || paymentData;
    try {
      const response = await axios.post(
        `${this.api_url_}/payments/${paymentId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${this.api_key_}` } }
      );
      return {
        status: response.data.status,
        data: response.data,
      };
    } catch (error) {
      this.logger_.error(`Aurapay cancelPayment error: ${error.message}`);
      throw error;
    }
  }

  async getPaymentData(paymentSession) {
    return paymentSession.data;
  }

  verifyWebhookSignature(signature, payload) {
    return true;
  }
}

exports.default = AurapayService;
