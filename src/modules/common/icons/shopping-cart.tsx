import React from "react"
import { IconProps } from "types/icon"

const ShoppingCart: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 1H5L7.68 14.39C7.77144 14.8507 8.02191 15.2672 8.38755 15.5649C8.75318 15.8627 9.2107 16.0239 9.68 16.02H19.4C19.8693 16.0239 20.3268 15.8627 20.6925 15.5649C21.0581 15.2672 21.3086 14.8507 21.4 14.39L23 6H6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export default ShoppingCart
