import React from 'react';
import style from "./common.module.css"


export const UserProfileImg = ({ img }) => {
    return (
        <div className={style.userProfile_img_con}>
            <img src={img} />
        </div>
    )
}
