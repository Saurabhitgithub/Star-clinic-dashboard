import React, { useEffect, useState } from "react";
import { Button } from "../../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/Inputs/Input";
import { DragAndDropInput } from "../../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { loader, toast } from "../../../utils";
import { Label } from "../../../components/Inputs/Label";
import { Editor } from "../../../components/Inputs/Editor";

const EmailFinancialDetails = () => {
       const { id } = useParams();
          const isAddMode = !id;
          const navigate = useNavigate();
          const [deletedFiles, setDeletedFiles] = useState([]);
          const [initialData, setInitialData] = useState(null);
    
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
    
          function onCancel() {
            navigate("/financialDetails");
          }
  return (
 <>
           <CustomDialog
             onCancel={onCancel}
             open={true}
             fullWidth
             maxWidth="sm"
             title={`${isAddMode ? "Add" : "Update"} New Mail`}
           >
             {/* <form onSubmit={handleSubmit(onSubmit)}> */}
             <form>
               <div className="mt-3">
                 <Controller
                   name="Invoice"
                   control={control}
                   rules={{ required: "Test Name is required" }}
                   render={({ field }) => (
                     <Input
                     //   required
                       error={!!errors.Invoice}
                       {...field}
                       placeholder="Enter Email "
                       label="To"
                     />
                   )}
                 />
               </div>
     
 
       
               <div className="mt-3">
                 <Controller
                   name="Employee"
                   control={control}
                   rules={{ required: "Subject is required" }}
                   render={({ field }) => (
                     <Input
                       required
                       error={!!errors.Invoice}
                       {...field}
                       placeholder="Enter Subject"
                       label="Subject"
                     />
                   )}
                 />
               </div>
                  <div className="mt-3 ">
                          <Label>Message</Label>
                          <Controller
                            name='description'
                            control={control}
                            defaultValue={null}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => {
                              return (
                                <Editor height={80} value={value} onChange={onChange} />
                              )
                            }}
                          />
                        </div>
            
               <div className="mt-7">
                 <Controller
                   name="fileData"
                   control={control}
                   rules={{ required: "File upload is required" }}
                   render={({ field: { value, onChange } }) => (
                     <DragAndDropInput
                       required
                       error={!!errors?.fileData}
                       fileLimit={1}
                       label={"Upload Data"}
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
                   {/* {isAddMode ? "Add" : "Update"} */}
                   Send
                 </Button>
               </div>
             </form>
           </CustomDialog>
         </>
  )
}

export default EmailFinancialDetails