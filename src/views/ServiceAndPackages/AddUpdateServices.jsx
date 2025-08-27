import React, { useEffect, useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../components/Inputs/Input";
import { DragAndDropInput } from "../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { uploadMultipleDocs } from "../../services/authApis";
import { loader, toast } from "../../utils";
import { addServiceData, getAllCategoryData, getServiceDataById, updateServiceDataById } from "../../services/ServiceCategory";
import { Label } from "../../components/Inputs/Label";
 
const AddUpdateServices = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [categories, setCategories] = useState([]);
 const fetchData = useOutletContext()
 
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      service_name: "",
      service_code: "",
      service_category: "",
      fileData: null,
    },
  });
 
   useEffect(() => {
            if (!isAddMode && id) {
              getServiceDataById(id)
                .then((response) => {
                  console.log("Raw API Response:", response);
       
                  if (!response || !response.data) {
                    console.error("Error: No data received from API");
                    return;
                  }
       
                  const data = response.data;
                  console.log("Fetched Data:", data);
       
                  setInitialData(data);
                  setValue("service_name", data.service_name || "");
                  setValue("service_code", data.service_code|| "");
                  setValue("service_category", data.service_category || "");
                  setValue("fileData", {
                    fileName: data.fileData?.fileName || "",
                    fileUrl: data.fileData?.fileUrl || "",
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
                response = await addServiceData(data);
              } else {
                response = await updateServiceDataById(id, data);
                console.log(response.data)
              }
         
              if (response && response.data) {
                setInitialData(response.data);
                setValue("id", response.data.id);
                setValue("service_name", response.data.service_name);
                setValue("service_code", response.data.service_code);
                setValue("service_category", response.data.service_category);
                setValue("fileData", {
                  fileName: response.data.fileData?.fileName || "",
                  fileUrl: response.data.fileData?.fileUrl || "",
                });
       
               
                toast.success(
                  `Service ${isAddMode ? "added" : "updated"} successfully!`
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
 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoryData();
        const categoryList = response.data?.data || [];
        setCategories(categoryList);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
 
    fetchCategories();
  }, []);
 
 
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
        title={`${isAddMode ? "Add" : "Update"} Service Record`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
 
       
          <div className="mt-3">
            <Controller
              name="service_name"
              control={control}
              rules={{ required: "Service Name is required" }}
              render={({ field }) => (
                <Input
                  required
                  error={!!errors.service_name}
                  {...field}
                  placeholder="Enter Service Name "
                  label="Service Name "
                />
              )}
            />
          </div>
 
          <div className="mt-3">
            <Controller
              name="service_code"
              control={control}
              rules={{ required: "Service Code is required" }}
              render={({ field }) => (
                <Input
                  required
                  error={!!errors.service_code}
                  {...field}
                  placeholder="Service Code"
                  label="Service Code"
                />
              )}
            />
          </div>
          <div className="mt-3">
            <Controller
              name="service_category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <div className="flex flex-col w-full">
                  <Label required className="mb-1 text-sm font-medium text-gray-700">
                    Category
                  </Label>
                  <select
                    {...field}
                    className={`w-full px-3 py-2 border rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="text-xs text-red-500 mt-1">
                      {errors.category.message}
                    </span>
                  )}
                </div>
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
  );
};
 
export default AddUpdateServices;