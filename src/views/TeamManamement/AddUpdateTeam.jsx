import React, { useEffect, useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../components/Inputs/Input";
import { DragAndDropInput } from "../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { uploadMultipleDocs } from "../../services/authApis";
import { loader, toast } from "../../utils";
import { addTeamData, getAllTeamData, getTeamDataById, updateTeamData } from "../../services/teamManagement";

const AddUpdateTeam = ({ onFormSubmit }) => {
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [initialData, setInitialData] = useState(null);

  const fetchTeamData = useOutletContext()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      doctor_name: "",
      category: "",
      description: "",
      education: "",
      fileData: null,
    },
  });

  useEffect(() => {
    if (!isAddMode && id) {
      getTeamDataById(id)
        .then((response) => {
          console.log("Raw API Response:", response);

          if (!response || !response.data) {
            console.error("Error: No data received from API");
            return;
          }

          const data = response.data;
          console.log("Fetched Data:", data);

          setInitialData(data);
          setValue("doctor_name", data.doctor_name || "");
          setValue("description", data.description || "");
          setValue("category", data.category || "");
          setValue("education", data.education || "");

          setValue("fileData", {
            fileName: data.fileData?.fileName || "",
            fileUrl: data.fileData?.fileUrl || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error("Error fetching data");
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
        response = await addTeamData(data);
      } else {
        response = await updateTeamData(id, data);
      }
  
      if (response && response.data) {
        setInitialData(response.data);
        setValue("doctor_name", response.data.doctor_name);
        setValue("description", response.data.description);
        setValue("category", response.data.category);
        setValue("education", response.data.education);
        setValue("fileData", {
          fileName: response.data.fileData?.fileName || "",
          fileUrl: response.data.fileData?.fileUrl || "",
        });

        toast.success(
          `Safety ${isAddMode ? "added" : "updated"} successfully!`
        );
        navigate("/teamManagement");
      } else {
        toast.error("Error: No response data received");
      }
      fetchTeamData();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    } finally {
      loader.stop();
      const response = await getAllTeamData();
      console.log("API Response:", response);
      setData(response?.data || []);
    }
  }

  function onCancel() {
    navigate("/teamManagement");
  }

  return (
    <div>
      <CustomDialog
        onCancel={onCancel}
        open={true}
        fullWidth
        maxWidth="sm"
        title={`${isAddMode ? "Add" : "Update"} Team Management Record`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="mt-3">
            <Controller
              name="doctor_name"
              control={control}
              rules={{ required: "Doctor Name is required" }}
              render={({ field }) => (
                <Input
                  required
                  error={!!errors.doctor_name}
                  {...field}
                  placeholder="Enter Doctor Name "
                  label="Doctor Name "
                />
              )}
            />
          </div>

          <div className="mt-3">
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <Input
                  required
                  error={!!errors.description}
                  {...field}
                  placeholder="Description"
                  label="Description"
                />
              )}
            />
          </div>
          <div className="mt-3">
            <Controller
              name="category"
              control={control}
              rules={{ required: "category is required" }}
              render={({ field }) => (
                <Input
                  required
                  error={!!errors.category}
                  {...field}
                  placeholder="Category"
                  label="Category"
                />
              )}
            />
          </div>
          <div className="mt-3">
            <Controller
              name="education"
              control={control}
              rules={{ required: "education is required" }}
              render={({ field }) => (
                <Input
                  required
                  error={!!errors.education}
                  {...field}
                  placeholder="Education"
                  label="Education"
                />
              )}
            />
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
  )
}

export default AddUpdateTeam