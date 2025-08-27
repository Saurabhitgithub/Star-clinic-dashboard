import React, { useState, useEffect } from "react";
import { EditIcon } from "../../components/Icons/SvgIcons";
import { TableContainer } from "../../components/Table/TableContainer";
import { Outlet, useNavigate } from "react-router";
import { DeleteButton } from "../../components/Buttons/DeleteButton";
import { loader, toast } from "../../utils";
import { StatusTag } from "../../components/common/StatusTag";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { ConfirmationDialog } from "../../components/Dialogs/ConfirmationDialog";
import { CommonPagesHeader } from "../../components/PagesHeaders/CommonPagesHeader";
import PrintIcon from "@mui/icons-material/Print";
import EmailIcon from "@mui/icons-material/Email";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "../../components/Buttons/Button";
import {
  editLabData,
  getAllLabTestData,
} from "../../services/LabTestManagement";

const LabsTestManagement = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [openShareMenuId, setOpenShareMenuId] = useState(null);

  const [labData, setLabData] = useState({
    Backlog: [],
    Requested: [],
    Received: [],
    Reviewing: [],
  });

  async function fetchLabData() {
    try {
      loader.start();
      const res = await getAllLabTestData();
      console.log("API Response:", res);

      if (res?.data?.data && Array.isArray(res.data?.data)) {
        console.log("Raw Lab Data:", res.data.data);
        const formattedData = {};

        res.data?.data.forEach((stageGroup) => {
          const stageKey =
            stageGroup._id.charAt(0).toUpperCase() + stageGroup._id.slice(1);

          if (Array.isArray(stageGroup.data)) {
            formattedData[stageKey] = stageGroup.data.map((item) => ({
              id: item._id,
              name: item.client_name,
              initials: getInitials(item.client_name),
              count: 1,
              testName: item.test_name,
            }));
          } else {
            console.warn(
              `Expected array at stageGroup.data for stage ${stageKey}`,
              stageGroup
            );
            formattedData[stageKey] = [];
          }
        });

        console.log("Formatted Lab Data:", formattedData);
        const allStages = ["Backlog", "Requested", "Received", "Reviewing"];
        const completeData = {};

        allStages.forEach((stage) => {
          completeData[stage] = formattedData[stage] || [];
        });

        setLabData(completeData);
      } else {
        toast.error("No lab test data received.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Error loading lab test data.");
    } finally {
      loader.stop();
    }
  }

  useEffect(() => {
    fetchLabData();
  }, []);

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "NA"; // Fallback initials
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  // const onDragEnd = (result) => {
  //   const { source, destination } = result;
  //   if (!destination) return;

  //   const sourceStage = source.droppableId;
  //   const destStage = destination.droppableId;

  //   const sourceItems = Array.from(labData[sourceStage]);
  //   const destItems = Array.from(labData[destStage]);
  //   const [movedItem] = sourceItems.splice(source.index, 1);

  //   destItems.splice(destination.index, 0, movedItem);

  //   setLabData({
  //     ...labData,
  //     [sourceStage]: sourceItems,
  //     [destStage]: destItems,
  //   });
  // };
  const stageApiMap = {
    Backlog: "backlog",
    Requested: "requested",
    Received: "received", // make sure this is correct
    Reviewing: "reviewing", // replace with correct value if needed (e.g., "in-review")
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    // No movement
    if (sourceStage === destStage && source.index === destination.index) return;

    const sourceItems = Array.from(labData[sourceStage]);
    const destItems = Array.from(labData[destStage]);
    const [movedItem] = sourceItems.splice(source.index, 1);

    // Update locally first for UI
    destItems.splice(destination.index, 0, movedItem);
    setLabData({
      ...labData,
      [sourceStage]: sourceItems,
      [destStage]: destItems,
    });

    console.log("Received:", filteredLabsData["Received"]);
    console.log("Reviewing:", filteredLabsData["Reviewing"]);
    try {
      loader.start();
      const updatedPayload = {
        test_name: movedItem.testName,
        stages: stageApiMap[destStage], // <- safer mapping
        client_name: movedItem.name,
        // fileData: movedItem.fileData || "",
    //     fileData: {
    // fileName: movedItem.fileData?.fileName || "",
    // fileUrl: movedItem.fileData?.fileUrl || "",
  // },
      };

      const res = await editLabData(movedItem.id, updatedPayload);
      toast.success("Stage updated successfully");
      console.log("Updated data:", res.data);
    } catch (err) {
      toast.error("Failed to update stage");
      console.error("Stage update failed:", err);
    } finally {
      loader.stop();
    }
  };

  const filteredLabsData = Object.fromEntries(
    Object.entries(labData).map(([stage, items]) => [
      stage,
      items.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      ),
    ])
  );

  const stages = ["Backlog", "Requested", "Received", "Reviewing"];

  return (
    <>
      <CommonPagesHeader
        heading={"Labs Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: "Create Test",
          show: true,
          onClick: () => navigate("createLabTest", { replace: true }),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      <br />
      <TableContainer
        pagination
        title={"Labs Test Details"}
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        totalCount={data?.totalCount || 0}
      >
        <div className="p-6 bg-gray-100 min-h-screen">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stages.map((stage) => {
                const stageItems = filteredLabsData[stage] || [];

                return (
                  <div
                    key={stage}
                    className="bg-white border rounded-md p-4 shadow-sm"
                  >
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      {stage}
                    </h3>
                    <span className="text-xs text-gray-500 mb-3 block">
                      {stageItems.length} request
                      {stageItems.length !== 1 ? "s" : ""}
                    </span>

                    <Droppable droppableId={stage}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2 min-h-[80px]"
                        >
                          {stageItems.map((patient, index) => (
                            <Draggable
                              key={patient.id}
                              draggableId={patient.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white border rounded-md p-2 shadow flex justify-between items-center"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                                      {patient.initials}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium text-gray-800">
                                        {patient.name}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {patient.testName}
                                      </span>
                                    </div>
                                  </div>
                                  {/* 
                                  {stage === "Requested" && (
                                    <button
                                      className="text-xs text-white bg-orange-500 hover:bg-orange-500 px-2 py-1 rounded"
                                      onClick={() =>
                                        navigate(`uploadReport/${id}`, {
                                          replace: true,
                                        })
                                      }
                                    >
                                      Upload Report
                                    </button>
                                  )} */}

                                  {stage === "Requested" && (
                                    <button
                                      className="text-xs text-white bg-orange-500 hover:bg-orange-500 px-2 py-1 rounded"
                                      onClick={() =>
                                        navigate(`uploadReport/${patient.id}`, {
                                          replace: true,
                                        })
                                      }
                                    >
                                      Upload Report
                                    </button>
                                  )}

                                  {stage === "Received" && (
                                    <button
                                      className="text-xs text-white bg-orange-500 hover:bg-orange-500 px-2 py-1 rounded"
                                      onClick={() => {
                                        navigate(`/viewReport/${patient.id}`);
                                      }}
                                    >
                                      View Report
                                    </button>
                                  )}

                                  {stage === "Reviewing" && (
                                    <div className="flex gap-2">
                                      <button
                                        className="text-xs text-white bg-orange-500 hover:bg-orange-500 px-2 py-1 rounded"
                                        onClick={() => {
                                       navigate(`/viewReport/${patient.id}`);
                                        }}
                                      >
                                        View Report
                                      </button>

                                      <div className="relative">
                                        <button
                                          className="text-xs text-white bg-orange-500 hover:bg-orange-500 px-2 py-1 rounded"
                                          onClick={() =>
                                            setOpenShareMenuId(
                                              openShareMenuId === patient.id
                                                ? null
                                                : patient.id
                                            )
                                          }
                                        >
                                          Share ⬇
                                        </button>

                                        {openShareMenuId === patient.id && (
                                          <div
                                            className="absolute right-0 mt-1 bg-white border rounded shadow z-10 w-36"
                                            onMouseLeave={() =>
                                              setOpenShareMenuId(null)
                                            }
                                          >
                                            <button
                                              className="w-full text-left text-sm px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                              onClick={() =>
                                                navigate(`printReport/${patient.id}`)
                                              }
                                            >
                                              <PrintIcon fontSize="small" />
                                              Print
                                            </button>
                                            <button
                                              className="w-full text-left text-sm px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                              onClick={() =>
                                                navigate("emailReport")
                                              }
                                            >
                                              <EmailIcon fontSize="small" />
                                              Email
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {![
                                    "Requested",
                                    "Received",
                                    "Reviewing",
                                  ].includes(stage) && (
                                    <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>
      </TableContainer>

      <Outlet context={fetchLabData} />
    </>
  );
};

export default LabsTestManagement;