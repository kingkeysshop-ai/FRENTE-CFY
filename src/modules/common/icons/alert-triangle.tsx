import React from "react"
import { IconProps } from "types/icon"

const AlertTriangle: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...attributes}>
      <path d="M12 9V13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55296 18.995C1.55296 19.3447 1.64537 19.6876 1.82 19.99C1.99463 20.2925 2.2457 20.5435 2.54824 20.7182C2.85079 20.8928 3.19369 20.9852 3.5434 20.9852H20.4566C20.8063 20.9852 21.1492 20.8928 21.4518 20.7182C21.7543 20.5435 22.0054 20.2925 22.18 19.99C22.3546 19.6876 22.447 19.3447 22.447 18.995C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2805 3.32312 12.9811 3.15448C12.6818 2.98585 12.3437 2.89726 12 2.89726C11.6563 2.89726 11.3182 2.98585 11.0189 3.15448C10.7195 3.32312 10.4683 3.56611 10.29 3.86Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12 16.5C12.2761 16.5 12.5 16.2761 12.5 16C12.5 15.7239 12.2761 15.5 12 15.5C11.7239 15.5 11.5 15.7239 11.5 16C11.5 16.2761 11.7239 16.5 12 16.5Z" fill={color} />
    </svg>
  )
}

export default AlertTriangle
