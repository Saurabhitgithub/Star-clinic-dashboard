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
import { getAllServiceData } from "../../../services/ServiceCategory";
import { addEquipmentService, getEquipmentServiceById, updateEquipmentServiceById } from "../../../services/ResourceManagement";

const AddEquipmentServiceDetails = () => {
  const { id, docId } = useParams();
  const isAddMode = !docId;
  const navigate = useNavigate();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [open, setOpen] = useState(true);
  const [services, setServices] = useState([]);

const fetchEquipmentServiceData = useOutletContext()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      resource_service_name: "",
      location: "",
      resource_id:"",
      all_services: false,
    },
  });

useEffect(()=>{
  if(!isAddMode && docId){
    getEquipmentServiceById(docId)
    .then((response)=>{
      console.log("Raw api response:",response);
      if(!response || !response.data){
        console.error("Error : No data received from API");
      }

      const data = response.data;
      console.log("fetch the data :",data);
      setInitialData(data);
      setValue("resource_service_name", data.resource_service_name || "");
      setValue("location", data.location || "");
      setValue("resource_id", data.resource_id|| "");
      setValue("all_services", Boolean(data.all_services));
    })
    .catch((error)=>{
      console.error("Error fetching Data:",error);
    });
  }
},[id,isAddMode,setValue]);




async function onSubmit(data){
        try {
          data.resource_id=id;
          data.all_services=Boolean(data.all_services);
          loader.start()
          let response;
          if (isAddMode){
            response=await addEquipmentService(data);
          }else{
            response= await updateEquipmentServiceById(docId,data);
          }

          if(response && response.data){
            setInitialData(response.data);
            setValue("resource_service_name", response.data.resource_service_name);
            setValue("location", response.data.location);
            setValue("resource_id", response.data.resource_id);
            setValue("all_services", response.data.all_services);
      
            toast.success(
              ` Equipment service Details ${isAddMode ? "added" : "updated"} successfully`
            )
           
            navigate(`/equipmentServiceListing/${id}`)

          }else{
            toast.error("Error:No response data received")
          }

          fetchEquipmentServiceData()
        } catch (error) {
          console.error("Error in saving the data ",error);
          toast.error("Error in saving the data")
        }finally{
           loader.stop()
        }
}








  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServiceData();
        console.log("Service response:", response);

        setServices(response.data.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);
  function onCancel() {
    setOpen(false);
    navigate(`/equipmentServiceListing/${id}`);
  }

  return (
    <div>
      {" "}
      <CustomDialog
        onCancel={onCancel}
        open={open}
        fullWidth
        maxWidth="sm"
        title={`${
          isAddMode ? "Add" : "Update"
        } Equipment Service Details Record`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="mt-3">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Services
              </label>
              <Controller
                name="resource_service_name"
                control={control}
                rules={{ required: "Service is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.resource_service_name ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.service_name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.Services && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Services.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3">
            <Controller
              name="location"
              control={control}
              rules={{ required: "Location is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Location"
                  label="Location"
                  error={!!errors.location}
                />
              )}
            />
          </div>
          <div className="mt-4">
            <Controller
              name="available_services"
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
  );
};

export default AddEquipmentServiceDetails;
