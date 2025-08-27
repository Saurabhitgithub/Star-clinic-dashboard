import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BsList } from "react-icons/bs";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { Button } from "../../components/Buttons/Button";
import {
  getAllLeads,
  getAllPipelineById,
  updatePipelineData,
} from "../../store/apiSlices/leadApiSlice";
import { useNavigate, useParams } from "react-router";
import { toast } from "../../utils";

export default function EditPipeline() {
  const navigate = useNavigate();
  const [stages, setStages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [currentStageId, setCurrentStageId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const { pipelineId } = useParams();
  const [newPipelineName, setNewPipelineName] = useState("");

  useEffect(() => {
    if (pipelineId) {
      fetchPipeline(pipelineId).then(() => {
        console.log("Stages after save:", stages);
      });
    }
  }, [pipelineId]);

  const fetchPipeline = async (id) => {
    try {
      const response = await getAllPipelineById(id);
      const pipelineData = response.data?.data;
      const stageList = pipelineData?.stages || [];

      const formattedStages = stageList.map((stage, index) => ({
        id: stage._id,
        name: stage.stage_name,
        order: stage.stage_order || index + 1,
      }));

      setNewPipelineName(pipelineData?.pipeline_name || "");
      setStages(formattedStages);
    } catch (error) {
      console.error("Error fetching pipeline stages:", error);
      setStages([]);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedStages = Array.from(stages);
    const [movedStage] = reorderedStages.splice(result.source.index, 1);
    reorderedStages.splice(result.destination.index, 0, movedStage);

    // Update order values based on new positions
    const updatedStages = reorderedStages.map((stage, idx) => ({
      ...stage,
      order: idx + 1,
    }));

    setStages(updatedStages);
  };

  const toggleDropdown = (stageId) => {
    setDropdownOpen(dropdownOpen === stageId ? null : stageId);
  };

  const handleDeleteStage = (stageId) => {
    const updatedStages = stages.filter((stage) => stage.id !== stageId);
    setStages(updatedStages);
    setDropdownOpen(null);
  };

  const openModal = (stageId, currentName) => {
    setCurrentStageId(stageId);
    setNewStageName(currentName);
    setShowModal(true);
    setDropdownOpen(null);
  };
  const handleAddStage = (index) => {
    const updatedStages = [...stages];

    const newStage = {
      id: `stage-${Date.now()}`, // temp ID
      name: "New Stage",
      order: index + 2, // add after current index
    };

    // Insert new stage after current one
    updatedStages.splice(index + 1, 0, newStage);

    // Recalculate order
    const reorderedStages = updatedStages.map((stage, idx) => ({
      ...stage,
      order: idx + 1,
    }));

    setStages(reorderedStages);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewStageName("");
  };

  const handleSaveStageName = () => {
    setStages((prevStages) =>
      prevStages.map((stage) =>
        stage.id === currentStageId
          ? {
              ...stage,
              name: newStageName || "Unnamed Stage",
              customName: true,
            }
          : stage
      )
    );
    closeModal();
  };
  const handleSavePipeline = async () => {
    if (!newPipelineName.trim()) {
      toast.error("Please enter a pipeline name.");
      return;
    }
  
    const hasEmptyStage = stages.some((stage) => !stage.name.trim());
    if (hasEmptyStage) {
      toast.error("Stage names cannot be empty.");
      return;
    }
  
    // Separate new and existing stages
    const newStages = [];
    const updatedStages = [];
  
    stages.forEach((stage) => {
      if (stage.id.startsWith("stage-")) {
        // New stage
        newStages.push({
          stage_name: stage.name,
          stage_order: stage.order,
        });
      } else {
        // Existing stage
        updatedStages.push({
          stage_id: stage.id,
          stage_name: stage.name,
          stage_order: stage.order,
        });
      }
    });
  
    const data = {
      pipeline_name: newPipelineName,
      stages: updatedStages,
      new_stages: newStages,
    };
  
    try {
      await updatePipelineData(pipelineId, data);
      toast.success("Pipeline updated successfully!");
      console.log(data)
  
      // Refetch pipeline to get updated stage IDs
      await fetchPipeline(pipelineId);
  
      setTimeout(() => navigate("/leadsPipeline"), 500);
    } catch (err) {
      console.error("Failed to update pipeline:", err);
      toast.error("Something went wrong while saving.");
    }
  };
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Edit Pipeline</h2>
      <div className="flex justify-between items-center my-4">
        <input
          type="text"
          value={newPipelineName}
          onChange={(e) => setNewPipelineName(e.target.value)}
          className="border p-2 w-2/3"
          placeholder="Enter Pipeline Name"
        />
        <button
          onClick={() => handleAddStage(stages.length - 1)}
          className="text-orange-600"
        >
          Add New Stage
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="pipeline" direction="horizontal">
          {(provided) => (
            <div
              className="flex space-x-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {stages.map((stage, index) => (
                <Draggable key={stage.id} draggableId={stage.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="w-64 group relative"
                    >
                      <div {...provided.dragHandleProps} className="">
                        <div className="flex items-center gap-2 p-4 border bg-gray-100">
                          <BsList />
                          <div className="font-semibold">{stage.name}</div>
                          <span className="ml-2 text-gray-500 text-sm">
                            (Order: {stage.order})
                          </span>
                        </div>
                        <div className="absolute top-5 right-[-10px] opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleDropdown(stage.id)}
                            className="text-gray-500"
                          >
                            <HiOutlineDotsVertical size={22} />
                          </button>
                          {dropdownOpen === stage.id && (
                            <div className="absolute top-4 right-0 mt-2 bg-white shadow-md rounded-md border">
                              <div
                                className="block px-4 py-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
                                onClick={() => openModal(stage.id, stage.name)}
                              >
                                <CiEdit /> Edit
                              </div>
                              {/* <div
                                className="text-red-700 block px-4 py-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
                                onClick={() => handleDeleteStage(stage.id)}
                              >
                                <MdOutlineDeleteOutline /> Delete
                              </div> */}
                            </div>
                          )}
                          <button
                            onClick={() => handleAddStage(index)}
                            className="text-gray-500 ml-2"
                          >
                            <IoAddCircleOutline size={22} />
                          </button>
                        </div>
                        <div className="border bg-gray-100 p-3 mt-1 h-40">
                          <input
                            className="border p-1 w-full"
                            disabled
                            placeholder="Enter a pipeline stage"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Stage Name</h3>
            <input
              type="text"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder="Enter new name"
            />
            <div className="flex justify-end gap-4">
              <button onClick={closeModal} className="text-gray-500">
                Cancel
              </button>
              <button onClick={handleSaveStageName} className="text-blue-500">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex mt-4 gap-4">
        <Button
          onClick={() => navigate("/leadsPipeline")}
          bordered
          type="button"
        >
          Cancel
        </Button>
        <Button onClick={handleSavePipeline} primary>
          Save
        </Button>
      </div>
    </div>
  );
}
