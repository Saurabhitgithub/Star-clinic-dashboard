import React, { Fragment, useEffect, useState } from 'react'
import { Label } from '../../components/Inputs/Label'
import { BasicCard } from '../../components/Cards/BasicCard'
import { DeleteButton } from '../../components/Buttons/DeleteButton'
import { Controller } from 'react-hook-form'
import { Button } from '../../components/Buttons/Button'
import { Input } from '../../components/Inputs/Input'

export const EducationAndExperienceForm = ({ fields, append, remove, control, errors, usedFor }) => {
    const isEducationForm = usedFor === "education";

    return (

        <div>
            <Label>{isEducationForm ? "Education" : "Work Experience"}</Label>
            {fields.map((item, index) => {
              
                return (
                    <Fragment key={item.id}>
                        <BasicCard className={"mt-2"}>
                            <div className="flex justify-between">
                                <div className="family-700 text-center">{isEducationForm ? "Education" : "Experience"} {index + 1}</div>
                                {fields?.length > 1 && <DeleteButton type="button" onDelete={() => remove(index)} fill="red" className="pointer" />}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={isEducationForm ?
                                        `${usedFor}[${index}].degree` :
                                        `${usedFor}[${index}].company`}
                                    render={({ field }) => (
                                        <Input
                                            required
                                            error={!!errors?.[usedFor]?.[index]?.[isEducationForm ? "degree" : "company"]}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={isEducationForm ? "Enter Degree" : "Enter Company Name"}
                                            label={isEducationForm ? "Degree" : "Company Name"}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={isEducationForm ?
                                        `${usedFor}[${index}].institution` :
                                        `${usedFor}[${index}].about`
                                    }
                                    render={({ field }) => (
                                        <Input
                                            required
                                            error={!!errors?.[usedFor]?.[index]?.[isEducationForm ? "institution" : "about"]}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={isEducationForm ? "Enter Institution" : "Enter About"}
                                            label={isEducationForm ? "Institution" : "About"}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={`${usedFor}[${index}].startDate`}
                                    render={({ field }) => (
                                        <Input
                                            required
                                            type="date"
                                            error={!!errors?.[usedFor]?.[index]?.startDate}
                                            value={field.value}
                                            onChange={field.onChange}
                                            label="Start Date"
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name={`${usedFor}[${index}].endDate`}
                                    render={({ field }) => {
                                        return (
                                            <Input
                                                required
                                                type="date"
                                                error={!!errors?.[usedFor]?.[index]?.endDate}
                                                value={field.value}
                                                onChange={field.onChange}
                                                label="End Date"

                                            />
                                        )
                                    }}
                                />
                            </div>
                        </BasicCard>
                    </Fragment>
                )
            }
            )}
            <div className="flex mt-2">
                <Button type="button" onClick={() => append(
                    isEducationForm ? ({ degree: "", institution: "", startDate: "", endDate: "" }) :
                        ({ company: "", startDate: "", endDate: "", about: "" })
                )} secondary addIcon>
                    Add
                </Button>
            </div>
        </div>


    )
}
