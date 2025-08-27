import React, { useState, useEffect } from "react";
import { EditIcon } from "../../components/Icons/SvgIcons";
import { TableContainer } from "../../components/Table/TableContainer";
import { Outlet, useNavigate, useParams } from "react-router";
import { DeleteButton } from "../../components/Buttons/DeleteButton";
import { loader, toast } from "../../utils";
import { StatusTag } from "../../components/common/StatusTag";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { ConfirmationDialog } from "../../components/Dialogs/ConfirmationDialog";
import { CommonPagesHeader } from "../../components/PagesHeaders/CommonPagesHeader";
import moment from "moment";
import { getLabManagementDataById } from "../../services/LabTestManagement";

const ViewReport = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchLabManagementData = async () => {
    try {
      loader.start();
      const response = await getLabManagementDataById(id);
      console.log("Api response :", response);
    const result = response?.data;
setData(Array.isArray(result) ? result : [result]);

      console.log("Data fetched successfully:", response?.data);
    } catch (error) {
      console.error("Fetch Error : ", error);
      setError(error.message || "Failed to Fetch data");
    } finally {
      loader.stop();
    }
  };

  useEffect(() => {
    fetchLabManagementData();
  }, [page]);

  const filteredReportData = data?.filter((news) =>
    news?.test_name?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <CommonPagesHeader
        heading={"Labs Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: "Add",
          show: false,
          onClick: () => navigate("create", { replace: true }),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      <br />
      <TableContainer
        pagination
        title="Patient Lab Report"
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        totalCount={Array.isArray(data) ? data.length : data?.totalCount || 0}
      >
        <DataTable data={filteredReportData || []}>
          <TableColumn
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
          />
          <TableColumn title="Patient Name" field="client_name" />
          <TableColumn title="Test Name" field="test_name" />
          <TableColumn
            title="Last Modified"
            body={(row) => moment(row.createdAt).format("DD-MM-YYYY")}
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
                      navigate(`update/${rowData.user_id}/${rowData._id}`);
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
          /> */}
        </DataTable>
      </TableContainer>
    </>
  );
};

export default ViewReport;
