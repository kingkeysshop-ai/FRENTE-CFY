import React from "react"
import { IconProps } from "types/icon"

const Vpn: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <rect x="4" y="8" width="16" height="13" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M8 8V6C8 3.8 9.5 2 12 2C14.5 2 16 3.8 16 6V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="15" r="2" fill={color} />
      <path d="M12 15V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 19V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default Vpn
