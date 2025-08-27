import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../../components/Inputs/Input";
import { CustomDialog } from "../../../../components/Dialogs/CustomDialog";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { Button } from "../../../../components/Buttons/Button";
import { loader, toast } from "../../../../utils";
import { addclientProblem, getClientProblemById, updateClientProblemById } from "../../../../services/offersApis";
 
 
const AddUpdateClientProblem = ({ mode }) => {
  const isAddMode = mode === "add";
  const navigate = useNavigate();
  const { id, clientProblemId } = useParams();
  const isEditMode = !!clientProblemId;
 
const fetchProblems= useOutletContext();
 
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      problem_name: "",
      related_appointments: "",
      diagnosis_date: "",
      note: "",
      user_id: id,
    },
  });
 
  useEffect(() => {
    if (!isAddMode && clientProblemId) {
      fetchProblem();
    }
  }, [clientProblemId, isAddMode]);
 
  const fetchProblem = async () => {
    try {
      loader.start();
      console.log("Fetching problem data for ID:", clientProblemId);
      const response = await getClientProblemById(clientProblemId);
      console.log("API Response:", response.data);
 
      if (response?.data?.data) {
        let problemData = response.data.data;
 
 
        if (problemData.diagnosis_date) {
          problemData.diagnosis_date = new Date(problemData.diagnosis_date)
            .toISOString()
            .split("T")[0];
        }
 
        reset(problemData);
      } else {
        toast.error("Failed to load problem data");
      }
    } catch (error) {
      console.error("Error fetching problem data:", error);
      toast.error("Failed to load problem data");
    } finally {
      loader.stop();
    }
  };
 
  async function onSubmit(data) {
    try {
      loader.start();
      if (data.diagnosis_date) {
        data.diagnosis_date = new Date(data.diagnosis_date)
          .toISOString()
          .split("T")[0];
      }
 
      console.log("Submitting Data:", data);
      if (isEditMode) {
        const response = await updateClientProblemById(clientProblemId, data);
        console.log("Update Response:", response);
        toast.success("Client problem updated successfully!");
      } else {
        const response = await addclientProblem(data);
        // fetchProblems();
        console.log("Add Response:", response);
        toast.success("Client problem added successfully!");
      }
 
      navigate(`/patientDetails/${id}/clientProblems`);
      fetchProblems();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    } finally {
      loader.stop();
    }
  }
 
  const onCancel = () => {
    navigate(`/patientDetails/${id}/clientProblems`);
  };
 
  return (
    <div className="p-4 md:p-2 lg:p-8 max-w-2xl mx-auto">
      <CustomDialog
        onCancel={onCancel}
        open={true}
        fullWidth
        maxWidth="sm"
        title={(isEditMode ? "Update" : "Add") + " Client Problem"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
 
 
          <Controller
            name="problem_name"
            control={control}
            rules={{ required: "Problem is required" }}
            render={({ field }) => (
              <Input
                required
                error={!!errors.problem_name}
                {...field}
                placeholder="Problem"
                label="Problem"
              />
            )}
          />
          <div className="mt-3">
 
            <Controller
              name="related_appointments"
              control={control}
              rules={{ required: "Problem is required" }}
              render={({ field }) => (
                <Input
                  required
                  error={!!errors.related_appointments}
                  {...field}
                  placeholder="Related Appointments"
                  label="Related Appointments"
                />
              )}
            />
          </div>
          <div className="mt-3">
 
            <Controller
              name="diagnosis_date"
              control={control}
              rules={{ required: "Diagnosis Date is required" }}
              render={({ field }) => (
                <Input
                  type="date"
                  required
                  error={!!errors.diagnosis_date}
                  {...field}
                  value={field.value || ""}
                  label="Diagnosis Date"
                />
              )}
            />
          </div>
          <div className="mt-3">
 
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <Input
                  textarea
                  required={false}
                  error={!!errors.note}
                  {...field}
                  value={field.value || ""}
                  label="Note"
                  placeholder="Note"
                />
              )}
            />
          </div>
 
          <div className="flex flex-col md:flex-row justify-end gap-3 mt-4">
            <Button onClick={onCancel} bordered type="button">
              Cancel
            </Button>
            <Button primary type="submit">
              {isEditMode ? "Update" : "Add"}
            </Button>
          </div>
 
        </form>
      </CustomDialog>
    </div>
  );
};
 
export default AddUpdateClientProblem;