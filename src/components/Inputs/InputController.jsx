import React from 'react'
import { Controller } from 'react-hook-form'
import { Input } from './Input'

export const InputController = ({ name, control, required, error, placeholder, label, rules,...props }) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={null}
            rules={rules}
            render={({ field: { value, onChange } }) => {
                return (
                    <Input
                        required={required}
                        error={error}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        label={label}
                        {...props}
                    />
                )
            }}
        />
    )
}
