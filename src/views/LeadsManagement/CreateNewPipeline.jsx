import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BsList } from "react-icons/bs";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { Button } from "../../components/Buttons/Button";
import { addNewPipeline } from "../../store/apiSlices/leadApiSlice";
import { toast } from "../../utils";
import { useNavigate } from "react-router";

export default function CreateNewPipeline() {
  const [stages, setStages] = useState([
    { id: "stage-1", name: "Lead Stage 1", order: 1 },
    { id: "stage-2", name: "Lead Stage 2", order: 2 },
    { id: "stage-3", name: "Lead Stage 3", order: 3 },
  ]);
  const navigate = useNavigate(); 

  const [showModal, setShowModal] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [currentStageId, setCurrentStageId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [pipelineName, setPipelineName] = useState("");

  // Update stage order after any change
  const updateStageOrder = (updatedStages) => {
    return updatedStages.map((stage, index) => ({
      ...stage,
      order: index + 1,
    }));
  };

  // Handle Drag and Drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedStages = Array.from(stages);
    const [movedStage] = reorderedStages.splice(result.source.index, 1);
    reorderedStages.splice(result.destination.index, 0, movedStage);

    const updatedStages = reorderedStages.map((stage, index) => ({
      ...stage,
      order: index + 1,
      name: stage.customName ? stage.name : `Lead Stage ${index + 1}`, // Keep edited names
    }));

    setStages(updatedStages);
  };

  // Add a New Stage
  const handleAddStage = (index) => {
    const updatedStages = [...stages];

    // Create the new stage with the correct order number
    const newStage = {
      id: `stage-${Date.now()}`,
      name: `Lead Stage ${index + 2}`, // New stage will take index + 2
      order: index + 2,
    };

    // Insert the new stage at the correct position
    updatedStages.splice(index + 1, 0, newStage);

    // Recalculate stage names and orders
    const renamedStages = updatedStages.map((stage, idx) => ({
      ...stage,
      order: idx + 1,
      name: `Lead Stage ${idx + 1}`,
    }));

    setStages(renamedStages);
  };

  // Delete a Stage
  const handleDeleteStage = (stageId) => {
    const updatedStages = stages.filter((stage) => stage.id !== stageId);

    // Recalculate order and update names only if they weren't manually changed
    const reorderedStages = updatedStages.map((stage, index) => ({
      ...stage,
      order: index + 1,
      name: stage.customName ? stage.name : `Lead Stage ${index + 1}`,
    }));

    setStages(reorderedStages);
    setDropdownOpen(null);
  };

  // Open Modal for Editing
  const openModal = (stageId, currentName) => {
    setCurrentStageId(stageId);
    setNewStageName(currentName);
    setShowModal(true);
    setDropdownOpen(null);
  };

  // Close Modal
  const closeModal = () => {
    setShowModal(false);
    setNewStageName("");
  };

  // Save Edited Stage Name
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

  // Toggle Dropdown
  const toggleDropdown = (stageId) => {
    setDropdownOpen(dropdownOpen === stageId ? null : stageId);
  };

  // Save Pipeline in JSON Format

  const handleSavePipeline = async () => {
    if (!pipelineName.trim()) {
      toast.error("Please enter a pipeline name.");
      return;
    }
  
    const formattedPipeline = {
      pipeline_name: pipelineName,
      stages: stages.map((stage) => ({
        stage_name: stage.name,
        stage_order: stage.order,
      })),
    };
  
    try {
      const response = await addNewPipeline(formattedPipeline); // Call API
  
      if (response?.status === 200 || response?.status === 201) {
       toast.success('New pipeline added successfully!')
        setPipelineName("");
        setStages([]); // Reset stages after successful save
      }
      setTimeout(() => {
        navigate("/leadsPipeline");
      }, 500)
    } catch (error) {
      console.error("Error saving pipeline:", error);
      toast.error("An error occurred while saving the pipeline. ");
    }
  };
  

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex justify-between items-center my-4">
          <h2 className="text-xl font-semibold">Create New Pipeline</h2>
        </div>
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
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
                      className="w-64 relative group"
                    >
                      <div {...provided.dragHandleProps} className=" ">
                        <div className="flex items-center gap-2 p-4 border bg-gray-100">
                          {" "}
                          <BsList />
                          <div className="font-semibold">
                            {stage.name || ""}
                          </div>
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
                              <div
                                className="text-red-700 block px-4 py-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
                                onClick={() => handleDeleteStage(stage.id)}
                              >
                                <MdOutlineDeleteOutline /> Delete
                              </div>
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
              placeholder="Enter New Name"
            />
            <div className="flex justify-end gap-4">
              <Button onClick={closeModal} bordered type="button">
                Cancel
              </Button>
              <Button onClick={handleSaveStageName} primary>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex mt-5">
        <Button onClick={handleSavePipeline} primary>
          Save Pipeline
        </Button>
      </div>
    </div>
  );
}
