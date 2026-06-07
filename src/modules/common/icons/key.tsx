import React from "react"
import { IconProps } from "types/icon"

const Key: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <circle cx="8" cy="15" r="4" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M11 12L18 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 9L17 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 11.5L14.5 13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 8L18.5 10.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default Key
