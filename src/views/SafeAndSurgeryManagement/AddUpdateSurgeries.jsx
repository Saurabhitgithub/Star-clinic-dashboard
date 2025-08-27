import React, { useEffect, useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../components/Inputs/Input";
import { DragAndDropInput } from "../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";


import { uploadMultipleDocs } from "../../services/authApis";
import {
  getSurgeryDataById,
  updateSurgeriesData,
  addSurgeriesdata,
} from "../../services/safeAndSurgery"

import { loader, toast } from "../../utils";

const AddUpdateSurgeries = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [initialData, setInitialData] = useState(null);

  const fetchSurgeries = useOutletContext()
       
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      heading: "",
      safety_title1: "",
      safety_title2: "",
      fileData: null,
    },
  });

  useEffect(() => {
    if (!isAddMode && id) {
      getSurgeryDataById(id)
        .then((response) => {
          console.log("Raw API Response:", response);

          if (!response || !response.data) {
            console.error("Error: No data received from API");
            return;
          }

          const data = response.data;
          console.log("Fetched Data:", data);

          setInitialData(data);
          setValue("heading", data.heading || "");
          setValue("safety_title1", data.safety_title1 || "");
          setValue("safety_title2", data.safety_title2 || "");
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
        response = await addSurgeriesdata(data);
      } else {
        response = await updateSurgeriesData(id, data);

      }

      if (response && response.data) {
        setInitialData(response.data);
        setValue("heading", response.data.heading);
        setValue("safety_title1", response.data.safety_title1);
        setValue("safety_title2", response.data.safety_title2);
        setValue("fileData", {
          fileName: response.data.fileData?.fileName || "",
          fileUrl: response.data.fileData?.fileUrl || "",
        });

        toast.success(
          `Safety ${isAddMode ? "added" : "updated"} successfully!`
        );
        navigate("/safeAndSurgery");
      } else {
        toast.error("Error: No response data received");
      }

      fetchSurgeries();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
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
        maxWidth="sm"
        title={`${isAddMode ? "Add" : "Update"} Safe and Surgery Record`}
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
            <Controller
              name="safety_title1"
              control={control}
              rules={{ required: "Safety Title 1 is required" }}
              render={({ field }) => (
                <Input
                  required
                  error={!!errors.safety_title1}
                  {...field}
                  placeholder="Safety Title 1"
                  label="Safety Title 1"
                />
              )}
            />
          </div>

          <div className="mt-3">
            <Controller
              name="safety_title2"
              control={control}
              rules={{ required: "Safety Title 2 is required" }}
              render={({ field }) => (
                <Input
                  required
                  error={!!errors.safety_title2}
                  {...field}
                  placeholder="Safety Title 2"
                  label="Safety Title 2"
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
  );
};

export default AddUpdateSurgeries;
