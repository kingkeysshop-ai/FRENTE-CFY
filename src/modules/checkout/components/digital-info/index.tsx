"use client"

import { setDigitalInfo } from "@lib/data/cart"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { HttpTypes } from "@medusajs/types"
import { useActionState } from "react"

const DigitalInfo = ({
  cart,
}: {
  cart: HttpTypes.StoreCart
}) => {
  const [message, formAction] = useActionState(setDigitalInfo, null)

  return (
    <form action={formAction}>
      <div className="text-gray-400 text-sm mb-6 leading-relaxed">
        Todos tus productos son digitales. Solo necesitamos tu nombre y email para enviarte las claves.
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre"
          name="first_name"
          autoComplete="given-name"
          defaultValue={cart.shipping_address?.first_name || ""}
          required
        />
        <Input
          label="Apellido"
          name="last_name"
          autoComplete="family-name"
          defaultValue={cart.shipping_address?.last_name || ""}
          required
        />
      </div>
      <div className="mt-4">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={cart.email || ""}
          required
        />
      </div>
      <ErrorMessage error={message} />
      <SubmitButton className="mt-6 w-full py-3 bg-yellow-400 text-gray-900 font-black rounded-xl hover:bg-yellow-300 transition-all text-sm">
        Continuar al Pago
      </SubmitButton>
    </form>
  )
}

export default DigitalInfo
