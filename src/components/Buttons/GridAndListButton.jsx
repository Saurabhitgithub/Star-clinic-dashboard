import React from 'react'
import { GridIcon, ListIcon } from '../Icons/SvgIcons'
import style from "./buttons.module.css"

export const GridAndListButton = ({ onClick, value }) => {

    return (
        <div className={style.gridAndlistButton_main_con}>
           
            <div onClick={() => onClick("list")} className={`${style.gridListButton} pointer ${value === "list" && style.gridListActiveButton}`}><ListIcon /></div>
            <div onClick={() => onClick("grid")} className={`${style.gridListButton} pointer ${value === "grid" && style.gridListActiveButton}`}><GridIcon /></div>
        </div>
    )
}
