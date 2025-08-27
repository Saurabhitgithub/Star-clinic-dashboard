import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { BreadCrum } from "../../components/common/BreadCrum";
import { UploadProfile } from "../../components/Inputs/UploadProfile";
import { Button } from "../../components/Buttons/Button";
import { EducationAndExperienceForm } from "./EducationAndExperienceForm";
import {
  useAddCustomerSupportMutation,
  useUpdateCustomerSupportByIdMutation,
} from "../../store/apiSlices/customerSupportApiSlices";
import { findFormDirtyFields, loader, toast } from "../../utils";
import { uploadMultipleDocs } from "../../services/authApis";
import { Link, useNavigate, useParams } from "react-router";
import { InputController } from "../../components/Inputs/InputController";
import { useFetchCustomerSupportData } from "../../hooks/useFetchCustomerSupportData";
 
export const CreateUpdateCustomerSupport = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [updateCustomerSupport] = useUpdateCustomerSupportByIdMutation();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [addCustomerSupport] = useAddCustomerSupportMutation();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      employee_id: "",
      name: "",
      email: "",
      phone_no:"",
      biography: "",
      profile_image: null,
      education: [{ degree: "", institution: "", startDate: "", endDate: "" }],
      workexperience: [{ company: "", startDate: "", endDate: "", about: "" }],
    },
  });
 
  const {
    fields: education,
    append: educationAppend,
    remove: educationRemove,
  } = useFieldArray({
    control,
    name: "education",
  });
  const {
    fields: workexperience,
    append: workexperienceAppend,
    remove: workexperienceRemove,
  } = useFieldArray({
    control,
    name: "workexperience",
  });
  // fetch customer data on edit process using this custom hook and reset data into form using reset function
  const { getCustomerData } = useFetchCustomerSupportData(id, reset);
 
  useEffect(() => {
    getCustomerData();
  }, [getCustomerData]);
 
  // for id generation
  useEffect(() => {
    if (!id) {
      const uniqueId = `EMP-${Date.now().toString().slice(-6)}-${Math.floor(
        Math.random() * 1000
      )}`;
      setValue("employee_id", uniqueId);
    }
  }, [id, setValue]);
 
  async function formSubmit(data) {
    try {
      const file = data?.profile_image;
      loader.start();
      if (file && file.file) {
        const formData = new FormData();
        formData.append("image", file);
        let imageUrl = await uploadMultipleDocs([file.file]);
        data.profile_image = imageUrl.data.data[0];
      }
      // on update data
      if (id) {
        loader.stop();
        const body = findFormDirtyFields(dirtyFields, data);
        await updateCustomerSupport({
          id,
          body: { deletedFiles: [deletedFiles], ...body },
        });
        toast.success("Customer support updated successfully");
        navigate("/customerSupportManagement");
      }
      // on add data
      else {
        const res = await addCustomerSupport(data);
        console.log(res);
        toast.success("Customer support created successfully");
        navigate("/customerSupportManagement");
      }
    } catch (error) {
      console.log(error);
      toast.error("Some Error occured !");
    } finally {
      loader.stop();
    }
  }
 
  const breadCrumData = [
    {
      title: "Customer Support",
      active: false,
      path: "/customerSupportManagement",
    },
    { title: "Create", active: true },
  ];
 
  return (
    <div>
      <BreadCrum backUrl={"/customerSupportManagement"} data={breadCrumData} />
      <form
        onSubmit={handleSubmit(formSubmit, () =>
          toast.warning("All fields are mandatory !")
        )}
      >
        <div className="mt-4">
          <Controller
            name="profile_image"
            control={control}
            defaultValue={null}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <UploadProfile
                  error={errors?.profile_image}
                  value={value}
                  onChange={onChange}
                  onDeleteFile={setDeletedFiles}
                />
              );
            }}
          />
        </div>
         <div className="grid grid-cols-2 mt-3 gap-4">
        <InputController
          name="employee_id"
          control={control}
          label="Employee ID"
          required
          readOnly
          error={!!errors?.employee_id}
 
        />
 
          <InputController
            name="phone_no"
            control={control}
            rules={{ required: true }}
            required
            error={!!errors?.name}
            placeholder="Enter phone_no"
            label="Phone No"
          />
</div>
        <div className="grid grid-cols-2 mt-3 gap-4">
          <InputController
            name="name"
            control={control}
            rules={{ required: true }}
            required
            error={!!errors?.name}
            placeholder="Enter Name"
            label="Employee Name"
          />
 
          <InputController
            name="email"
            control={control}
            rules={{ required: true }}
            required
            error={!!errors?.email}
            placeholder="Enter Email"
            label="Employee Email"
          />
        </div>
        <div className="mt-4">
          <InputController
            name="biography"
            control={control}
            rules={{ required: true }}
            required
            textarea
            error={!!errors?.biography}
            placeholder="Enter Biography"
            label="Biography"
          />
        </div>
        <EducationAndExperienceForm
          fields={education}
          control={control}
          append={educationAppend}
          remove={educationRemove}
          errors={errors}
          usedFor={"education"}
        />
        <br />
        <EducationAndExperienceForm
          fields={workexperience}
          control={control}
          append={workexperienceAppend}
          remove={workexperienceRemove}
          errors={errors}
          usedFor={"workexperience"}
        />
        <div className="flex justify-end gap-4 mt-4">
          <Link to={"/customerSupportManagement"}>
            <Button bordered type="button">
              Cancel
            </Button>
          </Link>
          <Button primary>Submit</Button>
        </div>
      </form>
 
      <br />
    </div>
  );
};
 