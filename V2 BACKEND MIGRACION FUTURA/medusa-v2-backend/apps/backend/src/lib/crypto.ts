import crypto from "crypto"
import { MedusaError } from "@medusajs/framework/utils"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12
const TAG_LENGTH = 16
const KEY_LENGTH = 32
const PREFIX = "enc:"

function getKey(): Buffer {
  const raw = process.env.LICENSE_ENCRYPTION_KEY
  if (!raw) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "LICENSE_ENCRYPTION_KEY no configurada. " +
      "Genera una con: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    )
  }
  const key = Buffer.from(raw, "hex")
  if (key.length !== KEY_LENGTH) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `LICENSE_ENCRYPTION_KEY debe tener ${KEY_LENGTH * 2} caracteres hex (256 bits)`
    )
  }
  return key
}

export function encrypt(plaintext: string): string {
  const key = getKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(plaintext, "utf8", "hex")
  encrypted += cipher.final("hex")
  const authTag = cipher.getAuthTag().toString("hex")

  return `${PREFIX}${iv.toString("hex")}.${authTag}.${encrypted}`
}

export function decrypt(stored: string): string {
  if (!stored.startsWith(PREFIX)) {
    return stored
  }

  const key = getKey()
  const payload = stored.slice(PREFIX.length)
  const parts = payload.split(".")

  if (parts.length !== 3) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Formato de clave encriptada inválido")
  }

  const [ivHex, authTagHex, encryptedHex] = parts
  const iv = Buffer.from(ivHex, "hex")
  const authTag = Buffer.from(authTagHex, "hex")

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encryptedHex, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

export function isEncrypted(stored: string): boolean {
  return stored.startsWith(PREFIX)
}
