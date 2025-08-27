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

import moment from "moment";
import {
  DeleteDocumentDataById,
  getAllDocumentData,
  getAllPatientCertificateData,
  updateDocumentStatus,
} from "../../../../services/documentManagement";

const Documents = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id, docId } = useParams();
  const navigate = useNavigate();
  const [certificateData, setCertificateData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const fetchDocumentData = async () => {
    if (!id) return;
    loader.start();
    try {
      const response = await getAllDocumentData(id);
      console.log("API Response:", response.data);
      setData(response?.data?.data || response?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      loader.stop();
    }
  };
  useEffect(() => {
    fetchDocumentData();
  }, [id, docId, page]);

  useEffect(() => {
    console.log("Updated Data State:", data);
  }, [data]);

  const deleteSpec = async (docId) => {
    try {
      loader.start();
      const res = await DeleteDocumentDataById(docId);
      if (res?.data) {
        setData((prevData) => {
          console.log("Previous Data:", prevData);
          const updatedData = prevData.filter((item) => item._id !== docId);
          console.log("Updated Data:", updatedData);
          return updatedData;
        });
        toast.success("Document deleted successfully");
      } else {
        toast.error("Failed to delete document: No data received");
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
      const payload = { status: !currentStatus };
      console.log("Payload:", payload);

      await updateDocumentStatus(id, payload);
      toast.success("Status updated!");
      fetchDocumentData();
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      loader.stop();
    }
  };

  // for patient certificate
  const fetchPatientCertificateData = async () => {
    if (!id) return;
    try {
      const response = await getAllPatientCertificateData(id);
      const data = response?.data;
      console.log(data, "data......");
      setCertificateData([data]);
      setFilteredCertificates([data]);
    } catch (error) {
      console.error("Certificate fetch error:", error);
    }
  };

  useEffect(() => {
    fetchPatientCertificateData();
  }, [id, page]);

  // Search filter function
  useEffect(() => {
    const filtered = certificateData.filter((item) =>
      item.upload_certificate?.some((cert) =>
        cert.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    console.log(
      filtered,
      "-----------------------------------------",
      certificateData
    );
    setFilteredCertificates(filtered);
  }, [searchTerm, certificateData]);

  const filteredSpecialities = data.filter(
    (doc) =>
      doc?.fileName && doc.fileName.toLowerCase().includes(search.toLowerCase())
  );

const tableData = certificateData.flatMap((item) =>
  Array.isArray(item.upload_certificate)
    ? item.upload_certificate.map((cert) => ({
        cert,
        createdAt: item.createdAt,
        parentId: item._id,
      }))
    : []
);

  return (
    <div>
      <CommonPagesHeader
        heading={"Document Management"}
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
        title={"Document"}
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        totalCount={Array.isArray(data) ? data.length : data?.totalCount || 0}
      >
        <DataTable data={filteredSpecialities || []}>
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

          <TableColumn title="File Name" field="fileName" />
          <TableColumn title="Created By" field="created_by" />
          <TableColumn
            title="Last modified"
            body={(rowData) => moment(rowData.createdAt).format("DD-MM-YYYY")}
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
          />
        </DataTable>
      </TableContainer>
      <br />
      <>
        <TableContainer
          pagination
          title="Patient Certificate"
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          totalCount={filteredCertificates.length}
        >
          <DataTable
            data={filteredCertificates.slice(
              (page - 1) * pageSize,
              page * pageSize
            )}
          >
            <TableColumn
              title="Certificate Image"
              body={(row) =>
                row.upload_certificate?.length ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    {row.upload_certificate.map((cert) => (
                      <a
                        key={cert._id}
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={cert.fileUrl}
                          alt="Cert"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                            borderRadius: "50%",
                          }}
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  "No Image"
                )
              }
            />

            <TableColumn
              title="Last Modified"
              body={(row) => moment(row.createdAt).format("DD-MM-YYYY")}
            />
          </DataTable>
        </TableContainer>
      </>
      <Outlet context={fetchDocumentData} />
    </div>
  );
};

export default Documents;
