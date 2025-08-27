import React from 'react'
import style from './pagesHeaders.module.css'
import { PageHeading } from '../common/PageHeading'
import { Input } from '../Inputs/Input';

export const DoctorsHeader = ({ onSearch, searchValue }) => {
  return (
    <section className={style.doctorApprovalHeader_con}>
      <div className='flex items-center'>
        <div>
          <PageHeading heading={'Doctors'} subHeading={'All Doctors'} />
        </div>

        <div className='flex text-nowrap gap-[10px] flex-1 items-center'>
          <div className='w-[100%] flex justify-end items-center'>
            <Input placeholder='Search' onChange={onSearch} value={searchValue} className={''} />
          </div>
          {/* <FilterButton>Filter</FilterButton> */}
        </div>
      </div>
    </section>
  )
}
