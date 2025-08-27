import React, { useEffect, useState } from "react";
import { LeadUserProfileCard } from "./LeadUserProfileCard";
import style from "./leads.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router";
import { getLeadById } from "../../store/apiSlices/leadApiSlice";
import { loader } from "../../utils";
import {LeadsAdditionalInfo} from "./LeadsAdditionalInfo";
import LeadStageSlider from "./LeadStageSlider";

export default function DetailViewLeads() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Lead ID:", id);
  const [leadData, setLeadData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loader.start();
    if (id) {
      getLeadById(id)
        .then((res) => {
          setLeadData(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching lead data:", err);
        })
        .finally(() => {
          loader.stop();
          setLoading(false);
        });
    }
  }, [id]);
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  const currentStageName = leadData?.pipelineDetails?.[0]?.stages?.find(
    (s) => s._id === leadData?.lead_stage
  )?.stage_name;

  return (
    <div className={`${style.patientViewLayout_con}`}>
      {/* Header */}
      <div className={`${style.patientView_header} flex justify-between`}>
        <div className="flex items-center gap-2">
          <IoIosArrowBack
            className="cursor-pointer"
            onClick={() => navigate("/leadsManagement")}
          />
          <div className={`${style.patient_view_name}`}>
            {leadData
              ? `${capitalize(leadData.first_name)} ${capitalize(
                  leadData.last_name
                )}`
              : "Lead Details"}
          </div>
        </div>
      </div>

      {/* Lead Stage Slider goes here */}
      <div className="px-4 py-2 bg-white shadow-sm border-y  ">
        <LeadStageSlider
          pipelineId={leadData?.pipelineDetails?.[0]?._id}
          stageId={leadData?.lead_stage}
          leadId={leadData?._id}
          setLeadStage={(newStage) => console.log("Changed to:", newStage)}
          setLeadData={setLeadData}
        />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-[350px_1fr] gap-3 p-4 bg-gray-100 ">
        {/* Left Column */}
        <div className="">
          <LeadUserProfileCard data={leadData} setLeadData={setLeadData} />
        </div>

        {/* Right Column */}
        <div className="">
          <LeadsAdditionalInfo data={leadData} setLeadData={setLeadData}/>
        </div>
      </div>
    </div>
  );
}
