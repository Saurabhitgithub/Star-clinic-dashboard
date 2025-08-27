import React, { useEffect, useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../components/Inputs/Input";
import { DragAndDropInput } from "../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { loader, toast } from "../../utils";
import {
  addNewsData,
  getNewsDataById,
  updateNewsDataById,
} from "../../services/newsManagement";
import { uploadMultipleDocs } from "../../services/authApis";

const AddUpdateNews = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const fetchRoomData = useOutletContext();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      heading: "",
      description: "",
      fileData: null,
    },
  });

  useEffect(() => {
    if (!isAddMode && id) {
      getNewsDataById(id)
        .then((response) => {
          console.log("Raw Api response:", response);
          if (!response || !response.data) {
            console.error("error no data received from the api");
          }
          const data = response.data;
          console.log("fetch data :", data);
          setInitialData(data);
          setValue("heading", data.heading || "");
          setValue("description", data.description);
          setValue("fileData", {
            fileName: data.fileData?.fileName || "",
            fileUrl: data.fileData?.fileUrl || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error("Error fetching the data ");
        });
    }
  }, [id, isAddMode, setValue]);

  async function onSubmit(data) {
    try {
      const file = data?.fileData;
      loader.start();
      if (file && file.file) {
        let imageUrl = await uploadMultipleDocs([file.file]);
        data.fileData = imageUrl.data.data[0];
      }

      let response;
      if (isAddMode) {
        response = await addNewsData(data);
      } else {
        response = await updateNewsDataById(id, data);
      }

      if (response && response.data) {
        setInitialData(response.data);
        setValue("heading", response.data.heading);
        setValue("description", response.data.description);
        setValue("fileData", {
          fileName: response.data.fileData?.fileName || "",
          fileUrl: response.data.fileData?.fileUrl || "",
        });
        toast.success(`News ${isAddMode ? "added" : "updated"} successfully !`);
        navigate("/newsManagement");
      } else {
        toast.error("Error:No response data received");
      }

      fetchRoomData();
    } catch (error) {
      console.error("Error saving the data ", error);
      toast.error("error saving the data");
    } finally {
      loader.stop();
    }
  }

  function onCancel() {
    navigate("/newsManagement");
  }
  return (
    <div>
      <CustomDialog
        onCancel={onCancel}
        open={true}
        fullWidth
        maxWidth="sm"
        title={`${isAddMode ? "Add" : "Update"} News  Record`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-3">
            <Controller
              name="heading"
              control={control}
              rules={{ required: "Heading is required" }}
              render={({ field }) => (
                <Input
                  required
                  error={!!errors.heading}
                  {...field}
                  placeholder="Enter Heading"
                  label="Heading"
                />
              )}
            />
          </div>

          <div className="mt-3">
            <label
              htmlFor="safety_title1"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              rules={{
                required: "Description is required",
                validate: (value) => {
                  const wordCount = value.trim().split(/\s+/).length;
                  return (
                    wordCount >= 200 || "Description must be at least 200 words"
                  );
                },
              }}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="description"
                  rows={4}
                  placeholder="Description"
                  className={`w-full px-3 py-2 border text-sm text-gray-700 ${
                    errors?.description ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
                />
              )}
            />
            {errors?.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="mt-3">
            <Controller
              name="fileData"
              control={control}
              rules={{ required: "File upload is required" }}
              render={({ field: { value, onChange } }) => (
                <DragAndDropInput
                  required
                  error={!!errors?.fileData}
                  fileLimit={1}
                  label={"Upload Media"}
                  value={[value].filter((e) => e)}
                  setDeleted={setDeletedFiles}
                  acceptedFileTypes={[]}
                  onChange={(e) => {
                    onChange(e[0]);
                  }}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={onCancel} bordered type="button">
              Cancel
            </Button>
            <Button primary type="submit">
              {isAddMode ? "Add" : "Update"}
            </Button>
          </div>
        </form>
      </CustomDialog>
    </div>
  );
};

export default AddUpdateNews;
