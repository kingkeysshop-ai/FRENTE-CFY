"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  if (typeof window !== "undefined") {
    console.error("[Checkout Error]", error)
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center bg-[#111111] border border-[#2a2a2a] rounded-xl p-8">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-black text-white mb-3">
          Error en el checkout
        </h1>
        <p className="text-[#888888] mb-2 text-sm">
          Ocurrió un error al procesar el pago. Tu carrito está seguro.
        </p>
        <p className="text-[#666666] mb-8 text-xs font-mono">
          {error.digest ? `ID: ${error.digest}` : ""}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#facc15] hover:bg-[#e6b800] text-black font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Intentar de nuevo
          </button>
          <a
            href="/cart"
            className="bg-[#2a2a2a] hover:bg-[#333] text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Volver al carrito
          </a>
        </div>
      </div>
    </div>
  )
}
