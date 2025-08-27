import React, { useEffect, useState } from "react";
import { Button } from "../../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/Inputs/Input";
import { DragAndDropInput } from "../../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { uploadMultipleDocs } from "../../../services/authApis";
import { getUserData, loader, toast } from "../../../utils";
import { Switch } from "@headlessui/react";
import { addResourceEquipment, getResourceEquipmentById, updateResourceEquipmentById } from "../../../services/ResourceManagement";

const AddEquipmentResource = () => {
      const { id } = useParams();
      const isAddMode = !id ;
      const navigate = useNavigate();
      const [deletedFiles, setDeletedFiles] = useState([]);
      const [initialData, setInitialData] = useState(null);
      const [open, setOpen] = useState(true);
    const fetchResourceEquipment = useOutletContext();
      
     const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        setValue
      } = useForm({
        defaultValues: {
          resource_name:"",
          // room_id :"",
          all_services : false,
          
        },
      });


      useEffect(() => {
          if (!isAddMode && id) {
            getResourceEquipmentById(id)
              .then((response) => {
                console.log("Raw Api response:", response);
                if (!response || !response.data) {
                  console.error("error no data received from the api");
                }
                const data = response.data;
                console.log("fetch data :", data);
                setInitialData(data);
                setValue("resource_name", data.resource_name || "");
                setValue("all_services", data.all_services);
              })
              .catch((error) => {
                console.error("Error fetching data:", error);
                toast.error("Error fetching the data ");
              });
          }
        }, [id, isAddMode, setValue]);
      
        async function onSubmit(data) {
          try {
            // data.room_id = id;
            data.all_services = Boolean(data.all_services);
            
            loader.start();
            let response;
            if (isAddMode) {
              response = await addResourceEquipment(data);
            } else {
              response = await updateResourceEquipmentById(id, data);
            }
      
            if (response && response.data) {
              setInitialData(response.data);
              setValue("resource_name",response.data.resource_name ||"");
              setValue("all_services",response.data.all_services ||"");
      
              toast.success(`Room ${isAddMode ? "added" : "updated"} successfully`);
              navigate(`/resourceEquipment`);
            } else {
              toast.error("Error : No response data received ");
            }
      
            fetchResourceEquipment();
          } catch (error) {
            console.error("Error in saving the Data", error);
            toast.error("error in saving the data ");
          } finally {
            loader.stop();
          }
        }
    
      function onCancel() {
        setOpen(false);
        navigate(`/resourceEquipment`);
      }
  return (
     <div>
       {" "}
       <CustomDialog
         onCancel={onCancel}
         open={open}
         fullWidth
         maxWidth="sm"
         title={`${isAddMode ? "Add" : "Update"} Resource Record`}
       >
         <form onSubmit={handleSubmit(onSubmit)}>
         
           <div className="mt-3">
             <Controller
               name="resource_name"
               control={control}
               rules={{ required: "Name is required" }}
               render={({ field }) => (
                 <Input
                   {...field}
                   placeholder="Enter Name"
                   label="Resource Name"
                   error={!!errors.resource_name}
                 />
               )}
             />
           </div>
           <div className="mt-4">
             <Controller
               name="all_services"
               control={control}
               render={({ field }) => (
                 <div className="flex items-center justify-between">
                   <label className="text-sm font-medium text-gray-700">
                   All services can be performed with this resource
                   </label>
                   <Switch
                     checked={field.value}
                     onChange={field.onChange}
                     className={`${
                       field.value ? "bg-green-500" : "bg-gray-300"
                     } relative inline-flex h-6 w-11 items-center rounded-full`}
                   >
                     <span
                       className={`${
                         field.value ? "translate-x-6" : "translate-x-1"
                       } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                     />
                   </Switch>
                 </div>
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

export default AddEquipmentResource