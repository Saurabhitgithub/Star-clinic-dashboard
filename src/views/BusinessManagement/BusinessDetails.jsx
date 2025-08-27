import React, { useState, useEffect } from "react";
import { CommonPagesHeader } from "../../components/PagesHeaders/CommonPagesHeader";
import { TableContainer } from "../../components/Table/TableContainer";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../components/Inputs/Input";

import { useRef } from "react";
import { uploadMultipleDocs } from "../../services/authApis";
import {
  addBusinessDetails,
  getAllBusinessDetails,
  getBusinessDetailsById,
  updateBusinessDetails,
} from "../../services/businessDetails";
import { loader, toast } from "../../utils";

const BusinessDetails = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("Details");
  const [timeFormat, setTimeFormat] = useState("12 Hours (U.S. Style)");
  const [disablePrescriptions, setDisablePrescriptions] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const { id } = useParams();
  const isAddMode = !id;

  const navigate = useNavigate();

  const tabs = [
    "Details",
    // "System",
  ];

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      businessName: "",
      companyEmail: "",
      companyPhone: "",
      companyWebsite: "",
      country: "",
      urlFriendlyName: "",
      businessType: "",
      fileData: null,
    },
  });

  async function fetchBusiness() {
    try {
      const res = await getAllBusinessDetails(); // Or getBusinessDetailsById(id)
      const business = res?.data?.data?.[0]; // Assuming first one for now
      console.log("Fetched Business Data:", business);
      if (business) {
        setValue("businessName", business.businessName || "");
        setValue("companyEmail", business.companyEmail || "");
        setValue("companyPhone", business.companyPhone || "");
        setValue("companyWebsite", business.companyWebsite || "");
        setValue("country", business.country || "");
        setValue("urlFriendlyName", business.urlFriendlyName || "");
        setValue("businessType", business.businessType || "");
        setValue("fileData", {
          fileName: business.fileData?.fileName || "",
          fileUrl: business.fileData?.fileUrl || "",
        });

        // Optional: Set image preview if needed
        setInitialData(business); // If you have a logo or preview logic
      }
    } catch (error) {
      console.error("Error fetching business:", error);
    }
  }

  useEffect(() => {
    fetchBusiness();
  }, [setValue]);

  async function onSubmit(data) {
    try {
      loader.start();

      // Upload file if it's a new file
      const file = data?.fileData;
      if (file && file instanceof File) {
        const uploadRes = await uploadMultipleDocs([file]);
        const uploadedFile = uploadRes?.data?.data?.[0];

        if (uploadedFile?.fileName && uploadedFile?.fileUrl) {
          data.fileData = {
            fileName: uploadedFile.fileName,
            fileUrl: uploadedFile.fileUrl,
          };
        } else {
          toast.error("File upload failed");
          return;
        }
      }

      const existingRes = await getAllBusinessDetails();
      const existingBusiness = existingRes?.data?.data?.[0];

      let response;
      if (existingBusiness && existingBusiness._id) {
        response = await updateBusinessDetails(existingBusiness._id, data);
      } else {
        response = await addBusinessDetails(data);
      }

      if (response && response.data) {
        const updatedData = response.data;

        setInitialData(updatedData);
        setValue("businessName", updatedData.businessName);
        setValue("companyEmail", updatedData.companyEmail);
        setValue("companyPhone", updatedData.companyPhone);
        setValue("companyWebsite", updatedData.companyWebsite);
        setValue("country", updatedData.country);
        setValue("urlFriendlyName", updatedData.urlFriendlyName);
        setValue("businessType", updatedData.businessType);
        setValue("fileData", {
          fileName: updatedData.fileData?.fileName || "",
          fileUrl: updatedData.fileData?.fileUrl || "",
        });

        toast.success(
          `Business Data ${
            existingBusiness ? "updated" : "added"
          } successfully!`
        );
      } else {
        toast.error("No response from server");
      }

      fetchBusiness();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    } finally {
      loader.stop();
    }
  }

  function onCancel() {
    navigate("/teamManagement");
  }

  return (
    <>
      <CommonPagesHeader
        heading={"Business Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
      />
      <br />
      <TableContainer
        pagination
        title={"Business details"}
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        totalCount={Array.isArray(data) ? data.length : data?.totalCount || 0}
      >
        <div className="flex min-h-screen bg-gray-100">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 p-6 shadow-md">
            <ul className="space-y-4 text-sm">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  className={`cursor-pointer pl-2 border-l-4 ${
                    activeTab === tab
                      ? "text-blue-600 font-medium border-blue-500"
                      : "text-gray-600 border-transparent hover:text-blue-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-10 bg-white">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">{activeTab}</h1>
                <Button primary type="submit">
                  Save Changes
                </Button>
              </div>
              {activeTab === "Details" && (
                <>
                  {/* Logo Section */}
                  <div className="flex justify-center mb-6">
                    <img
                      src="src/assets/images/logo1.png"
                      alt="Logo"
                      className="h-24 object-contain"
                    />
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business Name */}
                    <Controller
                      name="businessName"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Name
                          </label>
                          <input
                            {...field}
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="Enter business name"
                          />
                        </div>
                      )}
                    />

                    {/* Company Email */}
                    <Controller
                      name="companyEmail"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company Email
                          </label>
                          <input
                            {...field}
                            type="email"
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="Enter company email"
                          />
                        </div>
                      )}
                    />

                    {/* Phone Number */}
                    <Controller
                      name="companyPhone"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            {...field}
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="Enter phone number"
                          />
                        </div>
                      )}
                    />

                    {/* Website */}
                    <Controller
                      name="companyWebsite"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Website
                          </label>
                          <input
                            {...field}
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="https://example.com"
                          />
                        </div>
                      )}
                    />

                    {/* Country (Disabled) */}
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <input
                            {...field}
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded "
                          />
                        </div>
                      )}
                    />

                    {/* URL Friendly Name (Disabled) */}
                    <Controller
                      name="urlFriendlyName"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL Friendly Name
                          </label>
                          <input
                            {...field}
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded "
                          />
                        </div>
                      )}
                    />

                    {/* Business Type */}
                    <Controller
                      name="businessType"
                      control={control}
                      render={({ field }) => (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            How would you best describe your main type of
                            business?
                          </label>
                          <input
                            {...field}
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="e.g., breast surgery and facial rejuvenation ..."
                          />
                        </div>
                      )}
                    />
                  </div>

                  {/* Buttons */}
                  {/* <div className="flex gap-4 mt-8">
      <button
        type="button"
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
      >
        Upload Logo
      </button>
      <button
        type="button"
        className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
      >
        Delete
      </button>
    </div> */}
                  {/* 
<Controller
  name="fileData"
  control={control}
  rules={{ required: "File upload is required" }}
  render={({ field: { value, onChange }, fieldState: { error } }) => {
    const fileInputRef = useRef();

    return (
      <div>
      
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) onChange(file); 
          }}
        />

    
        {value && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {value.name || value.fileName}
          </p>
        )}

      
        {value?.fileUrl && (
          <a
            href={value.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-sm mt-1 inline-block"
          >
            View uploaded file
          </a>
        )}

     
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => fileInputRef.current.click()}
          >
            Upload Logo
          </button>

          <button
            type="button"
            className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
            onClick={() => onChange(null)} // clears the file
          >
            Delete
          </button>
        </div>

    
        {error && (
          <p className="text-red-500 text-xs mt-1">{error.message}</p>
        )}
      </div>
    );
  }} 
/>*/}

                  <div className="flex gap-4 mt-5">
                    <Button
                      type="button"
                      className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
                      onClick={() => {
                        reset({
                          businessName: "",
                          companyEmail: "",
                          companyPhone: "",
                          companyWebsite: "",
                          country: "",
                          urlFriendlyName: "",
                          businessType: "",
                          fileData: null,
                        });
                        setInitialData(null); // optional, if you want to clear preview as well
                      }}
                    >
                      Clear Form
                    </Button>
                  </div>
                </>
              )}
            </form>
            {/* {activeTab === "System" && (
              <>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Time Format</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value)}
                  >
                    <option>12 Hours (U.S. Style)</option>
                    <option>24 Hours</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-medium">Disable Prescriptions</label>
                  <div className="flex items-center gap-4">
                    <label>
                      <input
                        type="radio"
                        checked={disablePrescriptions === true}
                        onChange={() => setDisablePrescriptions(true)}
                      />
                      <span className="ml-1">Yes</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={disablePrescriptions === false}
                        onChange={() => setDisablePrescriptions(false)}
                      />
                      <span className="ml-1">No</span>
                    </label>
                  </div>
                </div>
              </>
            )} */}

            {/* Add similar blocks for other tabs like Security, Social, etc. if needed */}
          </main>
        </div>
      </TableContainer>
    </>
  );
};

export default BusinessDetails;
