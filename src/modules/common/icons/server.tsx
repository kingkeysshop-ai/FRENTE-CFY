import React from "react"
import { IconProps } from "types/icon"

const Server: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <rect x="3" y="2" width="18" height="6" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="3" y="10" width="18" height="6" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="3" y="18" width="18" height="4" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="7" cy="5" r="1" fill={color} />
      <circle cx="7" cy="13" r="1" fill={color} />
    </svg>
  )
}

export default Server
