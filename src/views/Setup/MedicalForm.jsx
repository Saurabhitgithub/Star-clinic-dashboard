import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import { EditIcon } from "../../components/Icons/SvgIcons";
import { DeleteButton } from "../../components/Buttons/DeleteButton";
import { TableContainer } from "../../components/Table/TableContainer";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { CommonPagesHeader } from "../../components/PagesHeaders/CommonPagesHeader";
import { ClassNames } from "@emotion/react";
import { ConfirmationDialog } from "../../components/Dialogs/ConfirmationDialog";
import { StatusTag } from "../../components/common/StatusTag";
import {
  deleteFormTemplateById,
  getAllFormTemplateData,
} from "../../services/formTemplateManagement";
import { loader, toast } from "../../utils";

const statusStyles = {
  Active: "bg-blue-100 text-blue-600",
  Inactive: "bg-yellow-100 text-yellow-600",
};

export const MedicalForm = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  const fetchFormTemplateData = async () => {
    try {
      loader.start();
      const response = await getAllFormTemplateData();
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
    fetchFormTemplateData();
  }, [page]);
  const filteredFormTemplateData = data.filter((item) => {
    const formType = item.formType;
    const nestedData = item[formType];
    const patientName =
      nestedData?.patientFullName || // used in most forms
      nestedData?.patientName || // used in treatment
      nestedData?.fullName || formType// used in registration
      "";

    return patientName.toLowerCase().includes(search.toLowerCase());
  });

  async function deleteSpec(id) {
    try {
      loader.start();
      const response = await deleteFormTemplateById(id);
      toast.success(response?.data);

      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete form data");
    } finally {
      loader.stop();
    }
  }

  const handleCreateFormClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <CommonPagesHeader
        heading="  Medical Form  Management"
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: "Create Form",
          show: true,
          onClick: () => {
            navigate("/General-Form", { replace: true });
          },
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      <br />

      <div className="p-4">
        <TableContainer
          title={"Patient Form Template"}
          pagination
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          totalCount={data?.totalCount || 0}
        >
          <DataTable data={filteredFormTemplateData}>
            {/* <TableColumn title="" body={() => <>≡</>} /> */}
            <TableColumn
              title="Patient Name"
              body={(row) => {
                const formType = row.formType;
                const nestedData = row[formType];
                return (
                  nestedData?.patientFullName ||
                  nestedData?.patientName ||
                  nestedData?.fullName ||
                  "N/A"
                );
              }}
            />

            <TableColumn title="Form Type" body={(row) => row.formType} />

            <TableColumn title="Service" body={(row) => row.serviceUsedFor} />
            <TableColumn
              title="Created Date"
              body={(row) => new Date(row.createdAt).toLocaleDateString()}
            />
{/* 
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
            /> */}


              <TableColumn
              title="Preview"
              body={(row) => (
                <div className="flex justify-between items-center">
                
               <button
                    className="text-blue-600 hover:underline text-sm"
                     onClick={() => navigate(`preview/${row._id}`)}
                  >
                    👁 Preview
                  </button>
                </div>
              )}
            />

            <TableColumn
              title="Action"
              body={(row) => (
                <div className="flex justify-between items-center">
                  {/* Left side: Preview */}
               

                  {/* Right side: Edit & Delete */}
                  <div className="flex gap-2 items-center">
                    <EditIcon
                      className="cursor-pointer"
                      onClick={() => navigate(`/update/${row._id}`)}
                    />
                    <DeleteButton
                      data={row._id}
                      onDelete={deleteSpec}
                      confirmation
                    />
                  </div>
                </div>
              )}
            />


          </DataTable>
        </TableContainer>
      </div>

      <Outlet />
    </div>
  );
};
