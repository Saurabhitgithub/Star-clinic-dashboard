import React from 'react';
import style from "./cards.module.css"
import { Divider } from '@mui/material';
import { BasicCard } from './BasicCard';

export const PatientProfileCard = ({ img, age, name, email, gender, mobile }) => {

    return (

        <div className={style.patientProfileCard_container}>
            <BasicCard>
                <div className="flex items-center gap-4">
                    <div>
                        <img src={img} className={style.patientProfileCard_img} />
                    </div>

                    <div className='flex-1'>
                        <div className='flex justify-between'>
                            <div>
                                <div className={style.username}>{name}</div>
                                {/* <div className={style.userid}>NDU-POID</div> */}
                            </div>

                        </div>
                        <div className="my-2">
                            <Divider />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <div className={style.grid_label}>Gender</div>
                                <div className={style.grid_value}>{gender}</div>
                            </div>
                            <div>
                                <div className={style.grid_label}>Age</div>
                                <div className={style.grid_value}>{age}</div>
                            </div>
                            <div>
                                <div className={style.grid_label}>Contact</div>
                                <div className={style.grid_value}>{mobile}</div>
                            </div>

                        </div>

                    </div>


                </div>

                <div className='mt-2'>
                    <div className={style.grid_label}>Email</div>
                    <div className={style.grid_value}>{email}</div>
                </div>

            </BasicCard>

        </div>
    )
}
