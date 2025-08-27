import React, { useEffect, useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../components/Inputs/Input";
import { DragAndDropInput } from "../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { useNavigate, useParams } from "react-router";
import { loader, toast, uploadMultipleFilesPromise } from "../../utils";
import { Editor } from "../../components/Inputs/Editor";
import { Label } from "../../components/Inputs/Label";
import { Grid2 } from "@mui/material";
import {
  useAddProductDataMutation,
  useGetProductDataByIdQuery,
  useUpdateProductDataByIdMutation,
} from "../../store/apiSlices/productApiSlices";
import { AutocompleteSelect } from "../../components/Inputs/Select";
import { IMAGES_EXTENSIONS, PRODUCTS_TYPES } from "../../utils/constants";
import { RiAddBoxLine } from "react-icons/ri";
 
import { addCategory, getAllCategory } from "../../services/offersApis";
 
export const CreateUpdateProduct = ({ mode }) => {
  const isAddMode = mode === "add";
  const { id } = useParams();
 
  const { data: productData, isLoading } = useGetProductDataByIdQuery(id, {
    skip: isAddMode,
  });
  useEffect(() => {
    if (isLoading) {
      loader.start();
    } else {
      loader.stop();
    }
  }, [isLoading]);
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
 
  // Function to open the modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [addProduct] = useAddProductDataMutation();
  const [updateProduct] = useUpdateProductDataByIdMutation();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      fileData: [],
      description: "",
      quantity: "",
      price: "",
      product_type: "",
    },
    values: productData
      ? {
          name: productData?.name || "",
          fileData: productData?.fileData || [],
          description: productData?.description || "",
          quantity: productData?.quantity || "",
          price: productData?.price || "",
          product_type: productData?.product_type,
        }
      : {},
  });
 
  async function onSubmit(data) {
    try {
      loader.start();
      const imagesData = await uploadMultipleFilesPromise(data.fileData);
      data.fileData = imagesData;
      setValue("fileData", data.fileData);
      const body = { ...data };
 
      if (id) {
        await updateProduct({ id, data: body });
      } else {
        await addProduct(body);
      }
      toast.success(`Product ${isAddMode ? "added" : "updated"} successfully.`);
      navigate("/products");
    } catch (error) {
      console.log(error);
      toast.error("Some Error occured !");
    } finally {
      loader.stop();
    }
  }
 
  const handleCategoryUpdate = async () => {
    if (!categoryName.trim()) {
      return;
    }
 
    try {
      loader.start();
 
      const response = await addCategory({ name: categoryName });
      fetchCategories();
      if (response?.data) {
        toast.success("Category information added successfully!");
        closeModal();
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
 
      const response = await getAllCategory();
      console.log("API Response:", response.data.data);
 
      if (response?.data?.data && Array.isArray(response.data?.data)) {
        console.log("Setting categories:", response.data);
        setCategories(response?.data?.data);
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
 
  function onCancel() {
    navigate("/products");
  }
 
  return (
    <>
      <div className="font-bold mb-3">
        {isAddMode ? "Create" : "Update"} Product
      </div>
      <div className="bg-white p-[30px] card rounded-xl shadow">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container columnSpacing={2} spacing={1}>
            <Grid2 size={6}>
              <Controller
                name="name"
                control={control}
                defaultValue={null}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Input
                      required
                      error={!!errors?.name}
                      value={value}
                      onChange={onChange}
                      placeholder="Product Name"
                      label="Product Name"
                    />
                  );
                }}
              />
            </Grid2>
            <Grid2 size={6}>
              <Controller
                name="quantity"
                control={control}
                defaultValue={null}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Input
                      required
                      error={!!errors?.quantity}
                      value={value}
                      onChange={onChange}
                      type="number"
                      placeholder="Quantity"
                      label="Quantity"
                    />
                  );
                }}
              />
            </Grid2>
            <Grid2 size={6}>
              <Controller
                name="price"
                control={control}
                defaultValue={null}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Input
                      required
                      error={!!errors?.price}
                      value={value}
                      onChange={onChange}
                      type="number"
                      placeholder="Price"
                      label="Price"
                    />
                  );
                }}
              />
            </Grid2>
            <Grid2 size={6}>
              <Label>
                Category<span className="text-red-500">*</span>
              </Label>
 
              <div className="flex gap-3">
                <Controller
                  name="product_type"
                  control={control}
                  defaultValue={null}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <AutocompleteSelect
                      label="Category"
                      className="w-full"
                      error={!!errors?.product_type}
                      options={
                        categories.length > 0
                          ? categories.map((cat) => ({
                              label: cat.name,
                              value: cat._id,
                            }))
                          : []
                      }
                      getOptionLabel={(option) => option.label}
                      value={
                        categories.length > 0
                          ? categories
                              .map((cat) => ({
                                label: cat.name,
                                value: cat._id,
                              }))
                              .find((option) => option.value === value)
                          : null
                      }
                      onChange={(e, val) => {
                        console.log("Selected value:", val);
                        onChange(val ? val.value : null);
                      }}
                    />
                  )}
                />
 
                <div className="pt-2 ">
                  <RiAddBoxLine
                    size={24}
                    className="text-gray-500"
                    onClick={openModal}
                  />
                </div>
              </div>
            </Grid2>
          </Grid2>
 
          <div className="mt-3">
            <Label required >Description</Label>
            <Controller
              name="description"
              control={control}
              defaultValue={null}
              rules={{ required: false }}
              render={({ field: { value, onChange } }) => {
                return <Editor height={80} value={value} onChange={onChange} />;
              }}
            />
          </div>
          <div className="mt-3">
            <Controller
              name="fileData"
              control={control}
              defaultValue={[]}
              rules={{
                validate: (value) =>
                  Array.isArray(value) && value.length === 3
                    ? true
                    : "You must upload exactly 3 images",
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <DragAndDropInput
                    required
                    error={!!errors?.fileData}
                    label={`Upload Media (Upload 3 images)`}
                    value={value || []}
                    setDeleted={setDeletedFiles}
                    acceptedFileTypes={IMAGES_EXTENSIONS}
                    onChange={(e) => {
                      onChange(e);
                    }}
                  />
                );
              }}
            />
          </div>
 
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={onCancel} bordered type="button">
              Cancel
            </Button>
            <Button primary>{isAddMode ? "Add" : "Update"}</Button>
          </div>
        </form>
      </div>
 
      <CustomDialog
        open={isModalOpen}
        onClose={closeModal}
        title="Category Name"
      >
        <div className="p-4">
          <Input
            label="Add  Category"
            placeholder="Enter category name"
            required
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={closeModal} bordered>
              Cancel
            </Button>
            <Button primary onClick={handleCategoryUpdate}>
              Add
            </Button>
          </div>
        </div>
      </CustomDialog>
    </>
  );
};