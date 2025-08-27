import React, { Fragment } from 'react'
import style from "./common.module.css"
import { ArrowLeftIcon } from '../Icons/SvgIcons'
import { useNavigate } from 'react-router'

export const BreadCrum = ({ data, backUrl }) => {
    const navigate = useNavigate();
    return (
        <div className={`flex items-center ${style.breadcrum_main_con}`}>
            {backUrl && <><div className='pointer' onClick={() => backUrl ? navigate(backUrl) : navigate(-1)}><ArrowLeftIcon /></div>&nbsp;&nbsp;</>}
            {data?.map((res, ind) => {
                return (
                    <Fragment key={ind}>
                        <div onClick={()=>res.path && navigate(res.path)} className={`${res.path && "pointer"} ${style.breadcrum_item} ${res.active && style.active_breadcrumItem}`}>{res?.title}</div>
                        {ind < data.length - 1 && <div className='mx-1'>/</div>}
                    </Fragment>
                )
            })}
        </div>
    )
}
