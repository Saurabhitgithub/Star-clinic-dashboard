import React from 'react';
import style from "./input.module.css";
import img from "../../assets/images/userProfileImg.png"
import { Button } from '../Buttons/Button';

export const UploadProfile = ({ value,error, onChange, onDeleteFile }) => {

    function inpChange(event) {
        console.log(value)
        const file = event.target.files[0]
        if (file) {
            const data = {
                file: file,
                fileName: file.name,
                fileUrl: URL.createObjectURL(file)
            }
            if (value && !value?.file) {
                onDeleteFile(value?.fileName)
            }
            onChange(data);
        }
    }

    function removeImage() {
        if (value && !value?.file) {
            onDeleteFile(value?.fileName)
        }
        onChange(null)
    };


    return (
        <div className={`${style.uploadProfile_main_con} ${error && style.error_uploadProfile_con}`}>
            <div className="flex justify-between items-center">
                <div className='flex items-center gap-4'>
                    <img className={style.uploadProfile_image} src={value?.fileUrl || img} />
                    <div className={style.uploadProfile_text}>You can upload jpg,png or gif<br /> image files</div>
                </div>
                <div className='flex items-center gap-4'>
                    {value?.fileUrl && <Button type="button" onClick={removeImage} bordered>Remove</Button>}
                    <label htmlFor='uploadProfileInput' className='btn secondary_btn pointer'>
                        Upload Photo
                    </label>
                    <input type="file" onChange={inpChange} hidden id='uploadProfileInput' accept=".jpg,.png,.gif" />

                </div>
            </div>
        </div>
    )
}
