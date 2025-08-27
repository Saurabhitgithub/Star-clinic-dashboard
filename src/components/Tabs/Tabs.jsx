import React from 'react';
import style from "./tabs.module.css"

export const Tabs = ({ tabData, activeIndex, onTabClick, className, ...props }) => {
    return (
        <div className={`${style.tabs_main_con} ${className}`} {...props}>
            <div className='flex gap-[10px]'>
                {tabData.map((res, ind) => {
                    return (
                        <div key={ind}
                            onClick={() => onTabClick(ind)}
                            className={`${style.tab_item} ${activeIndex == ind && style.active_tab_item}`}
                        >{res.title}</div>
                    )
                })}
            </div>
        </div>
    )
}
