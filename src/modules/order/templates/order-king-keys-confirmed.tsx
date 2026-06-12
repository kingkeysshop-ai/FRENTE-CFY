"use client"

import { useState, useEffect, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { fetchOrderLicenses } from "@lib/data/license-keys"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTypingEffect } from "@lib/hooks/use-typing-effect"

type LicenseKeyData = {
  id: string
  key: string
  product_id: string
  status: string
  delivery_status: string
  delivery_error?: string
}

type Props = {
  order: HttpTypes.StoreOrder
}

const PARTICLE_COUNT = 12

function ShieldCheckIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function CopyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export default function OrderKingKeysConfirmed({ order }: Props) {
  const [copied, setCopied] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [keys, setKeys] = useState<LicenseKeyData[]>([])
  const [loadingKeys, setLoadingKeys] = useState(true)
  const [keysError, setKeysError] = useState<string | null>(null)

  const TERMINAL_TEXT = `> Verificando pago.............. [OK]
> Validando licencia............. [OK]
> Asignando clave................. [OK]
> Acceso al Reino concedido!  ✓`

  const { displayedText: typedText, isComplete: typingComplete, cursor } = useTypingEffect({
    text: TERMINAL_TEXT,
    speed: 40,
    onComplete: () => setShowContent(true),
  })
  const orderId = order.id
  const firstItem = order.items?.[0]
  const productName = firstItem?.product_title || firstItem?.title || "Producto Digital"

  const loadKeys = useCallback(async () => {
    setLoadingKeys(true)
    setKeysError(null)
    const result = await fetchOrderLicenses(orderId, order.email)
    if (result.error) {
      setKeysError(result.error)
    } else if (result.keys.length > 0) {
      setKeys(result.keys)
    }
    setLoadingKeys(false)
  }, [orderId, order.email])

  useEffect(() => {
    loadKeys()
  }, [loadKeys])

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const handleCopy = async (keyText: string) => {
    try {
      await navigator.clipboard.writeText(keyText)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = keyText
      ta.style.position = "fixed"
      ta.style.opacity = "0"
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
    setCopied(true)
  }

  const firstKey = keys[0]
  const hasKey = !!firstKey?.key

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Grid overlay */}
      <div className="fixed inset-0 hero-grid-bg pointer-events-none" />

      {/* Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(250,204,21,0.08) 2px, rgba(250,204,21,0.08) 4px)",
        }}
      />

      {/* Golden particles */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${60 + (i * 13) % 35}%`,
              backgroundColor: "#facc15",
              opacity: 0.1 + (i % 5) * 0.04,
              animation: `kk-float-up ${3 + (i % 4)}s ${i * 0.25}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Custom keyframes */}
      <style>{`
        @keyframes kk-float-up {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.1; }
          50% { transform: translateY(-50px) scale(1.8); opacity: 0.5; }
        }
        @keyframes kk-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div className="relative z-20 max-w-2xl mx-auto px-4 py-12 flex flex-col gap-8">
        {/* ── Terminal Window ── */}
        <div className="terminal-win animate-fade-up">
          <div className="terminal-bar">
            <div className="terminal-dots">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
            </div>
            <span className="terminal-title">king_keys@server:~$</span>
          </div>
          <div className="terminal-body">
            <div className="terminal-line">
              <span className="terminal-prompt">$</span>
              <span className="terminal-cmd">
                ./activate --order={order.display_id || orderId.slice(0, 8)}
              </span>
            </div>
            <div className="terminal-out">
              <span className="text-[#27c93f]">[OK]</span>{" "}
              Conexion establecida con servidor de licencias
            </div>
            <div className="terminal-line">
              <span className="terminal-prompt">$</span>
              <span className="terminal-cmd">
                {`init --reino=digital --key=${orderId.slice(0, 8)}...`}
              </span>
            </div>
            <div className="terminal-out">
              <span className="text-[#27c93f]">[OK]</span>{" "}
              <span className="text-[#facc15] font-bold">
                BIENVENIDO AL REINO DIGITAL
              </span>
            </div>
          </div>
        </div>

        {/* ── Success Banner ── */}
        <div className="bg-[#111111] border border-[#facc15]/30 rounded-2xl p-8 flex flex-col items-center text-center gap-6 animate-fade-up-d1">
          <div className="w-20 h-20 rounded-full bg-[#facc15]/10 border-2 border-[#facc15] flex items-center justify-center animate-float">
            <ShieldCheckIcon size={40} />
          </div>

          {/* Terminal typing output */}
          <div className="w-full text-left max-w-md mx-auto">
            <p className="text-[#9ca3af] text-[10px] uppercase tracking-[0.2em] font-mono mb-2 text-center">
              {">"} PROCESO DE ACTIVACION
            </p>
            <div className="font-mono text-sm whitespace-pre-wrap leading-relaxed min-h-[6rem]">
              {typedText.split(/(\[OK\])/g).map((part, i) => {
                if (part === "[OK]") {
                  return (
                    <span key={i} className="text-[#22c55e] font-bold">
                      [OK]
                    </span>
                  )
                }
                return (
                  <span key={i} className="text-[#facc15]">
                    {part}
                  </span>
                )
              })}
              {!typingComplete && (
                <span className="inline-block text-[#facc15] ml-0.5">
                  {cursor}
                </span>
              )}
            </div>
          </div>

          {typingComplete && (
            <p className="text-[#9ca3af] text-sm animate-fade-in-top max-w-md">
              Pedido{" "}
              <span className="text-white font-bold">#{order.display_id}</span>{" "}
              procesado. Tu clave de activacion ya esta disponible
              <br />
              en el recuadro inferior.
            </p>
          )}

          {typingComplete && order.email && (
            <div className="flex items-center gap-2 text-xs text-[#666] font-mono">
              <span className="text-[#facc15]">$</span>
              Licencia enviada a:{" "}
              <span className="text-white">{order.email}</span>
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className={`bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 transition-all duration-700 ease-out ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center shrink-0">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#facc15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#9ca3af] text-[10px] uppercase tracking-[0.2em] font-mono">
                {">"} PRODUCTO
              </p>
              <p className="text-white font-bold text-lg truncate">
                {productName}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[#9ca3af] text-[10px] uppercase tracking-[0.2em] font-mono">
                {">"} ORDEN
              </p>
              <p className="text-[#facc15] font-mono font-bold">
                #{order.display_id}
              </p>
            </div>
          </div>
        </div>

        {/* ── License Key Box ── */}
        <div className={`transition-all duration-700 delay-100 ease-out ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {loadingKeys ? (
            <div className="bg-[#1a1a1a] border border-[#facc15]/30 rounded-2xl p-8 text-center">
              <p className="text-[#9ca3af] text-sm animate-pulse font-mono">
                {">"} GENERANDO LICENCIA...
              </p>
              <div className="mt-4 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#facc15]"
                    style={{ animation: `kk-blink 1s ${i * 0.2}s step-end infinite` }}
                  />
                ))}
              </div>
            </div>
          ) : hasKey ? (
            <div className="bg-[#1a1a1a] border-2 border-[#facc15]/40 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_40px_rgba(250,204,21,0.12)]">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#facc15]/30 rounded-tl" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-[#facc15]/30 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-[#facc15]/30 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#facc15]/30 rounded-br" />

              {/* Status badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                  <span
                    className="w-2 h-2 rounded-full bg-green-400"
                    style={{ animation: "kk-blink 1.5s step-end infinite" }}
                  />
                  <span className="text-green-400 text-[10px] font-bold tracking-[0.15em]">
                    LICENCIA ACTIVA
                  </span>
                </div>
                <span className="text-[#555] text-[10px] font-mono">
                  {firstKey.id.slice(0, 8)}
                </span>
              </div>

              {/* Key display */}
              <p className="text-[#9ca3af] text-[10px] uppercase tracking-[0.2em] mb-2 font-mono">
                {">"} CLAVE DE ACTIVACION
              </p>
              <p className="text-[#555] text-[10px] font-mono mb-3 -mt-1">
                Copia esta clave para usarla en el paso 2
              </p>
              <div className="bg-[#0a0a0a] border border-[#facc15]/20 rounded-xl p-4 sm:p-5 mb-5">
                <p className="text-[#facc15] font-tech text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.15em] break-all select-all text-center leading-relaxed">
                  {firstKey.key}
                </p>
              </div>

              {/* Copy button */}
              <button
                onClick={() => handleCopy(firstKey.key)}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: copied
                    ? "rgba(34,197,94,0.12)"
                    : "#facc15",
                  color: copied ? "#22c55e" : "#0a0a0a",
                  border: copied
                    ? "1px solid rgba(34,197,94,0.3)"
                    : "1px solid #facc15",
                }}
              >
                {copied ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    COPIADO ✓
                  </>
                ) : (
                  <>
                    <CopyIcon size={16} />
                    COPIAR CLAVE
                  </>
                )}
              </button>
            </div>
          ) : keysError ? (
            <div className="bg-[#111111] border border-red-500/30 rounded-2xl p-8 text-center">
              <p className="text-red-400 text-sm font-mono mb-2">
                {">"} ERROR AL CARGAR LICENCIA
              </p>
              <p className="text-[#9ca3af] text-xs mb-5">{keysError}</p>
              <button
                onClick={loadKeys}
                className="px-6 py-2.5 bg-[#facc15] text-[#0a0a0a] font-bold text-xs rounded-xl hover:bg-[#e6b800] transition-colors uppercase tracking-wider"
              >
                REINTENTAR
              </button>
            </div>
          ) : (
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 text-center">
              <p className="text-[#9ca3af] text-sm font-mono">
                {">"} GENERANDO LICENCIA...
              </p>
              <p className="text-[#555] text-xs mt-2">
                La licencia se asignara automaticamente. Revisa tu bandeja de
                entrada.
              </p>
            </div>
          )}
        </div>

        {/* ── Activation Instructions ── */}
        <div className={`bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden transition-all duration-700 delay-200 ease-out ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="bg-[#1a1a1a]/60 px-6 py-3.5 border-b border-[#2a2a2a] flex items-center gap-2">
            <span className="text-[#facc15] font-mono text-sm font-bold">
              {">"}
            </span>
            <span className="text-white font-bold text-xs uppercase tracking-[0.15em] font-mono">
              INSTRUCCIONES DE ACTIVACION
            </span>
          </div>
          <div className="p-5 sm:p-6 flex flex-col gap-4">
            {[
              [
                "Abre cualquier aplicacion de Microsoft Office",
                "Word, Excel, PowerPoint o la que hayas adquirido",
              ],
              [
                "Ve a Archivo > Cuenta > Activar Producto",
                "Alli aparecera un campo para ingresar tu clave de 25 caracteres",
              ],
              [
                "Ingresa la clave del recuadro superior",
                "Escribela tal cual aparece, incluyendo los guiones",
              ],
              [
                "Selecciona 'Activar en linea' y confirma",
                "Microsoft validara la licencia y desbloqueara tu producto",
              ],
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <span className="w-7 h-7 rounded-lg bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] font-mono font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-[#facc15] group-hover:text-[#0a0a0a] transition-all duration-200">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm">
                    {step[0]}
                  </p>
                  <p className="text-[#9ca3af] text-xs mt-0.5">{step[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Warning ── */}
        <div className={`transition-all duration-700 delay-200 ease-out ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="bg-[#1a1a1a]/60 border border-[#facc15]/20 rounded-xl p-4 flex items-start gap-3">
            <span className="text-[#facc15] font-mono text-sm shrink-0">{">"}</span>
            <p className="text-[#9ca3af] text-xs leading-relaxed">
              Guarda esta clave en un lugar seguro. La necesitaras si reinstalas
              el producto o realizas una migracion de equipo. Si la pierdes,
              contacta a soporte para recuperarla.
            </p>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-300 ease-out ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <LocalizedClientLink
            href="/account/orders"
            className="flex-1 py-3.5 text-center border border-[#facc15]/40 text-[#facc15] font-bold rounded-xl hover:bg-[#facc15] hover:text-[#0a0a0a] transition-all duration-200 text-sm uppercase tracking-[0.1em]"
          >
            [ VER MIS PEDIDOS ]
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/store"
            className="flex-1 py-3.5 text-center bg-[#facc15] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#e6b800] transition-all duration-200 text-sm uppercase tracking-[0.1em]"
          >
            [ SEGUIR COMPRANDO ]
          </LocalizedClientLink>
        </div>

        {/* ── Support Footer ── */}
        <div className={`text-center transition-all duration-700 delay-300 ease-out ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="h-px bg-gradient-to-r from-transparent via-[#facc15]/20 to-transparent mb-6" />
          <p className="text-[#9ca3af] text-xs font-mono">
            <span className="text-[#facc15]">{">"}</span> ¿Problemas con la activacion? Escríbenos a{" "}
            <a
              href="mailto:king@kingkeys.store"
              className="text-[#facc15] hover:underline font-semibold"
            >
              king@kingkeys.store
            </a>
            {" "}y te asistiremos en menos de 24 horas.
          </p>
          <p className="text-[#444] text-[10px] font-mono mt-2">
            KING KEYS — EL REINO DIGITAL // v2.0
          </p>
        </div>
      </div>
    </div>
  )
}
