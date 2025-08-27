import React from 'react'
import style from "./common.module.css"

export const ImageLabelValue = ({ img, label, value }) => {
    return (
        <div className={`${style.imageLabelValue_main_con} flex items-center gap-[10px]`}>
            {img && <img className='w-[30px] h-[30px] rounded-full' src={img} />}
            <div>
                <div className={style.imageLabelValue_label_text}>{label}</div>
                <div className={style.imageLabelValue_value_text}>{value}</div>
            </div>
        </div>
    )
}
