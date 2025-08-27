import React, { useState } from "react";

import { EditIcon } from "../../components/Icons/SvgIcons";
import { TableContainer } from "../../components/Table/TableContainer";
import { SpecialityManagementHeader } from "../../components/PagesHeaders/SpecialityManagementHeader";
import { Outlet, useNavigate } from "react-router";
import moment from "moment";
import {
  useDeleteSpecilieyByIdMutation,
  useGetAllSpecilitiesDataQuery,
  useUpdataSpecilitiesStatusMutation,
} from "../../store/apiSlices/specialityApiSlice";
import { DeleteButton } from "../../components/Buttons/DeleteButton";
import { loader, toast } from "../../utils";
import { StatusTag } from "../../components/common/StatusTag";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { ConfirmationDialog } from "../../components/Dialogs/ConfirmationDialog";

export const SpecialtyManagement = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  // fetch all specility management data with pagination
  const { data, isLoading, error } = useGetAllSpecilitiesDataQuery({
    page: page,
    pageSize: pageSize,
  });
  const [deleteSpeciality] = useDeleteSpecilieyByIdMutation();
  const [changeStatus] = useUpdataSpecilitiesStatusMutation();

  const navigate = useNavigate();

  async function deleteSpec(id) {
    try {
      loader.start();
      let res = await deleteSpeciality(id);
      toast.success(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      loader.stop();
    }
  }

  const filteredSpecialities = data?.data?.filter((speciality) =>
    speciality.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SpecialityManagementHeader
        onSearch={(e) => setSearch(e.target.value)}
        searchValue={search}
      />
      <br />
      <TableContainer
        pagination
        title={"Specialities"}
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        totalCount={data?.totalCount || 0}
      >
        <DataTable data={filteredSpecialities || []}>
          <TableColumn
            title="Icon"
            body={(rowData) =>
              rowData.image && rowData.image.fileUrl ? (
                <img
                  src={rowData.image.fileUrl}
                  alt="Speciality Icon"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    borderRadius: "10%",
                  }}
                />
              ) : (
                "No Image"
              )
            }
          />
          <TableColumn title="Name" field={"name"}></TableColumn>
          <TableColumn
            title="Date Added"
            body={(rowData) => moment(rowData.createdAt).format("DD-MM-YYYY")}
          ></TableColumn>
          <TableColumn title="No. of Doctors" body={() => "--"}></TableColumn>
          <TableColumn
            title="Status"
            body={(rowData) => (
              <ConfirmationDialog
                title="Chage Status"
                data={!rowData?.status}
                onConfirm={(data) =>
                  changeStatus({ status: data, id: rowData._id })
                }
                body="Are you sure you want to change status"
                secondaryBtnText={"Cancel"}
                primaryBtnText={"Submit"}
              >
                <StatusTag
                  className="pointer"
                  status={rowData?.status ? "Enabled" : "Disabled"}
                />
              </ConfirmationDialog>
            )}
          ></TableColumn>
          <TableColumn
            title="Action"
            body={(rowData) => (
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
                  onDelete={deleteSpec}
                />
              </div>
            )}
          ></TableColumn>
        </DataTable>
      </TableContainer>
      <Outlet />
    </div>
  );
};
