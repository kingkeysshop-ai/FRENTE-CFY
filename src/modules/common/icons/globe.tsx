import React from "react"
import { IconProps } from "types/icon"

const Globe: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M2 12H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 2C14.5 4.5 15.8 8.2 16 12C15.8 15.8 14.5 19.5 12 22C9.5 19.5 8.2 15.8 8 12C8.2 8.2 9.5 4.5 12 2Z" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export default Globe
