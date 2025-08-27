import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { DataTable, TableColumn } from "../../../../components/Table/DataTable";
import { ConfirmationDialog } from "../../../../components/Dialogs/ConfirmationDialog";
import { EditIcon } from "../../../../components/Icons/SvgIcons";
import { TableContainer } from "../../../../components/Table/TableContainer";
import { DeleteButton } from "../../../../components/Buttons/DeleteButton";
import { loader, toast } from "../../../../utils";
import { StatusTag } from "../../../../components/common/StatusTag";
import { CommonPagesHeader } from "../../../../components/PagesHeaders/CommonPagesHeader";
import { deleteMedicalConditionById, getAllMedicalConditionData, updateMedicalConditionStatusById } from "../../../../services/LabTestManagement";
import moment from "moment";

const MedicalCondition = () => {

      const [page, setPage] = useState(1);
      const pageSize = 10;
      const [search, setSearch] = useState("");
      const [data, setData] = useState([]);
   const { id, docId } = useParams();
 const fetchMedicalData = async () => {
    loader.start();
    try {
      const response = await getAllMedicalConditionData(id);
      console.log("API Response:", response);
      setData(response?.data || []);
      console.log("API raw Response:", response?.data );
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      loader.stop();
    }
  };

  useEffect(() => {
    fetchMedicalData();
  }, [page]);


  const deleteSpec = async (docId) => {
      try {
        loader.start();
        const res = await deleteMedicalConditionById(docId);
        if (res?.data) {
          setData((prevData) => {
            console.log("Previous Data:", prevData);
            const updatedData = prevData.filter((item) => item._id !== docId);
            console.log("Updated Data:", updatedData);
            return updatedData;
          });
          toast.success("Medical Data deleted successfully");
        } else {
          toast.error("Failed to delete Medical Data : No data received");
        }
      } catch (error) {
        console.error("Error during delete:", error);
        toast.error("Failed to delete data.");
      } finally {
        loader.stop();
      }
    };

const handleStatusUpdate = async (id, currentStatus) => {
  try {
    loader.start();
    const payload = { is_active: !currentStatus }; 
    console.log("Payload:", payload);

    await updateMedicalConditionStatusById(id, payload);
    toast.success("Status updated!");
    fetchMedicalData();
  } catch (err) {
    toast.error("Update failed.");
  } finally {
    loader.stop();
  }
};
      const navigate = useNavigate();
    const  filteredMedicalCondtion =data?.filter((item)=>{
        return item?.name && item?.name.toLowerCase().includes(search.toLowerCase())
    })
  return (
   <>
     <CommonPagesHeader
           heading={"Medical  Management"}
           subHeading={"All Consultations of All Healthcare Providers"}
           addButtonProps={{
             title: "Add",
             show: true,
             onClick: () => navigate("add", { replace: true }),
           }}
           searchValue={search}
           onSearch={(e) => setSearch(e.target.value)}
         />
         <br />
         <TableContainer
           pagination
           title={"Medical Conditions "}
           currentPage={page}
           onPageChange={setPage}
           pageSize={pageSize}
           totalCount={Array.isArray(data) ? data.length : data?.totalCount || 0}
         >
           <DataTable data={filteredMedicalCondtion || []}>
             {/* <TableColumn
               title="Image"
               body={(rowData) =>
                 rowData.fileData?.fileUrl ? (
                   <a
                     href={rowData.fileData.fileUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                   >
                     <img
                       src={rowData.fileData.fileUrl}
                       alt="Document Img"
                       style={{
                         width: "40px",
                         height: "40px",
                         objectFit: "cover",
                         borderRadius: "50%",
                         cursor: "pointer",
                       }}
                     />
                   </a>
                 ) : (
                   "No Image"
                 )
               }
             /> */}
   
             <TableColumn title=" Name" field="name" />
             <TableColumn title="Health Status" field="health_status" />
             <TableColumn
               title="Last modified"
               body={(rowData) => moment(rowData.createdAt).format("DD-MM-YYYY")}
             />
<TableColumn
  title="Status"
  body={(rowData) => (
    <ConfirmationDialog
      title={rowData?.is_active ? "Enabled" : "Disabled"}
      data={!rowData?.is_active}
      onConfirm={() =>
        handleStatusUpdate(rowData._id, rowData.is_active)
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
        status={rowData?.is_active ? "Enabled" : "Disabled"}
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
   navigate(`update/${rowData._id}`);

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

    <Outlet context={fetchMedicalData} />
   </>
  )
}

export default MedicalCondition