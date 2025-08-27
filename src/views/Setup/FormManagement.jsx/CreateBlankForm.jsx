import React, { useEffect, useState } from "react";
import { Button } from "../../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/Inputs/Input";
import { DragAndDropInput } from "../../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { uploadMultipleDocs } from "../../../services/authApis";
import { getUserData, loader, toast } from "../../../utils";
import { Label } from "../../../components/Inputs/Label";
import { Editor } from "../../../components/Inputs/Editor";
import { addBlankFormData, getBlankFormById, updateBlankFormById } from "../../../services/blankFormManagement";

const CreateBlankForm = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [open, setOpen] = useState(true);

  const fetchBlankFormData = useOutletContext();

  console.log("Extracted Params:", { id });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      gender: "",
      contact_number: "",
      address: "", 
      title: "",
      subject: "",
      description: "",
         fileData: null,
    },
  });


  useEffect(() => {
    if (!isAddMode && id) {
      getBlankFormById(id)
        .then((response) => {
          console.log("Raw Api response:", response);
          if (!response || !response.data) {
            console.error("error no data received from the api");
          }
          const data = response.data;
          console.log("fetch data :", data);
          
          setInitialData(response.data);
          setValue("full_name", response.data.full_name);
          setValue("gender", response.data.gender);
          setValue("contact_number", response.data.contact_number);
          setValue("address", response.data.address);
          setValue("title", response.data.title);
          setValue("subject", response.data.subject);
          setValue("description", response.data.description);
          setValue("fileData", {
            fileName: response.data.fileData?.fileName || "",
            fileUrl: response.data.fileData?.fileUrl || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error("Error fetching the data ");
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
          response = await addBlankFormData(data);
        } else {
          response = await updateBlankFormById(id, data);
        }
  
        if (response && response.data) {
          setInitialData(response.data);
          setValue("full_name", response.data.full_name);
          setValue("gender", response.data.gender);
          setValue("contact_number", response.data.contact_number);
          setValue("address", response.data.address);
          setValue("title", response.data.title);
          setValue("subject", response.data.subject);
          setValue("description", response.data.description);
          setValue("fileData", {
            fileName: response.data.fileData?.fileName || "",
            fileUrl: response.data.fileData?.fileUrl || "",
          });
          toast.success(`Form Data ${isAddMode ? "added" : "updated"} successfully !`);
          navigate("/BlankForm");
        } else {
          toast.error("Error:No response data received");
        }
  
        fetchBlankFormData();
      } catch (error) {
        console.error("Error saving the data ", error);
        toast.error("error saving the data");
      } finally {
        loader.stop();
      }
    }
  function onCancel() {
    setOpen(false);
    navigate(`/BlankForm`);
  }
  return (
    <>
      <CustomDialog
        onCancel={onCancel}
        open={open}
        fullWidth
        maxWidth="sm"
        title={`${isAddMode ? "Add" : "Update"} Form Data`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
       
          <div className="mt-3 ">
            <Controller
              name="full_name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Name"
                  label="Full Name"
                  error={!!errors.full_name}
                />
              )}
            />
          </div>
          <div className="mt-3">
  <label className="block font-medium mb-1">
    Gender <span className="text-red-500">*</span>
  </label>
  <Controller
    name="gender"
    control={control}
    rules={{ required: "Gender is required" }}
    render={({ field }) => (
      <select
        {...field}
        className={`w-full border p-2 rounded ${
          errors.gender ? "border-red-500" : ""
        }`}
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    )}
  />
  {errors.gender && (
    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
  )}
</div>

          <div className="mt-3 ">
            <Controller
              name="contact_number"
              control={control}
              rules={{ required: "Contact is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Contact Number"
                  label="Contact Number"
                  error={!!errors.contact_number}
                />
              )}
            />
          </div>

          <div className="mt-3 ">
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Adresss"
                  label=" Address"
                  error={!!errors.address}
                />
              )}
            />
          </div>
            <div className="mt-3 ">
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Title"
                  label="Title"
                  error={!!errors.fileName}
                />
              )}
            />
          </div> 

          <div className="mt-3 ">
            <Controller
              name="subject"
              control={control}
              rules={{ required: "subject is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Subject"
                  label="Subject"
                  error={!!errors.subject}
                />
              )}
            />
          </div>

          <div className="mt-3 ">
            <Label>Description</Label>
            <Controller
              name="description"
              control={control}
              defaultValue={null}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                return <Editor height={80} value={value} onChange={onChange} />;
              }}
            />
          </div>
          <div className="mt-9 ">
            <Controller
              name="fileData"
              control={control}
              rules={{ required: "File upload is required" }}
              render={({ field: { value, onChange } }) => (
                <DragAndDropInput
                  fileLimit={1}
                  label={"Upload Media"}
                  value={[value].filter((e) => e)}
                  setDeleted={setDeletedFiles}
                  acceptedFileTypes={[]}
                  onChange={(e) => onChange(e[0])}
                  error={!!errors?.fileData}
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
  );
};

export default CreateBlankForm;
