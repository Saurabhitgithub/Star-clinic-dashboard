// src/pages/Setup/Drug/Drug.jsx
import React, { useEffect, useState } from "react";
import { TableContainer } from "../../../components/Table/TableContainer";
import { DataTable, TableColumn } from "../../../components/Table/DataTable";
import { MainBodyContainer } from "../../../components/Layouts/MainBodyContainer";
import { CommonPagesHeader } from "../../../components/PagesHeaders/CommonPagesHeader";
import { Outlet, useNavigate, useParams, useLocation } from "react-router";
import { EditIcon } from "../../../components/Icons/SvgIcons";
import { DeleteButton } from "../../../components/Buttons/DeleteButton";
import { deleteDrug, getAllDrug } from "../../../services/offersApis";
import { loader, toast } from "../../../utils";
import { ConfirmationDialog } from "../../../components/Dialogs/ConfirmationDialog";
import { StatusTag } from "../../../components/common/StatusTag";

export const Drug = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); // 👈 get URL info

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAllDrugs();
  }, [page, location.search]); // 👈 refresh when query param changes

  const fetchAllDrugs = async () => {
    setLoading(true);
    loader.start();
    try {
      const response = await getAllDrug(id);
      const drugs = response?.data?.data || [];

      setData(drugs);

      // 👇 Clean up URL if refresh was triggered
      if (location.search.includes("refresh")) {
        window.history.replaceState({}, document.title, location.pathname);
      }
    } catch (err) {
      toast.error("Failed to fetch drug data");
    } finally {
      setLoading(false);
      loader.stop();
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteDrug(id);
      if (response?.data) {
        toast.success("Drug deleted successfully");
        fetchAllDrugs();
      } else {
        toast.error("Failed to delete drug");
      }
    } catch (error) {
      toast.error("Failed to delete drug");
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    try {
      toast.success("Status updated");
      fetchAllDrugs();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <MainBodyContainer>
        <CommonPagesHeader
          heading="Drugs"
          searchValue={search}
          onSearch={(e) => setSearch(e.target.value)}
          addButtonProps={{
            title: "Create Drug",
            show: true,
            onClick: () => navigate("/setup/drug/create"),
          }}
        />

        <TableContainer title="Drugs" className="mt-4 mb-2">
          <DataTable data={filteredData} loading={loading}>
            <TableColumn title="Name" field="name" />
            <TableColumn title="Dose" field="dose" />
            <TableColumn title="Unit" field="unit" />
            <TableColumn title="Route" field="route" />
            <TableColumn title="Frequency" field="frequency" />
            <TableColumn
              title="Status"
              body={(rowData) => (
                <ConfirmationDialog
                  title={rowData?.status ? "Enabled" : "Disabled"}
                  data={!rowData?.status}
                  onConfirm={() => handleStatusUpdate(rowData._id, rowData.status)}
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
              body={(rowData) => (
                <div className="flex gap-3">
                  <EditIcon
                    className="pointer"
                    onClick={() =>
                      navigate(`/setup/drug/update/${rowData._id}`)
                    }
                  />
                  <DeleteButton
                    className="pointer"
                    data={rowData._id}
                    confirmation
                    onDelete={() => handleDelete(rowData._id)}
                  />
                </div>
              )}
            />
          </DataTable>
        </TableContainer>
      </MainBodyContainer>
      <Outlet />
    </>
  );
};
