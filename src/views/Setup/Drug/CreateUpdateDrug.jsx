// src/pages/Setup/Drug/CreateUpdateDrug.jsx
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { CustomDialog } from "../../../components/Dialogs/CustomDialog";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/Inputs/Input";
import { Button } from "../../../components/Buttons/Button";
import {
  addDrug,
  getDrugById,
  updateDrugById,
} from "../../../services/offersApis";
import { loader, toast } from "../../../utils";

export const CreateUpdateDrug = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      dose: "",
      unit: "",
      route: "",
      frequency: "",
    },
  });

  const formSubmit = async (data) => {
    try {
      loader.start();
      const response = isAddMode
        ? await addDrug(data)
        : await updateDrugById(id, data);

      if (response?.data) {
        toast.success(`Drug ${isAddMode ? "created" : "updated"} successfully`);
        navigate("/setup/drug?refresh=true"); // 👈 add query param to trigger list refresh
      } else {
        toast.error("No response data from server");
      }
    } catch (error) {
      toast.error("Failed to save drug");
    } finally {
      loader.stop();
    }
  };

  const onCancel = () => {
    navigate("/setup/drug");
  };

  useEffect(() => {
    if (!isAddMode) {
      const fetchDrug = async () => {
        try {
          loader.start();
          const res = await getDrugById(id);
          const drug = res?.data?.data;
          if (drug) {
            setValue("name", drug.name || "");
            setValue("dose", drug.dose || "");
            setValue("unit", drug.unit || "");
            setValue("route", drug.route || "");
            setValue("frequency", drug.frequency || "");
          }
        } catch (err) {
          console.error("Failed to fetch drug data:", err);
          toast.error("Failed to load drug data");
        } finally {
          loader.stop();
        }
      };
      fetchDrug();
    }
  }, [id, isAddMode, setValue]);

  return (
    <CustomDialog
      onCancel={onCancel}
      open={true}
      fullWidth
      maxWidth="md"
      title={`${isAddMode ? "Add" : "Update"} Drug`}
    >
      <form onSubmit={handleSubmit(formSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Drug name is required" }}
          render={({ field }) => (
            <Input {...field} label="Drug Name" placeholder="Enter drug name" required error={!!errors.name} />
          )}
        />
        <Controller
          name="dose"
          control={control}
          rules={{ required: "Dose is required" }}
          render={({ field }) => (
            <Input {...field} label="Dose" placeholder="Enter dose" required error={!!errors.dose} />
          )}
        />
        <Controller
          name="unit"
          control={control}
          rules={{ required: "Unit is required" }}
          render={({ field }) => (
            <Input {...field} label="Unit" placeholder="Enter unit" required error={!!errors.unit} />
          )}
        />
        <Controller
          name="route"
          control={control}
          rules={{ required: "Route is required" }}
          render={({ field }) => (
            <Input {...field} label="Route" placeholder="Enter route" required error={!!errors.route} />
          )}
        />
        <Controller
          name="frequency"
          control={control}
          rules={{ required: "Frequency is required" }}
          render={({ field }) => (
            <Input {...field} label="Frequency" placeholder="Enter frequency" required error={!!errors.frequency} />
          )}
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={onCancel} bordered type="button">
            Cancel
          </Button>
          <Button primary type="submit">
            {isAddMode ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};
