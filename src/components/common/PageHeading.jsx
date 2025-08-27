import React from 'react'
 import style from "./common.module.css"
 
export const PageHeading = ({ heading, subHeading }) => {
  return (
    <div className={style.pageHeading_con}>
      <h1 className={style.pageHeading}>{heading}</h1>
     {subHeading&& <p className={style.pageSubheading}><span className={style.showing_text}>Showing: </span>{subHeading}</p>}
    </div>
  )
}