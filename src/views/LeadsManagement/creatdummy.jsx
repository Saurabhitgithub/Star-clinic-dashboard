import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAllLeads } from "../../store/apiSlices/leadApiSlice";
import moment from "moment";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import UserAvatar from "../../components/UI/UserAvatar";

export const LeadsManagement = () => {
  const [data, setData] = useState([]);
  const [columnOrder, setColumnOrder] = useState([
    "leadName",
    "email",
    "mobile",
    "leadAgo",
    "dateAdded",
    "amount",
    "pipeline",
    "leadStage",
    "action"
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllLeads().then((res) => {
      setData(res.data.data || []);
    });
  }, []);

  const columnsMap = {
    leadName: {
      key: "leadName",
      title: "Lead Name",
      render: (row) => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(`/detailView`)}
        >
          <UserAvatar
            img={row?.userData?.[0]?.user_profile?.fileUrl}
            name={`${row?.first_name} ${row?.last_name}`}
            size={30}
          />
          <span className="capitalize">
            {`${row.first_name} ${row.last_name}`.trim()}
          </span>
        </div>
      ),
    },
    email: {
      key: "email",
      title: "Email",
      render: (row) => row.email,
    },
    mobile: {
      key: "mobile",
      title: "Phone",
      render: (row) => row.mobile,
    },
    leadAgo: {
      key: "leadAgo",
      title: "Lead Ago",
      render: (row) => moment(row.createdAt).fromNow(),
    },
    dateAdded: {
      key: "dateAdded",
      title: "Date Added",
      render: (row) =>
        moment(row.createdAt).format("DD-MM-YYYY, hh:mm:ss"),
    },
    amount: {
      key: "amount",
      title: "Amount",
      render: (row) => row.amount,
    },
    pipeline: {
      key: "pipeline",
      title: "Pipeline",
      render: (row) =>
        row.pipelineDetails?.[0]?.pipeline_name || "N/A",
    },
    leadStage: {
      key: "leadStage",
      title: "Lead Stage",
      render: (row) => {
        const stages = row.pipelineDetails?.[0]?.stages || [];
        const currentStage = stages.find(
          (s) => s._id === row.lead_stage
        );
        return currentStage ? currentStage.stage_name : "N/A";
      },
    },
    action: {
      key: "action",
      title: "Action",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="text-blue-500 underline"
            onClick={() => navigate(`/leadsManagement/edit/${row._id}`)}
          >
            Edit
          </button>
          <button className="text-red-500 underline">Delete</button>
        </div>
      ),
    },
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedOrder = Array.from(columnOrder);
    const [moved] = updatedOrder.splice(result.source.index, 1);
    updatedOrder.splice(result.destination.index, 0, moved);
    setColumnOrder(updatedOrder);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Leads Management (Drag Columns)</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto border rounded">
          <div className="flex">
            <Droppable droppableId="columns" direction="horizontal" type="column">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex"
                >
                  {columnOrder.map((key, index) => {
                    const col = columnsMap[key];
                    if (!col) return null;

                    return (
                      <Draggable draggableId={key} index={index} key={key}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="min-w-[180px]  last:border-r-0"
                          >
                            {/* Header */}
                            <div className="bg-gray-100 p-2 flex items-center gap-2 border-b font-semibold">
                              <span
                                {...provided.dragHandleProps}
                                className="cursor-grab"
                              >
                                {/* Drag icon */}
                                <svg width="12" height="12" fill="gray" viewBox="0 0 24 24">
                                  <circle cx="5" cy="5" r="2" />
                                  <circle cx="5" cy="12" r="2" />
                                  <circle cx="5" cy="19" r="2" />
                                  <circle cx="12" cy="5" r="2" />
                                  <circle cx="12" cy="12" r="2" />
                                  <circle cx="12" cy="19" r="2" />
                                </svg>
                              </span>
                              {col.title}
                            </div>

                            {/* Body Cells */}
                            {data.map((row, rowIndex) => (
                              <div key={row._id || rowIndex} className="p-2 border-b">
                                {col.render(row)}
                              </div>
                            ))}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

















import React, { useState } from "react";

const tabs = ["Activity", "Notes", "Emails", "Calls", "More"];

export default function LeadsAdditionalInfo() {
  const [activeTab, setActiveTab] = useState("Emails");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Activity":
        return (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Recent Activities</h2>
            <ul className="list-disc pl-5 text-gray-600 text-sm">
              <li>Lead created on April 4, 2025</li>
              <li>Status updated to "Contacted"</li>
              <li>Email sent to the client</li>
            </ul>
          </div>
        );
      case "Notes":
        return (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Notes</h2>
            <p className="text-gray-600 text-sm">
              Client prefers evening calls. Interested in premium treatment plans.
            </p>
          </div>
        );
      case "Emails":
        return (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Email Communication</h2>
            <p className="text-gray-600 text-sm">Last email sent on April 7, 2025</p>
            <p className="text-gray-600 text-sm mt-1">Subject: Welcome to our clinic!</p>
          </div>
        );
      case "Calls":
        return (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Call Logs</h2>
            <ul className="text-gray-600 text-sm">
              <li>📞 Call on April 5, 2025 - No answer</li>
              <li>📞 Call on April 6, 2025 - Follow-up scheduled</li>
            </ul>
          </div>
        );
      case "More":
        return (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">More Information</h2>
            <p className="text-gray-600 text-sm">Lead source: Social Media</p>
            <p className="text-gray-600 text-sm">Assigned to: Dr. Sharma</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 h-auto">
      <div className="flex space-x-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-2 cursor-pointer text-sm font-medium text-gray-600 hover:text-black ${
              activeTab === tab ? "text-black" : ""
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-900 rounded-full" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
}







import React, { useState } from "react";

const tabs = ["Activity", "Notes", "Emails", "Calls"];

export default function LeadsAdditionalInfo() {
  const [activeTab, setActiveTab] = useState("Emails");

  return (
    <div className="bg-white p-4 h-auto">
      <div className="flex space-x-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-2 cursor-pointer text-sm font-medium text-gray-600 hover:text-black ${
              activeTab === tab ? "text-black" : ""
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-900 rounded-full" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-700">
        {/* Placeholder content */}
        Showing content for: <strong>{activeTab}</strong>
      </div>
    </div>
  );
}

