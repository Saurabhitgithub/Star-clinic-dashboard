import React from 'react';
import style from "./buttons.module.css";

export const IconButton = ({ children, className, ...props }) => {
    return (
        <button className={`${style.iconButton_container} ${className}`} {...props} >
            {children}
        </button>
    )
}
