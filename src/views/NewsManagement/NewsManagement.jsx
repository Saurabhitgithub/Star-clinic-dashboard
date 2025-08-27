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
  deleteNewsDataById,
  getAllNewsData,
  updateNewsStatusById,
} from "../../services/newsManagement";
import moment from "moment";
import Slider from "react-slick";
import { Card } from "@mui/material";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
const NewsManagement = () => {
  const [page, setPage] = useState(1);

  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // const onboardingScreens = data?.data ?? [];

  const fetchNewsData = async () => {
    try {
      loader.start();
      const response = await getAllNewsData();
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
    fetchNewsData();
  }, [page]);

async function deleteSpec(id) {
  try {
    loader.start();
    const response = await deleteNewsDataById(id);
    toast.success(response?.data);

    const res = await getAllNewsData();
    setData(res?.data?.data || []); // ✅ use `res` here
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete news data");
  } finally {
    loader.stop();
  }
}


  const handleStatusUpdate = async (id, currentStatus) => {
    try {
      loader.start();
      const payload = { status: !currentStatus };
      console.log("Payload:", payload);

      await updateNewsStatusById(id, payload);
      toast.success("Status updated!");
      fetchNewsData();
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      loader.stop();
    }
  };

  const filteredNews = data.filter((news) =>
    news?.heading?.toLowerCase().includes(search.toLowerCase())
  );
 const onboardingScreens = Array.isArray(data)
  ? data.filter((news) => news?.status) // ✅ Only enabled news for phone view
  : [];
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
        heading={"News Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: "Add",
          show: true,
          onClick: () => navigate("Add", { replace: true }),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      <br />
      <div className="grid gap-4 mt-4 m-0 grid-cols-[1fr_250px]">
        <TableContainer
          pagination
          title={"News"}
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          totalCount={data?.totalCount || 0}
        >
          <DataTable data={filteredNews || []}>
            <TableColumn
              title="Image"
              body={(rowData) =>
                rowData.fileData && rowData.fileData.fileUrl ? (
                  <img
                    src={rowData.fileData.fileUrl}
                    alt="News Icon"
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
            {/* <TableColumn title="Heading" field={"heading"} /> */}
              <TableColumn
                        title="Heading"
                        body={(rowData) => (
                          <div
                            className="line-clamp-2 text-sm  max-w-xl"
                            title={rowData.heading}
                          >
                            {rowData.heading}
                          </div>
                        )}
                      />
            

            {/* <TableColumn title="Description" field={"description"} /> */}
                      <TableColumn
                        title="Description"
                        body={(rowData) => (
                          <div
                            className="line-clamp-2 text-sm  max-w-xl"
                            title={rowData.description}
                          >
                            {rowData.description}
                          </div>
                        )}
                      />

            <TableColumn
              title="Date Added"
              body={(rowData) => moment(rowData.createdAt).format("DD-MM-YYYY")}
            ></TableColumn>

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
                      navigate(`/newsManagement/update/${rowData._id}`);
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
            <div className="z-10">
              <div
                className="text-white flex  items-center justify-center"
                style={{
                  fontSize: "14px",
                  height: "56px",
                  backgroundColor: "#393939",
                  // zIndex: 2,
                }}
              >
                Latest News
              </div>
              <div className="  bg-white  px-4 py-2 shadow">
                <SearchIcon
                  className="absolute left-7 top-20 transform -translate-y-1 text-gray-500"
                  fontSize="small"
                />
                <input
                  type="text"
                  placeholder="Search for news..."
                  value={""}
                  onChange={(e) => setSearch("")}
                  className="w-full border border-black rounded-md pl-10 pr-4 py-2 text-black text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-full bg-white text-white mt-10">
              {/* mobile screen card */}

              {loading ? (
                <div className="text-center py-4 text-black">Loading...</div>
              ) : onboardingScreens.length === 0 ? (
                <div className="text-center py-4 text-black">No news found</div>
              ) : (
                <>
                  <Slider {...settings}>
                    {onboardingScreens.map((screen, index) => (
                      <div key={index} className="p-2">
                        <Card
                          sx={{
                            backgroundColor: "#FFFFFF",
                            padding: "10px",
                            borderRadius: "10px",
                            textAlign: "left",
                          }}
                        >
                          <div>
                            <div className="flex items-center gap-4">
                              <div>
                                <img
                                  src={screen.fileData?.fileUrl}
                                  alt="News Thumbnail"
                                  style={{
                                    border: "1px solid white",
                                    borderRadius: "12px",
                                    width: "126px",
                                    height: "76px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                              <div>
                                <div
                                  className="mb-3"
                                  style={{
                                    fontSize: "9px",
                                    color: "black",
                                    fontWeight: "600",
                                  }}
                                >
                                  {screen?.heading || "No Title"}
                                </div>
                                <div
                                  className="mb-3"
                                  style={{
                                    fontSize: "9px",
                                    color: "rgba(102, 102, 102, 1)",
                                    fontWeight: "600",
                                  }}
                                >
                                  <span>
                                    Posted date:{" "}
                                    {moment(screen.createdAt).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-center">
                              <Button
                                sx={{
                                  color: "rgba(253, 94, 16, 1)",
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Outlet context={fetchNewsData} />
    </>
  );
};

export default NewsManagement;
