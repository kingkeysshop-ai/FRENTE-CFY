import React from "react"
import { IconProps } from "types/icon"

const Store: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <path d="M3 9L12 3L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M9 22V12H15V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 5L7.01 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M9 3L9.01 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default Store
