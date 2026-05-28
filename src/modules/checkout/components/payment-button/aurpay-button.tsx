"use client"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
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
      const amount = ((cart.total ?? 0) / 100).toFixed(2)
      const currency = (cart.region?.currency_code ?? "USD").toUpperCase()
      const orderId = `${cart.id}-${Date.now()}`
      const cartId = cart.id

      const res = await fetch("/api/aurpay/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, orderId, cartId }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error || "No se pudo generar el enlace de pago de Aurpay")
      }

      window.location.href = data.url
    } catch (err: any) {
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
