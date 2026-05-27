const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-semibold ${className || ""}`}>
      ⚠️ Solo pruebas
    </span>
  )
}

export default PaymentTest
