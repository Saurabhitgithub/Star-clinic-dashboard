import React from 'react'
import style from './common.module.css'

export const IconAndLabel = ({ icon, label,className }) => {
  return (
    <div className={`${style.iconAndLabel_con} ${className} flex items-center gap-2`}>
      <div>{icon}</div>
      <div className={`${style.iconAndLabel_label}`}>{label}</div>
    </div>
  )
}
