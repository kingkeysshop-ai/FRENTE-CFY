import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type LineItemOptionsProps = {
  variant: any | undefined
  "data-testid"?: string
  "data-value"?: any
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  if (!variant?.title && !variant?.options?.length) {
    return null
  }

  const optionsText = variant.options
    ?.map((opt: any) => opt.value)
    .filter(Boolean)
    .join(", ")

  const display = variant.title || optionsText

  if (!display) return null

  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis"
    >
      {display}
    </Text>
  )
}

export default LineItemOptions
