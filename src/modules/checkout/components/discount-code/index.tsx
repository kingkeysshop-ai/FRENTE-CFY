"use client"

import React from "react"
import { applyPromotions, updateCart } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: any[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const { promotions = [] } = cart

  const removePromotionCode = async (code: string) => {
    const remainingCodes = promotions
      .filter((p) => p.code !== code && p.code !== undefined)
      .map((p) => p.code!)
    await updateCart({ discount_codes: remainingCodes })
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")
    const code = formData.get("code")
    if (!code) return
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions.filter((p) => p.code !== undefined).map((p) => p.code!)
    codes.push(code.toString())
    try {
      await applyPromotions(codes)
    } catch (e: any) {
      setErrorMessage(e.message)
    }
    if (input) input.value = ""
  }

  return (
    <div className="w-full flex flex-col gap-y-3">
      <form action={(a) => addPromotionCode(a)} className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="text-sm text-[#facc15] hover:text-[#e6b800] font-semibold flex items-center gap-1 transition-colors"
          data-testid="add-discount-button"
        >
          {isOpen ? "▲" : "▼"} Agregar código de descuento
        </button>

        {isOpen && (
          <div className="mt-3 flex flex-col gap-y-2">
            <div className="flex w-full gap-x-2">
              <input
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#facc15] placeholder-gray-500"
                id="promotion-input"
                name="code"
                type="text"
                placeholder="Código de descuento"
                autoFocus={false}
                data-testid="discount-input"
              />
              <SubmitButton
                className="px-4 w-auto"
                data-testid="discount-apply-button"
              >
                Aplicar
              </SubmitButton>
            </div>
            <ErrorMessage error={errorMessage} data-testid="discount-error-message" />
          </div>
        )}
      </form>

      {promotions.length > 0 && (
        <div className="flex flex-col gap-y-2">
          <span className="text-xs text-[#888888] font-semibold uppercase tracking-wider">Promociones aplicadas:</span>
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex items-center justify-between bg-[#1a1a1a]/60 border border-[#facc15]/20 rounded-lg px-3 py-2"
              data-testid="discount-row"
            >
              <span className="text-sm text-white flex items-center gap-2" data-testid="discount-code">
                <span className="inline-flex px-2 py-0.5 rounded bg-[#facc15]/20 text-[#facc15] text-xs font-mono font-bold">
                  {promotion.code}
                </span>
                {promotion.application_method?.value !== undefined &&
                  promotion.application_method.currency_code !== undefined && (
                    <span className="text-[#facc15] text-xs">
                      ({promotion.application_method.type === "percentage"
                        ? `${promotion.application_method.value}%`
                        : convertToLocale({
                            amount: +promotion.application_method.value,
                            currency_code: promotion.application_method.currency_code,
                          })})
                    </span>
                  )}
              </span>
              {!promotion.is_automatic && (
                <button
                  className="text-[#888888] hover:text-red-400 transition-colors"
                  onClick={() => promotion.code && removePromotionCode(promotion.code)}
                  data-testid="remove-discount-button"
                >
                  <Trash size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DiscountCode
