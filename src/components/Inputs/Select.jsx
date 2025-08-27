import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

export const AutocompleteSelect = ({ label, error = false, ...props }) => {
    let inputFieldStyle = {
        '& .MuiOutlinedInput-root': {
            border: "1px solid red",
            '&:hover fieldset': {
                borderColor: 'var(--input-border-color-hovered)',
            },
            '&.Mui-focused fieldset': {
                border: "1px solid var(--input-border-color-focused)"
            },
        },
        '& .MuiOutlinedInput-root fieldset': {
            borderRadius: "8px",
            border: "1px solid var(--input-border-color-default)"
        },


    }
    return (
        <Autocomplete
            disablePortal
            {...props}
            sx={{
                '.MuiAutocomplete-inputRoot': {
                    minHeight: '40px',
                    alignItems: 'center',
                    border: "none !important",
                    fontWeight: "400",
                    fontFamily: "var(--font-family-400)"
                },
                '.MuiOutlinedInput-root': {
                    padding: '0 2px',
                },
                ...inputFieldStyle
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    error={error}
                    label={label}
                    slotProps={{
                        inputLabel: {
                            shrink: false,
                            sx: {
                                position: 'absolute',
                                top: '-6px',
                                left: '-5px',
                                fontSize: '0.85rem',
                                pointerEvents: 'none',
                                transition: 'opacity 0.2s ease-out',
                                color: "red",
                                opacity: params.inputProps.value ? 0 : 1,
                                fontFamily: "var(--font-family-700)",
                                fontSize: "14px",
                                fontWeight: "400",
                                lineHeight: "20px",
                                letterSpacing: "0.012em",
                                color: "#64748B",

                            },
                        },
                        inputProps: {
                            ...params.InputProps,
                            sx: {
                                minHeight: '40px',
                                padding: '0 10px',

                            },
                        }
                    }}

                />
            )}
        />
    );
};
