import React from 'react';
import style from "./cards.module.css"

export const IconLabelCard = ({ heading, colDirection, smallCard, value, mediumCard, value2, icon, }) => {
  return (
    <div className={`${style.iconLabelCard_con} ${mediumCard && style.mediumCard_con}`}>

      {smallCard && <div className={`flex gap-5  ${colDirection && "flex-col text-center gap-[8px]"}  items-center`}>
        <div className={`${style.imagecon}`}>
          {icon}
        </div>
        <div>
          <div className={style.iconLabelCard_heading}>{heading}</div>
          <div className={style.iconLabelCard_value}>{value}</div>
        </div>
      </div>
      }
      {mediumCard && <div>
        <div className='flex items-center gap-[13px]'>
          <div>{icon}</div>
          <div className={style.iconLabelCard_value}>{heading}</div>
        </div>
        <div className={`${style.iconLabelCard_heading} mt-[15px]`}>{value}</div>
        <div className={`${style.iconLabelCard_value2} text-sm`}>{value2}</div>
      </div>

      }




    </div>
  )
}
