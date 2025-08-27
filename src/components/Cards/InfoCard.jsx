import React from 'react'
import style from "./cards.module.css"

export const InfoCard = ({ heading, headerTemplate, headingStyle, children,className,...props }) => {
    return (
        <div className={`${style.infocard_main_con} ${className}`} {...props}>
            <div className={style.infoCard_heading} style={{...headingStyle}}>{heading}</div>
            {headerTemplate && headerTemplate}
            {children}
        </div>
    )
}
