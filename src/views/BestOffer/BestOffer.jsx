import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { loader, toast } from "../../utils";
import { TableColumn, DataTable } from "../../components/Table/DataTable";
import { TableContainer } from "../../components/Table/TableContainer";
import { EditIcon } from "../../components/Icons/SvgIcons";
import { DeleteButton } from "../../components/Buttons/DeleteButton";
import { CommonPagesHeader } from "../../components/PagesHeaders/CommonPagesHeader";
import { getBestOffer, deleteBestOffer } from "../../services/offersApis";
import star from "../../assets/images/star-clinic-iso.svg.png";
 
const BestOffer = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
 
  useEffect(() => {
    fetchBestOffers();
  }, [page]);
 
  const fetchBestOffers = async () => {
    setLoading(true);
    loader.start();
    try {
      const response = await getBestOffer();
      setData(response.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
      loader.stop();
    }
  };
 
  async function deleteOffer(id) {
    try {
      loader.start();
      await deleteBestOffer(id);
      toast.success("Offer deleted successfully");
      setData((prev) => prev.filter((offer) => offer._id !== id));
    } catch (error) {
      toast.error("Failed to delete offer");
    } finally {
      loader.stop();
    }
  }
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [data.length]);
 
  const filteredOffers = data.filter((offer) =>
    offer?.heading?.toLowerCase().includes(search.toLowerCase())
  );
 
  return (
    <div className="flex gap-8 p-4 items-start">
      {/* Table Section */}
      <div className="w-2/3">
        <CommonPagesHeader
          heading={"Best Offers"}
          subHeading={"Manage Offers"}
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
          title="Best Offers"
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          totalCount={data?.length || 0}
        >
          <DataTable data={filteredOffers}>
            <TableColumn
              title="Image"
              body={(rowData) =>
                rowData.fileData?.fileUrl ? (
                  <img
                    src={rowData.fileData.fileUrl}
                    alt="Offer Icon"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "10%",
                    }}
                  />
                ) : (
                  "No Image"
                )
              }
            />
            <TableColumn title="Heading" field="heading" />
            <TableColumn title="SubTitle 1" field="title1" />
            <TableColumn title="SubTitle 2" field="title2" />
            <TableColumn
              title="Action"
              body={(rowData) => (
                <div className="flex gap-2">
                  <EditIcon
                    className="pointer"
                    onClick={() => navigate(`/bestOffer/update/${rowData._id}`)}
                  />
                  <DeleteButton
                    className="pointer"
                    data={rowData._id}
                    confirmation
                    onDelete={deleteOffer}
                  />
                </div>
              )}
            />
          </DataTable>
        </TableContainer>
        <Outlet context={fetchBestOffers}/>
      </div>
 
      {/* Mobile Frame Section */}
      <div className="w-1/3 flex justify-center mt-5 p-5"  >
        <div className="relative w-64 h-[500px] bg-black rounded-3xl border-8 border-gray-900 shadow-lg flex items-center justify-center overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-3 bg-gray-800 rounded-b-lg flex items-center justify-center">
            <div className="w-1 h-1 bg-black rounded-full border-2 border-gray-500"></div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-full w-full bg-black text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
            </div>
          ) : data.length > 0 && data[currentIndex] ? (
            <>
              {/* Image */}
              <img
                src={data[currentIndex].fileData?.fileUrl}
                alt="Best Offer Screen"
                className="object-cover transition-opacity duration-500  mt-[3px] h-40"
              />
 
              {/* Overlay Heading Text */}
              <div className="absolute  left-1/3 transform -translate-x-1/2  text-gray-500 text-xs font-semibold px-1 py-1 rounded-md pb-[3px]"
              >
                <div className="text-xs text-gray-800">
                  {data[currentIndex].heading || "No Title"}
                </div>
                <div className="w-[120px]">
 
                <img className="p-2 " src={star}/>
                </div>
                <div className="text-xs text-gray-800 mb-2" style={{fontSize:8}}>
                  {data[currentIndex].title1 || "No Subtitle"}
                  {data[currentIndex].title2 || "No Subtitle"}
                </div>
                <button className= " fiexd px-2 py-1 text-xs text-white bg-black rounded h-6" style={{fontSize:8}}>
                  Get Cost Estimate
                </button>
              </div>
            </>
          ) : (
            <div className="text-white">No Image</div>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default BestOffer;