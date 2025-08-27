import React, { useState } from 'react'
import { CustomDialog } from './CustomDialog';
import { Button } from '../Buttons/Button';

export const ConfirmationDialog = ({ onConfirm, data, title, body, secondaryBtnText, primaryBtnText, children, size, onCancel }) => {

    const [dialog, setDialog] = useState(false);

    return (
        <>
            <div onClick={() => setDialog(true)}>{children}</div>
            <CustomDialog
                onCancel={() => {
                    onCancel && onCancel()
                    setDialog(false)
                }}
                open={dialog}
                title={title || 'Delete'}
                size={size || 'xs'}
            >
                <div className='family-600'>{body}</div>
                <div className='flex gap-4 mt-3'>
                    <Button
                        bordered
                        fullWidth
                        onClick={() => {
                            onCancel && onCancel()
                            setDialog(false)
                        }}
                    >
                        {secondaryBtnText}
                    </Button>
                    <Button primary fullWidth onClick={() => {
                        setDialog(false)
                        onConfirm(data)
                        }}>
                        {primaryBtnText}
                    </Button>
                </div>
            </CustomDialog>
        </>
    )
}
