import React, { useEffect } from 'react'
import style from './pagesHeaders.module.css'
import { PageHeading } from '../common/PageHeading'
import { Input } from '../Inputs/Input'
import { Button } from '../Buttons/Button'
import { useNavigate } from 'react-router'

export const SplashScreenHeader = ({ onSearch, searchValue }) => {
  const navigate = useNavigate()

  return (
    <section className={style.doctorApprovalHeader_con}>
      <div className='flex items-center'>
        <div>
          <PageHeading
            heading={'Splash Screen Management'}
            subHeading={'Manage Splash Screen'}
          />
        </div>

      </div>
    </section>
  )
}