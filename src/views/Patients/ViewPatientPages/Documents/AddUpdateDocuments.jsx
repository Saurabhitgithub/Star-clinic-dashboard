import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../../components/Inputs/Input";
import { DragAndDropInput } from "../../../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { uploadMultipleDocs } from "../../../../services/authApis";
import { getUserData, loader, toast } from "../../../../utils";
import { AddDocumentData, getDocumentDataById, updateDocumentData } from "../../../../services/documentManagement";


const getCurrentUserId = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData?._id || null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

const AddUpdateDocuments = () => {
  const { id, docId } = useParams();
  const isAddMode = !docId;
  const navigate = useNavigate();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [open, setOpen] = useState(true);

  const getData = useOutletContext()


  console.log("Extracted Params:", { id, docId });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_id: id || "",
      created_by: getCurrentUserId(),
      fileName: "",
      fileData: null,
    },
  });

  useEffect(() => {
    if (!isAddMode && docId) {
      getDocumentDataById(docId)
        .then((response) => {
          if (!response?.data) {
            console.error("Error: No data received from API");
            return;
          }
          const data = response.data;
          console.log("Fetched Data:", data);
          setInitialData(data);
          setValue("user_id", data.user_id || "");
          setValue("created_by", data.created_by || "");
          setValue("fileName", data.fileName || "");
          setValue("fileData", data.fileData || {});
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error("Error fetching data");
        });
    }
  }, [id, docId]);

  async function onSubmit(data) {
    try {
      if (!id) {
        toast.error("Error: Missing user ID");
        return;
      }
      const userId = getCurrentUserId();
      if (!userId) {
        toast.error("Error: User not logged in");
        return;
      }
      data.user_id = id;
      data.created_by = userId;

      loader.start();
      if (data.fileData?.file) {
        let imageUrl = await uploadMultipleDocs([data.fileData.file]);
        data.fileData = imageUrl.data.data[0];
      }

      let response;
      if (isAddMode) {
        response = await AddDocumentData(data);
      } else {
        response = await updateDocumentData(docId, data);
      }


      if (response?.data) {
        toast.success(`Document ${isAddMode ? "added" : "updated"} successfully!`);
        navigate(`/patientDetails/${id}/documents`);

      } else {
        toast.error("Error: No response data received");
      }
      getData()
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    } finally {
      loader.stop();
      const response = await getAllDocumentData(id);
      console.log("API Response:", response.data);
      setData(response?.data?.data || response?.data || []);
    }
  }

  function onCancel() {
    setOpen(false);
    navigate(`/patientDetails/${id}/documents`);
  }

  return (
    <CustomDialog onCancel={onCancel} open={open} fullWidth maxWidth="sm" title={`${isAddMode ? "Add" : "Update"} Document Record`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="fileName"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => <Input {...field} placeholder="Enter Name" label="File Name" error={!!errors.fileName} />}
        />

        <Controller
          name="created_by"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => <Input value={getUserData()?.name} placeholder="Enter Name" label="Created By" error={!!errors.created_by} />}
        />

        <Controller
          name="fileData"
          control={control}
          rules={{ required: "File upload is required" }}
          render={({ field: { value, onChange } }) => (
            <DragAndDropInput
              fileLimit={1}
              label={"Upload Media"}
              value={[value].filter((e) => e)}
              setDeleted={setDeletedFiles}
              acceptedFileTypes={[]}
              onChange={(e) => onChange(e[0])}
              error={!!errors?.fileData}
            />
          )}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={onCancel} bordered type="button">Cancel</Button>
          <Button primary type="submit">{isAddMode ? "Add" : "Update"}</Button>
        </div>
      </form>
    </CustomDialog>
  );
};
export default AddUpdateDocuments

