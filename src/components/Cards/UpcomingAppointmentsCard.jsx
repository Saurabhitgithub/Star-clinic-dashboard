import React from 'react'
import style from "./cards.module.css"
import { ImageLabelValue } from '../common/ImageLabelValue'
import { Button } from '../Buttons/Button'
import { CalenderIcon, PatientsIcon } from '../Icons/SvgIcons'

export const UpcomingAppointmentsDoctorCard = ({ name, img, speciality, date, patientName, time, onCancel, onReschedule }) => {
    return (
        <div className={style.upcomingAppointmentDoctorCard_main_con}>
            <ImageLabelValue img={img} value={speciality} label={name} />
            <div className={`family-400 mt-1 flex items-center gap-1 ${style.imageLabelValue_label_text}`}> <PatientsIcon /> {patientName}</div>
            <div className={`${style.upcomingAppointmentDoctorCard_dateTime_con} my-[20px] flex gap-3`}>
                <div>{date}</div>
                <div className='border'></div>
                <div>{time}</div>
            </div>
            {/* <div className="flex justify-between gap-3">
                <Button bordered>Cancel</Button>
                <Button primary icon={<CalenderIcon fill={"white"} />}>Reschedule</Button>
            </div> */}
        </div>
    )
}




