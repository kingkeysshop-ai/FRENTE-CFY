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
  const [error, setError] = useState<string | null>(null)

  const paymentSession =
    cart.payment_session?.status === "pending"
      ? cart.payment_session
      : (cart.payment_sessions || cart.payment_collection?.payment_sessions)?.find(
          (s: any) => s.status === "pending"
        )

  const handlePayment = () => {
    if (error || notReady || !paymentSession) return

    const redirectUrl = cart?.payment_session?.data?.redirect_url
      || cart?.payment_session?.data?.url
      || cart?.payment_session?.data?.pay_url

    if (!redirectUrl) {
      setError("No se pudo obtener el link de pago")
      return
    }

    window.location.href = redirectUrl as string
  }

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={!!error || notReady || !paymentSession}
        data-testid={dataTestId ?? "aurpay-payment-button"}
        style={{
          boxShadow: "0 5px 30px 2px rgb(0 0 0 / 0.06), 0 3px 15px -4px rgb(0 0 0 / 0.06)",
          cursor: error || notReady || !paymentSession ? "not-allowed" : "pointer",
          height: "54px",
          paddingLeft: "20px",
          boxSizing: "border-box",
          border: "none",
          outline: "none",
          background: "#23275D",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          width: "100%",
          opacity: error || notReady || !paymentSession ? 0.5 : 1,
        }}
      >
        <img
          style={{ width: "24px", height: "24px" }}
          src="https://aurpay.net/wp-content/uploads/2022/06/favicon-logo.png"
          alt="logo"
        />
        <span
          style={{
            display: "block",
            height: "54px",
            backgroundColor: "#191D48",
            padding: "12px 20px",
            boxSizing: "border-box",
            transform: "skewX(-15deg) translateX(0.875rem)",
            textAlign: "center",
            flex: 1,
          }}
        >
          <span
            style={{
              display: "block",
              color: "#FFFFFF",
              fontSize: "14px",
              marginBottom: "4px",
              transform: "skewX(8deg)",
              fontWeight: 700,
            }}
          >
            Pay with Aurpay
          </span>
          <span
            style={{
              display: "block",
              fontSize: "10px",
              color: "#FFFFFF",
              opacity: 0.5,
              transform: "skewX(6deg)",
            }}
          >
            Secured by Aurpay
          </span>
        </span>
      </button>
      <ErrorMessage error={error} data-testid="aurpay-payment-error" />
    </>
  )
}

export default AurpayPaymentButton
