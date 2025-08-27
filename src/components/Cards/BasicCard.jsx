import React from 'react'
import style from "./cards.module.css"

export const BasicCard = ({ children,className, ...props }) => {
  return <div {...props} className={`${className} ${style.basicCard_con}`}>{children}</div>
}
