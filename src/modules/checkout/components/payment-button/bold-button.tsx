"use client"

import { getActivePaymentSession } from "@lib/constants"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import { retrieveCart, initiatePaymentSession } from "@lib/data/cart"
import ErrorMessage from "../error-message"

type Props = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}

const BoldPaymentButton = ({ cart, notReady, "data-testid": dataTestId }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const session = getActivePaymentSession(cart)
  const providerId = session?.provider_id || "bold"

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await initiatePaymentSession(cart, { provider_id: providerId })

      const updatedCart = await retrieveCart(cart.id)
      const updatedSession = getActivePaymentSession(updatedCart)
      const redirectUrl = updatedSession?.data?.redirect_url

      if (!redirectUrl) {
        setError("No se pudo generar el link de pago")
        setIsLoading(false)
        return
      }

      window.location.href = redirectUrl
    } catch (e: any) {
      console.error("Bold payment error:", e?.message || e)
      setError("Error al redirigir a Bold")
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleSubmit}
        disabled={isLoading || !!error || notReady}
        data-testid={dataTestId ?? "bold-payment-button"}
        className="w-full py-4 bg-[#facc15] text-[#0a0a0a] font-black text-base rounded-xl hover:bg-[#e6b800] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          "Pagar con Bold"
        )}
      </button>
      <ErrorMessage error={error} data-testid="bold-payment-error" />
    </>
  )
}

export default BoldPaymentButton
