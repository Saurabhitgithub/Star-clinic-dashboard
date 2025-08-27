import React, { useEffect, useState } from 'react'
import { CommonPagesHeader } from '../../components/PagesHeaders/CommonPagesHeader'
import { useGetThemeDataQuery, useUpdateThemeDataByIdMutation } from '../../store/apiSlices/themeApiSlice'
import { useNavigate } from 'react-router'
import { Button } from '../../components/Buttons/Button'
import { Label } from '../../components/Inputs/Label'

export const Theme = () => {

    const { data } = useGetThemeDataQuery()
    const navigate = useNavigate()

    const [updateTheme] = useUpdateThemeDataByIdMutation();

    console.log(data)

    const [colors, setColor] = useState()

    useEffect(() => {
        if (data) {
            setColor({
                button_color: data?.button_color,
                background_color: data?.background_color
            })
        }
    }, [data])

    async function formSubmit() {
        try {
            console.log(colors)


            updateTheme({ id: data?._id, data: colors })

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div>
           <CommonPagesHeader
                heading={"Themes"}
                subHeading={"Manage Themes"}
            />
            <br/>
           
            <div className="grid grid-cols-2">

                <div className="flex justify-center">
                    <div
                        style={{ backgroundColor: colors?.background_color }}
                        className="relative w-64 h-[500px] rounded-3xl border-8 border-gray-900 shadow-lg flex items-center justify-center overflow-hidden">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-3 bg-gray-800 rounded-b-lg flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full border-2 border-gray-500"></div>
                        </div>
                        <Button
                            style={{ backgroundColor: colors?.button_color }}
                        >Button</Button>

                    </div>
                </div>
                <div className='flex flex-col justify-between'>
                    <div>
                        <div>
                            <Label>Background Color</Label>
                            <br />
                            <input
                                onChange={(e) => setColor({ ...colors, background_color: e.target.value })}
                                type="color" id="colorPicker" name="colorPicker" value={colors?.background_color} />
                        </div>
                        <br />
                        <div>
                            <Label>Button Color</Label>
                            <br />
                            <input
                                onChange={(e) => setColor({ ...colors, button_color: e.target.value })}
                                type="color" id="colorPicker" name="colorPicker" value={colors?.button_color} />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={formSubmit} primary>Submit</Button>
                    </div>
                </div>
            </div>

        </div>
    )
}
