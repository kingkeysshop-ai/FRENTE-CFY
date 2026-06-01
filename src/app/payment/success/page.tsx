import { Suspense } from "react"
import PaymentSuccessContent from "./payment-success-content"

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#facc15] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#888888]">Procesando pago...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
