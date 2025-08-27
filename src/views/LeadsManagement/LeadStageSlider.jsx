import React, { useState, useEffect, useRef } from "react";
import { getAllPipeline, updateLeadData } from "../../store/apiSlices/leadApiSlice";

const LeadStageSlider = ({ pipelineId, stageId, setLeadStage, leadId, setLeadData }) => {
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [showSelect, setShowSelect] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const response = await getAllPipeline();
        const pipelineData = response?.data?.data || [];
        setPipelines(pipelineData);

        if (pipelineId) {
          const matched = pipelineData.find((p) => p._id === pipelineId);
          if (matched) setSelectedPipeline(matched);
          else setSelectedPipeline(pipelineData[0]);
        } else {
          setSelectedPipeline(pipelineData[0]);
        }
      } catch (error) {
        console.error("Failed to fetch pipelines", error);
      }
    };
    fetchPipelines();
  }, [pipelineId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSelect(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedPipeline) {
      const sortedStages = [...selectedPipeline.stages].sort(
        (a, b) => a.stage_order - b.stage_order
      );
      const index = sortedStages.findIndex((s) => s._id === stageId);
      setCurrentStageIndex(index >= 0 ? index : 0);
    }
  }, [selectedPipeline, stageId]);

  const handleStageClick = async (index) => {
    if (!selectedPipeline) return;
    const sortedStages = [...selectedPipeline.stages].sort(
      (a, b) => a.stage_order - b.stage_order
    );
    const newStage = sortedStages[index];
    setCurrentStageIndex(index);
    setLeadStage(newStage.stage_name);

    try {
      await updateLeadData(leadId, { lead_stage: newStage._id });
      setLeadData((prev) => ({
        ...prev,
        lead_stage: newStage._id,
        pipelineDetails: [selectedPipeline],
      }));
    } catch (err) {
      console.error("Failed to update stage", err);
    }
  };

  const handlePipelineChange = async (pipeline) => {
    setSelectedPipeline(pipeline);
    setShowSelect(false);

    const sortedStages = [...pipeline.stages].sort((a, b) => a.stage_order - b.stage_order);
    const firstStage = sortedStages[0];
    setCurrentStageIndex(0);
    setLeadStage(firstStage.stage_name);

    try {
      await updateLeadData(leadId, {
        lead_pipeline: pipeline._id,
        lead_stage: firstStage._id,
      });
      setLeadData((prev) => ({
        ...prev,
        lead_stage: firstStage._id,
        pipelineDetails: [pipeline],
      }));
    } catch (err) {
      console.error("Failed to update pipeline", err);
    }
  };

  const sortedStages = selectedPipeline
    ? [...selectedPipeline.stages].sort((a, b) => a.stage_order - b.stage_order)
    : [];

  return (
    <div className=" mx-auto pt-3">
      <div className="items-center">
        {selectedPipeline && (
          <div className="flex w-full overflow-hidden rounded my-2">
            {sortedStages.map((stage, index) => {
              const isActive = index <= currentStageIndex;
              return (
                <div
                  key={stage._id}
                  className={`relative flex-1 flex items-center justify-center text-xs font-medium px-4 py-1 cursor-pointer
                  ${isActive ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}
                  ${
                    index !== sortedStages.length - 1
                      ? "after:content-[''] after:absolute after:right-[-10px] after:top-[-7px] after:h-full after:w-0 after:border-l-[5px] after:border-t-[20px] after:border-b-[20px] after:border-transparent after:z-10"
                      : ""
                  }
                  ${isActive && index !== sortedStages.length - 1
                    ? "after:border-l-gray-100"
                    : "after:border-l-gray-100"}
                `}
                  onClick={() => handleStageClick(index)}
                >
                  {stage.stage_name}
                </div>
              );
            })}
          </div>
        )}

        {/* Breadcrumb Dropdown */}
        {selectedPipeline && sortedStages[currentStageIndex] && (
          <div className="mb-2 text-sm text-gray-500 flex items-center gap-1 relative" ref={dropdownRef}>
            <span className="text-sm cursor-pointer" onClick={() => setShowSelect((prev) => !prev)}>
              {selectedPipeline.pipeline_name}
            </span>
            <span>&gt;</span>
            <span>{sortedStages[currentStageIndex].stage_name}</span>

            {showSelect && (
              <div className="absolute top-6 left-0 z-50 w-48 bg-white border border-gray-200 rounded shadow-md">
                {pipelines.map((pipeline) => (
                  <div
                    key={pipeline._id}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePipelineChange(pipeline)}
                  >
                    {pipeline.pipeline_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadStageSlider;
