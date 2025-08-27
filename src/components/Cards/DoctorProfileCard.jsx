import React from 'react'
import style from './cards.module.css'
import { Divider } from '@mui/material'
import { RatingStars } from '../common/RatingStars'

export const DoctorProfileCard = ({
  img,
  Id,
  rating,
  name,
  speciality,
  email,
  address,
  mobile
}) => {
  return (
    <div className={style.doctorProfileCard_container}>
      <div>
        <div className={style.profile_image_con}>
          <img src={img} className={style.profile_image} />
        </div>

        <div className={style.userid}>{Id}</div>
        <div className={`flex justify-center items-center gap-2 family-500 ${style.rating_con}`}>
          <RatingStars length={1} rating={1} />
          {rating}
        </div>
        <div className={style.username}>{name}</div>
        <div className={style.specialist_text}>{speciality}</div>
        <Divider />

        <div className='grid gap-y-[10px] mt-4 grid-cols-[1fr_170px] items-center'>
          <div className={style.grid_label}>Phone Number</div>
          <div className={style.grid_value}>{mobile}</div>
          <div className={style.grid_label}>Email</div>
          <div className={style.grid_value}>{email}</div>
          {address && <> <div className={style.grid_label}>Address</div>
            <div className={style.grid_value}>{address}</div></>}
        </div>
      </div>
    </div>
  )
}
