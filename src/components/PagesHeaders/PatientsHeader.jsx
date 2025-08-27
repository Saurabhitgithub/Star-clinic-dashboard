import React from 'react'
import { PageHeading } from '../common/PageHeading'
import { Input } from '../Inputs/Input';
import style from "./pagesHeaders.module.css";

export const PatientsHeader = ({searchValue,onSearch}) => {
  return (
    <section className={style.doctorApprovalHeader_con}>
      <div className='flex items-center'>
        <div>
          <PageHeading heading={'Patients'} subHeading={'All Patients'} />
        </div>

        <div className='flex text-nowrap gap-[10px] flex-1 items-center'>
          <div className='w-[100%] flex justify-end items-center'>
            <Input
              value={searchValue}
              onChange={onSearch}
              search
              placeholder='Search'
            />
          </div>
        
        </div>
      </div>
    </section>
  )
}
