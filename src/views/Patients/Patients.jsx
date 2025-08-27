import React, { useState } from "react";
import { TableContainer } from "../../components/Table/TableContainer";
import { PatientsHeader } from "../../components/PagesHeaders/PatientsHeader";
import { EyeIcon } from "../../components/Icons/SvgIcons";
import { StatusTag } from "../../components/common/StatusTag";
import { useGetAllPatientsQuery } from "../../store/apiSlices/patientApiSlice";
import { searchDataWithMultipleKeys } from "../../utils";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { Link, useNavigate } from "react-router";
import { GridAndListButton } from "../../components/Buttons/GridAndListButton";
import { DoctorCard } from "../../components/Cards/DoctorCard";
import img from "../../assets/images/userProfileImg.png";

export const Patients = () => {
  const navigate = useNavigate();
  const [dataTableView, setDataTableView] = useState("column");
  const { data } = useGetAllPatientsQuery();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;
  const filteredPatients = searchDataWithMultipleKeys(
    ["name"],
    data || [],
    search
  );

  return (
    <div>
      <div className="grid grid-cols-[1fr_80px] gap-4 items-center ">
        <PatientsHeader
          onSearch={(e) => setSearch(e.target.value)}
          searchValue={search}
        />
        <GridAndListButton onClick={setDataTableView} value={dataTableView} />
      </div>
      <br />

      {dataTableView === "grid" ? (
        <div className="grid 2500px:grid-cols-6 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5">
          {filteredPatients?.map((res, ind) => {
            return (
              <DoctorCard
                onClick={() => {
                  navigate(`view/${res._id}`);
                }}
                isSmallCard={true}
                actionButtons={false}
                key={ind}
                img={res?.profile_image?.fileUrl || img}
                name={res?.name}
                status={"Active"}
                mobile={res?.mobile}
                patient_id={res?.patient_id}
              />
            );
          })}
        </div>
      ) : (
        <TableContainer title={"Patients"}>
          <DataTable data={filteredPatients || []}>
            <TableColumn
              title="Patient Name"
              field={"name"}
              body={(rowData) => {
                return (
                  <div className="flex items-center gap-3">
                    <img
                      src={rowData?.profile_image?.fileUrl || img}
                      className="w-[20px] h-[20px] rounded-full"
                    />
                    <span>{rowData?.name}</span>
                  </div>
                );
              }}
            ></TableColumn>
            <TableColumn
              title="Patient ID"
              field="patient_id"
              body={(rowData) => rowData?.patient_id ?? "N/A"}
            />

            <TableColumn title="Mobile" field={"mobile"}></TableColumn>
            {/* <TableColumn title="Status" body={() => <StatusTag status={"Active"} />}></TableColumn> */}
            <TableColumn
              title="Action"
              body={(rowData) => (
                <div className="flex gap-2">
                  <Link to={`/patientDetails/${rowData._id}/appointments`}>
                    <EyeIcon />
                  </Link>
                </div>
              )}
            ></TableColumn>
          </DataTable>
        </TableContainer>
      )}
    </div>
  );
};
