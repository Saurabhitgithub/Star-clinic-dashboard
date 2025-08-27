import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deleteLeadData, getAllLeads } from "../../store/apiSlices/leadApiSlice";
import moment from "moment";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import UserAvatar from "../../components/UI/UserAvatar";
import { EditIcon } from "../../components/Icons/SvgIcons";
import { DeleteButton } from "../../components/Buttons/DeleteButton";
import { LeadsManagementHeader } from "../../components/PagesHeaders/LeadsManagementHeader";
import { loader, toast } from "../../utils";
import { BiGridVertical } from "react-icons/bi";

export const LeadsManagement = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [columnOrder, setColumnOrder] = useState([
    "leadName",
    "email",
    "mobile",
    "leadAgo",
    "dateAdded",
    "amount",
    "pipeline",
    "leadStage",
    "action",
  ]);

  const navigate = useNavigate();

  const fetchAllLeadData = async () => {
    setLoading(true);
    loader.start();
    try {
      const response = await getAllLeads();
      const leads = response.data.data || [];
      setData(leads);
      setTotalCount(leads.length);
    } catch (err) {
      toast.error(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
      loader.stop();
    }
  };

  useEffect(() => {
    fetchAllLeadData();
  }, []);

  const deleteLeads = async (id) => {
    try {
      loader.start();
      await deleteLeadData(id);
      toast.success("Lead deleted successfully");
      await fetchAllLeadData();
    } catch (error) {
      toast.error("Failed to delete lead");
    } finally {
      loader.stop();
    }
  };
  useEffect(() => {
    const storedColumnOrder = localStorage.getItem("leads_column_order");
    if (storedColumnOrder) {
      setColumnOrder(JSON.parse(storedColumnOrder));
    }
    fetchAllLeadData();
  }, []);

  const columnsMap = {
    leadName: {
      title: "Full Name",
      render: (row) => {
        const fullName = `${row.first_name || ""} ${row.last_name || ""}`.trim();
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(`/leadsManagement/detailView/${row._id}`)}
          >
            <UserAvatar
              name={fullName}
              img={row.profile_picture || ""}
              size={30}
            />
            <span className="capitalize">{fullName}</span>
          </div>
        );
      },
    },
    
    email: { title: "Email", render: (row) => row.email },
    mobile: { title: "Phone", render: (row) => row.mobile },
    leadAgo: {
      title: "Lead Ago",
      render: (row) => moment(row.createdAt).fromNow(),
    },
    dateAdded: {
      title: "Date Added",
      render: (row) => moment(row.createdAt).format("DD-MM-YYYY, HH:mm:ss"),
    },
    amount: { title: "Amount", render: (row) => row.amount },
    pipeline: {
      title: "Pipeline",
      render: (row) => row.pipelineDetails?.[0]?.pipeline_name || "N/A",
    },
    leadStage: {
      title: "Lead Stage",
      render: (row) => {
        const stages = row.pipelineDetails?.[0]?.stages || [];
        const currentStage = stages.find((s) => s._id === row.lead_stage);
        return currentStage ? currentStage.stage_name : "N/A";
      },
    },
    action: {
      title: "Action",
      render: (row) => (
        <div className="flex justify-center gap-2">
          <EditIcon
            className="pointer"
            onClick={() => navigate(`/leadsManagement/edit/${row._id}`)}
          />
          <DeleteButton
            className="pointer "
            data={row._id}
            confirmation
            onDelete={deleteLeads}
          />
        </div>
      ),
    },
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedOrder = [...columnOrder];
    const [moved] = updatedOrder.splice(result.source.index, 1);
    updatedOrder.splice(result.destination.index, 0, moved);
    setColumnOrder(updatedOrder);
    localStorage.setItem("leads_column_order", JSON.stringify(updatedOrder));
  };
  

  const filteredData = data.filter((lead) =>
    `${lead.first_name} ${lead.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <LeadsManagementHeader
        onSearch={(e) => setSearch(e.target.value)}
        searchValue={search}
        heading={"Leads"}
        subHeading={"All Leads"}
        totalCount={totalCount}
        addButtonProps={{
          show: true,
          title: "Create Lead",
          onClick: () => navigate("/leadsManagement/add"),
        }}
      />

      {/* Custom Table */}
      <div className="mt-5 border rounded overflow-hidden">
  <DragDropContext onDragEnd={handleDragEnd}>
    <Droppable droppableId="columns" direction="horizontal" type="column">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`grid grid-cols-${columnOrder.length} auto-cols-min min-w-full`}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columnOrder.length}, minmax(180px, 1fr))`,
            maxHeight: "500px", // Adjust max height for vertical scrolling
            overflowY: "auto",  // Enable vertical scrolling
            overflowX: "auto",  // Enable horizontal scrolling
          }}
        >
          {/* Header */}
          {columnOrder.map((key, index) => {
            const col = columnsMap[key];
            return (
              <Draggable draggableId={key} index={index} key={key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="p-3 bg-gray-100 font-semibold border-b flex items-center gap-2"
                  >
                    <span {...provided.dragHandleProps} className="cursor-grab">
                      <BiGridVertical className="text-gray-600" />
                    </span>
                    {col.title}
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}

          {/* Rows */}
          {filteredData.map((row, rowIndex) =>
            columnOrder.map((key, colIndex) => {
              const col = columnsMap[key];
              return (
                <div
                  key={`${row._id}-${key}`}
                  className="p-2 border-t  border-r break-words"
                >
                  {col.render(row)}
                </div>
              );
            })
          )}
        </div>
      )}
    </Droppable>
  </DragDropContext>
</div>

    </div>
  );
};
