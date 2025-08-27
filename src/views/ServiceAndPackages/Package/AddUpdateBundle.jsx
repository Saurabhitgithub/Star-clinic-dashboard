import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router";
import { DataTable, TableColumn } from "../../../components/Table/DataTable";
import { ConfirmationDialog } from "../../../components/Dialogs/ConfirmationDialog";
import { EditIcon } from "../../../components/Icons/SvgIcons";
import { TableContainer } from "../../../components/Table/TableContainer";
import { DeleteButton } from "../../../components/Buttons/DeleteButton";
import { StatusTag } from "../../../components/common/StatusTag";
import { CommonPagesHeader } from "../../../components/PagesHeaders/CommonPagesHeader";
// import { useLocation } from "react-router";
import { Input } from "../../../components/Inputs/Input";
import { Switch } from "@headlessui/react";
import { Button } from "../../../components/Buttons/Button";
import { CustomDialog } from "../../../components/Dialogs/CustomDialog";

import { useForm, Controller } from "react-hook-form";
import { addBundleData, getBundleDataById, updateBundleDataById } from "../../../services/ServiceCategory";
import { loader, toast } from "../../../utils";
const AddUpdateBundle = (defaultValues = {}) => {
 
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id, docId } = useParams();
  const navigate = useNavigate();
  const isAddMode = !id;
  const [selectedTab, setSelectedTab] = useState("general");
  const [showDialog, setShowDialog] = useState(true);
   const [initialData, setInitialData] = useState(null);

   

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      name: "",
      available_online: false,
      ...defaultValues,
    },
  });



  useEffect(() => {
    if (!isAddMode && id) {
      getBundleDataById(id)
        .then((response) => {
          if (!response?.data) {
            console.error("Error: No data received from API");
            return;
          }
  
          const data = response.data;
          console.log("Fetched Data:", data);
  
          setInitialData(data);
  
          
          setValue("id",data._id);
          setValue("name",data.name);
          setValue("available_online",data.available_online);
         
          setValue("status", data.status);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error("Error fetching data");
        });
    }
  }, [id]);
  
   async function onSubmit(data) {
      try {
  
        loader.start();
        let response;
        if (isAddMode) {
          response = await addBundleData(data);
        } else {
          response = await updateBundleDataById(id, data);
          console.log(response.data);
        }
  
        if (response && response.data) {
          setInitialData(response.data);
          setValue("id", response.data.id);
          setValue("name", response.data.name);
          setValue("available_online", response.data.available_online);
  
          toast.success(` Bundle ${isAddMode ? "added" : "updated"} successfully!`);
          navigate("/packages");
        } else {
          toast.error("Error: No response data received");
        }
        
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("Error saving data");
      } finally {
        loader.stop();
      }
    }

  const onCancel = () => {
    setShowDialog(false);
    
    if (selectedTab === "general") {
      navigate("/packages");
    }
  };
  const availableOnline = watch("availableOnline");

  return (
    <>
      <CommonPagesHeader
        heading={"Package Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={
          selectedTab === "items"
            ? {
                title: "Add Item",
                show: true,
                onClick: () =>
                  navigate("/packages/addBundle/add", { replace: true }),
              }
            : {
                title: "",
                show: false,
                onClick: () => {}, 
              }
        }
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      {/* Tab Buttons */}
      <div className="flex gap-4 mt-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            selectedTab === "general" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedTab("general")}
        >
          General
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedTab === "items" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedTab("items")}
        >
          Items
        </button>
      </div>
      <CustomDialog
          onCancel={onCancel}
          open={showDialog}
          fullWidth
          maxWidth="sm"
          title={`${isAddMode ? "Add" : "Update"} Bundle Details `}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Bundle Name Field */}
            <div className="mt-3">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Bundle name is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Bundle Name"
                    placeholder="Enter bundle name"
                    error={!!errors.name}

                  />
                )}
              />
            </div>

            {/* Online Availability Toggle */}
            <div className="mt-4">
              <Controller
                name="available_online"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <label className="font-medium">
                      Available for Online Purchase
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={onCancel} bordered type="button">
                Cancel
              </Button>
              <Button type="submit" primary>
                Save
              </Button>
            </div>
          </form>
        </CustomDialog>
     
      <Outlet />
    </>
  );
};

export default AddUpdateBundle;
