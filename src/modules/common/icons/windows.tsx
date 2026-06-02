import React from "react"
import { IconProps } from "types/icon"

const Windows: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <path d="M3 5.5L11 4.5V11.5H3V5.5Z" fill="currentColor" />
      <path d="M3 18.5L11 19.5V12.5H3V18.5Z" fill="currentColor" />
      <path d="M12 4.5L21 3V11.5H12V4.5Z" fill="currentColor" />
      <path d="M12 12.5H21V21L12 19.5V12.5Z" fill="currentColor" />
    </svg>
  )
}

export default Windows
