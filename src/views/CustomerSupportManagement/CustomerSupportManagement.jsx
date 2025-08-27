import React, { useState } from "react";
import { TableContainer } from "../../components/Table/TableContainer";
import { CommonPagesHeader } from "../../components/PagesHeaders/CommonPagesHeader";
import { Link, useNavigate } from "react-router";
import {
  useDeleteCustomerSupportByIdMutation,
  useGetAllCustomerSupportQuery,
  useUpdateCustomerSupportStatusMutation,
} from "../../store/apiSlices/customerSupportApiSlices";
import { loader, searchDataWithMultipleKeys, toast } from "../../utils";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { DeleteIcon, EditIcon, EyeIcon } from "../../components/Icons/SvgIcons";
import { StatusTag } from "../../components/common/StatusTag";
import { DeleteButton } from "../../components/Buttons/DeleteButton";
export const CustomerSupportManagement = () => {
 
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
 
 
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
 
  const { data } = useGetAllCustomerSupportQuery();
 
 
 
  const [updateStatus] = useUpdateCustomerSupportStatusMutation();
  const filteredData = searchDataWithMultipleKeys(
    ["name", "email"],
    data || [],
    search
  );
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const [deleteCustomerSupport] = useDeleteCustomerSupportByIdMutation();
 
  async function deleteSpec(id) {
    try {
      loader.start();
      let res = await deleteCustomerSupport(id);
      toast.success("Deleted successfully");
    } catch (error) {
      console.log(error);
    } finally {
      loader.stop();
    }
  }
 
  return (
    <div>
      <CommonPagesHeader
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
        subHeading={"All Consultations of All Healthcare Providers"}
        heading={"Customer Support Management"}
        addButtonProps={{
          show: true,
          title: "Add Employee",
          onClick: () => navigate("create"),
        }}
      />
      <TableContainer
        pagination
        currentPage={currentPage}
        onPageChange={(newPage) => setCurrentPage(newPage)}
        pageSize={pageSize}
        totalCount={filteredData.length}
        className={"mt-4"}
        title="Customer Support"
        height="340px"
      >
        <DataTable data={paginatedData || []}>
          <TableColumn title="Employee ID" field={"employee_id"}></TableColumn>
          <TableColumn title="Name" field={"name"}></TableColumn>
          <TableColumn title="Email Address" field={"email"}></TableColumn>
          {/* <TableColumn title="Query Resolved" body={() => "57"}></TableColumn>
                    <TableColumn title="Query Pending" body={() => 4}></TableColumn> */}
          <TableColumn
            title="Status"
            body={(rowData) => (
              <div
                onClick={() =>
                  updateStatus({
                    id: rowData._id,
                    body: { status: !rowData?.status },
                  })
                }
              >
                <StatusTag status={rowData?.status ? "Enabled" : "Disabled"} />
              </div>
            )}
          ></TableColumn>
          <TableColumn
            title="Action"
            body={(rowData) => (
              <div className="flex items-center gap-2">
                <Link to={`update/${rowData._id}`}>
                  <EditIcon />
                </Link>
                <Link to={`view/${rowData._id}`}>
                  <EyeIcon className="pointer" />
                </Link>
                <DeleteButton
                  className="cursor-pointer"
                  data={rowData._id}
                  confirmation
                  onDelete={deleteSpec}
                />
              </div>
            )}
          ></TableColumn>
        </DataTable>
      </TableContainer>
    </div>
  );
};
 