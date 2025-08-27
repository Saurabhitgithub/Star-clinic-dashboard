import React, { useState, useEffect } from "react";

import { EditIcon } from "../../components/Icons/SvgIcons";
import { TableContainer } from "../../components/Table/TableContainer";

import { Outlet, useNavigate } from "react-router";
import moment from "moment";
import { DeleteButton } from "../../components/Buttons/DeleteButton";
import { loader, toast } from "../../utils";
import { StatusTag } from "../../components/common/StatusTag";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { ConfirmationDialog } from "../../components/Dialogs/ConfirmationDialog";
import {
  deleteSurgeryDataById,
  getAllSurgeriesData,
  updateSurgeriesStatus,
} from "../../services/safeAndSurgery";
import { Container, Card, CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import SafeAndSurgeryHeader from "../../components/PagesHeaders/SafeAndSurgeryHeader";
import { CommonPagesHeader } from "../../components/PagesHeaders/CommonPagesHeader";

const SafeAndSurgery = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const onboardingScreens = data?.data ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);


  const fetchSurgeries = async () => {
    loader.start();
    try {
      const response = await getAllSurgeriesData();
      console.log(response.data);
      setData(response?.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
       loader.stop();
    }
  };

  useEffect(() => {
 
    fetchSurgeries();
  }, [page]);

  const navigate = useNavigate();

  async function deleteSpec(id) {
    try {
      loader.start();
      let res = await deleteSurgeryDataById(id);
      toast.success(res?.data);
      const response = await getAllSurgeriesData();
      console.log(response.data);
      setData(response?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete surgery.");
    } finally {
      loader.stop();
    }
  }

  async function handleStatusUpdate(id, currentStatus) {
    try {
      loader.start();
      const newStatus = !currentStatus;
      await updateSurgeriesStatus(id, newStatus);
      toast.success(`Status changed to ${newStatus ? "Enabled" : "Disabled"}`);

      setData((prevData) => {
        const safeData = Array.isArray(prevData)
          ? prevData
          : prevData?.data || [];
        return safeData.map((surgery) =>
          surgery._id === id ? { ...surgery, status: newStatus } : surgery
        );
      });

      const response = await getAllSurgeriesData();
      setData(response?.data || []);
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    } finally {
      loader.stop();
    }
  }

  const filteredSpecialities = data?.data?.filter(
    (speciality) =>
      speciality?.heading &&
      speciality.heading.toLowerCase().includes(search.toLowerCase())
  );

  // Auto-scroll through onboarding screens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % onboardingScreens.length
      );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [onboardingScreens.length]);

  return (
    <>
      <div className="flex gap-8 p-4 items-start">
        <div>
         
  <CommonPagesHeader
          heading={"Safe Surgery"}
          subHeading={"All Consultations of All Healthcare Providers"}
          addButtonProps={{
            title: "Add",
            show: true,
            onClick: () => navigate("create", { replace: true }),
          }}
          searchValue={search}
          onSearch={(e) => setSearch(e.target.value)}
        />




          <br />
          <TableContainer
            pagination
            title={"Safe Surgeries"}
            currentPage={page}
            onPageChange={setPage}
            pageSize={pageSize}
            totalCount={data?.totalCount || 0}
          >
            <DataTable data={filteredSpecialities || []}>
              <TableColumn
                title="Icon"
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
              <TableColumn title="Heading" field={"heading"} />
              <TableColumn title="Safety Title 1" field={"safety_title1"} />
              <TableColumn title="Safety Title 2" field={"safety_title2"} />
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
                body={(rowData) => (
                  <div className="flex gap-2">
                    <EditIcon
                      className="pointer"
                      onClick={() => {
                        console.log(
                          "Navigating to update with ID:",
                          rowData._id
                        );
                        navigate(`/safeAndSurgery/update/${rowData._id}`);
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
          <Outlet context={fetchSurgeries} />
        </div>

        <div className="w-1/3 flex justify-center mt-5 pt-5">
          {/* Mobile Frame */}
          <div className="relative w-64 h-[500px] bg-black rounded-3xl border-8 border-gray-900 shadow-lg flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-3 bg-gray-800 rounded-b-lg flex items-center justify-center">
              <div className="w-1 h-1 bg-black rounded-full border-2 border-gray-500"></div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full bg-black text-white p-2 ">
              <Typography variant="h7" gutterBottom>
                Safe & Secure Surgery
              </Typography>
              <Typography variant="subtitle2">
                Get your first Consultation FREE
              </Typography>

              <Card
                sx={{
                  backgroundColor: "#ff6600",
                  padding: "10px",
                  borderRadius: "10px",
                  textAlign: "left",
                  marginLeft: 0,
                }}
              >
                <div>
                  <div
                    className="text-white"
                    style={{ textAlign: "left", fontSize: "13px" }}
                  >
                    {onboardingScreens[currentIndex]?.heading || "No Title"}
                  </div>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "white" }}
                  >
                    {onboardingScreens[currentIndex]?.safety_title1 ||
                      "No Title"}
                  </Typography>
                  <div
                    className="text-white"
                    style={{ textAlign: "left", fontSize: "13px" }}
                  >
                    {onboardingScreens[currentIndex]?.safety_title2 ||
                      "No Title"}
                  </div>
                  {loading ? (
                    <div className="flex items-center justify-center h-full w-full bg-black text-white">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
                    </div>
                  ) : onboardingScreens.length > 0 ? (
                    <div className="flex justify-end right:0">
                      <img
                        src={onboardingScreens[currentIndex]?.fileData?.fileUrl}
                        alt="Onboarding Screen"
                        style={{
                          border: "1px solid red",
                          borderRadius: "50px",
                        }}
                        className="w-1/4 h-auto transition-opacity duration-500  "
                      />
                    </div>
                  ) : (
                    <div className="text-white">No Image</div>
                  )}
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      fontSize: "7px",
                    }}
                  >
                    Book in clinic appointment
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SafeAndSurgery;
