"use client"

import KingSelect, { type SelectOption } from "@modules/common/components/king-select"
import {
  forwardRef,
  type SelectHTMLAttributes,
} from "react"

export type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  children?: React.ReactNode
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "children">

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ placeholder = "Seleccionar...", className, children, ...props }) => {
    const options: SelectOption[] = []
    if (children) {
      const childrenArray = Array.isArray(children) ? children : [children]
      for (const child of childrenArray) {
        if (child && typeof child === "object" && "props" in child) {
          const c = child as any
          if (c.props?.value !== undefined) {
            options.push({
              value: String(c.props.value),
              label: c.props.children ?? String(c.props.value),
              disabled: c.props.disabled ?? false,
            })
          }
        }
      }
    }

    return (
      <div className={className}>
        <KingSelect
          options={options}
          value={props.value != null ? String(props.value) : undefined}
          defaultValue={props.defaultValue != null ? String(props.defaultValue) : undefined}
          onValueChange={(val) => {
            props.onChange?.({
              target: { value: val, name: props.name },
            } as React.ChangeEvent<HTMLSelectElement>)
          }}
          placeholder={placeholder}
          name={props.name}
          required={props.required}
          data-testid={(props as Record<string, unknown>)["data-testid"] as string}
        />
      </div>
    )
  }
)

NativeSelect.displayName = "NativeSelect"

export default NativeSelect
