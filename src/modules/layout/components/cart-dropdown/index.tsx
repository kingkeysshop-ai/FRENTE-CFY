"use client"

import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { ShoppingCart, ShoppingBag, Lock } from "lucide-react"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({ cart: cartState }: { cart?: HttpTypes.StoreCart | null }) => {
  const [activeTimer, setActiveTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems = cartState?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0
  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) clearTimeout(activeTimer)
    open()
  }

  useEffect(() => {
    return () => { if (activeTimer) clearTimeout(activeTimer) }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div className="h-full z-50" onMouseEnter={openAndCancel} onMouseLeave={close}>
      <Popover className="relative h-full">
        <PopoverButton className="h-full focus:outline-none">
          <LocalizedClientLink
            href="/cart"
            data-testid="nav-cart-link"
            className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#facc15] transition-colors duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden small:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#facc15] text-gray-900 text-xs font-black flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </LocalizedClientLink>
        </PopoverButton>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <PopoverPanel
            static
            className="hidden small:flex flex-col absolute top-[calc(100%+1px)] right-0 w-[380px] bg-[#111111] border border-[#2a2a2a] rounded-xl shadow-2xl shadow-black overflow-hidden"
            data-testid="nav-cart-dropdown"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#facc15]" />
                <h3 className="text-white font-black text-sm">Tu Carrito</h3>
              </div>
              {totalItems > 0 && (
                <span className="text-xs text-[#888888]">{totalItems} {totalItems === 1 ? "producto" : "productos"}</span>
              )}
            </div>

            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-auto max-h-[320px] flex flex-col divide-y divide-[#2a2a2a]/50 no-scrollbar">
                  {cartState.items
                    .sort((a: any, b: any) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
                    .map((item: any) => (
                      <div className="flex gap-3 p-4" key={item.id} data-testid="cart-item">
                        <LocalizedClientLink href={`/products/${item.product_handle}`} className="w-14 shrink-0">
                          <div className="rounded-lg overflow-hidden border border-[#2a2a2a]">
                            <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
                          </div>
                        </LocalizedClientLink>
                        <div className="flex flex-col flex-1 min-w-0 gap-1">
                          <LocalizedClientLink href={`/products/${item.product_handle}`} data-testid="product-link">
                            <p className="text-white text-xs font-semibold truncate hover:text-[#facc15] transition-colors">
                              {item.title}
                            </p>
                          </LocalizedClientLink>
                          <LineItemOptions variant={item.variant} data-testid="cart-item-variant" data-value={item.variant} />
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-[#888888]" data-testid="cart-item-quantity">x{item.quantity}</span>
                            <span className="text-[#facc15] font-bold text-xs">
                              <LineItemPrice item={item} style="tight" currencyCode={cartState.currency_code} />
                            </span>
                          </div>
                          <DeleteButton id={item.id} className="mt-1 text-xs text-[#888888] hover:text-red-400 transition-colors w-fit" data-testid="cart-item-remove-button">
                            Eliminar
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="p-4 flex flex-col gap-3 border-t border-[#2a2a2a] bg-[#1a1a1a]/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[#888888] text-xs">Subtotal</span>
                    <span className="text-white font-black text-sm" data-testid="cart-subtotal">
                      {convertToLocale({ amount: subtotal, currency_code: cartState.currency_code })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" onClick={close}>
                    <button className="w-full py-2.5 bg-[#facc15] text-gray-900 font-black text-sm rounded-lg hover:bg-[#e6b800] transition-colors" data-testid="go-to-cart-button">
                      <ShoppingCart className="w-4 h-4" /> Ver Carrito
                    </button>
                  </LocalizedClientLink>
                  <LocalizedClientLink href="/checkout" onClick={close}>
                    <button className="w-full py-2.5 border border-[#facc15]/40 text-[#facc15] text-xs font-bold rounded-lg hover:bg-[#facc15]/10 transition-colors">
                      <Lock className="w-3.5 h-3.5" /> Ir al Checkout
                    </button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <ShoppingCart className="w-12 h-12 text-[#4a4a4a]" />
                <p className="text-[#888888] text-sm">Tu carrito está vacío</p>
                <LocalizedClientLink href="/store" onClick={close}>
                  <button className="px-5 py-2 bg-[#facc15] text-gray-900 text-xs font-bold rounded-lg hover:bg-[#e6b800] transition-colors flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Ver Productos
                  </button>
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown