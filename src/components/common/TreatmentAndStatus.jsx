import React from 'react';
import style from "./common.module.css"
import { StatusTag } from './StatusTag';

export const TreatmentAndStatus = ({ status, date, title,data }) => {
    const doctorName=data?.doctorDetails?.[0]?.name
    return (
        <div className={`${style.treatmentAndStatus} flex items-center gap-[30px]`}>
            <div className='flex-1'>
                <div className={style.treatmentAndStatus_header}>{title}</div>
                <div className={style.treatmentAndStatus_date}>{date}</div>
                <div className={style.doctor_name}>Dr {doctorName}</div>
            </div>
            {status && <StatusTag status={status} />}
        </div>
    )
};
