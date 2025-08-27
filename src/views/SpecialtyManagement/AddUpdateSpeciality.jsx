import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Buttons/Button';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Input } from '../../components/Inputs/Input';
import { DragAndDropInput } from '../../components/Inputs/DragAndDropInput';
import { CustomDialog } from '../../components/Dialogs/CustomDialog';
import { useNavigate, useParams } from 'react-router';
import { uploadMultipleDocs } from '../../services/authApis';
import {
  useAddSpecilitiesDataByIdMutation,
  useLazyGetSpecilitiesDataByIdQuery,
  useUpdateSpecilitiesDataByIdMutation
} from '../../store/apiSlices/specialityApiSlice';
import { loader, toast } from '../../utils';
import { useDispatch } from 'react-redux';
import { doctorApiSlice } from '../../store/apiSlices/doctorApiSlices';
import { Editor } from '../../components/Inputs/Editor';
import { Label } from '../../components/Inputs/Label';
import { AddIcon, DeleteIcon } from '../../components/Icons/SvgIcons';
import { Grid2, Stack, Typography } from '@mui/material';

export const AddUpdateSpeciality = ({ mode }) => {
  const isAddMode = mode === 'add'
  const { id } = useParams()
  const dispatch = useDispatch();
  const [getData, specialityData] = useLazyGetSpecilitiesDataByIdQuery()

  useEffect(() => {

    if (id) {
      getData(id)
    }
  }, [])


  const [addSpeciality] = useAddSpecilitiesDataByIdMutation()
  const [updateSepecility] = useUpdateSpecilitiesDataByIdMutation()
  const [deletedFiles, setDeletedFiles] = useState([]);
  const navigate = useNavigate();
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      image: null,
      description: "",
      features: [{ name: "" }]
    },
    values: specialityData?.data
    ? {
      name: specialityData?.data?.name || "",
      image: specialityData?.data?.image || null,
      description: specialityData?.data?.description || "",
      features: specialityData?.data?.features?.map(({ _id, ...rest }) => rest) || []
    }
    : {}

  })


  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  async function onSubmit(data) {
    try {
      const file = data?.image
      loader.start()

      if (file && file.file) {
        const formData = new FormData()
        formData.append('image', file)
        let imageUrl = await uploadMultipleDocs([file.file])
        data.image = imageUrl.data.data[0]
      }

      if (id) {
        await updateSepecility({ id, data })
        dispatch(doctorApiSlice.util.invalidateTags("GetAllDoctorsTag"))
      } else {
        await addSpeciality(data).unwrap()
      }
      toast.success(`Speciality ${isAddMode ? "added" : "updated"} successfully.`);
      navigate('/specialtyManagement')
    } catch (error) {
      toast.error(error)
    } finally {
      loader.stop()
    }
  }

  function onCancel() {
    navigate('/specialtyManagement')
  }

  return (
    <div>
      <CustomDialog
        onCancel={onCancel}
        open={true}
        fullWidth
        maxWidth='md'
        title={(isAddMode ? 'Add' : 'Update') + ' ' + 'Speciality'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            defaultValue={null}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <Input
                  required
                  error={!!errors?.name}
                  value={value}
                  onChange={onChange}
                  placeholder='Speciality Name'
                  label='Speciality Name'
                />
              )
            }}
          />
          <div className="mt-3">
            <Label>Description</Label>
            <Controller
              name='description'
              control={control}
              defaultValue={null}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                return (
                  <Editor height={80} value={value} onChange={onChange} />
                )
              }}
            />
          </div>

          <div className='mt-3'>
            <Label>Features</Label>
            <Grid2 container spacing={2}>
              {fields.map((field, index) => {
                return (
                  <Grid2 size={6} key={field.id}>
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <Controller
                        control={control}
                        rules={{ required: true }}
                        name={`features[${index}].name`}
                        render={({ field }) => (
                          <Input
                            required
                            error={!!errors?.features?.[index]?.name}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={"Enter feature"}
                            className="w-[100%]"
                          />
                        )}
                      />
                      {fields?.length > 1 && <DeleteIcon className="pointer" onClick={() => remove(index)} fill={"red"} />}
                    </Stack>
                  </Grid2>
                )
              }
              )}
            </Grid2>

            <div className="flex mt-[20px] justify-end items-center gap-1 body">
              <AddIcon fill={"black"} />
              <Typography className='font_manrope' onClick={() => append({ name: "" })} style={{ cursor: "pointer" }}>
                Add more
              </Typography>
            </div>
          </div>

          <div className='mt-3'>
            <Controller
              name='image'
              control={control}
              defaultValue={null}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                return (
                  <DragAndDropInput
                    required
                    error={!!errors?.image}
                    fileLimit={1}
                    label={'Upload Media'}
                    value={[value].filter(e => e)}
                    setDeleted={setDeletedFiles}
                    acceptedFileTypes={[]}
                    onChange={e => {
                      onChange(e[0])
                    }}
                  />
                )
              }}
            />
          </div>

          <div className='flex justify-end gap-3 mt-4'>
            <Button onClick={onCancel} bordered type='button'>
              Cancel
            </Button>
            <Button primary>{isAddMode ? 'Add' : 'Update'}</Button>
          </div>
        </form>
      </CustomDialog>
    </div>
  )
}
