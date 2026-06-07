import React from "react"
import { IconProps } from "types/icon"

const Office: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 18V6l10.5-4L20 4v16l-5.5 2zm0 0l10 .5V6L8.5 7.5v8z" />
    </svg>
  )
}

export default Office
