import React, { useEffect, useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { DragAndDropInput } from "../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { useNavigate, useParams } from "react-router";
import { loader, toast, uploadMultipleFilesPromise } from "../../utils";
import { useDispatch } from "react-redux";
import {
  splashScreenApiSlice,
  useGetAllSplashScreenDataQuery,
  useLazyGetSplashScreenDataByIdQuery,
  useUpdateSplashScreenDataByIdMutation,
} from "../../store/apiSlices/splashScreenApiSlice";

export const AddUpdateSplashScreen = ({ mode }) => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const [fetchSplashScreen] = useLazyGetSplashScreenDataByIdQuery();
  const [updateSplashScreen] = useUpdateSplashScreenDataByIdMutation();

  const { data, isLoading, error } = useGetAllSplashScreenDataQuery();

  const [deletedFiles, setDeletedFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const file = data?.data?.[0]?.fileData?.[0];
    if (file) {
      console.log(file);
      const { fileName, fileUrl } = file
      setValue("image", { fileName, fileUrl });
    }
  }, [data]);

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: null,
    },
  });


  async function onSubmit(fileData) {
    try {

      loader.start();
      let updatedData = {};

      const data = await uploadMultipleFilesPromise([fileData.image])
      // Update splash screen
      let res = await updateSplashScreen({ id, data: { fileData: data } })

      toast.success("Splash screen updated successfully.");
      dispatch(splashScreenApiSlice.util.invalidateTags(["SplashScreens"]));
      navigate("/splashScreen");
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong.");
    } finally {
      loader.stop();
    }
  }

  function onCancel() {
    navigate("/safeAndSurgery");
  }

  return (
    <div>
      <CustomDialog
        onCancel={onCancel}
        open={true}
        fullWidth
        maxWidth="md"
        title={"update splash"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-3">
            <Controller
              name="image"
              control={control}
              defaultValue={null}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                return (
                  <DragAndDropInput
                    required
                    error={!!errors?.image}
                    fileLimit={1}
                    label={"Upload Media"}
                    value={[value].filter((d) => d)}
                    setDeleted={setDeletedFiles}
                    acceptedFileTypes={[]}
                    onChange={(e) => {


                      onChange(e[0] || null);
                    }}
                  />
                );
              }}
            />    
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={onCancel} bordered type="button">
              Cancel
            </Button>
            <Button primary>Update</Button>
          </div>
        </form>
      </CustomDialog>
    </div>
  );
};
