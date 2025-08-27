import React, { useEffect, useState } from "react";
import { Button } from "../../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/Inputs/Input";
import { DragAndDropInput } from "../../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { loader, toast } from "../../../utils";

const AddFinancialsDetails = () => {

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


      useEffect(()=>{
         if(!isAddMode && id){
          getFinancialDataById(id)
          .then((response)=>{
            console.log("Raw API response:",response);
           if(!response || !response.data){
            console.error("error no data received from the Api")
           }
          
           const data=response.data;
           console.log("fetch data :",data);
           setValue("InvpoiceNo",data.invoiceNo ||"");
            setValue("InvpoiceNo",data.invoiceNo ||"");
             setValue("InvpoiceNo",data.invoiceNo ||"");
              setValue("InvpoiceNo",data.invoiceNo ||"");
          })
            .catch((error) =>{
             console.error("Error fetching the data:",error);
             toast.error("Error fetching the data");
            })
        
         }
      },[id,isAddMode,setValue]);

       async function  onSubmit(data) {
        try {
          loader.start();
          let response;
          if(isAddMode){
            response= await addFinancialData();
          }else{
            response = await updateFinancialData();
          }

          if(response && response.data){
            setInitialData(response.data);
            setValue("InvoiceNo" ,response.data.InvoiceNo);
            setValue("InvoiceNo" ,response.data.InvoiceNo);
            setValue("InvoiceNo" ,response.data.InvoiceNo);
            setValue("InvoiceNo" ,response.data.InvoiceNo);

          toast.success(`Financial Data ${isAddMode ? "added" : "updated"} successfully !`)
          navigate("/financialDetails")
          }else{
            toast.error("Error : No response data received");
          }
        } catch (error) {
          console.error("Error saving the data",error);
          toast.error("error in saving the data")
        }finally{
          loader.stop();
        }
       }
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
           title={`${isAddMode ? "Add" : "Update"} Financials  Record`}
         >
           {/* <form onSubmit={handleSubmit(onSubmit)}> */}
           <form>
             <div className="mt-3">
               <Controller
                 name="Invoice"
                 control={control}
                 rules={{ required: "Invoice is required" }}
                 render={({ field }) => (
                   <Input
                     required
                     error={!!errors.Invoice}
                     {...field}
                     placeholder="Enter Invoice"
                     label="Invoice"
                   />
                 )}
               />
             </div>
   
             <div className="mt-3">
             <Controller
                 name="Employee"
                 control={control}
                 rules={{ required: "Employee is required" }}
                 render={({ field }) => (
                   <Input
                     required
                     error={!!errors.Invoice}
                     {...field}
                     placeholder="Enter Employee"
                     label="Employee"
                   />
                 )}
               />
             </div>
   
             <div className="mt-3">
             <Controller
                 name="Location"
                 control={control}
                 rules={{ required: "Location is required" }}
                 render={({ field }) => (
                   <Input
                    
                     error={!!errors.Location}
                     {...field}
                     placeholder="Enter Location"
                     label="Location"
                   />
                 )}
               />
             </div>

             
             <div className="mt-3">
             <Controller
                 name="Amount ($)"
                 control={control}
                 rules={{ required: "Amount ($) is required" }}
                 render={({ field }) => (
                   <Input
                    
                     error={!!errors.Amount}
                     {...field}
                     placeholder="Enter Amount ($)"
                     label="Amount ($)"
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
  )
}

export default AddFinancialsDetails