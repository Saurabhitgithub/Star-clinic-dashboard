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

const CreateCreditNotes = () => {
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
                title={`Generate Credit Notes`}
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
                          placeholder="Enter Invoice Number "
                          label="Invoice Number"
                        />
                      )}
                    />
                  </div>

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
                                        placeholder="Enter Patient Name "
                                        label="Patient Name"
                                      />
                                    )}
                                  />
                                </div>
        
                  <div className="mt-3">
                    <Controller
                      name="Credit Amount"
                      control={control}
                      rules={{ required: "Subject is required" }}
                      render={({ field }) => (
                        <Input
                          required
                          error={!!errors.Invoice}
                          {...field}
                          placeholder="Enter Credit Amount"
                          label="Credit Amount"
                        />
                      )}
                    />
                  </div>
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
                                        placeholder="Enter Service "
                                        label="Service"
                                      />
                                    )}
                                  />
                                </div>
                     <div className="mt-3 ">
                             <Label>Reason for Credit</Label>
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
                
          
               
                  <div className="flex justify-end gap-3 mt-10">
                    <Button onClick={onCancel} bordered type="button">
                      Cancel
                    </Button>
                    <Button primary type="submit">
                      {/* {isAddMode ? "Add" : "Update"} */}
                      Save
                    </Button>
                  </div>
                </form>
              </CustomDialog>
            </>
  )
}

export default CreateCreditNotes