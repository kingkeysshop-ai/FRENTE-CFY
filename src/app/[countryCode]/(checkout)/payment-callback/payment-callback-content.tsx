"use client"

import { useSearchParams, useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { countryCode } = useParams()
  const [status, setStatus] = useState<string>("processing")

  useEffect(() => {
    const paymentStatus = searchParams.get("status")
    const orderId = searchParams.get("order_id")

    if (paymentStatus === "paid" || paymentStatus === "success" || paymentStatus === "completed") {
      setStatus("success")
      if (orderId) {
        setTimeout(() => {
          router.push(`/${countryCode}/order/${orderId}/confirmed`)
        }, 2000)
      } else {
        setTimeout(() => {
          router.push(`/${countryCode}`)
        }, 2000)
      }
    } else if (paymentStatus === "cancelled" || paymentStatus === "failed") {
      setStatus("failed")
      setTimeout(() => {
        router.push(`/${countryCode}/checkout?step=review`)
      }, 3000)
    } else {
      setStatus("processing")
      setTimeout(() => {
        router.push(`/${countryCode}`)
      }, 5000)
    }
  }, [searchParams, router, countryCode])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      {status === "success" && (
        <>
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">¡Pago exitoso!</h1>
          <p className="text-[#888888]">Redirigiendo a la confirmación de tu orden...</p>
        </>
      )}
      {status === "failed" && (
        <>
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">Pago cancelado</h1>
          <p className="text-[#888888]">Redirigiendo al checkout...</p>
        </>
      )}
      {status === "processing" && (
        <>
          <span className="inline-block w-10 h-10 border-4 border-[#facc15] border-t-transparent rounded-full animate-spin" />
          <h1 className="text-2xl font-black text-white">Procesando pago...</h1>
          <p className="text-[#888888]">Espera mientras confirmamos tu pago.</p>
        </>
      )}
    </div>
  )
}
