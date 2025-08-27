import React, { useState, useEffect } from "react";
import { EditIcon } from "../../../components/Icons/SvgIcons";
import { TableContainer } from "../../../components/Table/TableContainer";
import { Outlet, useNavigate } from "react-router";
import { DeleteButton } from "../../../components/Buttons/DeleteButton";
import { loader, toast } from "../../../utils";
import { StatusTag } from "../../../components/common/StatusTag";
import { DataTable, TableColumn } from "../../../components/Table/DataTable";
import { ConfirmationDialog } from "../../../components/Dialogs/ConfirmationDialog";
import { CommonPagesHeader } from "../../../components/PagesHeaders/CommonPagesHeader";
import { deleteBlankFormById, getAllBlankFormData } from "../../../services/blankFormManagement";
const BlankForm = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);


  
  const fetchBlankFormData = async () => {
    try {
      loader.start();
      const response = await getAllBlankFormData();
      console.log("Api response :", response);
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Fetch Error : ", error);
      setError(error.message || "Failed to Fetch data");
    } finally {
      loader.stop();
    }
  };

  useEffect(() => {
    fetchBlankFormData();
  }, [page]);
  const filteredFormData = data.filter((item) => {
    return (
      item.full_name &&
      item.full_name.toLowerCase().includes(search.toLowerCase())
    );
  });

  async function deleteSpec(id) {
    try {
      loader.start();
      const response = await deleteBlankFormById(id);
      toast.success(response?.data);
  fetchBlankFormData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete form data");
    } finally {
      loader.stop();
    }
  }

const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = String(html || '');
  return div.textContent || div.innerText || '';
};
console.log(stripHtml('<p>Need a consultation regarding post-surgery symptoms and medication.</p>'));
  return (
    <>
      <CommonPagesHeader
        heading={"Form Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: "Create form",
          show: true,
          onClick: () => navigate("create", { replace: true }),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      <br />
      <TableContainer
        title={"Patient Forms"}
        pagination
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        totalCount={data?.totalCount || 0}
      >
        <DataTable data={filteredFormData || []}>
          <TableColumn
            title="Support Document"
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
          <TableColumn title="Patient Name" field={"full_name"} />
          <TableColumn title="Gender" field={"gender"} />
          <TableColumn title="Contact Number" field={"contact_number"} />
          <TableColumn title="Address" field={"address"} />
           <TableColumn title="Title" field={"title"} />
          <TableColumn title="Subject" field={"subject"} />
<TableColumn
  title="Description"
  field="description"
  body={(row) => stripHtml(row.description)}
/>



          <TableColumn
            title="Action"
            body={(rowData) => (
              <div className="flex gap-2">
                <EditIcon
                  className="pointer"
                  onClick={() => {
                    console.log("Navigating to update with ID:", rowData._id);
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
          />
        </DataTable>
      </TableContainer>
      <Outlet context={fetchBlankFormData} />
    </>
  );
};

export default BlankForm;
