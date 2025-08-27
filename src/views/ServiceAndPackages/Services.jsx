import React, { useState, useEffect } from "react";
import { EditIcon } from "../../components/Icons/SvgIcons";
import { TableContainer } from "../../components/Table/TableContainer";
import { Outlet, useNavigate } from "react-router";
import { DeleteButton } from "../../components/Buttons/DeleteButton";
import { loader, toast } from "../../utils";
import { StatusTag } from "../../components/common/StatusTag";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { ConfirmationDialog } from "../../components/Dialogs/ConfirmationDialog";
import { CommonPagesHeader } from "../../components/PagesHeaders/CommonPagesHeader";
import {
  deleteCategoryDataById,
  deleteServiceDataById,
  getAllCategoryData,
  getAllServiceData,
  updateCategoryStatus,
  updateServiceStatus,
} from "../../services/ServiceCategory";

const Services = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedTab, setSelectedTab] = useState("services");

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedTab === "categories") {
        response = await getAllCategoryData();
      } else {
        response = await getAllServiceData();
      }
      console.log("API Response:", response);
      setData(response?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTab, page]);

  async function handleStatusUpdate(id, currentStatus) {
    try {
      loader.start();
      const newStatus = !currentStatus;

      if (selectedTab === "categories") {
        await updateCategoryStatus(id, newStatus);
      } else {
        await updateServiceStatus(id, newStatus);
      }

      toast.success(`Status changed to ${newStatus ? "Enabled" : "Disabled"}`);

      
      setData((prevData) =>
        Array.isArray(prevData)
          ? prevData.map((item) =>
              item._id === id ? { ...item, status: newStatus } : item
            )
          : []
      );

     
      const response =
        selectedTab === "categories"
          ? await getAllCategoryData()
          : await getAllServiceData();

      setData(response?.data || []);
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    } finally {
      loader.stop();
    }
  }

  async function deleteSpec(id) {
    try {
      loader.start();
      if (selectedTab === "categories") {
        let res = await deleteCategoryDataById(id);
      } else {
        let res = await deleteServiceDataById(id);
      }

      const response =
        selectedTab === "categories"
          ? await getAllCategoryData()
          : await getAllServiceData();

      setData(response?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      loader.stop();
    }
  }

  const filteredSpecialities = data?.data?.filter((doc) =>
    selectedTab === "categories"
      ? doc?.name?.toLowerCase().includes(search.toLowerCase())
      : doc?.service_name?.toLowerCase().includes(search.toLowerCase()) ||
        doc?.service_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <CommonPagesHeader
        heading={"Service Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: selectedTab === "services" ? "Add Service" : "Add Category",
          show: true,
          onClick: () =>
            selectedTab === "services"
              ? navigate("add", { replace: true })
              : navigate(
                  "addCategory",
                  { replace: true },
                  { state: { selectedTab } }
                ),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />

      {/* Tab Buttons */}
      <div className="flex gap-4 mt-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            selectedTab === "services"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setSelectedTab("services")}
        >
          Services
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedTab === "categories"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setSelectedTab("categories")}
        >
          Categories
        </button>
      </div>

      {/*  Conditional Rendering Based on Tab */}
      {selectedTab === "services" ? (
        <TableContainer
          pagination
          title={"Services"}
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          totalCount={Array.isArray(data) ? data.length : data?.totalCount || 0}
        >
          <DataTable data={filteredSpecialities || []}>
            <TableColumn
              title="Image"
              body={(rowData) =>
                rowData.fileData && rowData.fileData.fileUrl ? (
                  <img
                    src={rowData.fileData.fileUrl}
                    alt="Surgery Icon"
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

            <TableColumn title="Service Name" field="service_name" />
            <TableColumn title="Service code" field="service_code" />
            <TableColumn
              title="Category"
              body={(rowData) => rowData?.categoryData?.[0]?.name || ""}
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
                return (
                  <div className="flex gap-2">
                    <EditIcon
                      className="pointer"
                      onClick={() =>
                        navigate(`/services/updateService/${rowData._id}`)
                      }
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
      ) : (
        // "Category" table
        <>
          <TableContainer
            pagination
            title={"Category"}
            currentPage={page}
            onPageChange={setPage}
            pageSize={pageSize}
            totalCount={
              Array.isArray(data) ? data.length : data?.totalCount || 0
            }
          >
            <DataTable data={filteredSpecialities || []}>
              <TableColumn
                title="Image"
                body={(rowData) =>
                  rowData.fileData && rowData.fileData.fileUrl ? (
                    <img
                      src={rowData.fileData.fileUrl}
                      alt="category Icon"
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

              <TableColumn title="Category Name" field="name" />

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
                        onClick={
                          () =>
                            selectedTab === "services"
                              ? navigate(
                                  `/services/updateService/${rowData._id}`
                                ) // Update Service
                              : navigate(
                                  `/services/updateCategory/${rowData._id}`
                                ) // Update Category
                        }
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
        </>
      )}

      <Outlet context={fetchData} />
    </div>
  );
};

export default Services;
