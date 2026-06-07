import React from "react"
import { IconProps } from "types/icon"

const Gift: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <rect x="3" y="8" width="18" height="4" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M12 8V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 20H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 12V20" stroke={color} strokeWidth="1.5" />
      <path d="M17 12V20" stroke={color} strokeWidth="1.5" />
      <path d="M7 8C7 5.8 8.5 4 12 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M17 8C17 5.8 15.5 4 12 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export default Gift
