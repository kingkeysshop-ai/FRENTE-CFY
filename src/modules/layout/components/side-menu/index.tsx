"use client"

import { Fragment, useEffect, useRef } from "react"
import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { clx, useToggleState } from "@medusajs/ui"
import { usePathname } from "next/navigation"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

// ─── Constantes ────────────────────────────────────────────────────────────────

const SideMenuItems: Record<string, string> = {
  Inicio: "/",
  Tienda: "/store",
  "Mi Cuenta": "/account",
  Carrito: "/cart",
}

const MENU_ICONS: Record<string, string> = {
  Inicio: "🏠",
  Tienda: "🛒",
  "Mi Cuenta": "👤",
  Carrito: "🛍️",
}

const ANIMATION_DELAYS = [0, 60, 120, 180]

// ─── Tipos ─────────────────────────────────────────────────────────────────────

type SideMenuProps = {
  regions: any[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

// ─── Componente ────────────────────────────────────────────────────────────────

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const pathname = usePathname()

  // Inyecta la animación slideInLeft en el <head> una sola vez
  // Reemplaza el <style jsx> eliminado — compatible con Next.js 15 + React 19
  const styleInjected = useRef(false)
  useEffect(() => {
    if (styleInjected.current) return
    styleInjected.current = true

    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-20px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      .kk-slide-in {
        animation: slideInLeft 0.35s ease-out forwards;
      }
    `
    document.head.appendChild(style)
  }, [])

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              {/* ── Botón hamburguesa ── */}
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors duration-200 focus:outline-none"
                >
                  <span className="flex flex-col gap-[5px]">
                    <span className="block w-5 h-[2px] bg-current" />
                    <span className="block w-5 h-[2px] bg-current" />
                    <span className="block w-5 h-[2px] bg-current" />
                  </span>
                  <span className="hidden small:block">Menu</span>
                </Popover.Button>
              </div>

              {/* ── Backdrop ── */}
              {open && (
                <div
                  className="fixed inset-0 z- bg-black/60 backdrop-blur-sm pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              {/* ── Panel lateral ── */}
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-4"
              >
                <PopoverPanel className="flex flex-col absolute w-full sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z- inset-x-0 m-2">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-gray-900 border border-yellow-400/20 rounded-xl justify-between p-6 shadow-2xl shadow-black"
                  >
                    {/* ── Header ── */}
                    <div>
                      <div className="flex justify-between items-center mb-8">
                        <span className="text-lg font-black tracking-widest">
                          <span className="text-white">KING</span>
                          <span className="text-yellow-400"> KEYS</span>
                        </span>
                        <button
                          data-testid="close-menu-button"
                          onClick={close}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                          aria-label="Cerrar menú"
                        >
                          <XMark />
                        </button>
                      </div>

                      {/* ── Links de navegación ── */}
                      <ul className="flex flex-col gap-2">
                        {Object.entries(SideMenuItems).map(([name, href], index) => {
                          const isActive =
                            pathname === href ||
                            (href !== "/" && pathname.includes(href))

                          return (
                            <li
                              key={name}
                              className="kk-slide-in"
                              style={{
                                animationDelay: `${ANIMATION_DELAYS[index] ?? 0}ms`,
                                opacity: 0, // empieza invisible, la animación lo revela
                              }}
                            >
                              <LocalizedClientLink
                                href={href}
                                onClick={close}
                                data-testid={`${name.toLowerCase().replace(" ", "-")}-link`}
                                className={clx(
                                  "flex items-center gap-3 px-4 py-3 rounded-lg",
                                  "transition-all duration-200 text-base font-medium",
                                  isActive
                                    ? "text-yellow-400 bg-yellow-400/10 border-l-2 border-yellow-400 pl-[14px]"
                                    : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10"
                                )}
                              >
                                <span aria-hidden="true">{MENU_ICONS[name]}</span>
                                {name}
                              </LocalizedClientLink>
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    {/* ── Footer ── */}
                    <div className="flex flex-col gap-y-4 border-t border-gray-700 pt-4">
                      {!!locales?.length && (
                        <div
                          className="flex justify-between items-center text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}

                      {regions && (
                        <div
                          className="flex justify-between items-center text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors"
                          onMouseEnter={countryToggleState.open}
                          onMouseLeave={countryToggleState.close}
                        >
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              countryToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}

                      <p className="text-xs text-gray-600 text-center">
                        © {new Date().getFullYear()} King Keys. All rights reserved.
                      </p>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu