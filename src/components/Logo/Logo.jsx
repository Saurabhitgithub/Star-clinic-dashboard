import React from 'react'
import logoIcon from "../../assets/images/logoIcon.png"
import style from "./logo.module.css"

export const 
Logo = ({whiteText}) => {
    return (
        <div className={`${style.logo_main_container} flex gap-[11px]`}>
            <img src={logoIcon} alt='logo' />
        </div>
    )
}























