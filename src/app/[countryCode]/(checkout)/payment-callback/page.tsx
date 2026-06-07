import { Suspense } from "react"
import PaymentCallbackContent from "./payment-callback-content"

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <span className="inline-block w-10 h-10 border-4 border-[#facc15] border-t-transparent rounded-full animate-spin" />
          <h1 className="text-2xl font-black text-white">Procesando pago...</h1>
          <p className="text-[#888888]">Espera mientras confirmamos tu pago.</p>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  )
}
