
import React, { useEffect } from 'react'
import style from './pagesHeaders.module.css'
import { PageHeading } from '../common/PageHeading'
import { Input } from '../Inputs/Input'
import { Button } from '../Buttons/Button'
import { useNavigate } from 'react-router'
const SafeAndSurgeryHeader = ({ onSearch, searchValue }) => {
const navigate = useNavigate()
  return (
     <section className={style.doctorApprovalHeader_con}>
          <div className='flex items-center'>
            <div>
              <PageHeading
                heading={'Safe Surgery'}
                subHeading={'All Consultations of All Healthcare Providers'}
              />
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
              <Button primary addIcon onClick={() => navigate('add')}>
                Add
              </Button>
            </div>
          </div>
        </section>
  )
}

export default SafeAndSurgeryHeader