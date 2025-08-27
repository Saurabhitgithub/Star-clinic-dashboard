import React from 'react';
import { InfoCard } from './InfoCard';
import style from "./cards.module.css";
import { convertDateIntoDateAndTimeSeprate } from '../../utils';
export const UpcomingCounclingCard = ({ heading, data,className,doctorName }) => {
 
   
    return (
        <div className={`${style.UpcomingCounclingCard_con} ${className}`}>
            <InfoCard heading={heading}>
                {!(!!data?.length)&&<div className='font_manrope mt-4'>No Appointments available...</div>}
                <div className='max-h-[400px] overflow-auto'>
                    {data?.map((res, ind) => {
                        console.log(res)
                        return (
                            <div key={ind} className={`${style.upcomingCouncling_item_con} mt-4`}>
                                <div className={style.UpcomingCounclingCard_title}>{res?.symptoms || "--"}</div>
                                {/* <div className={style.UpcomingCounclingCard_description}>{res.description}</div> */}
                                <div className='flex justify-between mt-[10px]'>
                                    <div className={style.UpcomingCounclingCard_doctor_name}>{res.doctorDetails?.[0]?.name || doctorName}</div>
                                    <div className={style.UpcomingCounclingCard_date}>  {res?.booking_date?.replace('T', ' ').slice(0, 16)}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </InfoCard>
        </div>
    )
}
 