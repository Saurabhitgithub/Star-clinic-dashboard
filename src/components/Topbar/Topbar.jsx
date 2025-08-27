import React from 'react';
import style from "./topbar.module.css"
import { Logo } from '../Logo/Logo';
import { IconButton } from '../Buttons/IconButton';
import { InfoIcon, MsgIcon, ThreeDotIcon } from '../Icons/SvgIcons';
import { UserProfileImg } from '../common/UserProfileImg';
import img from "../../assets/images/Avatar.png"
import { getUserData } from '../../utils';

export const Topbar = () => {
    return (
        <div className={`${style.topbar_main_container}`}>
            <div>
                <Logo whiteText />
            </div>
            <div className='flex gap-[10px] items-center'>

                <div className='flex items-center gap-[10px]'>
                    <div>
                        <UserProfileImg img={img} />
                    </div>
                    <div className='text-white'>
                        <div className={style.userName_text}>{getUserData()?.name}</div>
                        <div className={style.userEmail_text}>{getUserData()?.email_address}</div>
                    </div>
                </div>

            </div>
        </div>
    )
}
