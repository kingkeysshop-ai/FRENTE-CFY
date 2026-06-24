export type EmailResult = {
  success: boolean
  error?: string
}

class LicenseNotificationService {
  private fromEmail_: string
  private resendApiKey_: string

  constructor(container: Record<string, unknown>, options: Record<string, unknown> = {}) {
    this.fromEmail_ = process.env.LICENSE_FROM_EMAIL || ""
    this.resendApiKey_ = process.env.RESEND_API_KEY || ""
  }

  async sendLicenseEmail(
    toEmail: string,
    licenseKey: string,
    productName: string,
    orderId: string,
    customerName: string = ""
  ): Promise<EmailResult> {
    if (!this.resendApiKey_) {
      console.warn(
        "RESEND_API_KEY not configured. License email NOT sent. Set RESEND_API_KEY and LICENSE_FROM_EMAIL environment variables."
      )
      return { success: false, error: "RESEND_API_KEY not configured" }
    }

    if (!this.fromEmail_) {
      console.error("LICENSE_FROM_EMAIL not configured. Cannot send license email.")
      return { success: false, error: "LICENSE_FROM_EMAIL not configured" }
    }

    try {
      const orderShort = (orderId?.length > 10 ? orderId.slice(-8) : orderId) || "N/A"
      const dateStr = new Date().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      const storeUrl = process.env.STORE_URL || "#"
      const greeting = customerName
        ? `Gracias por tu compra, ${customerName}`
        : "Gracias por tu compra"

      const text = `KING KEYS - Tu licencia para ${productName}

Hola,

Gracias por tu compra. Tu licencia digital esta lista:

Producto: ${productName}
Clave: ${licenseKey}
Orden: #${orderShort}
Fecha: ${dateStr}

--- Instrucciones ---
1. Ve a Configuracion > Cuenta > Activacion en tu sistema
2. Ingresa la clave cuando te la soliciten
3. Sigue las instrucciones en pantalla para completar la activacion

Si tienes problemas, responde a este correo para contactar a soporte.

© ${new Date().getFullYear()} King Keys
Bogota, Colombia`

      const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#d1d5db;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#1a1a1a;border-radius:12px;">
          <tr>
            <td style="padding:40px 32px 24px;text-align:center;background-color:#0a0a0a;border-radius:12px 12px 0 0;">
              <span style="font-size:28px;font-weight:900;letter-spacing:4px;color:#ffffff;">KING </span>
              <span style="font-size:28px;font-weight:900;letter-spacing:4px;color:#facc15;">KEYS</span>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#facc15;border-radius:8px;">
                <tr>
                  <td style="padding:16px 20px;text-align:center;">
                    <span style="font-size:13px;font-weight:800;color:#0a0a0a;letter-spacing:1.5px;">&#10003;  ACTIVACION COMPLETADA</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <h1 style="font-size:20px;font-weight:700;color:#ffffff;margin:0 0 10px;">${greeting}</h1>
              <p style="font-size:14px;color:#d1d5db;margin:0;line-height:1.6;">Tu pedido ha sido procesado y tu licencia digital esta lista para usar.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:8px;border:1px solid #facc15;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="font-size:10px;font-weight:700;color:#facc15;letter-spacing:2px;margin:0 0 4px;text-transform:uppercase;">Producto</p>
                    <p style="font-size:16px;font-weight:700;color:#ffffff;margin:0;">${productName}</p>
                    <p style="font-size:12px;color:#6b7280;margin:8px 0 0;font-family:'Courier New',monospace;">Orden #${orderShort}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border-radius:8px;border:2px solid #facc15;">
                <tr>
                  <td style="padding:28px 24px;">
                    <p style="font-size:10px;font-weight:700;color:#facc15;letter-spacing:2px;margin:0 0 16px;text-transform:uppercase;text-align:center;">Tu Clave de Activacion</p>
                    <p style="font-family:'Courier New',Consolas,monospace;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:4px;text-align:center;word-break:break-all;margin:0;">${licenseKey}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:8px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="font-size:10px;font-weight:700;color:#facc15;letter-spacing:2px;margin:0 0 16px;text-transform:uppercase;">Instrucciones</p>
                    <p style="font-size:13px;color:#d1d5db;margin:0 0 8px;">1. Ve a Configuracion > Cuenta > Activacion</p>
                    <p style="font-size:13px;color:#d1d5db;margin:0 0 8px;">2. Ingresa la clave cuando te la soliciten</p>
                    <p style="font-size:13px;color:#d1d5db;margin:0;">3. Sigue las instrucciones en pantalla</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 24px;background-color:#000000;border-radius:0 0 12px 12px;">
              <p style="font-size:12px;color:#6b7280;margin:0;text-align:center;">&copy; ${new Date().getFullYear()} King Keys &mdash; Bogota, Colombia</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.resendApiKey_}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `King Keys <${this.fromEmail_.replace(/[<>]/g, "").trim()}>`,
          to: toEmail,
          subject: `Tu licencia para ${productName} ya esta lista`,
          text,
          html,
        }),
      })

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        return { success: false, error: `Resend API error (HTTP ${response.status}): ${errBody?.message || response.statusText}` }
      }

      return { success: true }
    } catch (error: any) {
      const msg = error.message || "Unknown error sending email"
      console.error(`Error sending license email: ${msg}`)
      return { success: false, error: msg }
    }
  }
}

export default LicenseNotificationService
