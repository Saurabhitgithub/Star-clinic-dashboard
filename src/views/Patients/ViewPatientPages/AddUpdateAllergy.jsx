import React, { useState, useEffect } from "react";
import { Button } from "../../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/Inputs/Input";
import { CustomDialog } from "../../../components/Dialogs/CustomDialog";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";
import {
  addAllergy,
  getAllergyById,
  updateAllergyById,
} from "../../../services/offersApis";
import { loader, toast } from "../../../utils";
import { useGetPatientByIdQuery } from "../../../store/apiSlices/patientApiSlice";

const AddUpdateAllergy = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id, allergyId } = useParams();
  const fetchAllergyData = useOutletContext();
  const isAddMode = !id;
  const { data: patientData, isLoading: isPatientLoading } =
    useGetPatientByIdQuery(id);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "",
      user_id: "",
      severity: "",
      reaction: "",
      medications: [],
      emergency_contact: {
        name: "",
        phone: "",
        relationship: "",
      },
      notes: "",
    },
  });
  useEffect(() => {
    if (patientData?._id) {
      setValue("user_id", patientData._id);
    }
  }, [patientData, setValue]);

  useEffect(() => {
    if (allergyId) {
      fetchAllergy();
    } else if (state) {
      reset(state);
    }
  }, [allergyId, state, reset]);

  const fetchAllergy = async () => {
    if (!allergyId) {
      console.warn("allergyId is undefined, switching to add mode.");
      return;
    }
    try {
      loader.start();
      console.log("Fetching allergy data for ID:", allergyId);
      const response = await getAllergyById(allergyId);
      const allergyData = response?.data?.data;

      if (allergyData) {
        console.log("Fetched Allergy Data:", allergyData);
        reset(allergyData);
      }
    } catch (error) {
      console.error("Error fetching allergy data:", error);
      toast.error("Failed to load allergy data");
    } finally {
      loader.stop();
    }
  };

  async function onSubmit(data) {
    try {
      loader.start();
      let response;

      if (allergyId) {
        response = await updateAllergyById(allergyId, data);
      } else {
        response = await addAllergy(data);
      }
      fetchAllergyData();
      if (response && response.data) {
        toast.success("Allergy information saved successfully!");
        navigate(`/patientDetails/${id}/allergies`);
      } else {
        toast.error("Error: No response data received");
      }
    } catch (error) {
      console.error("Error saving allergy data:", error);
      toast.error("Error saving data");
    } finally {
      loader.stop();
      // window.location.reload()
    }
  }

  function onCancel() {
    navigate(`/patientDetails/${id}/allergies`);
  }

return (
  <div className="p-4 md:p-2 lg:p-8 max-w-2xl mx-auto">
    <CustomDialog
      onCancel={onCancel}
      open={true}
      fullWidth
      maxWidth="sm"
      title={
        allergyId ? "Edit Allergy Information" : "Add Allergy Information"
      }
    >
      {(!patientData && !state && !allergyId) ? (
        <div className="text-center text-gray-500 py-8">No data available</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields here (unchanged) */}
          {/* ... Keep all your Controllers as-is ... */}

          <Controller
            name="type"
            control={control}
            rules={{ required: "Allergy name is required" }}
            render={({ field }) => (
              <Input
                required
                error={!!errors.type}
                helperText={errors.type?.message}
                {...field}
                placeholder="Allergy Name"
                label="Allergy Name"
              />
            )}
          />

          <Controller
            name="severity"
            control={control}
            rules={{ required: "Severity is required" }}
            render={({ field }) => (
              <Input
                required
                error={!!errors.severity}
                helperText={errors.severity?.message}
                {...field}
                placeholder="Severity (e.g., Mild, Severe)"
                label="Severity"
              />
            )}
          />

          <Controller
            name="reaction"
            control={control}
            rules={{ required: "Reaction is required" }}
            render={({ field }) => (
              <Input
                required
                error={!!errors.reaction}
                helperText={errors.reaction?.message}
                {...field}
                placeholder="Reaction (e.g., Anaphylaxis)"
                label="Reaction"
              />
            )}
          />

          <Controller
            name="emergency_contact.phone"
            control={control}
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Phone number must contain only digits",
              },
            }}
            render={({ field }) => (
              <Input
                required
                type="tel"
                error={!!errors.emergency_contact?.phone}
                helperText={errors.emergency_contact?.phone?.message}
                {...field}
                placeholder="Phone Number"
                label="Phone Number"
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
              {!allergyId ? "Add" : "Update"}
            </Button>
          </div>
        </form>
      )}
    </CustomDialog>
  </div>
);

};

export default AddUpdateAllergy;
