"use client"

import { getActivePaymentSession } from "@lib/constants"
import { HttpTypes } from "@medusajs/types"
import { useState, useEffect, useCallback } from "react"
import { retrieveCart, initiatePaymentSession } from "@lib/data/cart"
import ErrorMessage from "../error-message"

type Props = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}

type BoldMode = "link" | "datfono"

const BoldPaymentButton = ({ cart, notReady, "data-testid": dataTestId }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<BoldMode>("link")
  const [terminals, setTerminals] = useState<any[]>([])
  const [selectedTerminal, setSelectedTerminal] = useState<string>("")
  const [showTerminals, setShowTerminals] = useState(false)

  const session = getActivePaymentSession(cart)
  const providerId = session?.provider_id || "bold"

  const fetchTerminals = useCallback(async () => {
    try {
      const res = await fetch("/api/bold/datfono?action=terminals")
      if (!res.ok) return
      const data = await res.json()
      const list = data?.available_terminals || []
      setTerminals(list)
      if (list.length > 0 && !selectedTerminal) {
        setSelectedTerminal(`${list[0].terminal_model}::${list[0].terminal_serial}`)
      }
    } catch {
      console.warn("[Bold] Could not fetch terminals")
    }
  }, [selectedTerminal])

  useEffect(() => {
    if (mode === "datfono") {
      fetchTerminals()
    }
  }, [mode, fetchTerminals])

  const handlePaymentLink = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await initiatePaymentSession(cart, { provider_id: providerId })
      const updatedCart = await retrieveCart(cart.id)
      const updatedSession = getActivePaymentSession(updatedCart)
      const redirectUrl = updatedSession?.data?.redirect_url

      if (!redirectUrl) {
        setError("No se pudo generar el link de pago")
        setIsLoading(false)
        return
      }

      window.location.href = redirectUrl
    } catch (e: any) {
      console.error("Bold payment error:", e?.message || e)
      setError("Error al redirigir a Bold")
      setIsLoading(false)
    }
  }

  const handleDatfonoPayment = async () => {
    if (!selectedTerminal) {
      setError("Selecciona un datáfono")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const [terminalModel, terminalSerial] = selectedTerminal.split("::")
      const total = cart?.total || 0

      const res = await fetch("/api/bold/datfono", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total / 100,
          currency: cart?.region?.currency_code || "COP",
          payment_method: "POS",
          terminal_model: terminalModel,
          terminal_serial: terminalSerial,
          reference: cart.id,
          user_email: cart.email || "cliente@elreino.digital",
          description: "Compra en El Reino Digital",
          payer: {
            email: cart.email || "",
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al iniciar pago en datáfono")
        setIsLoading(false)
        return
      }

      setShowTerminals(false)
      setError(null)
      setIsLoading(false)
    } catch (e: any) {
      console.error("Bold datáfono error:", e?.message || e)
      setError("Error al conectar con el datáfono")
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (mode === "datfono") {
      setShowTerminals(true)
      return
    }
    await handlePaymentLink()
  }

  return (
    <>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => { setMode("link"); setError(null) }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === "link"
              ? "bg-[#facc15] text-[#0a0a0a]"
              : "bg-[#2a2a2a] text-[#888888] hover:bg-[#333]"
          }`}
        >
          Online
        </button>
        <button
          type="button"
          onClick={() => { setMode("datfono"); setError(null); fetchTerminals() }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === "datfono"
              ? "bg-[#facc15] text-[#0a0a0a]"
              : "bg-[#2a2a2a] text-[#888888] hover:bg-[#333]"
          }`}
        >
          Datáfono
        </button>
      </div>

      {showTerminals && mode === "datfono" && (
        <div className="mb-3 p-3 bg-[#1a1a1a] rounded-xl border border-[#333]">
          <p className="text-xs text-[#888888] mb-2">Selecciona un datáfono:</p>
          {terminals.length === 0 ? (
            <p className="text-xs text-red-400">No hay datáfonos disponibles</p>
          ) : (
            terminals.map((t: any) => {
              const val = `${t.terminal_model}::${t.terminal_serial}`
              return (
                <label
                  key={val}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all mb-1 ${
                    selectedTerminal === val
                      ? "bg-[#facc15]/10 border border-[#facc15]/30"
                      : "bg-[#2a2a2a] hover:bg-[#333]"
                  }`}
                >
                  <input
                    type="radio"
                    name="terminal"
                    value={val}
                    checked={selectedTerminal === val}
                    onChange={() => setSelectedTerminal(val)}
                    className="accent-[#facc15]"
                  />
                  <div>
                    <span className="text-white text-sm font-bold block">
                      {t.name || t.terminal_serial}
                    </span>
                    <span className="text-[#888] text-xs">{t.terminal_model}</span>
                  </div>
                </label>
              )
            })
          )}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowTerminals(false)}
              className="flex-1 py-2 text-xs bg-[#2a2a2a] text-[#888] rounded-lg hover:bg-[#333]"
            >
              Cancelar
            </button>
            <button
              onClick={handleDatfonoPayment}
              disabled={!selectedTerminal || isLoading}
              className="flex-1 py-2 text-xs bg-[#facc15] text-[#0a0a0a] font-black rounded-lg hover:bg-[#e6b800] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Enviando..." : "Pagar en datáfono"}
            </button>
          </div>
        </div>
      )}

      {!showTerminals && (
        <button
          onClick={handleSubmit}
          disabled={isLoading || !!error || notReady}
          data-testid={dataTestId ?? "bold-payment-button"}
          className="w-full py-4 bg-[#facc15] text-[#0a0a0a] font-black text-base rounded-xl hover:bg-[#e6b800] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="inline-block w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            mode === "datfono" ? "Pagar con datáfono" : "Pagar con Bold"
          )}
        </button>
      )}

      <ErrorMessage error={error} data-testid="bold-payment-error" />
    </>
  )
}

export default BoldPaymentButton
