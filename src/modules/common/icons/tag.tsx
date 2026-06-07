import React from "react"
import { IconProps } from "types/icon"

const Tag: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L3 13V3H13L20.59 10.59C20.9625 10.9625 21.1716 11.4705 21.1716 12C21.1716 12.5295 20.9625 13.0375 20.59 13.41Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="8" cy="8" r="1.5" fill={color} />
    </svg>
  )
}

export default Tag
