const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] text-xs font-semibold ${className || ""}`}>
      ⚠️ Solo pruebas
    </span>
  )
}

export default PaymentTest
