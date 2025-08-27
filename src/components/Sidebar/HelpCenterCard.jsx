import React from 'react'
import style from './sidebar.module.css'
import { Button } from '../Buttons/Button'
import { BorderedQuestionIcon } from '../Icons/SvgIcons'

export const HelpCenterCard = () => {
  return (
    <div className={style.helpCenter_main_con}>
      <div className={style.question_mark_con}>
        <BorderedQuestionIcon />
      </div>

      <div className={style.help_center_heading}>Help Center</div>
      <div className={`${style.help_center_sub_heading} mt-[4px] `}>
        Etiam porta sem malesuada magna mollis euismod.
      </div>
      <Button className={'mt-[24px]'} fullWidth secondary>
        Go to help center
      </Button>
    </div>
  )
}
