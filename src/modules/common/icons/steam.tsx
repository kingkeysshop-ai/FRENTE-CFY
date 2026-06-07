import React from "react"
import { IconProps } from "types/icon"

const Steam: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M14 10L16.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="16.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  )
}

export default Steam
