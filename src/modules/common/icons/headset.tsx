import React from "react"
import { IconProps } from "types/icon"

const Headset: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <path d="M4 13.5V15C4 16.5 4.5 18 6 18H7V12H6C4.5 12 4 12.5 4 13.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M20 13.5V15C20 16.5 19.5 18 18 18H17V12H18C19.5 12 20 12.5 20 13.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M7 12V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M15 18V20C15 21 14.5 22 13 22H11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default Headset
