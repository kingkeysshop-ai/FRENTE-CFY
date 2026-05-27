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
        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-yellow-400 focus:ring-yellow-400/50 focus:ring-2 accent-yellow-400 cursor-pointer"
      />
      <label
        htmlFor="checkbox"
        className="text-yellow-400 text-sm font-semibold cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  )
}

export default CheckboxWithLabel
