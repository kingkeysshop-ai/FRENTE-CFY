"use client"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import { retrieveCart, initiatePaymentSession, testPaymentAndCapture } from "@lib/data/cart"
import ErrorMessage from "../error-message"

type Props = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}

const TestPaymentButton = ({ cart, notReady, "data-testid": dataTestId }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const freshCart = await retrieveCart(cart.id)
      await initiatePaymentSession(freshCart, { provider_id: "test-payment" })
      await testPaymentAndCapture(cart.id)
    } catch (e: any) {
      if (e?.digest === "NEXT_REDIRECT") throw e
      setError("Error al procesar el pago de prueba")
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleSubmit}
        disabled={isLoading || notReady}
        data-testid={dataTestId ?? "test-payment-button"}
        className="w-full py-4 bg-green-500 text-white font-black text-base rounded-xl hover:bg-green-400 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Pago de Prueba (Test)"
        )}
      </button>
      <ErrorMessage error={error} data-testid="test-payment-error" />
    </>
  )
}

export default TestPaymentButton
