import React from "react"

type CheckboxProps = {
  checked?: boolean
  onChange?: () => void
  label: string
  name?: string
  'data-testid'?: string
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name,
  'data-testid': dataTestId
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="checkbox"
        checked={checked}
        onChange={onChange}
        name={name}
        data-testid={dataTestId}
        className="w-4 h-4 rounded border-[#2a2a2a] bg-[#1a1a1a] text-[#facc15] focus:ring-yellow-400/50 focus:ring-2 accent-yellow-400 cursor-pointer"
      />
      <label
        htmlFor="checkbox"
        className="text-[#facc15] text-sm font-semibold cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  )
}

export default CheckboxWithLabel
