import React, { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/Buttons/Button";
import LeadStageSlider from "./LeadStageSlider";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  addLeadData,
  getAllLeads,
  getAllPipeline,
  getAllSpecialitiesData,
  getLeadById,
  updateLeadData,
} from "../../store/apiSlices/leadApiSlice";
import { uploadMultipleDocs } from "../../services/authApis";
import { useNavigate, useParams } from "react-router";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { loader, toast } from "../../utils";
import moment from "moment";

export const CreateLeads = ({ mode }) => {
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [leadStages, setLeadStages] = useState([]);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      salutation: "",
      first_name: "",
      last_name: "",
      email: "",
      mobile: "",
      gender: "",
      description: "",
      lead_source: "",
      dob: "",
      lead_location: "",
      lead_stage: "New Lead",
      pipeline_name: "",
      treatment_interested: "",
      amount: "",
    },
  });

  // const [selectedDate, setSelectedDate] = useState(null);
  // const handleDateChange = (date) => {
  //   setSelectedDate(date);

  //   const formattedDate = date ? moment(date).format("YYYY-MM-DD") : "";
  //   setValue("dob", formattedDate);
  // };
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await getAllSpecialitiesData();
        console.log("API Response:", response);

        if (response?.data?.data) {
          setSpecialties(response.data.data);
        } else {
          console.error("Specialties data not found in response");
          setSpecialties([]);
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
        setSpecialties([]);
      }
    };

    fetchSpecialties();
  }, []);
  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        const response = await getAllPipeline();
        console.log("Pipeline Data:", response?.data?.data);

        if (response?.data?.data) {
          setPipeline(response.data.data);
        } else {
          console.error("Specialties data not found in response");
          setPipeline([]);
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
        setPipeline([]);
      }
    };

    fetchPipeline();
  }, []);
  useEffect(() => {
    const selectedPipeline = pipeline.find(
      (p) => p.pipeline_name === watch("pipeline_name")
    );

    if (selectedPipeline) {
      const sortedStages = [...(selectedPipeline.stages || [])].sort(
        (a, b) => a.stage_order - b.stage_order
      );
      setLeadStages(sortedStages);
    } else {
      setLeadStages([]);
    }
  }, [watch("pipeline_name"), pipeline]);

  useEffect(() => {
    if (!isAddMode && id && pipeline.length > 0) {
      loader.start();
      getLeadById(id)
        .then((response) => {
          let leadData = response?.data?.data;
          if (leadData) {
            const pipelineData = pipeline.find(
              (p) => p._id === leadData.lead_pipeline
            );

            if (pipelineData) {
              const sortedStages = [...(pipelineData.stages || [])].sort(
                (a, b) => Number(a.stage_order) - Number(b.stage_order)
              );
              setLeadStages(sortedStages);
            }

            reset({
              salutation: leadData.salutation || "",
              first_name: leadData.first_name || "",
              last_name: leadData.last_name || "",
              email: leadData.email || "",
              mobile: leadData.mobile || "",
              gender: leadData.gender || "",
              description: leadData.description || "",
              lead_source: leadData.lead_source || "",
              dob: leadData.dob
                ? moment(leadData.dob).format("YYYY-MM-DD")
                : "",
              lead_location: leadData.lead_location || "",
              lead_stage: leadData.lead_stage || "",
              pipeline_name: pipelineData?.pipeline_name || "",
              treatment_interested: leadData.treatment_interested || "",
              amount: leadData.amount || "",
            });

            setValue("lead_stage", leadData.lead_stage || "");
          }
        })
        .catch((error) => {
          console.error("Error fetching lead data:", error);
          toast.error("Error fetching data");
        })
        .finally(() => {
          loader.stop();
        });
    }
  }, [id, isAddMode, pipeline, reset, setValue]);

  async function onSubmit(data) {
    const selectedPipeline = pipeline.find(
      (p) => p.pipeline_name === data.pipeline_name
    );

    const selectedStage = leadStages.find(
      (stage) => stage._id === data.lead_stage
    );

    if (!selectedPipeline || !selectedStage) {
      toast.error("Invalid Pipeline or Lead Stage selection");
      return;
    }

    const payload = {
      ...data,
      lead_pipeline: selectedPipeline._id, //  Assign correct Pipeline ObjectId
      lead_stage: selectedStage._id, //  Assign correct Stage ObjectId
    };

    try {
      loader.start();
      let response = isAddMode
        ? await addLeadData(payload) //  Send corrected payload
        : await updateLeadData(id, payload);

      if (response && response.data) {
        toast.success(`Lead added successfully!`);
        setTimeout(() => navigate("/leadsManagement"), 500);
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

  function onCancel() {
    navigate("/leadsManagement");
  }

  return (
    <div className=" mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">
        {isAddMode ? "Add New Lead" : "Update Lead"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 flex space-x-2">
          <div className="w-1/4">
            <label className="block text-gray-700">Salutation <span className="text-red-500 ">*</span></label>
            <select
              {...register("salutation", {
                required: "Salutation is required",
              })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
            </select>
            {errors.salutation && (
              <p className="text-red-500 text-sm">
                {errors.salutation.message}
              </p>
            )}
          </div>

          <div className="w-1/3">
            <label className="block text-gray-700">First Name <span className="text-red-500 ">*</span></label>
            <input
              {...register("first_name", {
                required: "First name is required",
              })}
              className="w-full p-2 border rounded capitalize"
              placeholder="First Name"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div className="w-1/3">
            <label className="block text-gray-700">Last Name</label>
            <input
              {...register("last_name")}
              className="w-full p-2 border rounded capitalize"
              placeholder="Last Name"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Gender: <span className="text-red-500 ">*</span></label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="Male"
                {...register("gender", { required: "Gender is required" })}
                className="mr-2"
              />{" "}
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Female"
                {...register("gender", { required: "Gender is required" })}
                className="mr-2"
              />{" "}
              Female
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="Other"
                {...register("gender", { required: "Gender is required" })}
                className="mr-2"
              />{" "}
              Other
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            How Did You Hear About Us? <span className="text-red-500 ">*</span>
          </label>
          <select
            {...register("lead_source", {
              required: "This field is required",
            })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select an option</option>
            <option value="Google">Google</option>
            <option value="Social Media">Social Media</option>
            <option value="Friend">Friend</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Other">Other</option>
          </select>
          {errors.lead_source && (
            <p className="text-red-500 text-sm">{errors.lead_source.message}</p>
          )}
        </div>

        <div className="mb-4 flex space-x-2">
          <div className="w-1/2">
            <label className="block text-gray-700">Date of Birth <span className="text-red-500 ">*</span></label>
            <input
              type="date"
              {...register("dob", { required: "DOB is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.dob && (
              <p className="text-red-500 text-sm">{errors.dob.message}</p>
            )}
          </div>

          <div className="w-1/2">
            <label className="block text-gray-700">Phone Number <span className="text-red-500 ">*</span></label>
            <input
              type="phone"
              {...register("mobile", {
                required: "Phone Number is required",
              })}
              className="w-full p-2 border rounded"
              placeholder="Enter Phone Number"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile.message}</p>
            )}
          </div>
        </div>

        <div className="mb-4 flex space-x-2">
          <div className="w-1/2 ">
            <label className="block text-gray-700">Email <span className="text-red-500 ">*</span></label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              className="w-full p-2 border rounded"
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Amount <span className="text-red-500 ">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("amount", {
                  required: "Amount is required",
                  validate: (value) =>
                    parseFloat(value) >= 0 ||
                    "Amount must be a positive number",
                })}
                className="w-full p-2 border rounded pl-8"
                placeholder="Enter amount"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Lead Location <span className="text-red-500 ">*</span></label>
          <select
            {...register("lead_location", {
              required: "Lead location is required",
            })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Location</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Chicago">Chicago</option>
          </select>
          {errors.lead_location && (
            <p className="text-red-500 text-sm">
              {errors.lead_location.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Treatment Of Interest <span className="text-red-500 ">*</span></label>
          <select
            {...register("treatment_interested", {
              required: "Treatment of interest is required",
            })}
            value={watch("treatment_interested") || ""}
            onChange={(e) => setValue("treatment_interested", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Treatment</option>
            {specialties.length > 0 ? (
              specialties.map((speciality) => (
                <option key={speciality._id} value={speciality.name}>
                  {speciality.name}
                </option>
              ))
            ) : (
              <option disabled>No Treatments Available</option>
            )}
          </select>

          {errors.treatment_interested && (
            <p className="text-red-500 text-sm">
              {errors.treatment_interested.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Lead Pipeline <span className="text-red-500 ">*</span></label>
          <select
            {...register("pipeline_name", {
              required: "Lead pipeline type is required",
            })}
            value={watch("pipeline_name") || ""}
            onChange={(e) => setValue("pipeline_name", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Pipeline</option>
            {pipeline.length > 0 ? (
              pipeline.map((pipeline) => (
                <option key={pipeline._id} value={pipeline.pipeline_name}>
                  {pipeline.pipeline_name}
                </option>
              ))
            ) : (
              <option disabled>No Pipeline Available</option>
            )}
          </select>
          {errors.pipeline_name && (
            <p className="text-red-500 text-sm">
              {errors.pipeline_name.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Lead Stage <span className="text-red-500 ">*</span></label>
          <select
            {...register("lead_stage", {
              required: "Lead stage is required",
            })}
            value={watch("lead_stage") || ""}
            onChange={(e) => setValue("lead_stage", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Lead Stage</option>
            {leadStages.length > 0 ? (
              leadStages.map((stage) => (
                <option key={stage._id} value={stage._id}>
                  {stage.stage_name}
                </option>
              ))
            ) : (
              <option disabled>No Stages Available</option>
            )}
          </select>
          {errors.lead_stage && (
            <p className="text-red-500 text-sm">{errors.lead_stage.message}</p>
          )}
        </div>

        <div className="mb-8 mt-10">
          <label className="block text-gray-700 text-lg">Message</label>
          <textarea
            {...register("description")}
            className="w-full p-3 border rounded-lg h-48"
            placeholder="Write msg ..."
          ></textarea>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={onCancel} bordered type="button">
            Cancel
          </Button>
          <Button primary>{isAddMode ? "Add" : "Update"}</Button>
        </div>
      </form>
    </div>
  );
};
