import React from 'react'
import { AddIcon } from '../Icons/SvgIcons'

export const Button = ({
  children,
  addIcon,
  fullWidth,
  icon,
  primary,
  secondary,
  className,
  bordered,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`
        ${className}
        ${fullWidth && 'w-[100%]'}
        btn
        ${primary && 'primary_btn'}
        ${secondary && 'secondary_btn'}
        ${bordered && 'bordered_btn'}
        `}
    >
      {addIcon && (
        <>
          <AddIcon />
          &nbsp;
          &nbsp;
        </>
      )}
      {icon && <>{icon}&nbsp;&nbsp;</>} {children}
    </button>
  )
}
