"use client"
import React, { useEffect, useActionState } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { updateCustomerPassword } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const [state, formAction] = useActionState(updateCustomerPassword, {
    error: "",
    success: false,
  })

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  const clearState = () => setSuccessState(false)

  return (
    <form action={formAction} onReset={() => clearState()} className="w-full">
      <AccountInfo
        label="Contraseña"
        currentInfo={
          <span className="text-gray-500 italic text-xs">
            🔒 La contraseña está oculta por seguridad
          </span>
        }
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="grid grid-cols-1 small:grid-cols-2 gap-3">
          <Input
            label="Contraseña actual"
            name="old_password"
            required
            type="password"
            data-testid="old-password-input"
          />
          <Input
            label="Nueva contraseña"
            type="password"
            name="new_password"
            required
            data-testid="new-password-input"
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            name="confirm_password"
            required
            data-testid="confirm-password-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
