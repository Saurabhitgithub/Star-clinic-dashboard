import React from 'react'
import { FilterIcon } from '../Icons/SvgIcons'
import style from './buttons.module.css'

export const FilterButton = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`${props.className} ${style.filter_btn} flex items-center gap-2`}
    >
      {children} <FilterIcon />
    </button>
  )
}
