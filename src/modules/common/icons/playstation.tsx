import React from "react"
import { IconProps } from "types/icon"

const Playstation: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M8.5 8V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.5 9.5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default Playstation
