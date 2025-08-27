import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../../components/Inputs/Input";
import { DragAndDropInput } from "../../../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { uploadMultipleDocs } from "../../../../services/authApis";
import { getUserData, loader, toast } from "../../../../utils";
import { addMedicalConditionData, getMedicalConditionById, updateMedicalConditionById } from "../../../../services/LabTestManagement";

const AddUpdateCondition = () => {

  const { id, docId } = useParams();
  const isAddMode = !docId;
  const navigate = useNavigate();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [open, setOpen] = useState(true);
  console.log("docId", docId);
  console.log("id", id);

  const getData = useOutletContext()

 const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      health_status: "",
        user_id: id|| "",
    },
  });

  useEffect(() => {
      if (!isAddMode && docId) {
        getMedicalConditionById(docId)
          .then((response) => {
            if (!response?.data) {
              console.error("Error: No data received from API");
              return;
            }
            const data = response.data;
            console.log("Fetched Data:", data);
      
              setInitialData(response.data);
          setValue("name", response.data.name);
          setValue("health_status", response.data.health_status);
          setValue("user_id", response.data.user_id);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            toast.error("Error fetching data");
          });
      }
    }, [id, docId]);

  

   async function onSubmit(data) {
      try {
    
        loader.start();
     
        let response;
        if (isAddMode) {
          response = await addMedicalConditionData(data);
        } else {
          response = await updateMedicalConditionById(docId, data);
        }
    
        if (response && response.data) {
          setInitialData(response.data);
          setValue("name", response.data.name);
          setValue("health_status", response.data.health_status);
         
          toast.success(
            `Medical data  ${isAddMode ? "added" : "updated"} successfully!`
          );
       navigate(`/patientDetails/${id}/medicalConditionManagement`);
        } else {
          toast.error("Error: No response data received");
        }
        getData();
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("Error saving data");
      } finally {
        loader.stop();
    
      }
    }
 function onCancel() {
    setOpen(false);
    navigate(`/patientDetails/${id}/medicalConditionManagement`);
  }

  return (
 <>
  <CustomDialog onCancel={onCancel} open={open} fullWidth maxWidth="sm" title={`${isAddMode ? "Add" : "Update"} Medical  Record`}>
       <form onSubmit={handleSubmit(onSubmit)}>

        <div className="mt-3">
         <Controller
           name="name"
           control={control}
           rules={{ required: "Name is required" }}
           render={({ field }) => <Input {...field} placeholder="Enter Name" label=" Name" error={!!errors.name} />}
         />
              </div>
                 <div className="mt-3">
         <Controller
           name="health_status"
           control={control}
           rules={{ required: "Name is required" }}
           render={({ field }) => <Input {...field} placeholder="Enter stage" label="Health Status" error={!!errors.health_status} />}
         />
 </div>

         <div className="flex justify-end gap-3 mt-4">
           <Button onClick={onCancel} bordered type="button">Cancel</Button>
           <Button primary type="submit">{isAddMode ? "Add" : "Update"}</Button>
         </div>
       </form>
     </CustomDialog>
 </>
  )
}

export default AddUpdateCondition