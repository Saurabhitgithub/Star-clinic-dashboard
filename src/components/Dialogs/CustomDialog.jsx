import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import style from './dialogs.module.css'
import { CrossIcon } from '../Icons/SvgIcons'

export const CustomDialog = ({
  title,
  className,
  children,
  onCancel,
  size,
  ...props
}) => {
  return (
    <Dialog

    fullWidth={true}
    maxWidth={size}
    {...props}
    sx={{
        "& .MuiPaper-root": {
          borderRadius: "20px", // Customize the border radius
        },
      }}
      className={`${className} ${style.customDialog_container}`}
    >
      <DialogTitle className={style.customDialog_title}>
        <div className='flex justify-between items-center'>
          <div>{title}</div>
          <CrossIcon className="pointer" onClick={onCancel&& onCancel} />
        </div>
      </DialogTitle>
      <DialogContent className={style.customDialog_content}>{children}</DialogContent>
    </Dialog>
  )
};
