"use client"

import { useState } from "react"
import { retrieveCart, initiatePaymentSession, testPaymentAndCapture } from "@lib/data/cart"

const TestCheckoutButton = ({ cart }: { cart: any }) => {
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    try {
      const fresh = await retrieveCart(cart.id)
      await initiatePaymentSession(fresh, { provider_id: "manual" })
      await testPaymentAndCapture(cart.id)
    } catch (e: any) {
      if (e?.digest === "NEXT_REDIRECT") throw e
      console.error("Test error:", e)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleTest}
      disabled={loading}
      className="w-full py-2.5 bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-xs rounded-xl hover:bg-green-500/20 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <span>🧪</span>
          Pago de Prueba (sin salir)
        </>
      )}
    </button>
  )
}

export default TestCheckoutButton
