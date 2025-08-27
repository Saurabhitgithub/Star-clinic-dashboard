import React from 'react'
import style from './lists.module.css'

export const ListByDot = ({ data, title,className,...props }) => {
  return (
    <div className={`${style.listByDot_main_container} ${className}`} {...props}>
      <div className={style.listByDot_title1}>{title}</div>

      {data?.map((res, ind) => {
        return (
          <div key={ind} className='mt-[20px]'>
            <div className={style.viewDoctor_title2}>
              <span className={style.blackDot}></span>
             {res.title}
            </div>
            <div className={style.basic_text}>{res.body}</div>
          </div>
        )
      })}
    </div>
  )
}
