"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchOrderLicenses, resendLicense } from "@lib/data/license-keys"

type LicenseKey = {
  id: string
  key: string
  product_id: string
  status: string
  delivery_status: string
  delivery_error?: string
}

const CACHE_PREFIX = "kk_licenses_"
const CACHE_TTL = 1000 * 60 * 60 * 24

function getCacheKey(orderId: string) {
  return `${CACHE_PREFIX}${orderId}`
}

function readCache(orderId: string): { keys: LicenseKey[]; ts: number } | null {
  try {
    const raw = localStorage.getItem(getCacheKey(orderId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.ts > CACHE_TTL) {
      localStorage.removeItem(getCacheKey(orderId))
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeCache(orderId: string, keys: LicenseKey[]) {
  try {
    localStorage.setItem(
      getCacheKey(orderId),
      JSON.stringify({ keys, ts: Date.now() })
    )
  } catch {}
}

const LicenseKeysDisplay = ({ orderId }: { orderId: string }) => {
  const [keys, setKeys] = useState<LicenseKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resending, setResending] = useState<string | null>(null)
  const [sent, setSent] = useState<string | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)

  const loadKeys = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    setError(null)

    const cached = readCache(orderId)
    if (cached?.keys?.length) {
      setKeys(cached.keys)
      setIsFromCache(true)
      setLoading(false)
    }

    const result = await fetchOrderLicenses(orderId)

    if (result.error) {
      setError(result.error)
      if (!cached?.keys?.length) {
        setKeys([])
      }
    } else if (result.keys.length > 0) {
      setKeys(result.keys)
      setIsFromCache(false)
      writeCache(orderId, result.keys)
    } else if (!cached?.keys?.length) {
      setKeys([])
    }

    setLoading(false)
  }, [orderId])

  useEffect(() => {
    loadKeys()
  }, [loadKeys])

  const handleResend = async (keyId: string) => {
    setResending(keyId)
    setSent(null)
    const result = await resendLicense(orderId)
    setResending(null)
    if (result.error) {
      setError(result.error)
    } else {
      setSent(keyId)
      await loadKeys(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2a2a2a]">
          <span className="text-[#facc15] font-black text-sm uppercase tracking-wider">
            🔑 Tus Licencias
          </span>
        </div>
        <div className="text-[#888888] text-sm animate-pulse">
          Cargando licencias...
        </div>
      </div>
    )
  }

  if (keys.length === 0 && error) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2a2a2a]">
          <span className="text-[#facc15] font-black text-sm uppercase tracking-wider">
            🔑 Tus Licencias
          </span>
        </div>
        <div className="bg-[#1a1a1a]/60 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm mb-2">
            No se pudieron cargar tus licencias.
          </p>
          <p className="text-[#888888] text-xs mb-3">{error}</p>
          <button
            onClick={() => loadKeys()}
            className="px-4 py-2 bg-[#facc15] text-[#0a0a0a] font-bold text-xs rounded-lg hover:bg-[#e6b800] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (keys.length === 0) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2a2a2a]">
          <span className="text-[#facc15] font-black text-sm uppercase tracking-wider">
            🔑 Tus Licencias
          </span>
        </div>
        <div className="bg-[#1a1a1a]/60 border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-[#888888] text-sm">
            Tus licencias se estan generando. Si no aparecen en unos minutos, contacta a soporte.
          </p>
          <button
            onClick={() => loadKeys()}
            className="mt-2 px-4 py-2 bg-[#2a2a2a] text-white font-bold text-xs rounded-lg hover:bg-[#3a3a3a] transition-colors"
          >
            Verificar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2a2a2a]">
        <span className="text-[#facc15] font-black text-sm uppercase tracking-wider">
          🔑 Tus Licencias
        </span>
        {isFromCache && (
          <span className="text-[10px] text-[#888888] bg-[#2a2a2a] px-2 py-0.5 rounded-full">
            cache local
          </span>
        )}
      </div>
      {error && (
        <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-xs">
            No se pudieron actualizar las licencias desde el servidor. Mostrando datos en cache.
          </p>
        </div>
      )}
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
