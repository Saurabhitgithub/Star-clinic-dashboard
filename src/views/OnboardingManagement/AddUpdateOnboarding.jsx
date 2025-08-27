import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Buttons/Button';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Input } from '../../components/Inputs/Input';
import { DragAndDropInput } from '../../components/Inputs/DragAndDropInput';
import { CustomDialog } from '../../components/Dialogs/CustomDialog';
import { useNavigate, useParams } from 'react-router';
import { uploadMultipleDocs } from '../../services/authApis';

import { loader, toast } from '../../utils';
import { useDispatch } from 'react-redux';
import { onboardingApiSlice, useAddOnboardingDataByIdMutation, useLazyGetOnboardingDataByIdQuery, useUpdateOnboardingDataByIdMutation } from '../../store/apiSlices/onboardingApiSlice';

export const AddUpdateOnboarding = ({ mode }) => {
  const isAddMode = mode === 'add'
  const { id } = useParams()
  const dispatch = useDispatch();

  const [getData, data] = useLazyGetOnboardingDataByIdQuery()
  useEffect(() => {
    if (id) {
      getData(id)
    }
  }, [id]);

  useEffect(() => {
    if (data?.status === "fulfilled") {
      setValue("title", data?.data?.title || '');
      setValue("subtitle", data?.data?.subtitle || '');
      setValue("image", data?.data?.fileData || '');

    }
  }, [data])


  const [addOnboarding] = useAddOnboardingDataByIdMutation()
  const [updateOnboarding] = useUpdateOnboardingDataByIdMutation()
  const [deletedFiles, setDeletedFiles] = useState([]);
  const navigate = useNavigate();
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      subtitle: '',
      image: null,

    },
  })
  // useEffect(() => {
  //   if (onboardingData) {
  //     setValue("title", onboardingData.title || '');
  //     setValue("subtitle", onboardingData.subtitle || '');
  //     setValue("image", onboardingData.fileData || '');
  //   }
  // }, [onboardingData, setValue]);



  async function onSubmit(data) {
    try {
      const file = data?.image
      loader.start()
      console.log("Submitting Data:", data);

      if (file && file.file) {
        const formData = new FormData()
        formData.append('image', file)
        let imageUrl = await uploadMultipleDocs([file.file])
        data.fileData = imageUrl.data.data[0]
        console.log("Uploaded Image FileData:", data.fileData);
      }
      if (deletedFiles.length > 0) {
        data.deleted_file = deletedFiles;
      }

      if (id) {
        await updateOnboarding({ id, data })
        dispatch(onboardingApiSlice.util.invalidateTags(""))
      } else {
        await addOnboarding(data).unwrap()
      }
      toast.success(`Onboarding ${isAddMode ? "added" : "updated"} successfully.`);
      navigate('/OnboardingManagement')
    } catch (error) {
      toast.error(error)
    } finally {
      loader.stop()
    }
  }

  function onCancel() {
    navigate('/OnboardingManagement')
  }


  return (
    <div>
      <CustomDialog
        onCancel={onCancel}
        open={true}
        fullWidth
        maxWidth='md'
        title={(isAddMode ? 'Add' : 'Update') + ' ' + 'Onboarding'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='title'
            control={control}
            defaultValue={null}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <Input
                  required
                  error={!!errors?.title}
                  value={value}
                  onChange={onChange}
                  placeholder='Title'
                  label='Title'
                />
              )
            }}
          />
          <div className='mt-3'>
            <Controller
              name='subtitle'
              control={control}
              defaultValue={null}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                return (
                  <Input
                    required
                    error={!!errors?.subtitle}
                    value={value}
                    onChange={onChange}
                    placeholder='Subtitle'
                    label='Subtitle'
                  />
                )
              }}
            />
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
