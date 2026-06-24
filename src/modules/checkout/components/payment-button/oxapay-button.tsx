"use client"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import ErrorMessage from "../error-message"

type Props = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}

const OxapayPaymentButton = ({ cart, notReady, "data-testid": dataTestId }: Props) => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    if (submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const orderId = `${cart.id}-${Date.now()}`
      const amount = ((cart.total ?? 0) / 100).toFixed(2)
      const currency = (cart.region?.currency_code ?? "USD").toUpperCase()

      const res = await fetch("/api/oxapay/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, orderId, cartId: cart.id }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error || "No se pudo crear la factura en Oxapay")
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
        disabled={notReady || submitting}
        onClick={handlePayment}
        data-testid={dataTestId ?? "oxapay-payment-button"}
        className="w-full py-4 bg-[#1a1a2e] text-[#facc15] font-black text-base rounded-xl hover:bg-[#252545] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 border border-[#facc15]/30"
      >
        {submitting ? (
          <span className="inline-block w-5 h-5 border-2 border-[#facc15] border-t-transparent rounded-full animate-spin" />
        ) : (
          "Pagar con Oxapay"
        )}
      </button>
      <ErrorMessage error={error} data-testid="oxapay-payment-error" />
    </>
  )
}

export default OxapayPaymentButton
