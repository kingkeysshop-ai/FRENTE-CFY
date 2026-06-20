"use client"

import { RadioGroup } from "@headlessui/react"
import { getActivePaymentSession, isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession, retrieveCart, ensurePaymentSessions } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, { StripeCardContainer } from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import ShieldCheck from "@modules/common/icons/shield-check"
import { isCartAllDigital } from "@lib/util/is-digital-cart"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [freshCart, setFreshCart] = useState<any>(null)

  const liveCart = freshCart || cart
  const liveActiveSession = getActivePaymentSession(liveCart)

  const derivedPaymentMethods = (() => {
    const sessions = liveCart?.payment_sessions || liveCart?.payment_collection?.payment_sessions
    if (!sessions || sessions.length === 0) return null
    return sessions.map((ps: any) => ({ id: ps.provider_id }))
  })()

  const effectivePaymentMethods = useMemo(
    () => (availablePaymentMethods?.length > 0 ? availablePaymentMethods : derivedPaymentMethods || []),
    [availablePaymentMethods, derivedPaymentMethods]
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  useEffect(() => {
    setFreshCart(null)
  }, [cart?.id])

  useEffect(() => {
    if (!isOpen) return
    if (effectivePaymentMethods.length > 0) return
    if (!liveCart?.id) return

    let cancelled = false
    const init = async () => {
      try {
        await ensurePaymentSessions(liveCart.id)
        if (cancelled) return
        const updatedCart = await retrieveCart(liveCart.id)
        if (cancelled) return
        if (updatedCart) setFreshCart(updatedCart)
      } catch {}
    }
    init()
    return () => { cancelled = true }
  }, [isOpen, effectivePaymentMethods.length, liveCart?.id])

  useEffect(() => {
    if (liveActiveSession?.provider_id) {
      setSelectedPaymentMethod(liveActiveSession.provider_id)
    } else if (effectivePaymentMethods.length > 0) {
      setSelectedPaymentMethod(effectivePaymentMethods[0].id)
    }
  }, [liveActiveSession?.provider_id, effectivePaymentMethods])

  const setPaymentMethod = (method: string) => {
    setError(null)
    setCardBrand(null)
    setSelectedPaymentMethod(method)
  }

  const isDigital = isCartAllDigital(liveCart)
  const paidByGiftcard = liveCart?.gift_cards && liveCart?.gift_cards?.length > 0 && Number(liveCart?.total) === 0
  const paymentReady = (liveActiveSession && (isDigital || (liveCart?.shipping_methods?.length ?? 0) > 0)) || paidByGiftcard

  const createQueryString = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(name, value)
    return params.toString()
  }, [searchParams])

  const handleEdit = () => router.push(pathname + "?" + createQueryString("step", "payment"), { scroll: false })

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await initiatePaymentSession(liveCart, { provider_id: selectedPaymentMethod })
      const updatedCart = await retrieveCart(liveCart.id)
      if (updatedCart) setFreshCart(updatedCart)
      if (!isStripeLike(selectedPaymentMethod) || (paidByGiftcard)) {
        return router.push(pathname + "?" + createQueryString("step", "review"), { scroll: false })
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { setError(null) }, [isOpen])

  return (
    <div className="bg-transparent">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className={clx("flex flex-row text-xl font-black text-white gap-x-2 items-center", {
          "opacity-50 pointer-events-none select-none": !isOpen && !paymentReady,
        })}>
          <ShieldCheck size="16" color="#facc15" /> Método de Pago
          {!isOpen && paymentReady && <CheckCircleSolid className="text-[#facc15]" />}
        </h2>
        {!isOpen && paymentReady && (
          <button
            onClick={handleEdit}
            className="text-[#facc15] hover:text-[#e6b800] text-sm font-semibold transition-colors"
            data-testid="edit-payment-button"
          >
            Editar
          </button>
        )}
      </div>

      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && effectivePaymentMethods.length > 0 && (
            <RadioGroup value={selectedPaymentMethod} onChange={(value: string) => setPaymentMethod(value)}>
              {effectivePaymentMethods.map((paymentMethod: any) => (
                <div key={paymentMethod.id}>
                  {isStripeLike(paymentMethod.id) ? (
                    <StripeCardContainer
                      paymentProviderId={paymentMethod.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                      paymentInfoMap={paymentInfoMap}
                      setCardBrand={setCardBrand}
                      setError={setError}
                      setCardComplete={setCardComplete}
                    />
                  ) : (
                    <PaymentContainer
                      paymentInfoMap={paymentInfoMap}
                      paymentProviderId={paymentMethod.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                    />
                  )}
                </div>
              ))}
            </RadioGroup>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <p className="font-bold text-white mb-1">Método de pago</p>
              <p className="text-[#888888]" data-testid="payment-method-summary">Tarjeta de regalo</p>
            </div>
          )}

          <ErrorMessage error={error} data-testid="payment-method-error-message" />

          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              (isStripeLike(selectedPaymentMethod) && liveActiveSession && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
            className="mt-6 w-full py-4 bg-[#facc15] text-[#0a0a0a] font-black text-base rounded-xl hover:bg-[#e6b800] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            ) : liveActiveSession && isStripeLike(selectedPaymentMethod) && !cardComplete ? (
              "Ingresa los datos de tu tarjeta"
            ) : (
              "Continuar a la revisión"
            )}
          </button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {liveCart && paymentReady && liveActiveSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <p className="font-bold text-white mb-1">Método de pago</p>
                <p className="text-[#888888]" data-testid="payment-method-summary">
                  {paymentInfoMap[liveActiveSession?.provider_id]?.title || liveActiveSession?.provider_id}
                </p>
              </div>
              <div className="flex flex-col w-1/3">
                <p className="font-bold text-white mb-1">Detalles de pago</p>
                <div className="flex gap-2 text-sm text-[#888888] items-center" data-testid="payment-details-summary">
                  <div className="flex items-center h-7 w-fit p-2 bg-[#1a1a1a] rounded-lg">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || <CreditCard />}
                  </div>
                  <span>
                    {isStripeLike(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Aparecerá el siguiente paso"}
                  </span>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <p className="font-bold text-white mb-1">Método de pago</p>
              <p className="text-[#888888]" data-testid="payment-method-summary">Tarjeta de regalo</p>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
