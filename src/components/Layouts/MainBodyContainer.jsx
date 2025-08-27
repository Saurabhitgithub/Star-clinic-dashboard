import React from 'react'
import style from "./layouts.module.css"
export const MainBodyContainer = ({children}) => {
  return (
    <div className={style.mainBodyContainer_con}>{children}</div>
  )
}
