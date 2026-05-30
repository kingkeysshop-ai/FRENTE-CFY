"use client"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import { placeOrder } from "@lib/data/cart"
import ErrorMessage from "../error-message"

type Props = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}

const AurpayPaymentButton = ({ cart, notReady, "data-testid": dataTestId }: Props) => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const paymentSession =
    cart.payment_session?.status === "pending"
      ? cart.payment_session
      : (cart.payment_sessions || cart.payment_collection?.payment_sessions)?.find(
          (s: any) => s.status === "pending"
        )

  const handlePayment = async () => {
    if (submitting || notReady) return
    setSubmitting(true)
    setError(null)

    try {
      const result = await placeOrder()

      if (result?.payment_session?.data) {
        const redirectUrl = result.payment_session.data.redirect_url || result.payment_session.data.url
        if (redirectUrl) {
          window.location.href = redirectUrl
          return
        }
      }

      throw new Error("No se pudo obtener la URL de pago de Aurpay")
    } catch (err: any) {
      if (err?.digest === "NEXT_REDIRECT") {
        throw err
      }
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        disabled={notReady || submitting || !paymentSession}
        onClick={handlePayment}
        data-testid={dataTestId ?? "aurpay-payment-button"}
        className="w-full py-4 bg-yellow-400 text-gray-900 font-black text-base rounded-xl hover:bg-yellow-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <span className="inline-block w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          "Pagar con Aurpay (Crypto)"
        )}
      </button>
      <ErrorMessage error={error} data-testid="aurpay-payment-error" />
    </>
  )
}

export default AurpayPaymentButton
