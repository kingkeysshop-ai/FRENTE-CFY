import React from "react"
import { IconProps } from "types/icon"

const Lock: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M8 11V7C8 4.8 9.5 3 12 3C14.5 3 16 4.8 16 7V11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="12" cy="16" r="1.5" fill={color} />
    </svg>
  )
}

export default Lock
