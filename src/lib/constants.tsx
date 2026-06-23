import React from "react"
import { CreditCard } from "@medusajs/icons"

import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import PayPal from "@modules/common/icons/paypal"
import Cryptomus from "@modules/common/icons/cryptomus"
import Oxapay from "@modules/common/icons/oxapay"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_medusa-payments_default": {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <CreditCard />,
  },
    pp_cryptomus_cryptomus: {
    title: "Criptomonedas",
    icon: <Cryptomus />,
  },
  pp_aurpay_aurpay: {
    title: "Aurpay (Crypto)",
    icon: <CreditCard />,
  },
  aurpay: {
    title: "Aurpay (Crypto)",
    icon: <CreditCard />,
  },
  pp_aurapay_aurapay: {
    title: "Aurpay (Crypto)",
    icon: <CreditCard />,
  },
  aurapay: {
    title: "Aurpay (Crypto)",
    icon: <CreditCard />,
  },
  pp_bold_bold: {
    title: "Bold (Colombia)",
    icon: <CreditCard />,
  },
  bold: {
    title: "Bold (Colombia)",
    icon: <CreditCard />,
  },
  pp_oxapay_oxapay: {
    title: "Oxapay (Crypto)",
    icon: <Oxapay />,
  },
  oxapay: {
    title: "Oxapay (Crypto)",
    icon: <Oxapay />,
  },
  "test-payment": {
    title: "Pago de Prueba",
    icon: <CreditCard />,
  },
}

export const isStripeLike = (providerId?: string) => {
  return (
    providerId?.startsWith("pp_stripe_") || providerId?.startsWith("pp_medusa-")
  )
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}

export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default") || providerId === "manual"
}

export const isCryptomus = (providerId?: string) => {
  return providerId?.startsWith("pp_cryptomus") || providerId === "cryptomus"
}

export const isAurapay = (providerId?: string) => {
  return providerId?.startsWith("pp_aurpay") || providerId === "aurpay"
    || providerId?.startsWith("pp_aurapay") || providerId === "aurapay"
}

export const isBold = (providerId?: string) => {
  return providerId?.startsWith("pp_bold") || providerId === "bold"
}

export const isOxapay = (providerId?: string) => {
  return providerId?.startsWith("pp_oxapay") || providerId === "oxapay"
}

export const isTestPayment = (providerId?: string) => {
  return providerId === "test-payment"
}

export function getActivePaymentSession(cart: any) {
  if (cart?.payment_session?.status === "pending") {
    return cart.payment_session
  }
  if (cart?.payment_session) {
    return cart.payment_session
  }
  if (cart?.payment_collection?.payment_sessions) {
    return cart.payment_collection.payment_sessions.find((s: any) => s.status === "pending")
      || cart.payment_collection.payment_sessions[0]
  }
  if (cart?.payment_sessions) {
    return cart.payment_sessions.find((s: any) => s.status === "pending")
      || cart.payment_sessions[0]
  }
  return null
}

export const noDivisionCurrencies = [
  "krw", "jpy", "vnd", "clp", "pyg", "xaf", "xof", "bif",
  "djf", "gnf", "kmf", "mga", "rwf", "xpf", "htg", "vuv",
  "xag", "xdr", "xau",
]
