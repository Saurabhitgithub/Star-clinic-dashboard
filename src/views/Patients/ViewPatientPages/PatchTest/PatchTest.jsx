import { useState, useEffect } from "react";
import { DeleteIcon, EditIcon } from "../../../../components/Icons/SvgIcons";
import { TableContainer } from "../../../../components/Table/TableContainer";
import { DataTable, TableColumn } from "../../../../components/Table/DataTable";
import { Outlet, useNavigate, useParams } from "react-router";
import { DeleteButton } from "../../../../components/Buttons/DeleteButton";
import { CommonPagesHeader } from "../../../../components/PagesHeaders/CommonPagesHeader";
import { deletePatchTest, getAllPatchTest } from "../../../../services/offersApis";
import { loader, toast } from "../../../../utils";

const PatchTests = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState([]);
    const { id: userId } = useParams();

  useEffect((userId) => {
    fetchAllPatch();
  }, [userId]);

  const fetchAllPatch = async () => {
    setLoading(true);
    loader.start();
    try {
      const response = await getAllPatchTest(userId);
      const data = response?.data?.data || [];
      setTestData(data);
    } catch (err) {
      toast.error("Failed to fetch patch test data");
    } finally {
      setLoading(false);
      loader.stop();
    }
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    const days = Math.floor(seconds / (60 * 60 * 24));
    return days < 30
      ? `${days} days ago`
      : `${Math.floor(days / 30)} months ago`;
  };

 
  const handleDelete = async (id) => {
    try {
      const response = await deletePatchTest(id);
      if (response?.data) {
        toast.success("Patch Test deleted successfully");
        fetchAllPatch(); // ✅ call the correct fetch function
      } else {
        toast.error("Failed to delete Patch Test");
      }
    } catch (error) {
      toast.error("Failed to delete Patch Test");
    }
  };
  
 

  const filteredData = testData.filter((item) =>
    item.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <CommonPagesHeader
        heading="Patch Tests"
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
        addButtonProps={{
          title: "Create Patch Tests",
          show: true,
          onClick: () => navigate("add"),
        }}
      />

      <TableContainer title="Patch Tests" className="mt-4">
        <DataTable data={filteredData} loading={loading}>
          <TableColumn
            title="Date"
            body={(rowData) => (
              <>
                <span>
                  {new Date(
                    rowData.createdAt || rowData.timestamp
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </span>
                <p className="text-sm text-gray-500">
                  {getTimeAgo(rowData.createdAt || rowData.timestamp)}
                </p>
              </>
            )}
          />
          <TableColumn title="Description" field="description" />
          <TableColumn
            title="Staff"
            field="staff"
            body={(rowData) => (
              <div className="flex items-center space-x-3">
                <img
                  src={
                    rowData.fileData?.fileUrl
                      ? rowData.fileData?.fileUrl
                      : "/default-avatar.png" // fallback if no profile pic
                  }
                  alt="Staff"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span>{rowData.staff}</span>
              </div>
            )}
          />

<TableColumn
  title="Status"
  body={(rowData) => {
    const status = rowData.status?.toLowerCase() || "pending";
    let colorClass = "";

    if (status === "passed") {
      colorClass = "bg-green-100 text-green-700";
    } else if (status === "failed") {
      colorClass = "bg-red-100 text-red-700";
    } else {
      colorClass = "bg-yellow-100 text-yellow-700"; // default: pending
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-sm font-medium ${colorClass}`}
      >
        {rowData.status || "Pending"}
      </span>
    );
  }}
/>


          <TableColumn
            title="Actions"
            body={(rowData) => (
              <div className="flex gap-3">
                <EditIcon
                  className="pointer"
                  onClick={() => navigate(`update/${rowData._id}`)}
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

      <Outlet context={fetchAllPatch} />
    </div>
  );
};

export default PatchTests;
