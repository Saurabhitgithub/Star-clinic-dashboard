import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { DataTable, TableColumn } from "../../../components/Table/DataTable";
import { ConfirmationDialog } from "../../../components/Dialogs/ConfirmationDialog";
import { EditIcon } from "../../../components/Icons/SvgIcons";
import { TableContainer } from "../../../components/Table/TableContainer";
import { DeleteButton } from "../../../components/Buttons/DeleteButton";
import { StatusTag } from "../../../components/common/StatusTag";
import { CommonPagesHeader } from "../../../components/PagesHeaders/CommonPagesHeader";
import moment from "moment";
import {
  deleteBundleDataById,
  deletePackageDataById,
  getAllBundleData,
  getAllPackageData,  
  updateBundleStatus,
  updatePackageStatus,
} from "../../../services/ServiceCategory";
import { loader, toast } from "../../../utils";
const PackageManagement = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id, docId } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("packages");

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedTab === "packages") {
        response = await getAllPackageData();
      } else {
        response = await getAllBundleData();
      }
      console.log("API Response:", response);
      setData(response?.data?.data || []);
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

      if (selectedTab === "packages") {
        await updatePackageStatus(id, newStatus);
      } else {
        await updateBundleStatus(id, newStatus);
      }

      toast.success(`Status changed to ${newStatus ? "Enabled" : "Disabled"}`);

      setData((prevData) =>
        Array.isArray(prevData)
          ? prevData.map((item) =>
              item._id === id ? { ...item, status: newStatus } : item
            )
          : []
      );

      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // const response =
      //   selectedTab === "packages"
      //     ? await getAllPackageData()
      //     : await getAllBundleData();

      // setData(response?.data?.data || []);
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
      if (selectedTab === "packages") {
        let res = await deletePackageDataById(id);
      } else {
        let res = await deleteBundleDataById(id);
      }

      const response =
        selectedTab === "packages"
          ? await getAllPackageData()
          : await getAllBundleData();

      setData(response?.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      loader.stop();
    }
  }

  const filteredSpecialities = data?.filter((doc) =>
    selectedTab === "packages"
      ? doc?.package_name?.toLowerCase().includes(search.toLowerCase())
      : doc?.name?.toLowerCase().includes(search.toLowerCase()) ||
        doc?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <CommonPagesHeader
        heading={"Package Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: selectedTab === "packages" ? "Add Package" : "Add Bundle",
          show: true,

          onClick: () =>
            selectedTab === "packages"
              ? navigate("add", { replace: true })
              : navigate("addBundle", {
                  replace: true,
                  state: { selectedTab },
                }),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      <br />

      {/* Tab Buttons */}
      <div className="flex gap-4 mt-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            selectedTab === "packages"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setSelectedTab("packages")}
        >
          Packages
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedTab === "bundles" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedTab("bundles")}
        >
          Bundles
        </button>
      </div>

      {/*  Conditional Rendering Based on Tab */}
      {selectedTab === "packages" ? (
        <TableContainer
          pagination
          title={"Packages"}
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          totalCount={Array.isArray(data) ? data.length : data?.totalCount || 0}
        >
          <DataTable data={filteredSpecialities || []}>
            <TableColumn title="Name" field="package_name" />
            <TableColumn title="Price" field="package_price" />
            <TableColumn
              title="Service"
              body={(rowData) =>
                rowData?.serviceData?.[0]?.service_name || "N/A"
              }
            />

            <TableColumn title="Sessions" field="session" />

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
              title="Available Online"
              body={(rowData) => (rowData?.available_online ? "Yes" : "No")}
            />

            <TableColumn
              title="Action"
              body={(rowData) => {
                console.log("Clicked Row Data:", rowData);
                return (
                  <div className="flex gap-2">
                    <EditIcon
                      className="pointer"
                      onClick={() =>
                        navigate(`/packages/updatePackage/${rowData._id}`)
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
        // "Bundle" table
        <>
          <TableContainer
            pagination
            title={"Bundles"}
            currentPage={page}
            onPageChange={setPage}
            pageSize={pageSize}
            totalCount={
              Array.isArray(data) ? data.length : data?.totalCount || 0
            }
          >
            <DataTable data={filteredSpecialities || []}>
              <TableColumn
                title="Name"
                body={(rowData) => (
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => navigate(`/packages/item/${rowData._id}`)}
                  >
                    {rowData.name}
                  </span>
                )}
              />
              <TableColumn
                title="Price"
                field="totalPrice"
                render={(rowData) => `${rowData.totalPrice}`}
              />
              <TableColumn
                title="Items"
    
                body={(rowData) =>
                  rowData.MainData?.map((pkg) => pkg.package_name).join(", ")
                }
              />
              <TableColumn
                title="Available Online"
                body={(rowData) => (rowData?.available_online ? "Yes" : "No")}
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
                          selectedTab === "bundles"
                            ? navigate(`/updateBundle/${rowData._id}`)
                            : navigate(
                                `/services/updatePackages/${rowData._id}`
                              )
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

export default PackageManagement;
