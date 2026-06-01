"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-black text-white mb-3">
          Algo salió mal
        </h1>
        <p className="text-[#888888] mb-8 text-sm">
          Hubo un error al cargar esta página. Por favor intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="bg-[#facc15] hover:bg-[#e6b800] text-black font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
