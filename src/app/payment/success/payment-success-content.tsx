"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState, useCallback } from "react"

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "error" | "retrying">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const mounted = useRef(true)

  const cartId = searchParams.get("cart_id") || searchParams.get("cartId") || searchParams.get("reference")
  const provider = searchParams.get("provider")

  const checkOrder = useCallback(async (cid: string): Promise<string | null> => {
    try {
      const res = await fetch(`/api/oxapay/check-order?cart_id=${cid}&_=${Date.now()}`)
      const data = await res.json()
      return data.orderId || null
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    mounted.current = true

    if (!cartId) {
      setStatus("error")
      setErrorMessage("No se recibió el ID del carrito")
      return
    }

    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

    const attemptOrder = async () => {
      for (let i = 0; i < (provider === "oxapay" ? 30 : 3); i++) {
        if (!mounted.current) return
        const orderId = await checkOrder(cartId)
        if (orderId) {
          router.push(`/order/${orderId}/confirmed`)
          return
        }
        setStatus("retrying")
        await delay(3000)
      }
      // Si el webhook ya creó la orden pero no pudimos obtener el ID, redirigir al home
      router.push("/")
    }

    attemptOrder()

    return () => { mounted.current = false }
  }, [cartId, provider, router, checkOrder])

  const handleRetry = useCallback(async () => {
    setStatus("loading")
    if (!cartId) return
    for (let i = 0; i < 30; i++) {
      if (!mounted.current) return
      const orderId = await checkOrder(cartId)
      if (orderId) {
        router.push(`/order/${orderId}/confirmed`)
        return
      }
      setStatus("retrying")
      await new Promise((r) => setTimeout(r, 3000))
    }
    router.push("/")
  }, [cartId, router, checkOrder])

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
          <div className="text-center">
            <h1 className="text-white text-xl font-bold mb-2">Error al procesar el pago</h1>
            <p className="text-[#888888] mb-4">{errorMessage}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-[#facc15] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#e6b800] transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
