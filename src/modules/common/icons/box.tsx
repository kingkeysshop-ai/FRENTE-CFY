import React from "react"
import { IconProps } from "types/icon"

const Box: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12 12L20 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12L4 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default Box
