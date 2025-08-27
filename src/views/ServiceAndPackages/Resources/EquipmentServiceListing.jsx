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
import { deleteEquipmentServiceById, getAllEquipmentService, updateEquipmentServiceStatusById } from "../../../services/ResourceManagement";
const EquipmentServiceListing = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id} = useParams();
  const navigate = useNavigate();
 
  const fetchEquipmentServiceData = async () => {
    if (!id) return;
    loader.start();
    try {
      const response = await getAllEquipmentService(id);
      console.log("API Response:", response.data);
      setData(response?.data?.data || response?.data || []);
    } catch (error) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      loader.stop();
    }
  };
  useEffect(() => {
    fetchEquipmentServiceData();
  }, [id, page]);

  async function deleteSpec(docId) {
    try {
      loader.start();
      const res = await deleteEquipmentServiceById(docId);
      if (res?.data) {
        setData((prevData) => {
          console.log("Previous Data:", prevData);
          const updatedData = prevData.filter((item) => item._id !== docId);
          console.log("updated data:", updatedData);
          return updatedData;
        });
        toast.success(response?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      loader.stop();
    }
  }

  async function handleStatusUpdate(docId, currentStatus) {
    try {
      loader.start();
      const newStatus = !currentStatus;
      await updateEquipmentServiceStatusById(docId, newStatus);
      toast.success(`status changed to ${newStatus ? "Enabled" : "Disabled"}`);
      setData((prevData) => {
        const serviceData = Array.isArray(prevData)
          ? prevData
          : prevData?.data || [];
        return serviceData.map((service) => {
          service._id === docId ? { ...service, status: newStatus } : service;
        });
      });
      fetchEquipmentServiceData();
    } catch (error) {
      toast.error("failed to update status");
      console.error(error);
    } finally {
      loader.stop();
    }
  }

  const filteredEquipmentServices = data.filter(
    (doc) =>
      doc?.resource_service_name  && doc.resource_service_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <CommonPagesHeader
        heading={"Resource Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: "Add Services",
          show: true,
          onClick: () =>
            navigate("AddResourceServicesDetails", { replace: true }),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      <br />
      <TableContainer
        pagination
        title={"Resource details"}
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        totalCount={Array.isArray(data) ? data.length : data?.totalCount || 0}
      >
        <DataTable data={filteredEquipmentServices || []}>
          <TableColumn title=" Service Name" 
           body={(rowData)=>rowData?.servicesData?.[0]?.service_name}
           
           />
          <TableColumn title="Location" field="location" />

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
                      navigate(`updateResourceServicesDetails/${rowData._id}`);
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
      <Outlet context={fetchEquipmentServiceData} />
    </div>
  );
};

export default EquipmentServiceListing;
