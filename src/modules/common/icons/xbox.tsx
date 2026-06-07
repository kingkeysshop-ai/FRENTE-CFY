import React from "react"
import { IconProps } from "types/icon"

const Xbox: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M7.5 7.5C7.5 7.5 10.5 10.5 12 12C13.5 10.5 16.5 7.5 16.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M7.5 16.5C7.5 16.5 10.5 13.5 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16.5 16.5C16.5 16.5 13.5 13.5 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="10" cy="16" r="0.5" fill="currentColor" />
      <circle cx="14" cy="16" r="0.5" fill="currentColor" />
    </svg>
  )
}

export default Xbox
