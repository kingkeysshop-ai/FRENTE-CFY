"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"
import { forwardRef, useId } from "react"

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

type KingSelectProps = {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  triggerClassName?: string
  name?: string
  required?: boolean
  "data-testid"?: string
}

const KingSelect = forwardRef<HTMLButtonElement, KingSelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Seleccionar...",
      className,
      triggerClassName,
      name,
      required,
      "data-testid": dataTestId,
    },
    ref
  ) => {
    const id = useId()
    const selectedLabel =
      options.find((o) => o.value === (value ?? defaultValue))?.label ?? ""

    return (
      <div className={className}>
        {name && (
          <input type="hidden" name={name} value={value ?? defaultValue ?? ""} />
        )}
        <SelectPrimitive.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          {...(name ? { name } : {})}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            id={id}
            className={`inline-flex items-center justify-between gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white px-4 py-2.5 rounded-xl hover:bg-[#2a2a2a] transition-colors focus:outline-none focus:border-[#facc15] data-[placeholder]:text-[#888888] cursor-pointer text-sm ${triggerClassName || ""}`}
            data-testid={dataTestId}
          >
            <SelectPrimitive.Value placeholder={placeholder}>
              {selectedLabel ||
                (value ?? defaultValue ? value ?? defaultValue : undefined)}
            </SelectPrimitive.Value>
            <SelectPrimitive.Icon asChild>
              <ChevronDown className="h-4 w-4 text-[#888888] shrink-0" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              position="popper"
              sideOffset={4}
              className="z-[9999] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-[#333] bg-[#0a0a0a] text-white shadow-lg"
            >
              <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-6 bg-[#0a0a0a] text-[#888888] cursor-default">
                <ChevronDown className="h-4 w-4 rotate-180" />
              </SelectPrimitive.ScrollUpButton>

              <SelectPrimitive.Viewport className="p-1">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className="relative flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer select-none outline-none data-[disabled]:text-[#555] data-[disabled]:pointer-events-none data-[highlighted]:bg-[#facc15] data-[highlighted]:text-black data-[state=checked]:bg-[#facc15] data-[state=checked]:text-black"
                  >
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>

              <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-6 bg-[#0a0a0a] text-[#888888] cursor-default">
                <ChevronDown className="h-4 w-4" />
              </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </div>
    )
  }
)

KingSelect.displayName = "KingSelect"

export default KingSelect
