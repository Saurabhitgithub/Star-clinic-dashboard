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
import { deleteResourceEquipmentById, getAllResourceEquipment, updateResourceEquipmentStatusById } from "../../../services/ResourceManagement";

const EquipmentResource = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id, docId } = useParams();
  const navigate = useNavigate();



  const fetchResourceEquipment = async()=>{
    try {
      const response= await getAllResourceEquipment();
      setData(response?.data || []);

    } catch (error) {
      console.Error("Fetch error",error);
      setError(error.message || "Failed to fetch data")
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchResourceEquipment()
  },[page]);


  async function deleteSpec(id){
    setLoading(true);
    try {
      loader.start();
      let response = await deleteResourceEquipmentById(id)
      toast.success(response?.data);
      const res= await getAllResourceEquipment();
      setData(res?.data || []);
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete resource data")
    }finally {
      loader.stop();
    }
  }

  async function handleStatusUpdate(id,currentStatus) {
    try {
      loader.start()
      const newStatus=!currentStatus;
      await updateResourceEquipmentStatusById(id,newStatus);
      toast.success(`Status changed to ${newStatus ? "Enabled" : "Disabled"}`);
      setData((preData)=>{
        const equipmentData=Array.isArray(preData) ? preData : preData?.data || [];
        return equipmentData.map((equipment)=>{
          equipment._id===id ? {...equipment, status: newStatus } : equipment ;
        })
      })

      const response= await getAllResourceEquipment();
      setData(response?.data || []);
    } catch (error) {
       toast.error("Failed to update status");
            console.error(error);
    } finally {
          loader.stop();
        }
  }

    const filteredSpecialities = data?.data?.filter(
        (doc) =>
          doc?.resource_name && doc.resource_name.toLowerCase().includes(search.toLowerCase())
      );
  return (
  <div><CommonPagesHeader
             heading={"Resource Management"}
             subHeading={"All Consultations of All Healthcare Providers"}
             addButtonProps={{
               title: "Add Services",
               show: true,
               onClick: () => navigate("AddEquipmentResource", { replace: true }),
             }}
             searchValue={search}
             onSearch={(e) => setSearch(e.target.value)}
           />
           <br />
           <TableContainer
             pagination
             title={"Resources"}
             currentPage={page}
             onPageChange={setPage}
             pageSize={pageSize}
             totalCount={Array.isArray(data) ? data.length : data?.totalCount || 0}
           >
             <DataTable data={filteredSpecialities || []}>

              
               <TableColumn 
               title=" Resource Name "
               body={(rowData)=>(
                <span 
                className="text-blue-600 cursor-pointer"
                onClick={()=>navigate(`/equipmentServiceListing/${rowData._id}`)}
                >
                  {rowData.resource_name}
                </span>
               )} 
                />
               <TableColumn title="Location" 
            body={(rowData)=>rowData?.ResourceEquipmentData?.map((item)=>item.location).join(",")} 

               />
               
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
                      
                           navigate(`updateEquipmentResource/${rowData._id}`);
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
           <Outlet context={fetchResourceEquipment} />
           </div>
  )
}

export default EquipmentResource



