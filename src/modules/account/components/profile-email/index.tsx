"use client"

import React, { useEffect, useActionState } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const updateCustomerEmail = async (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    const email = (formData.get("email") as string || "").trim()

    if (!email) {
      return { success: false, error: "El email es requerido." }
    }
    if (!EMAIL_RE.test(email)) {
      return { success: false, error: "Ingresa un email válido." }
    }

    try {
      await updateCustomer({ email })
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.message || "Error al actualizar el email." }
    }
  }

  const [state, formAction] = useActionState(updateCustomerEmail, {
    error: null,
    success: false,
  })

  const clearState = () => setSuccessState(false)

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  return (
    <form action={formAction} className="w-full">
      <AccountInfo
        label="Correo Electrónico"
        currentInfo={customer.email}
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error as string}
        clearState={clearState}
        data-testid="account-email-editor"
      >
        <div className="grid grid-cols-1 gap-3">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={customer.email}
            data-testid="email-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileEmail
