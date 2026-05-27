"use client"

import { convertToLocale } from "@lib/util/money"
import {
  HttpTypes,
  StoreCart,
  StoreCartShippingOption,
  StorePrice,
} from "@medusajs/types"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState } from "react"
import { StoreFreeShippingPrice } from "types/global"

const computeTarget = (
  cart: HttpTypes.StoreCart,
  price: HttpTypes.StorePrice
) => {
  const priceRule = (price.price_rules || []).find(
    (pr: any) => pr.attribute === "item_total"
  )!

  const currentAmount = cart.item_total
  const targetAmount = parseFloat(priceRule.value)

  if (priceRule.operator === "gt") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: currentAmount > targetAmount,
      target_remaining:
        currentAmount > targetAmount ? 0 : targetAmount + 1 - currentAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else if (priceRule.operator === "gte") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: currentAmount > targetAmount,
      target_remaining:
        currentAmount > targetAmount ? 0 : targetAmount - currentAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else if (priceRule.operator === "lt") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: targetAmount > currentAmount,
      target_remaining:
        targetAmount > currentAmount ? 0 : currentAmount + 1 - targetAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else if (priceRule.operator === "lte") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: targetAmount > currentAmount,
      target_remaining:
        targetAmount > currentAmount ? 0 : currentAmount - targetAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: currentAmount === targetAmount,
      target_remaining:
        targetAmount > currentAmount ? 0 : targetAmount - currentAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  }
}

export default function ShippingPriceNudge({
  variant = "inline",
  cart,
  shippingOptions,
}: {
  variant?: "popup" | "inline"
  cart: StoreCart
  shippingOptions: StoreCartShippingOption[]
}) {
  if (!cart || !shippingOptions?.length) {
    return
  }

  // Check if any shipping options have a conditional price based on item_total
  const freeShippingPrice = shippingOptions
    .flatMap((shippingOption: any) => {
      if (!shippingOption.prices?.length) {
        return []
      }

      return shippingOption.prices
        .filter((price: any) =>
          price.currency_code === cart.currency_code &&
          (price.price_rules || []).some(
            (priceRule: any) => priceRule.attribute === "item_total"
          )
        )
        .map((price: any) => ({
          ...price,
          shipping_option_id: shippingOption.id,
          ...computeTarget(cart, price),
        }))
    })
    .filter(Boolean)
    // We focus here entirely on free shipping, but this can be edited to handle multiple layers
    // of reduced shipping prices.
    .find((price) => price?.amount === 0)

  if (!freeShippingPrice) {
    return
  }

  if (variant === "popup") {
    return <FreeShippingPopup cart={cart} price={freeShippingPrice} />
  } else {
    return <FreeShippingInline cart={cart} price={freeShippingPrice} />
  }
}

function FreeShippingInline({
  cart,
  price,
}: {
  cart: StoreCart
  price: StorePrice & {
    target_reached: boolean
    target_remaining: number
    remaining_percentage: number
  }
}) {
  return (
    <div className="bg-gray-900 border border-yellow-400/20 p-3 rounded-xl">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <div>
            {price.target_reached ? (
              <div className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                ✓ Envío gratis desbloqueado
              </div>
            ) : (
              `Desbloquea envío gratis`
            )}
          </div>

          <div
            className={clx({
              "opacity-0 invisible": price.target_reached,
            })}
          >
            Faltan{" "}
            <span className="text-white font-semibold">
              {convertToLocale({
                amount: price.target_remaining,
                currency_code: cart.currency_code,
              })}
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          <div
            className={clx(
              "h-1 rounded-full max-w-full duration-500 ease-in-out",
              {
                "bg-gradient-to-r from-yellow-400 to-yellow-300": price.target_reached,
                "bg-gradient-to-r from-yellow-400/60 to-yellow-400/30": !price.target_reached,
              }
            )}
            style={{ width: `${Math.min(price.remaining_percentage, 100)}%` }}
          />
          <div className="h-1 rounded-full flex-grow bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

function FreeShippingPopup({
  cart,
  price,
}: {
  cart: StoreCart
  price: StoreFreeShippingPrice
}) {
  const [isClosed, setIsClosed] = useState(false)

  return (
    <div
      className={clx(
        "fixed bottom-5 right-5 flex flex-col items-end gap-2 transition-all duration-500 ease-in-out z-10",
        {
          "opacity-0 invisible delay-1000": price.target_reached,
          "opacity-0 invisible": isClosed,
          "opacity-100 visible": !price.target_reached && !isClosed,
        }
      )}
    >
      <button
        className="w-7 h-7 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 transition-all"
        onClick={() => setIsClosed(true)}
      >
        ✕
      </button>

      <div className="w-[380px] bg-gray-900 border border-yellow-400/20 rounded-xl p-5 shadow-lg shadow-yellow-400/5">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-400">
            <div>
              {price.target_reached ? (
                <div className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                  ✓ Envío gratis desbloqueado
                </div>
              ) : (
                <span>Desbloquea envío gratis</span>
              )}
            </div>

            <div
              className={clx({
                "opacity-0 invisible": price.target_reached,
              })}
            >
              Faltan{" "}
              <span className="text-white font-semibold">
                {convertToLocale({
                  amount: price.target_remaining,
                  currency_code: cart.currency_code,
                })}
              </span>
            </div>
          </div>

          <div className="flex gap-1">
            <div
              className={clx(
                "h-1.5 rounded-full max-w-full duration-500 ease-in-out",
                {
                  "bg-gradient-to-r from-yellow-400 to-yellow-300": price.target_reached,
                  "bg-gradient-to-r from-yellow-400/60 to-yellow-400/30": !price.target_reached,
                }
              )}
              style={{ width: `${Math.min(price.remaining_percentage, 100)}%` }}
            />
            <div className="h-1.5 rounded-full flex-grow bg-gray-700" />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <LocalizedClientLink
            className="flex-1 rounded-lg bg-transparent border border-yellow-400/40 text-yellow-400 text-sm font-bold py-2.5 px-4 text-center hover:bg-yellow-400/10 hover:border-yellow-400 transition-all"
            href="/cart"
          >
            Ver carrito
          </LocalizedClientLink>

          <LocalizedClientLink
            className="flex-1 rounded-lg bg-yellow-400 text-gray-900 text-sm font-bold py-2.5 px-4 text-center hover:bg-yellow-300 transition-all"
            href="/store"
          >
            Ver productos
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
