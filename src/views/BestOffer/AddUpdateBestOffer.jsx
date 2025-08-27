import React, { useEffect, useState } from "react";
// import { uploadMultipleDocs } from '../../services/authApis';
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../components/Inputs/Input";
import { DragAndDropInput } from "../../components/Inputs/DragAndDropInput";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
 
import { uploadMultipleDocs } from "../../services/authApis";
import { loader, toast } from "../../utils";
import { addBestOffer,  getBestOffer,
  getBestOfferDataById,
  updateBestOffer } from "../../services/offersApis";
 
const AddUpdateBestOffer = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
 
const fetchBestOffers = useOutletContext()
 
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      heading: "",
      title1: "",
      title2: "",
      fileData: null,
    },
  });
 
  useEffect(() => {
    if (!isAddMode && id) {
      loader.start();
      getBestOfferDataById(id )
        .then((response) => {
          let dd = response?.data?.[0];
          reset({
            heading: dd.heading,
            title1: dd.title1,
            title2: dd.title2,
            fileData:dd.fileData
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error("Error fetching data");
        }).finally(()=>{
          loader.stop()
        })
    }
  }, [id, isAddMode, reset]);
 
  async function onSubmit(data) {
    try {
      loader.start();
 
   const file = data?.fileData
       loader.start()
 
       if (file && file.file) {
         const formData = new FormData()
         formData.append('image', file)
 
         let imageUrl = await uploadMultipleDocs([file.file])
         data.fileData = imageUrl.data.data[0]
       }
 
 
 
 
      let response = isAddMode
        ? await addBestOffer(data)
        : await updateBestOffer(id, data);
 
      if (response && response.data) {
        toast.success(
          `Offer ${isAddMode ? "added" : "updated"} successfully!`
        );
        navigate("/BestOffer");
      } else {
        toast.error("Error: No response data received");
      }
 
    fetchBestOffers();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    } finally {
      loader.stop();
    }
  }
 
  function onCancel() {
    navigate("/BestOffer");
  }
 
  return (
    <div className="p-4 md:p-2 lg:p-8 max-w-2xl mx-auto">
      <CustomDialog
        onCancel={onCancel}
        open={true}
        fullWidth
        maxWidth="sm"
        title={`${isAddMode ? "Add" : "Update"} Best Offer`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="heading"
            control={control}
            rules={{ required: "Heading is required" }}
            render={({ field }) => (
              <Input
                required
                error={!!errors.heading}
                {...field}
                placeholder="Enter Heading"
                label="Heading"
              />
            )}
          />
 
          <Controller
            name="title1"
            control={control}
            rules={{ required: "Title 1 is required" }}
            render={({ field }) => (
              <Input
                required
                error={!!errors.title1}
                {...field}
                placeholder="Title 1"
                label="Title 1"
              />
            )}
          />
 
          <Controller
            name="title2"
            control={control}
            rules={{ required: "Title 2 is required" }}
            render={({ field }) => (
              <Input
                required
                error={!!errors.title2}
                {...field}
                placeholder="Title 2"
                label="Title 2"
              />
            )}
          />
 
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
                setDeleted={() => {}}
                acceptedFileTypes={[]}
                onChange={(e) => {
                  onChange(e[0]);
                }}
              />
            )}
          />
 
          <div className="flex flex-col md:flex-row justify-end gap-3 mt-4">
            <Button
              onClick={onCancel}
              bordered
              type="button"
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button primary type="submit" className="w-full md:w-auto">
              {isAddMode ? "Add" : "Update"}
            </Button>
          </div>
        </form>
      </CustomDialog>
    </div>
  );
};
 
export default AddUpdateBestOffer;