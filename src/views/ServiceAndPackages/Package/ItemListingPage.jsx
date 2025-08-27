import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { DataTable, TableColumn } from "../../../components/Table/DataTable";
import { ConfirmationDialog } from "../../../components/Dialogs/ConfirmationDialog";
import { EditIcon } from "../../../components/Icons/SvgIcons";
import { TableContainer } from "../../../components/Table/TableContainer";
import { DeleteButton } from "../../../components/Buttons/DeleteButton";
import { StatusTag } from "../../../components/common/StatusTag";
import { CommonPagesHeader } from "../../../components/PagesHeaders/CommonPagesHeader";

import { Input } from "../../../components/Inputs/Input"; 
import { Switch } from "@headlessui/react";
import { Button } from "../../../components/Buttons/Button";
import { CustomDialog } from "../../../components/Dialogs/CustomDialog";

import { useForm, Controller } from "react-hook-form";
import {
  addBundleData,
  deleteBundleItemDataById,
  getAllBundleItemData,
  updateBundleItemStatus,
} from "../../../services/ServiceCategory";
import { loader, toast } from "../../../utils";
import { useMemo } from "react";

export default function ItemListingPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id, docId } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [value, setValue] = useState([]);

  const fetchItemData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await getAllBundleItemData(id);
      console.log("API Response:", response.data);
      setData(response?.data?.data || response?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchItemData();
  }, [id, docId, page]);
  const filteredSpecialities = data.filter(
    (doc) =>
      doc?.package_id &&
      doc.package_id.toLowerCase().includes(search.toLowerCase())
  );

  const deleteSpec = async (docId) => {
    try {
      loader.start();
      const res = await deleteBundleItemDataById(docId);
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

  const handleStatusUpdate = async (docId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const updatedDoc = await updateBundleItemStatus(docId, newStatus);
      console.log("Document status updated:", updatedDoc);

      setData((prevData) => {
        const documentData = Array.isArray(prevData)
          ? prevData
          : prevData?.data || [];

        return documentData.map((document) =>
          document._id === docId ? { ...document, status: newStatus } : document
        );
      });

      toast.success(
        `Document status updated to ${newStatus ? "Enabled" : "Disabled"}`
      );
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const totalPrice = useMemo(() => {
    return data?.reduce((sum, item) => sum + (item?.price || 0), 0);
  }, [data]);

  return (
    <>
      <CommonPagesHeader
        heading={"Package Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: "Add Item",
          show: true,
          onClick: () =>
            navigate(`/packages/item/${id}/add`, { replace: true }),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />

      <TableContainer
        pagination
        title={"Create Item "}
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        totalCount={Array.isArray(data) ? data.length : data?.totalCount || 0}
      >
        <DataTable data={filteredSpecialities || []}>
          <TableColumn
            title="Package"
            body={(rowData) => rowData?.packageData?.[0]?.package_name || ""}
          />
          <TableColumn title=" Quantity" field="quantity" />
          <TableColumn title=" Price" field="price" />

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
              return (
                <div className="flex gap-2">
                  <EditIcon
                    className="pointer"
                    onClick={() => navigate(`updateItem/${rowData._id}`)}
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
        <div className="flex justify-center mt-4 pr-6">
          <p className="text-sm text-gray-700">
            Total Price of All Items: ₹{totalPrice.toFixed(2)}
          </p>
        </div>
      </TableContainer>
      <div className="flex justify-start mt-4 pr-6">
        <Button
          onClick={() => navigate("/packages")} 
          primary
        >
          ← Back
        </Button>
      </div>
      <Outlet context={fetchItemData}/>
    </>
  );
}
