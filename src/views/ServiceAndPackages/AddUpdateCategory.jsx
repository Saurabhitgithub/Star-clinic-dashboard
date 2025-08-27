import React, { useEffect, useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../components/Inputs/Input";
import { DragAndDropInput } from "../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { useNavigate, useParams, useOutletContext } from "react-router";
import { uploadMultipleDocs } from "../../services/authApis";
import { loader, toast } from "../../utils";
import { addCategoryData, getCategoryDataById, updateCategoryDataById } from "../../services/ServiceCategory";

const AddUpdateCategory = () => {
const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [initialData, setInitialData] = useState(null);
 
   const fetchData = useOutletContext()
          
      const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm({
        defaultValues: {
            id: "343323",
            name: "",
          fileData: null,
        },
      });


       useEffect(() => {
          if (!isAddMode && id) {
            getCategoryDataById(id)
              .then((response) => {
                console.log("Raw API Response:", response);
      
                if (!response || !response.data) {
                  console.error("Error: No data received from API");
                  return;
                }
      
                const data = response.data;
                console.log("Fetched Data:", data);
      
                setInitialData(data[0]);
                setValue("name", data[0].name || "");
                
                setValue("fileData", {
                  fileName: data[0].fileData?.fileName || "",
                  fileUrl: data[0].fileData?.fileUrl || "",
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
              response = await addCategoryData(data);
            } else {
              response = await updateCategoryDataById(id, data);
              console.log(response.data)
            }
        
            if (response && response.data) {
              setInitialData(response.data);
              setValue("id", response.data.id);
              setValue("name", response.data.name);
              setValue("fileData", {
                fileName: response.data.fileData?.fileName || "",
                fileUrl: response.data.fileData?.fileUrl || "",
              });
      
             
              toast.success(
                `Category ${isAddMode ? "added" : "updated"} successfully!`
              );
              navigate("/services");
            } else {
              toast.error("Error: No response data received");
            }
            fetchData();
          } catch (error) {
            console.error("Error saving data:", error);
            toast.error("Error saving data");
          } finally {
            loader.stop();
          }
        }
      
    function onCancel() {
        navigate("/services");
      }
  
  return (
    <div>
         <CustomDialog
           onCancel={onCancel}
           open={true}
           fullWidth
           maxWidth="sm"
           title={`${isAddMode ? "Add" : "Update"} Category  Record`}
         >
           <form onSubmit={handleSubmit(onSubmit)}>
   
        
   
             <div className="mt-3">
               <Controller
                 name="name"
                 control={control}
                 rules={{ required: "Category Name is required" }}
                 render={({ field }) => (
                   <Input
                     required
                     error={!!errors.name}
                     {...field}
                     placeholder="Enter Category Name "
                     label=" Category Name "
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

export default AddUpdateCategory