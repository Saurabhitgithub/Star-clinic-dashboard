import React, { useState } from 'react'
import { DeleteIcon } from '../Icons/SvgIcons'
import { CustomDialog } from '../Dialogs/CustomDialog'
import { Button } from './Button'

export const DeleteButton = ({
  data,
  confirmation,
  button,
  deleteTitle,
  deleteBody,
  onCancel,
  children,
  onDelete,
  ...props
}) => {
  const [dialog, setDialog] = useState(false);
  return (
    <>
      {!button && <DeleteIcon
        {...props}
        onClick={() => (confirmation ? setDialog(true) : onDelete(data))}
      />
      }
      {button && <Button
        onClick={() => (confirmation ? setDialog(true) : onDelete(data))}
        {...props}>{children}</Button>}
      <CustomDialog
        onCancel={() => {
          onCancel && onCancel()
          setDialog(false)
        }}
        open={dialog}
        title={deleteTitle || 'Delete'}
        size={'xs'}
      >
        <div className="family-500">{deleteBody || 'Are you your want to Delete ?'}</div>
        <div className='flex gap-4 mt-3'>
          <Button
            bordered
            fullWidth
            onClick={() => {
              onCancel && onCancel()
              setDialog(false)
            }}
          >
            Cancel
          </Button>
          <Button primary fullWidth onClick={() => {
            onDelete(data)
            setDialog(false)
          }}>
            Delete
          </Button>
        </div>
      </CustomDialog>
    </>
  )
}
