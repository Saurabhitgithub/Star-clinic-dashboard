import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { TableColumn, DataTable } from "../../../components/Table/DataTable";
import { TableContainer } from "../../../components/Table/TableContainer";
import { EditIcon } from "../../../components/Icons/SvgIcons";
import { DeleteButton } from "../../../components/Buttons/DeleteButton";
import { CommonPagesHeader } from "../../../components/PagesHeaders/CommonPagesHeader";
 
import { convertDateIntoSimpleDate, loader, toast } from "../../../utils";
import { getAllAllergy,deleteAllergy} from "../../../services/offersApis";
 
const Allergies = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   const { id: userId } = useParams();
 
  useEffect(() => {
    if (userId) {
      fetchAllAllergies();
    }
  }, [userId]);;
 
 const fetchAllAllergies = async () => {
    loader.start();
    try {
      const response = await getAllAllergy(userId);
      console.log("Allergy Response:", response.data?.data);
      setData(response?.data?.data || []);
    } catch (err) {
      console.error("Error fetching allergies", err);
      toast.error("Failed to fetch allergy data");
    } finally {
      loader.stop();
    }
  };
 
 
  // const fetchgetAllergyById = async () => {
  //   setLoading(true);
  //   loader.start();
  //   try {
  //     const response = await getAllergyById("678f571280d0fc857e84e30b");
  //     console.log("API Response:", response.data.data);
 
  //     if (!response.data.data.every((item) => item._id)) {
  //       console.error("Missing _id in API response", response.data.data);
  //     }
 
  //     setData(response?.data?.data || []);
  //   } catch (err) {
  //     console.error("API Error:", err);
  //     toast.error("Failed to fetch allergy data");
  //   } finally {
  //     setLoading(false);
  //     loader.stop();
  //   }
  // };
 
 
 
 
  const deleteall= async (id) => {
    try {
      loader.start();
      await deleteAllergy(id); // Ensure this function exists in offersApis.js
      toast.success("Deleted successfully");
      setData((prev) => prev.filter((offer) => offer._id !== id));
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      loader.stop();
    }
  };
 
  return (
    <div>
      <CommonPagesHeader
        heading="Allergy Information"
        subHeading="Manage Allergy Details"
        addButtonProps={{
          title: "Add",
          show: true,
          onClick: () => navigate("add", { replace: true }),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer
          pagination
          title="Allergy Information"
          currentPage={page}
          onPageChange={setPage}
          pageSize={pageSize}
          totalCount={data.length}
        >
          <DataTable
            data={data.filter((item) =>
              item?.type?.toLowerCase().includes(search.toLowerCase())
            )}
          >
            <TableColumn title="Allergy Name" field="type" />
            <TableColumn title="Severity" field="severity" />
            <TableColumn title="Reaction" field="reaction" />
 
            <TableColumn
              title="Phone No"
              body={(rowData) => rowData?.emergency_contact?.phone || "-"}
            />
 
            <TableColumn
              title="Created At"
              body={(rowData) =>
                rowData?.createdAt
                  ? convertDateIntoSimpleDate(rowData.createdAt)
                  : "-"
              }
            />
 
            <TableColumn
              title="Actions"
              body={(rowData) => (
                <div className="flex gap-2">
                  <EditIcon
                    className="pointer"
                    onClick={() =>
                      navigate(`update/${rowData?._id}`, { replace: true })
                    }
                  />
                  <DeleteButton
                    className="pointer"
                    data={rowData._id}
                    confirmation
                    onDelete={() => deleteall(rowData._id)}
                  />
                </div>
              )}
            />
          </DataTable>
        </TableContainer>
      )}
      <Outlet context={fetchAllAllergies}/>
    </div>
  );
};
 
export default Allergies;