import React, { useState, useEffect } from "react";
// import { EditIcon } from "../../../components/Icons/SvgIcons";
import { TableContainer } from "../../../../components/Table/TableContainer";
import { Outlet, useNavigate } from "react-router";
import { DeleteButton } from "../../../../components/Buttons/DeleteButton";
import { loader, searchDataWithMultipleKeys, toast } from "../../../../utils";
import { StatusTag } from "../../../../components/common/StatusTag";
import { DataTable, TableColumn } from "../../../../components/Table/DataTable";
import { ConfirmationDialog } from "../../../../components/Dialogs/ConfirmationDialog";
import { CommonPagesHeader } from "../../../../components/PagesHeaders/CommonPagesHeader";
import { useGetAllDoctorsQuery, useUpdateDoctorByIdMutation } from "../../../../store/apiSlices/doctorApiSlices";


const LocationDetails = () => {
    const [page, setPage] = useState(1);
  
    const pageSize = 10;
    const [search, setSearch] = useState("");
    // const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

        // fetch all doctor data 
        const { data } = useGetAllDoctorsQuery()
        const [updateDoctor] = useUpdateDoctorByIdMutation()
       
        const filteredDoctors = searchDataWithMultipleKeys(["name"], data || [], search)
console.log("Filtered Doctors:", data);
      const filteredDoctorData = data?.filter(
    (speciality) =>
      speciality?.name &&
      speciality.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>  <CommonPagesHeader
            heading={"Location Management"}
            subHeading={"All Consultations of All Healthcare Providers"}
            addButtonProps={{
              title: "Add",
              show: false,
              onClick: () => navigate("create", { replace: true }),
            }}
            searchValue={search}
            onSearch={(e) => setSearch(e.target.value)}
          />
          <br></br>

            <TableContainer
              pagination
              title={"Location"}
              currentPage={page}
              onPageChange={setPage}
              pageSize={pageSize}
              totalCount={data?.totalCount || 0}
            >
              <DataTable data={filteredDoctorData || []}>
           <TableColumn
  title="Image"
  body={(rowData) =>
    rowData.profile_image?.fileUrl ? (
      <img
        src={rowData.profile_image.fileUrl}
        alt={rowData.name || "Profile image"}
        style={{
          width: "40px",
          height: "40px",
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
    ) : (
      "No Image"
    )
  }
/>

                <TableColumn title="Doctor Name" field={"name"} />
                {/* <TableColumn title="Description" field={"description"} /> */}
               
                <TableColumn title="Phone Number" field={"mobile"} />
                <TableColumn title="Email Address" field={"email_address"} />
               <TableColumn
  title="Clinic Address"
  body={(rowData) =>
    rowData.clinic_address?.map(addr => addr.address).join(', ') || 'N/A'
  }
/>
                {/* <TableColumn
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
                /> */}
                {/* <TableColumn
                  title="Action"
                  body={(rowData) => (
                    <div className="flex gap-2">
                      <EditIcon
                        className="pointer"
                        onClick={() => {
                          console.log("Navigating to update with ID:", rowData._id);
                          navigate(`/teamManagement/update/${rowData._id}`);
                        }}
                      />
                      <DeleteButton
                        className="pointer"
                        data={rowData._id}
                        confirmation
                        // onDelete={deleteSpec}
                      />
                    </div>
                  )}
                /> */}
              </DataTable>
            </TableContainer>
            </>
  )
}

export default LocationDetails