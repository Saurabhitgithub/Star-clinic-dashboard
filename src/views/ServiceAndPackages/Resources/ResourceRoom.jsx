import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { DataTable, TableColumn } from "../../../components/Table/DataTable";
import { ConfirmationDialog } from "../../../components/Dialogs/ConfirmationDialog";
import { EditIcon } from "../../../components/Icons/SvgIcons";
import { TableContainer } from "../../../components/Table/TableContainer";
import { DeleteButton } from "../../../components/Buttons/DeleteButton";
import { StatusTag } from "../../../components/common/StatusTag";
import { CommonPagesHeader } from "../../../components/PagesHeaders/CommonPagesHeader";
import { loader, toast } from "../../../utils";
import {
  deleteRoomDataById,
  getAllRoomData,
  updateRoomStatusById,
} from "../../../services/ResourceManagement";
const ResourceRoom = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();


  const fetchRoomData = async () => {
    try {

      loader.start()
      const response = await getAllRoomData();
      console.log("Api response :", response);
      setData(response?.data || []);
    } catch (error) {
      console.error("Fetch Error : ", error);
      setError(error.message || "Failed to Fetch data");
    } finally {
   loader.stop()
    }
  };

  useEffect(() => {
 
    fetchRoomData();
  }, [page]);

  async function deleteSpec(id) {
    try {
      loader.start();
      let response = await deleteRoomDataById(id);
      toast.success(response?.data);
      const res = await getAllRoomData();
      setData(res?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete room data");
    } finally {
      loader.stop();
    }
  }

  const filteredSpecialities = data?.data?.filter(
    (doc) => doc?.name && doc.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleStatusUpdate(id, currentStatus) {
    try {
      loader.start();
      const newStatus = !currentStatus;
      await updateRoomStatusById(id, newStatus);

      toast.success(`Status changed to ${newStatus ? "Enabled" : "disabled"}`);
      setData((preData) => {
        const roomData = Array.isArray(preData) ? preData : preData?.data || [];
        return roomData.map((room) => {
          room._id === id ? { ...room, status: newStatus } : room;
        });
      });

      const response = await getAllRoomData();
      setData(response?.data || []);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      loader.stop();
    }
  }

  return (
    <>
      <CommonPagesHeader
        heading={"Resource Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: " Create Room",
          show: true,
          onClick: () => navigate("createRoom", { replace: true }),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      <br />
      <TableContainer
        pagination
        title={"Rooms"}
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        totalCount={Array.isArray(data) ? data.length : data?.totalCount || 0}
      >
        <DataTable data={filteredSpecialities || []}>
          <TableColumn
            title=" Room Name"
            body={(rowData) => (
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate(`/servicesListing/${rowData._id}`)}
              >
                {rowData.name}
              </span>
            )}
          />


          <TableColumn title="Location" 
          body={(rowData)=>rowData?.serviceData?.map((item)=>item.location).join(",")} />

          <TableColumn
            title="Status"
            body={(rowData) => (
              <ConfirmationDialog
                title={rowData?.status ? "Enabled" : "Disabled"}
                data={!rowData?.status}
                onConfirm={() =>
                  handleStatusUpdate(rowData._id, rowData.status)
                }
                body="Are you sure you want to change the status?"
                secondaryBtnText={
                  <button className="px-0 py-0.5 text-xs">Cancel</button>
                }
                primaryBtnText={
                  <button className="px-0 py-0.5 text-xs">Submit</button>
                }
              >
                <StatusTag
                  className="pointer"
                  status={rowData?.status ? "Enabled" : "Disabled"}
                />
              </ConfirmationDialog>
            )}
          />
          <TableColumn
            title="Action"
            body={(rowData) => {
              console.log("Clicked Row Data:", rowData);
              return (
                <div className="flex gap-2">
                  <EditIcon
                    className="pointer"
                    onClick={() => {
                      navigate(`updateRoom/${rowData._id}`);
                    }}
                  />
                  <DeleteButton
                    className="pointer"
                    data={rowData._id}
                    confirmation
                    onDelete={() => deleteSpec(rowData._id)}
                  />
                </div>
              );
            }}
          />
        </DataTable>
      </TableContainer>
      <Outlet context={fetchRoomData}/>
    </>
  );
};

export default ResourceRoom;
