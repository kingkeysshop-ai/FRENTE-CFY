"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState, useCallback } from "react"
import { placeOrder, getOrderIdByCartId } from "@lib/data/cart"

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "error" | "retrying">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const mounted = useRef(true)

  const cartId = searchParams.get("cart_id") || searchParams.get("cartId") || searchParams.get("reference")
  const provider = searchParams.get("provider")

  useEffect(() => {
    mounted.current = true

    if (!cartId) {
      setStatus("error")
      setErrorMessage("No se recibió el ID del carrito")
      return
    }

    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

    const attemptOrder = async () => {
      if (provider === "oxapay") {
        for (let i = 0; i < 30; i++) {
          if (!mounted.current) return
          try {
            await placeOrder(cartId)
            return
          } catch (err: any) {
            if (!mounted.current) return
            if (err?.digest === "NEXT_REDIRECT") throw err
            // If webhook already completed it, try to find the order
            const orderId = await getOrderIdByCartId(cartId).catch(() => null)
            if (orderId) {
              router.push(`/order/${orderId}/confirmed`)
              return
            }
          }
          setStatus("retrying")
          await delay(3000)
        }
        setStatus("error")
        setErrorMessage("El pago no se confirmó. Si el problema persiste, contacta a soporte.")
        return
      }

      // Otros proveedores: placeOrder directo
      const maxRetries = 3
      for (let i = 0; i <= maxRetries; i++) {
        if (!mounted.current) return
        try {
          await placeOrder(cartId)
          return
        } catch (err: any) {
          if (!mounted.current) return
          if (err.message?.includes("completado") || err.message?.includes("already been completed")) {
            const orderId = cartId ? await getOrderIdByCartId(cartId) : null
            if (orderId) {
              router.push(`/order/${orderId}/confirmed`)
            } else {
              router.push("/")
            }
            return
          }
          if (i < maxRetries) {
            setStatus("retrying")
            await delay(3000)
          } else {
            setStatus("error")
            setErrorMessage(err.message || "Error al procesar el pago")
          }
        }
      }
    }

    attemptOrder()

    return () => { mounted.current = false }
  }, [cartId, provider, router])

  const handleRetry = useCallback(async () => {
    setStatus("loading")
    if (!cartId) return
    for (let i = 0; i < 30; i++) {
      if (!mounted.current) return
      try {
        await placeOrder(cartId)
        return
      } catch (err: any) {
        if (!mounted.current) return
        if (err?.digest === "NEXT_REDIRECT") throw err
        const orderId = await getOrderIdByCartId(cartId).catch(() => null)
        if (orderId) {
          router.push(`/order/${orderId}/confirmed`)
          return
        }
      }
      setStatus("retrying")
      await new Promise((r) => setTimeout(r, 3000))
    }
    setStatus("error")
    setErrorMessage("El pago no se confirmó. Si el problema persiste, contacta a soporte.")
  }, [cartId, router])

  if (!cartId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center max-w-md px-4">
          <h1 className="text-white text-xl font-bold mb-2">Error</h1>
          <p className="text-[#888888]">No se recibió el ID del carrito</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center max-w-md px-4">
        {status === "loading" || status === "retrying" ? (
          <>
            <div className="w-8 h-8 border-2 border-[#facc15] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h1 className="text-white text-xl font-bold">
              {status === "retrying" ? "Reintentando..." : "Procesando tu pago..."}
            </h1>
            <p className="text-[#888888] mt-2">
              {status === "retrying"
                ? "El pago aún no se ha confirmado. Reintentando..."
                : "Estamos verificando el estado de tu pago. Esto puede tomar unos segundos."}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-white text-xl font-bold mb-2">Error al procesar el pago</h1>
            <p className="text-[#888888] mb-4">{errorMessage}</p>
            <button
              onClick={provider === "oxapay" ? handleRetry : () => window.location.reload()}
              className="px-6 py-3 bg-[#facc15] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#e6b800] transition-colors"
            >
              Reintentar
            </button>
          </>
        )}
      </div>
    </div>
  )
}
