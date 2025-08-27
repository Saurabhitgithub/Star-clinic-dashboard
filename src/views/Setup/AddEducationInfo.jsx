import React, { useEffect, useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../components/Inputs/Input";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { useNavigate, useParams } from "react-router";
import { DragAndDropInput } from "../../components/Inputs/DragAndDropInput";
import { addEducation, addEducationCategory, getAllEducationCategory } from "../../services/offersApis";
import { loader, toast } from "../../utils";
import { RiAddBoxLine } from "react-icons/ri";
import { Label } from "../../components/Inputs/Label";
import { AutocompleteSelect } from "../../components/Inputs/Select";
 
const mockData = {
  1: {
    type: "Acne Tips",
    user_id: "123",
    category: "skinCare",
    sendTime: "immediately",
    educationType: "text",
    content: "Wash face twice daily",
    fileData: null,
  },
};
 
const AddEducationInfo = ({isModalOpen, setIsModalOpen,fetchAllEducation}) => {
  const navigate = useNavigate();
  const { id, educationId } = useParams();
    const [isModalOpen1, setIsModalOpen1] = useState(false);
 
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
 
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      user_id: id,
      category: "",
      sendTime: "immediately",
      educationType: "text",
      content: "",
      fileData: null,
    },
  });
 
 
  useEffect(() => {
    if (isModalOpen && !educationId) {
      reset({
        title: "",
        user_id: id,
        category: "",
        sendTime: "immediately",
        educationType: "text",
        content: "",
        fileData: null,
       
      });
    }
  }, [isModalOpen, educationId, reset, id]);
 
  const educationType = watch("educationType");
 
  useEffect(() => {
    if (educationId && mockData[educationId]) {
      reset({
        ...mockData[educationId],
        user_id: id,
      });
    }
  }, [educationId, reset, id]);
 
  const onSubmit = async (data) => {
    console.log(educationId ? "Updating..." : "Creating...", data);
 
    try {
      loader.start();
      const response = await addEducation(data);
      if (response?.data) {
        toast.success("Education information added successfully!");
        fetchAllEducation()
        setIsModalOpen(false)
 
        // navigate(`/setup`);
      } else {
        toast.error("Error: No response data received");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    } finally {
      loader.stop();
    }
  };
 
  const fetchCategories = async () => {
    try {
      loader.start();
      const response = await getAllEducationCategory();
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        toast.error("Error: No response data received");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data");
    } finally {
      loader.stop();
    }
  };
 
  useEffect(() => {
    fetchCategories();
  }, []);
 
  const EducationCategory = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }
 
    try {
      loader.start();
      const response = await addEducationCategory({ name: categoryName });
 
      if (response?.data) {
        toast.success("Category added successfully!");
        const newCat = response.data;
        await fetchCategories();
        setValue("category", newCat._id); // ✅ auto-select new category
        setCategoryName("");
        setIsModalOpen1(false);
      } else {
        toast.error("Error: No response data received");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    } finally {
      loader.stop();
    }
  };
 
  const onCancel = () => setIsModalOpen(false);
  const onCancel1 = () => setIsModalOpen1(false);
 
  return (
    <div className="p-4 md:p-2 lg:p-8 max-w-2xl mx-auto">
      <CustomDialog
        onCancel={onCancel}
        open={isModalOpen}
        fullWidth
        maxWidth="sm"
        title={educationId ? "Edit Education" : "Add Education"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Education Type */}
          <Controller
            name="educationType"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Education Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="radio" value="text" checked={field.value === "text"} onChange={field.onChange} />
                    <span>Text Education</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" value="video" checked={field.value === "video"} onChange={field.onChange} />
                    <span>Video Education</span>
                  </label>
                </div>
              </div>
            )}
          />
 
          {/* Title */}
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title name is required" }}
            render={({ field }) => (
              <Input required error={!!errors.title} {...field} placeholder="Title Name" label="Title Name" />
            )}
          />
 
          {/* Category with Add button */}
          <div className="flex gap-3">
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field: { value, onChange } }) => (
                <div className="w-full">
                  <Label  required className="block mb-1 text-sm font-medium text-gray-700">Category</Label>
                  <AutocompleteSelect
                    label="Select Category"
                    className="w-full"
                    options={categories.map((cat) => ({
                      label: cat.name,
                      value: cat._id,
                    }))}
                    getOptionLabel={(option) => option.label}
                    value={categories.find((cat) => cat._id === value)}
                    onChange={(e, val) => onChange(val ? val.value : null)}
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  />
                </div>
              )}
            />
            <div className="pt-2 mt-6">
              <RiAddBoxLine size={24} className="text-gray-500 cursor-pointer" onClick={() => setIsModalOpen1(true)} />
            </div>
          </div>
 
          {/* Send Time */}
          <Controller
            name="sendTime"
            control={control}
            rules={{ required: "Send time is required" }}
            render={({ field }) => (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Send Time</label>
                <select
                  {...field}
                  className={`w-full p-2 border rounded-md ${
                    errors.sendTime ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="immediately">Immediately</option>
                </select>
                {errors.sendTime && <p className="text-sm text-red-500 mt-1">{errors.sendTime.message}</p>}
              </div>
            )}
          />
 
          {/* Content */}
          <Controller
            name="content"
            control={control}
            rules={{
              required:
                educationType === "text"
                  ? "Text content is required"
                  : "Video description is required",
            }}
            render={({ field }) => (
              <Input
              required
                {...field}
                placeholder={
                  educationType === "text"
                    ? "Enter your text content here..."
                    : "Enter video description or notes here..."
                }
                label={
                  educationType === "text" ? "Text Content" : "Video Description"
                }
                error={!!errors.content}
              />
            )}
          />
 
          {/* File Upload */}
          <Controller
            name="fileData"
            control={control}
            rules={{ required: "File upload is required" }}
            render={({ field: { value, onChange } }) => (
              <DragAndDropInput
                fileLimit={1}
                label="Upload File"
                value={[value].filter(Boolean)}
                onChange={(e) => onChange(e[0])}
                acceptedFileTypes={[]}
                error={!!errors?.fileData}
              />
            )}
          />
 
          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-end gap-3 mt-4">
            <Button onClick={onCancel} bordered type="button" className="w-full md:w-auto">
              Cancel
            </Button>
            <Button primary type="submit" className="w-full md:w-auto">
              {educationId ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </CustomDialog>
 
      {/* Modal for Adding Category */}
      <CustomDialog open={isModalOpen1} onCancel={onCancel1} title="Category Name">
        <div className="p-4">
          <Input
            label="Add Category"
            placeholder="Enter category name"
            required
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              if (e.target.value.trim() !== "") setError("");
            }}
            error={!!error}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={onCancel1} bordered>
              Cancel
            </Button>
            <Button primary onClick={EducationCategory}>
              Add
            </Button>
          </div>
        </div>
      </CustomDialog>
    </div>
  );
};
 
export default AddEducationInfo;