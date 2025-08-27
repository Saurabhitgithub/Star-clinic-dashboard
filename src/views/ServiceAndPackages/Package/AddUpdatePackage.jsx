import React, {  useEffect, useState } from "react";
import { Button } from "../../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/Inputs/Input";
import { CustomDialog } from "../../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
import {
  addPackageData,
  getAllServiceData,
  getPackageDataById,
  updatePackageDataById,
} from "../../../services/ServiceCategory";
import { loader, toast } from "../../../utils";
const AddUpdatePackage = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  console.log("Extracted Params:", { id });
  const isAddMode = !id;
  const [initialData, setInitialData] = useState(null);
  const [services, setServices] = useState([]);

   const fetchData = useOutletContext()
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_id: id || "",
      package_name: "",
      package_price: "",
      service: "",
      session: "",
      available_online: "",
    },
  });
  const navigate = useNavigate();




   useEffect(() => {
              if (!isAddMode && id) {
                getPackageDataById(id)
                  .then((response) => {
                    console.log("Raw API Response:", response);
          
                    if (!response || !response.data) {
                      console.error("Error: No data received from API");
                      return;
                    }
          
                    const data = response.data;
                    console.log("Fetched Data:", data);
          
                    setInitialData(data);
                    setValue("package_name", data.package_name || "");
                    setValue("package_price", data.package_price || "");
                    setValue("service", data.service || "")
                    setValue("session", data.session || "")
                    setValue("available_online", data.available_online || "")
                    
                  })
                  .catch((error) => {
                    console.error("Error fetching data:", error);
                    toast.error("Error fetching data");
                  });
              }
            }, [id, isAddMode, setValue]);


  async function onSubmit(data) {
    try {

      loader.start();
      let response;
      if (isAddMode) {
        response = await addPackageData(data);
      } else {
        response = await updatePackageDataById(id, data);
        console.log(response.data);
      }

      if (response && response.data) {
        setInitialData(response.data);
        setValue("id", response.data.id);
        setValue("package_name", response.data.package_name);
        setValue("package_price", response.data.package_price);
        setValue("service", response.data.service);
        setValue("session", response.data.session);
        setValue("available_online", response.data.available_online);

        toast.success(`Package ${isAddMode ? "added" : "updated"} successfully!`);
        navigate("/packages");
      } else {
        toast.error("Error: No response data received");
      }
      fetchData()
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    } finally {
      loader.stop();
    }
  }

  async function fetchServices() {
    try {
      const response = await getAllServiceData();
      setServices(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch services", error);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  function onCancel() {
    navigate(`/packages`);
  }

  return (
    <CustomDialog
      onCancel={onCancel}
      open={open}
      fullWidth
      maxWidth="sm"
      title={`${isAddMode ? "Add" : "Update"} Package Record`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="package_name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Enter Name"
              label="Name"
              error={!!errors.fileName}
            />
          )}
        />
        <div className="mt-3">
          <Controller
            name="package_price"
            control={control}
            rules={{ required: "Price is required" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Price"
                label="Price"
                error={!!errors.created_by}
              />
            )}
          />
        </div>

        <div className="mt-3">
          <Controller
            name="service"
            control={control}
            rules={{ required: "Service is required" }}
            render={({ field }) => (
              <div className="flex flex-col w-full">
                <label className="mb-1 text-sm font-medium text-gray-700">
                  Service
                </label>
                <select
                  {...field}
                  className={`w-full px-3 py-2 border rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.service_name ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Service</option>
                  {services.map((ser) => (
                    <option key={ser._id} value={ser._id}>
                      {ser.service_name}
                    </option>
                  ))}
                </select>
                {errors.service_name && (
                  <span className="text-xs text-red-500 mt-1">
                    {errors.service_name.message}
                  </span>
                )}
              </div>
            )}
          />
        </div>
        <div className="mt-3">
          <Controller
            name="session"
            control={control}
            rules={{ required: "Session is required" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Session"
                label="Session"
                error={!!errors.Session}
              />
            )}
          />
        </div>

        <div className="mt-3 mb-3">
          <Controller
            name="available_online"
            control={control}
            rules={{ required: "Session is required" }}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Online
                </label>
                <select
                  {...field}
                  className={`w-full px-3 py-2 border rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.available_online ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {errors.available_online && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.available_online.message}
                  </p>
                )}
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
  );
};

export default AddUpdatePackage;
