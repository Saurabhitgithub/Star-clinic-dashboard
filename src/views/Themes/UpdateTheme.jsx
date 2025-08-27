import React, { useEffect } from 'react'
import { CustomDialog } from '../../components/Dialogs/CustomDialog'
import { useNavigate, useParams } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { Grid2 } from '@mui/material'
import { Input } from '../../components/Inputs/Input'
import { Button } from '../../components/Buttons/Button'
import { useGetThemeDataQuery, useUpdateThemeDataByIdMutation } from '../../store/apiSlices/themeApiSlice'
import { toast } from '../../utils'

export const UpdateTheme = () => {
    const navigate = useNavigate()
    const {id}=useParams()
    const { data } = useGetThemeDataQuery()
    const [updateTheme] = useUpdateThemeDataByIdMutation()
    const { control, reset, formState: { errors }, handleSubmit } = useForm({})

    function onCancel() {
        navigate("/theme")
    }

    async function onSubmit(data) {
        try {
             await updateTheme({id, data})
             toast.success("Theme updated successfully")
            navigate("/theme")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!!data?.length) {
            reset({
                button_color: data?.[0]?.button_color || "",
                background_color: data?.[0]?.background_color || ""
            })
        }
    }, [data]);

    return (
        <div>
            <CustomDialog
                onCancel={onCancel}
                open={true}
                fullWidth
                maxWidth='md'
                title={'Update Theme'}
            >
                <form onSubmit={handleSubmit(onSubmit)}>

                    <Grid2 container columnSpacing={2}>
                        <Grid2 size={6} >
                            <Controller
                                name='background_color'
                                control={control}
                                defaultValue={null}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => {
                                    return (
                                        <Input
                                            required
                                            error={!!errors?.background_color}
                                            value={value}
                                            onChange={onChange}
                                            placeholder='Background Color'
                                            label='Background Color'
                                        />
                                    )
                                }}
                            />
                        </Grid2>
                        <Grid2 size={6}>
                            <Controller
                                name='button_color'
                                control={control}
                                defaultValue={null}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => {
                                    return (
                                        <Input
                                            required
                                            error={!!errors?.button_color}
                                            value={value}
                                            onChange={onChange}
                                            placeholder='Button Color'
                                            label='Button Color'
                                        />
                                    )
                                }}
                            />
                        </Grid2>
                    </Grid2>

                    <div className='flex justify-end gap-3 mt-4'>
                        <Button onClick={onCancel} bordered type='button'>
                            Cancel
                        </Button>
                        <Button primary>{"Update"}</Button>
                    </div>
                </form>
            </CustomDialog>
        </div>
    )
}
