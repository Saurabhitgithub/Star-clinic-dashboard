import React from 'react'
import style from "./cards.module.css"
import { Button } from '../Buttons/Button'

export const PlanPurchasedUserCard = ({ name, img, date, email, plan, expires, onCancel }) => {
    return (
        <div className={style.planPurchasedUserCard_con}>
            <img src={img} alt="User" />
            <div className={style.planPurchasedCard_name}>{name}</div>
            <div className={style.planPurchasesCard_date}>{date}</div>
            <div className={style.planPurchasesCard_email}>{email}</div>
            <div className={style.planPurchasesCard_plan}>{plan}</div>
            <div className={style.planPurchasesCard_expires}>Expires: {expires}</div>
            <Button bordered onClick={onCancel}>Cancel</Button>
        </div>
    )
}
