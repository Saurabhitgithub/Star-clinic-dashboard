import React, { useEffect, useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../components/Inputs/Input";
import { DragAndDropInput } from "../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { loader, toast } from "../../utils";
import { uploadMultipleDocs } from "../../services/authApis";
import { addLabTestData, editLabData } from "../../services/LabTestManagement";

const UploadReport = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [initialData, setInitialData] = useState(null);

  const fetchLabData = useOutletContext()
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
     test_name: "",
        stages: "",
      client_name: "",
      fileData: null,
    },
  });

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
          response = await addLabTestData(data);
        } else {
          response = await editLabData(id, data);
        }
    
        if (response && response.data) {
          setInitialData(response.data);
          setValue("test_name", response.data.test_name);
          setValue("stages", response.data.stages);
          setValue("client_name", response.data.client_name);
          setValue("fileData", {
            fileName: response.data.fileData?.fileName || "",
            fileUrl: response.data.fileData?.fileUrl || "",
          });
  
          toast.success(
            `Safety ${isAddMode ? "added" : "updated"} successfully!`
          );
          navigate("/labsManagement");
        } else {
          toast.error("Error: No response data received");
        }
       fetchLabData()
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("Error saving data");
      } finally {
        loader.stop();
      }
    }
  

  function onCancel() {
    navigate("/labsManagement");
  }
  return (
    <>
      <CustomDialog
        onCancel={onCancel}
        open={true}
        fullWidth
        maxWidth="sm"
        title={`${isAddMode ? "Add" : "Update"} Lab Test  Record`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
    
          <div className="mt-3">
            <Controller
              name="test_name"
              control={control}
              rules={{ required: "Test Name is required" }}
              render={({ field }) => (
                <Input
                  required
                  error={!!errors.test_name}
                  {...field}
                  placeholder="Enter Test Name "
                  label="Test Name "
                />
              )}
            />
          </div>

        <div className="mt-3">
                 <Controller
                   name="stages"
                   control={control}
                   rules={{ required: "Stages is required" }}
                   render={({ field }) => (
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Stages
                       </label>
                       <select
                         {...field}
                         className={`w-full border rounded px-3 py-2 ${
                           errors.stages ? "border-red-500" : "border-gray-300"
                         }`}
                       >
                         <option value="">Select stage</option>
                         <option value="backlog">Backlog</option>
                         <option value="requested">Requested</option>
                         <option value="received">Received</option>
                         <option value="reviewing">Reviewing</option>
                       </select>
                       {errors.stages && (
                         <p className="text-red-500 text-xs mt-1">
                           {errors.stages.message}
                         </p>
                       )}
                     </div>
                   )}
                 />
               </div>

          <div className="mt-3">
            <Controller
              name="client_name"
              control={control}
              rules={{ required: "Client Name is required" }}
              render={({ field }) => (
                <Input
                  error={!!errors.client_name}
                  {...field}
                  placeholder="Enter Client Name"
                  label="Client Name"
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
                  label={"Upload Report"}
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
    </>
  );
};

export default UploadReport;
