import React from 'react'
import style from "./cards.module.css"
import { IconAndLabel } from '../common/IconAndLabel'
import { CalenderIcon, DirectoryIcon, ScheduleIcon, StethoscopeIcon } from '../Icons/SvgIcons'

export const DoctorAppointmentProfileCard = ({ img, name, speciality, date, time, description }) => {
  return (
    <div className={`${style.doctorAppointmentProfileCard_con} grid grid-cols-[64px_1fr] gap-[16px]`}>
      <div>
        <img className={style.doctorAppointment_profile_img} src={img} />
      </div>
      <div>
        <div className={style.doctorAppontment_name}>{name}</div>
        <div>
          <div className='flex gap-3 my-1'>
            <IconAndLabel icon={<StethoscopeIcon />} label={speciality} />
            <IconAndLabel icon={<ScheduleIcon />} label={time} />
            <IconAndLabel icon={<CalenderIcon />} label={date} />
          </div>
          <IconAndLabel className={"mt-2"} icon={<DirectoryIcon />} label={description} />
        </div>
      </div>
    </div>
  );
};
