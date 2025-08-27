import React, { useEffect } from 'react'
import { CustomDialog } from '../../components/Dialogs/CustomDialog'
import { Controller, useForm } from 'react-hook-form'
import { InputController } from '../../components/Inputs/InputController'
import { Button } from '../../components/Buttons/Button'
import { useNavigate, useParams } from 'react-router'
import { useAddSubscriptionPlanMutation, useUpdateSubscriptionPlanByIdMutation } from '../../store/apiSlices/subscriptionsPlanApiSlice'
import { Label } from '../../components/Inputs/Label'
import { AutocompleteSelect } from '../../components/Inputs/Select'
import { SUBSCRIPTION_PLAN_STATUS } from '../../utils/constants'
import { useFetchSubscriptionPlanDate } from '../../hooks/useFetchSubscriptionPlanData'
import { findFormDirtyFields, toast } from '../../utils'
import { Editor } from '../../components/Inputs/Editor'





export const AddUpdateSubscription = ({ mode }) => {
    const navigate = useNavigate()
    const isAddMode = mode === "add"
    const { id } = useParams()
    const [addSubscription] = useAddSubscriptionPlanMutation()
    const [updateSubscriptionData] = useUpdateSubscriptionPlanByIdMutation()
    const { handleSubmit, control, reset, formState: { errors, dirtyFields } } = useForm({
        defaultValues: {
            type: "doctor",
            subcription_name: "",
            subcription_details: "",
            subcription_days: "",
            subcription_fees: ""
        }
    }
    )
    const { fetchSubscriptionData } = useFetchSubscriptionPlanDate(id, reset)
    useEffect(() => {
        fetchSubscriptionData()
    }, [])

    async function formSubmit(data) {
        try {
            if (id) {
                const body = findFormDirtyFields(dirtyFields, data)
                let res = await updateSubscriptionData({ id, body }).unwrap()
                console.log(res, "[p[p[p[p[p[p[p")
                toast.success("Subscription updated successfully")
                navigate("/manageSubscriptions")
            }
            else {

                await addSubscription(data).unwrap()
                toast.success("Subscription added successfully")
                navigate("/manageSubscriptions")
            }
        } catch (error) {
            console.log(error)
            toast.error(error)

        }
    };

    return (
        <div>
            <CustomDialog
                size={"md"}
                onCancel={() => navigate("/manageSubscriptions")}
                title={isAddMode ? "Add" : "Update" + " Subscription Plan"}
                open={true}>
                <form onSubmit={handleSubmit(formSubmit)}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Type</Label>
                            <Controller
                                name={"type"}
                                control={control}
                                defaultValue={null}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => {
                                    return (
                                        <AutocompleteSelect
                                            label="Type"
                                            error={!!errors?.type}
                                            getOptionLabel={(option) => option.label}
                                            value={value ? SUBSCRIPTION_PLAN_STATUS?.find(e => e.value == value) : null || null}
                                            onChange={(e, val) => {
                                                console.log(val)
                                                onChange(val ? val?.value : null)
                                            }}
                                            options={SUBSCRIPTION_PLAN_STATUS}
                                        />
                                    )
                                }}
                            />
                        </div>
                        <InputController
                            control={control}
                            error={errors.subcription_name}
                            rules={{ required: true }}
                            name={"subcription_name"}
                            label={"Subscription plan name"}
                            placeholder={"Subscription plan name"}
                            required
                        />
                        <InputController
                            control={control}
                            rules={{ required: true }}
                            error={errors.subcription_days}
                            name={"subcription_days"}
                            label={"Subscription Days"}
                            placeholder={"Subscription Days"}
                            type="number"
                            required
                        />
                        <InputController
                            control={control}
                            rules={{ required: true }}
                            error={errors.subcription_fees}
                            name={"subcription_fees"}
                            label={"Subscription Price"}
                            placeholder={"Subscription Price"}
                            type="number"
                            required
                        />
                    </div>
                    <div className="mt-4">


                        <Controller
                            name={"subcription_details"}
                            control={control}
                            defaultValue={null}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <Editor
                                        height={"200px"}
                                        value={value}
                                        onChange={onChange}
                                    />
                                )
                            }}
                        />


                    </div>
                    <div className="flex gap-4 mt-4 justify-end">
                        <Button type="button" onClick={() => navigate("/manageSubscriptions")} bordered>Cancel</Button>
                        <Button primary>{isAddMode?"Add":"Update"}</Button>
                    </div>
                </form>
            </CustomDialog>
        </div>
    )
}
