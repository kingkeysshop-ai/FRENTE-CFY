"use client"

import { useState, useEffect } from "react"
import { fetchOrderLicenses, resendLicense } from "@lib/data/license-keys"

type LicenseKey = {
  id: string
  key: string
  product_id: string
  status: string
  delivery_status: string
  delivery_error?: string
}

const LicenseKeysDisplay = ({ orderId }: { orderId: string }) => {
  const [keys, setKeys] = useState<LicenseKey[]>([])
  const [loading, setLoading] = useState(true)
  const [resending, setResending] = useState<string | null>(null)
  const [sent, setSent] = useState<string | null>(null)

  useEffect(() => {
    fetchOrderLicenses(orderId).then((data) => {
      setKeys(data)
      setLoading(false)
    })
  }, [orderId])

  if (loading) return null
  if (keys.length === 0) return null

  const handleResend = async (keyId: string) => {
    setResending(keyId)
    setSent(null)
    await resendLicense(orderId)
    setResending(null)
    setSent(keyId)
    const fresh = await fetchOrderLicenses(orderId)
    setKeys(fresh)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2a2a2a]">
        <span className="text-[#facc15] font-black text-sm uppercase tracking-wider">
          🔑 Tus Licencias
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {keys.map((lk) => (
          <div
            key={lk.id}
            className="bg-[#1a1a1a]/60 border border-[#2a2a2a] rounded-xl overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#888888] text-xs uppercase tracking-wider">
                  Producto
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  lk.delivery_status === "sent"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : lk.delivery_status === "failed"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-yellow-500/20 text-[#facc15] border border-yellow-500/30"
                }`}>
                  {lk.delivery_status === "sent" ? "Enviado" : lk.delivery_status === "failed" ? "Error" : "Pendiente"}
                </span>
              </div>
              <p className="text-white font-bold text-sm mb-3">{lk.product_id}</p>
              <div className="bg-[#111111] border border-[#facc15]/20 rounded-lg p-3 mb-3">
                <span className="text-[#facc15] font-mono font-bold text-sm tracking-wider break-all select-all">
                  {lk.key}
                </span>
              </div>
              {lk.delivery_status !== "sent" && (
                <button
                  onClick={() => handleResend(lk.id)}
                  disabled={resending === lk.id}
                  className="text-xs text-[#facc15] hover:text-[#e6b800] font-bold transition-colors disabled:opacity-50"
                >
                  {resending === lk.id ? "Reenviando..." : sent === lk.id ? "✅ Reenviado" : "🔄 Reenviar al correo"}
                </button>
              )}
              {lk.delivery_error && (
                <p className="text-red-400/60 text-[10px] mt-1">{lk.delivery_error}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LicenseKeysDisplay
