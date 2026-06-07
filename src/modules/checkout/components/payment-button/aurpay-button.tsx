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

const AurpayPaymentButton = ({ cart, notReady, "data-testid": dataTestId }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setError(null)
    setIsLoading(true)
    try {
      await initiatePaymentSession(cart, { provider_id: "aurpay" })

      const updatedCart = await retrieveCart(cart.id)
      const updatedSession = getActivePaymentSession(updatedCart)
      const redirectUrl = updatedSession?.data?.redirect_url
        || updatedSession?.data?.url
        || updatedSession?.data?.pay_url

      if (!redirectUrl) {
        console.error("[Aurpay] No redirect URL in session data:", updatedSession?.data)
        setError("No se pudo generar el link de pago. Intenta de nuevo.")
        setIsLoading(false)
        return
      }

      window.location.href = redirectUrl
    } catch (e) {
      console.error("[Aurpay] Redirect error:", e)
      setError("Error al redirigir a Aurpay. Intenta de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleSubmit}
        disabled={isLoading || notReady}
        data-testid={dataTestId ?? "aurpay-payment-button"}
        className="flex items-center overflow-hidden w-full h-[54px] pl-5 border-none outline-none rounded-md bg-[#23275D] transition-opacity disabled:opacity-50"
      >
        <img
          className="w-6 h-6 shrink-0"
          src="https://aurpay.net/wp-content/uploads/2022/06/favicon-logo.png"
          alt="logo"
        />
        <span className="flex flex-col items-center justify-center h-[54px] bg-[#191D48] px-5 flex-1 skew-x-[-15deg] translate-x-3.5">
          <span className="text-white text-sm font-bold skew-x-[8deg]">
            {isLoading ? "Redirigiendo..." : "Pay with Aurpay"}
          </span>
          <span className="text-[10px] text-white/50 skew-x-[6deg]">
            Secured by Aurpay
          </span>
        </span>
      </button>
      <ErrorMessage error={error} data-testid="aurpay-payment-error" />
    </>
  )
}

export default AurpayPaymentButton
