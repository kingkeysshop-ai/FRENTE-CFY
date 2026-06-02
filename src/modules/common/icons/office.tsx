import React from "react"
import { IconProps } from "types/icon"

const Office: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <rect x="3" y="3" width="7" height="18" rx="1" fill="#D83B01" />
      <rect x="11" y="6" width="4" height="15" rx="1" fill="#0078D4" />
      <rect x="16" y="9" width="5" height="12" rx="1" fill="#00A4EF" />
      <circle cx="6.5" cy="7.5" r="1" fill="white" />
      <circle cx="13" cy="9" r="1" fill="white" />
      <circle cx="18.5" cy="12" r="1" fill="white" />
    </svg>
  )
}

export default Office
