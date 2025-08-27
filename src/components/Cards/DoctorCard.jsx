import React from 'react'
import style from './cards.module.css'
import { Button } from '../Buttons/Button'
import { IconAndLabel } from '../common/IconAndLabel'
import { CalenderIcon, DirectoryIcon, ScheduleIcon, StethoscopeIcon } from '../Icons/SvgIcons'
import { StatusTag } from '../common/StatusTag'

export const DoctorCard = ({
  img,
  name,
  specility,
  date,
  time,
  status,
  isSmallCard,
  actionButtons,
  mobile,
  onPrimaryBtnClick,
  onSecondaryBtnClick,
  description,
  primaryBtnText,
  secondaryBtnText,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`${style.doctorCard_main_con} ${props.className} pointer`}
    >
      <div
        className={`flex justify-between ${isSmallCard ? 'flex-col' : 'items-center'
          }`}
      >
        <div className={`flex gap-4`}>
          <div className={`${style.doctorCard_image_con}`}>
            <img src={img} className={style.doctorCard_image} />
          </div>
          <div className='w-[100%]'>
            <div className={style.doctorCard_name}>{name}</div>
            <div className={`${!isSmallCard && 'flex'} items-center gap-3`}>
              {specility && <IconAndLabel icon={<StethoscopeIcon />} label={specility} />}
              {mobile && <div className='family-400'>{mobile}</div>}
              {!isSmallCard ? (
                <>
                  <IconAndLabel icon={<ScheduleIcon />} label={time} />
                  <IconAndLabel icon={<CalenderIcon />} label={date} />
                </>
              ) : (
                <div className='mt-[5px]'>
                  <StatusTag status={status} />
                </div>
              )}
            </div>
            {description && <IconAndLabel className="mt-[7px]" icon={<DirectoryIcon />} label={description} />}
          </div>
        </div>

        {!isSmallCard && (
          <>
            <div>{status}</div>
          </>
        )}

        {actionButtons && (
          <>
            <div
              className={`flex ${!isSmallCard ? 'flex-col ' : 'mt-3'} justify-end gap-4`}
            >
              {onPrimaryBtnClick && <div>
                <Button className={"text-nowrap"} primary onClick={(e) => {
                  onPrimaryBtnClick()
                  e.stopPropagation()
                }}>{primaryBtnText || "Verify"}</Button>
              </div>}
              {onSecondaryBtnClick && <div>
                <Button className={"text-nowrap"} bordered onClick={(e) => {
                  e.stopPropagation()
                  onSecondaryBtnClick()
                }}>{secondaryBtnText || "Reject"}</Button>
              </div>}
            </div>
          </>
        )}
      </div>
    </div>


  )
}
