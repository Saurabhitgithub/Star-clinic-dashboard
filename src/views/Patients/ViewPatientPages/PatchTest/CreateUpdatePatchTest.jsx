import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { CustomDialog } from '../../../../components/Dialogs/CustomDialog';
import { Input } from '../../../../components/Inputs/Input';
import { AutocompleteSelect } from '../../../../components/Inputs/Select';
import { DragAndDropInput } from '../../../../components/Inputs/DragAndDropInput';
import { Label } from '../../../../components/Inputs/Label';
import { Button } from '../../../../components/Buttons/Button';
import { SUBSCRIPTION_PLAN_STATUS } from '../../../../utils/constants';
import { toast, loader } from '../../../../utils';
import { uploadMultipleDocs } from '../../../../services/authApis';
import { addPatchTest, getPatchTestById, updatePatchTestById } from '../../../../services/offersApis';

const CreateUpdatePatchTest = () => {
  const { id, testId } = useParams(); // id = patientId
  const isAddMode = !testId;
  const navigate = useNavigate();
  const fetchAllPatch = useOutletContext();

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      staff: '',
      description: '',
      status: '',
      fileData: [],
    },
  });

  const onClose = () => {
    navigate(`/patientDetails/${id}/patchTests`);
  };

  const normalizeFileData = async (fileDataArray) => {
    if (!fileDataArray?.length) return null;

    const fileItem = fileDataArray[0];
    if (fileItem.file && typeof fileItem.file !== 'string') {
      const uploadRes = await uploadMultipleDocs([fileItem.file]);
      return uploadRes.data?.data?.[0] || null;
    } else if (fileItem.fileUrl) {
      return {
        fileUrl: fileItem.fileUrl,
        name: fileItem.name || '',
      };
    }
    return null;
  };

  const formSubmit = async (data) => {
    try {
      loader.start();

      const finalFileData = await normalizeFileData(data.fileData);

      const payload = {
        user_id: id,  // Include patientId always
        description: data.description,
        status: data.status?.toLowerCase(),
        staff: data.staff?.value || data.staff,
        fileData: finalFileData,
      };

      let response;

      if (isAddMode) {
        response = await addPatchTest(payload);
      } else {
        response = await updatePatchTestById(testId, payload);
      }

      if (response?.data) {
        toast.success(`Patch Test ${isAddMode ? 'created' : 'updated'} successfully`);
        fetchAllPatch();
        navigate(`/patientDetails/${id}/patchTests?refresh=true`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to save Patch Test');
    } finally {
      loader.stop();
    }
  };

  useEffect(() => {
    if (!isAddMode) {
      const fetchPatchTest = async () => {
        try {
          loader.start();
          const res = await getPatchTestById(testId);
          const data = res?.data?.data;

          if (data) {
            setValue('description', data.description || '');
            setValue('status', data.status || 'pending');

            const staffOption = SUBSCRIPTION_PLAN_STATUS.find(
              (opt) => opt.value === data.staff
            );
            setValue('staff', staffOption || null);

            if (data.fileData) {
              setValue('fileData', [
                {
                  fileUrl: data.fileData.fileUrl || '',
                  name: data.fileData.name || '',
                },
              ]);
            } else {
              setValue('fileData', []);
            }
          }
        } catch (err) {
          console.error(err);
          toast.error('Failed to load Patch Test data');
        } finally {
          loader.stop();
        }
      };
      fetchPatchTest();
    }
  }, [testId, isAddMode, setValue]);

  return (
    <CustomDialog
      onCancel={onClose}
      open={true}
      fullWidth
      maxWidth="sm"
      title={`${isAddMode ? 'Create' : 'Update'} Patch Test`}
    >
      <form onSubmit={handleSubmit(formSubmit)}>
        {/* File Upload */}
        <div className="mb-4">
          <Controller
            name="fileData"
            control={control}
            render={({ field }) => (
              <DragAndDropInput
                label="File"
                value={field.value}
                onChange={field.onChange}
                acceptedFileTypes={[]} // Accept any file type
              />
            )}
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <Input
                {...field}
                label="Description"
                placeholder="Enter description"
                error={!!errors.description}
              />
            )}
          />
        </div>

        {/* Staff Select */}
        <div className="mb-4">
          <Label className="block text-gray-700 font-medium">Staff</Label>
          <Controller
            name="staff"
            control={control}
            render={({ field }) => (
              <AutocompleteSelect
                label="Staff"
                getOptionLabel={(option) => option.label}
                value={field.value || null}
                onChange={(e, val) => field.onChange(val)}
                options={SUBSCRIPTION_PLAN_STATUS}
              />
            )}
          />
        </div>

        {/* Status Radio Buttons */}
        <div className="mb-4">
          <Label className="block text-gray-700 font-medium">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="flex gap-4 mt-2 sm:flex-wrap md:flex-wrap">
                {['pending', 'passed', 'failed'].map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={field.value === status}
                      onChange={() => field.onChange(status)}
                      className="mr-2"
                    />
                    <span
                      className={`text-${status === 'pending' ? 'yellow' : status === 'passed' ? 'green' : 'red'}-500 border-2 border-${status === 'pending' ? 'yellow' : status === 'passed' ? 'green' : 'red'}-200 bg-${status === 'pending' ? 'yellow' : status === 'passed' ? 'green' : 'red'}-100 px-2 py-1 rounded`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={onClose} bordered>
            Cancel
          </Button>
          <Button type="submit" primary>
            {isAddMode ? 'Create' : 'Update'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default CreateUpdatePatchTest;
