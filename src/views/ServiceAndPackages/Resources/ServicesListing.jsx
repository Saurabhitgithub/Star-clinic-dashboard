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
import { Button } from "../../../components/Buttons/Button";
import { deleteRoomServiceDataById, getAllRoomServiceData, updateRoomServiceStatusById } from "../../../services/ResourceManagement";



const ServicesListing = () => {


  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   const { id, docId } = useParams();
 
   


   const fetchRoomServiceData = async () => {
    if (!id) return;
        loader.start()
       try {
         const response = await getAllRoomServiceData(id);
         console.log("API Response:", response.data);
         setData(response?.data?.data || response?.data || []);
       } catch (err) {
         console.error("Fetch Error:", err);
         setError(err.message || "Failed to fetch data");
       } finally {
         loader.stop()
       }
    };

  useEffect(() => {
 
    fetchRoomServiceData();
  },[id, docId, page]);

  async function deleteSpec(docId) {
    try {
      loader.start();
      const res = await deleteRoomServiceDataById(docId);
      if (res?.data) {
        setData((prevData) => {
          console.log("Previous Data:", prevData);
          const updatedData = prevData.filter((item) => item._id !== docId);
          console.log("Updated Data:", updatedData);
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

     async function handleStatusUpdate(docId , currentStatus){
      try {
       loader.start();
       const newStatus = !currentStatus;
       await updateRoomServiceStatusById(docId, newStatus);
       toast.success(`Status changed to ${newStatus ? "Enabled" : "Disabled"}`);
       setData((preData) => {
        const ServiceData = Array.isArray(preData) ? preData : preData?.data || [];
        return ServiceData.map((service) =>
          service._id === docId ? { ...service, status: newStatus } : service
        );
      });

      } catch (error) {
        toast.error("failed to update status");
        console.error(error)
      }finally{
        loader.stop();
      }
     }

   
  const filteredSpecialities = data.filter(
    (doc) =>
      doc?.service && doc.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <CommonPagesHeader
        heading={"Resource Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: "Add Services",
          show: true,
          onClick: () => navigate("AddRoomServices", { replace: true }),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      <br />
      <TableContainer
        pagination
        title={"Room Service details"}
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        totalCount={Array.isArray(data) ? data.length : data?.totalCount || 0}
      >
        <DataTable data={filteredSpecialities || []}>
                      
          <TableColumn title=" Service Name" 
          body={(rowData)=>rowData?.serviceData?.[0]?.service_name} />
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
                      navigate(`updateRoomService/${rowData._id}`);
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
      <div className="flex justify-start mt-4 pr-6">
              <Button
                onClick={() => navigate("/resourceRoom")} 
                primary
              >
                ← Back
              </Button>
            </div>
      <Outlet context={fetchRoomServiceData}/>
    </div>
  );
};

export default ServicesListing;
