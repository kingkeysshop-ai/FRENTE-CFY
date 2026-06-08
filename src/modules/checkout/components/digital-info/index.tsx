"use client"

import { setDigitalInfo } from "@lib/data/cart"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { HttpTypes } from "@medusajs/types"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

const DigitalInfo = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
}) => {
  const router = useRouter()
  const [message, formAction] = useActionState(setDigitalInfo, null)

  useEffect(() => {
    if (typeof message === "string" && message.startsWith("/")) {
      router.push(message)
    }
  }, [message, router])

  return (
    <form action={formAction}>
      <div className="text-[#888888] text-sm mb-6 leading-relaxed">
        Todos tus productos son digitales. Solo necesitamos tu nombre y email para enviarte las claves.
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre"
          name="first_name"
          autoComplete="given-name"
          defaultValue={cart.shipping_address?.first_name || customer?.first_name || ""}
          required
        />
        <Input
          label="Apellido"
          name="last_name"
          autoComplete="family-name"
          defaultValue={cart.shipping_address?.last_name || customer?.last_name || ""}
          required
        />
      </div>
      <div className="mt-4">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={cart.email || customer?.email || ""}
          required
        />
      </div>
      <ErrorMessage error={message && !message.startsWith("/") ? message : null} />
      <SubmitButton className="mt-6 w-full py-3 bg-[#facc15] text-[#0a0a0a] font-black rounded-xl hover:bg-[#e6b800] transition-all text-sm">
        Continuar al Pago
      </SubmitButton>
    </form>
  )
}

export default DigitalInfo
