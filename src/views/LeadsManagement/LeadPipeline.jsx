import React, { useState, useEffect } from "react";
import { LeadsManagementHeader } from "../../components/PagesHeaders/LeadsManagementHeader";
import {
  getAllLeads,
  getAllPipeline,
  getLeadsByPipeline,
  updateLeadData,
} from "../../store/apiSlices/leadApiSlice";
import { useNavigate } from "react-router";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { UserProfileImg } from "../../components/common/UserProfileImg";
import img from "../../assets/images/Avatar.png";
import { loader } from "../../utils";

export default function LeadPipeline() {
  const [search, setSearch] = useState("");
  const [pipelineStages, setPipelineStages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState("");
    const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const groupLeads = (leads) => {
    const grouped = {};
    leads.forEach((lead) => {
      const stageKey = lead.lead_stage.trim().toLowerCase(); // normalize key
      if (!grouped[stageKey]) grouped[stageKey] = [];
      grouped[stageKey].push(lead);
    });
    return grouped;
  };

  useEffect(() => {
    if (!selectedPipelineId) {
      console.warn("No selectedPipelineId");
      return;
    }
    loader.start();
    setLoading(true);

    const fetchPipelineAndLeads = async () => {
      try {
        
        const [pipelineRes, leadsRes] = await Promise.all([
          getAllPipeline(),
          getLeadsByPipeline(selectedPipelineId),
        ]);

        const selectedPipeline = pipelineRes.data.data.find(
          (p) => p._id === selectedPipelineId
        );
        console.log("Raw leads response:", leadsRes.data);
        const allStages = (selectedPipeline?.stages || []).sort(
          (a, b) => (a.stage_order || 0) - (b.stage_order || 0)
        );
        
        const allLeads = leadsRes.data?.data.flatMap((d) => d.data) || [];
        console.log("Flattened leads:", allLeads);
        // const groupedLeads = groupLeads(allLeads);

        const stagesWithLeads = allStages.map((stage) => {
          const stageId = stage._id;

          return {
            id: stageId,
            name: stage.stage_name,
            users: allLeads
              .filter((lead) => {
                const leadStageId =
                  typeof lead.lead_stage === "object"
                    ? lead.lead_stage._id
                    : lead.lead_stage;

                return leadStageId === stageId;
              })
              .map((lead) => ({
                id: lead._id,
                name: `${lead.first_name} ${lead.last_name}`,
                amount: lead.amount,
              })),
          };
        });

        setPipelineStages(stagesWithLeads);
        setLeads(allLeads);
      } catch (err) {
        console.error("Error loading pipeline/leads", err);
      }
      finally {
        setLoading(false);
            loader.stop();
          }
    };

    fetchPipelineAndLeads();
  }, [selectedPipelineId]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
  
    const { source, destination, draggableId, type } = result;
  
    if (type === "stage") return;
  
    // Don't mutate directly
    const newStages = pipelineStages.map(stage => ({
      ...stage,
      users: [...stage.users],
    }));
  
    const sourceStage = newStages.find(s => s.id === source.droppableId);
    const destStage = newStages.find(s => s.id === destination.droppableId);
  
    if (!sourceStage || !destStage) return;
  
    const draggedUserIndex = sourceStage.users.findIndex(u => u.id === draggableId);
    const [movedUser] = sourceStage.users.splice(draggedUserIndex, 1);
    destStage.users.splice(destination.index, 0, movedUser);
  
    //  Immediate state update first
    setPipelineStages(newStages);
  
    try {
      //  Async update AFTER state is reflected
      await updateLeadData(draggableId, { lead_stage: destStage.id });
    } catch (err) {
      console.error("Failed to update lead stage:", err);
      // Optional: rollback state or show error
    }
  };
  

  const filteredStages = pipelineStages.map((stage) => ({
    ...stage,
    users: stage.users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  return (
    <div>
      <LeadsManagementHeader
        onSearch={(e) => setSearch(e.target.value)}
        searchValue={search}
        heading="Leads"
        totalCount={filteredStages.reduce((acc, s) => acc + s.users.length, 0)}
        totalAmount={filteredStages.reduce(
          (acc, s) =>
            acc +
            s.users.reduce((sum, u) => sum + Number(u.amount || 0), 0),
          0
        )}
        addButtonProps={{
          show: true,
          title: "Create Lead",
          onClick: () => navigate("/leadsManagement/add"),
        }}
        onPipelineChange={setSelectedPipelineId} // handle selection
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="pipeline" type="stage" direction="horizontal">
          {(provided) => (
        <div className="overflow-x-auto">
        <div
          className="flex gap-4 p-4"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {filteredStages.map((stage, index) => (
            <div key={stage.id} className="w-72 flex-shrink-0">
              <div className="bg-blue-100 border p-2 ">
                <div className="font-semibold text-sm">{stage.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {stage.users.length} leads — $
                  {stage.users.reduce((sum, u) => sum + u.amount, 0).toFixed(2)}
                </div>
              </div>
      
              <Droppable droppableId={stage.id} type="user">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-100 mt-2 p-2  min-h-[100px]"
                    
                  >
                    {stage.users.length === 0 ? (
                      <div className="text-center text-gray-500 mt-4">
                        No leads available
                      </div>
                    ) : (
                      stage.users.map((user, index) => (
                        <Draggable
                          key={user.id}
                          draggableId={user.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white shadow-lg p-2 mb-2"
                            >
                              <div
                                className="text-sm font-semibold cursor-pointer"
                                onClick={() =>
                                  navigate(`/leadsManagement/detailView/${user.id}`)
                                }
                                
                              >
                                {user.name}
                              </div>
                              <div className="text-gray-500 text-sm flex items-center mt-2 gap-1">
                                <UserProfileImg
                                  img={img}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginRight: 8,
                                  }}
                                />
                               ${Number(user.amount || 0).toFixed(2)}
                        
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
          {provided.placeholder}
        </div>
      </div>
      
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
