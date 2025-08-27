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
  deleteTeamDataById,
  getAllTeamData,
  updateTeamStatus,
} from "../../services/teamManagement";
import Slider from "react-slick";
import { Card } from "@mui/material";
import Button from "@mui/material/Button";
export const TeamManagement = () => {
  const [page, setPage] = useState(1);

  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 const onboardingScreens = (data?.data || []).filter(member => member.status);


  const fetchTeamData = async () => {
    loader.start();
    try {
      const response = await getAllTeamData();
      console.log("API Response:", response);
      setData(response?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      loader.stop();
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [page]);

  const navigate = useNavigate();

  async function deleteSpec(id) {
    try {
      loader.start();
      let res = await deleteTeamDataById(id);
      toast.success(res?.data);
      const response = await getAllTeamData();
      console.log("API Response:", response);
      setData(response?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete team.");
    } finally {
      loader.stop();
    }
  }
  const filteredSpecialities = data?.data?.filter(
    (speciality) =>
      speciality?.doctor_name &&
      speciality.doctor_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusUpdate = async (id, currentStatus) => {
    try {
      loader.start();
      const payload = { status: !currentStatus };
      console.log("Payload:", payload);

      await updateTeamStatus(id, payload);
      toast.success("Status updated!");
      fetchTeamData();
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      loader.stop();
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    vertical: true,
    verticalSwiping: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      <CommonPagesHeader
        heading={"Team Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: "Add",
          show: true,
          onClick: () => navigate("create", { replace: true }),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-4 mt-4 m-0 grid-cols-[1fr_250px]">
        <TableContainer
          pagination
          title={"Team"}
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          totalCount={data?.totalCount || 0}
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
            <TableColumn title="Doctor Name" field={"doctor_name"} />
            {/* <TableColumn title="Description" field={"description"} /> */}
            <TableColumn
              title="Description"
              body={(rowData) => (
                <div
                  className="line-clamp-2 text-sm text-gray-800 max-w-xl"
                  title={rowData.description}
                >
                  {rowData.description}
                </div>
              )}
            />
            <TableColumn title="Category" field={"category"} />
            <TableColumn title="Education" field={"education"} />
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
                      console.log("Navigating to update with ID:", rowData._id);
                      navigate(`/teamManagement/update/${rowData._id}`);
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

        {/* phone screen */}
        <div className="w-100">
          <div className="relative h-[500px] bg-white rounded-3xl border-8 border-gray-900 shadow-lg flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-b-lg flex items-center justify-center">
              <div className="bg-black rounded-full border-2 border-gray-500"></div>
            </div>

            <div
              className="text-white flex items-center justify-center"
              style={{
                fontSize: "14px",
                height: "56px",
                backgroundColor: "#393939",
                zIndex: 2,
              }}
            >
              Our team
            </div>

            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-full bg-white text-white mt-10">
              {/* mobile screen card */}
              <div className="">
                <Slider {...settings}>
                  {onboardingScreens.map((screen, index) => (
                    <div key={index} className="p-2">
                      <Card
                        sx={{
                          backgroundColor: "#FFFFFF",
                          padding: "10px",
                          borderRadius: "10px",
                          textAlign: "left",
                          boxShadow: "none",
                        }}
                      >
                        <div>
                          <div className="flex items-center gap-4">
                            {/* Image Section */}
                            <div>
                              {loading ? (
                                <div className="flex items-center justify-center h-full w-full bg-black text-white">
                                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
                                </div>
                              ) : (
                                <div>
                                  {screen?.fileData?.fileUrl ? (
                                    <img
                                      src={screen.fileData.fileUrl}
                                      alt="Onboarding Screen"
                                      style={{
                                        border: "1px solid white",
                                        borderRadius: "12px",
                                        width: "74px",
                                        height: "80px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <div className="text-black">No Image</div>
                                  )}
                                </div>
                              )}
                            </div>
                            {/* Text Section */}
                            <div>
                              <div
                                className="mb-3"
                                style={{ fontSize: "12px", color: "black" }}
                              >
                                {screen?.doctor_name || "No Title"}
                              </div>
                              <div
                                className=""
                                style={{ fontSize: "9px", color: "#8890A0" }}
                              >
                                {screen?.category || "No Title"}
                              </div>
                              <div
                                className=""
                                style={{ fontSize: "9px", color: "#8890A0" }}
                              >
                                {screen?.education || "No Title"}
                              </div>
                            </div>
                          </div>
                          <div className="w-100%  border-t border-gray-400 mt-1"></div>
                          <div className="flex justify-center">
                            <Button
                              sx={{
                                color: "#FD5E10",
                                fontSize: "7px",
                                padding: "3px 6px",
                              }}
                            >
                              View more
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet context={fetchTeamData} />
    </>
  );
};
