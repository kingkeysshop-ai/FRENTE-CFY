"use client"

import { getActivePaymentSession, isAurapay, isCryptomus, isBold, isOxapay, isTestPayment, isManual, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import CryptomusPaymentButton from "./cryptomus-button"
import AurpayPaymentButton from "./aurpay-button"
import BoldPaymentButton from "./bold-button"
import OxapayPaymentButton from "./oxapay-button"
import TestPaymentButton from "./test-button"
import { isCartAllDigital } from "@lib/util/is-digital-cart"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const paymentSession = getActivePaymentSession(cart)
  const isDigital = isCartAllDigital(cart)

  const notReady =
    !cart ||
    !cart.email ||
    (!isDigital && !cart.shipping_address) ||
    (!isDigital && (cart.shipping_methods?.length ?? 0) < 1)

  if (typeof window !== "undefined") {
    console.log("[PaymentButton] paymentSession:", paymentSession)
    console.log("[PaymentButton] notReady:", notReady)
    console.log("[PaymentButton] cart.shipping_address:", cart?.shipping_address)
    console.log("[PaymentButton] cart.email:", cart?.email)
    console.log("[PaymentButton] cart.shipping_methods:", cart?.shipping_methods)
  }

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    case isCryptomus(paymentSession?.provider_id):
      return (
        <CryptomusPaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    case isAurapay(paymentSession?.provider_id):
      return (
        <AurpayPaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    case isBold(paymentSession?.provider_id):
      return (
        <BoldPaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    case isOxapay(paymentSession?.provider_id):
      return (
        <OxapayPaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    case isTestPayment(paymentSession?.provider_id):
      if (process.env.NODE_ENV === "production") return null
      return (
        <TestPaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    default:
      return (
        <button disabled className="w-full py-4 bg-[#2a2a2a] text-[#888888] font-black text-base rounded-xl cursor-not-allowed">
          Selecciona un metodo de pago
        </button>
      )
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = getActivePaymentSession(cart)

  const disabled = !stripe || !elements

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)
    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    const clientSecret = session?.data?.client_secret
    if (!clientSecret) {
      setErrorMessage("No se pudo obtener la sesión de pago. Intenta de nuevo.")
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: cart.billing_address?.first_name + " " + cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent
          if ((pi && pi.status === "requires_capture") || (pi && pi.status === "succeeded")) {
            return onPaymentCompleted()
          }
          setErrorMessage(error.message || null)
          setSubmitting(false)
          return
        }
        if (
          paymentIntent?.status === "requires_capture" ||
          paymentIntent?.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }
        setErrorMessage("Estado de pago inesperado: " + paymentIntent.status)
        setSubmitting(false)
      })
      .catch((err: any) => {
        if (err?.digest === "NEXT_REDIRECT") throw err
        setErrorMessage(err?.message || "Error al procesar el pago")
        setSubmitting(false)
      })
  }

  return (
    <>
      <button
        disabled={disabled || notReady}
        onClick={handlePayment}
        data-testid={dataTestId}
        className="w-full py-4 bg-[#facc15] text-[#0a0a0a] font-black text-base rounded-xl hover:bg-[#e6b800] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <span className="inline-block w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          "Realizar Pedido"
        )}
      </button>
      <ErrorMessage error={errorMessage} data-testid="stripe-payment-error-message" />
    </>
  )
}

const ManualTestPaymentButton = ({
  notReady,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
  }

  const handlePayment = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      await onPaymentCompleted()
    } catch (err: any) {
      if (err?.digest === "NEXT_REDIRECT") {
        throw err
      }
      setErrorMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        disabled={notReady || submitting}
        onClick={handlePayment}
        data-testid={dataTestId ?? "submit-order-button"}
        className="w-full py-4 bg-[#facc15] text-[#0a0a0a] font-black text-base rounded-xl hover:bg-[#e6b800] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <span className="inline-block w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          "Realizar Pedido"
        )}
      </button>
      <ErrorMessage error={errorMessage} data-testid="manual-payment-error-message" />
    </>
  )
}

export default PaymentButton
