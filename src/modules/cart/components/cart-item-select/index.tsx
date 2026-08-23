"use client"

import KingSelect, { type SelectOption } from "@modules/common/components/king-select"

type CartItemSelectProps = {
  value?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  className?: string
  "data-testid"?: string
}

const CartItemSelect = ({
  value,
  onValueChange,
  options,
  className,
  "data-testid": dataTestId,
}: CartItemSelectProps) => {
  return (
    <KingSelect
      options={options}
      value={value}
      onValueChange={onValueChange}
      className={className}
      triggerClassName="w-14 h-9 small:h-8 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs rounded-lg justify-center px-2"
      data-testid={dataTestId}
    />
  )
}

CartItemSelect.displayName = "CartItemSelect"

export default CartItemSelect
