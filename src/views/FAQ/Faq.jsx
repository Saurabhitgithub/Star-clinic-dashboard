import React, { useState, useEffect } from "react";
import { TableContainer } from "../../components/Table/TableContainer";
import { useNavigate } from "react-router";
import { loader, toast } from "../../utils";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { CommonPagesHeader } from "../../components/PagesHeaders/CommonPagesHeader";
import { deleteFaq, getAllFaq } from "../../store/apiSlices/faqApiSlice";

export const Faq = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [faqData, setFaqData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (isLoading) {
      loader.start();
    } else {
      loader.stop();
    }
  }, [isLoading]);

  useEffect(() => {
    fetchFaqData();
  }, []);

  const fetchFaqData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllFaq();
     

      const faq = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setFaqData(faq);
    } catch (error) {
      toast.error("Error fetching Faq data");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSpec = async (id) => {
    try {
      loader.start();
      await deleteFaq(id);
      toast.success("Question deleted successfully");
      fetchFaqData();
    } catch (error) {
      toast.error("Error deleting question");
    } finally {
      loader.stop();
    }
  };

  const filteredFaq = faqData.filter((faq) =>
    (faq.question || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <CommonPagesHeader
        heading="FAQ"
        subHeading="Manage Frequently Asked Questions"
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
        title={"Frequently Asked Questions"}
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        totalCount={filteredFaq.length}
      >
        <DataTable loading={isLoading} data={filteredFaq}>
          <TableColumn
            title="Question"
            body={(rowData) => (
              <div
                className="line-clamp-2 text-sm text-gray-800 max-w-xs"
                title={rowData.question}
              >
                {rowData.question}
              </div>
            )}
          />

          <TableColumn
            title="Answer"
            body={(rowData) => (
              <div
                className="line-clamp-2 text-sm text-gray-800 max-w-xl"
                title={rowData.answer}
              >
                {rowData.answer}
              </div>
            )}
          />

          <TableColumn
            title="Action"
            body={(rowData) => (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`update/${rowData._id}`)}
                  className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSpec(rowData._id)}
                  className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            )}
          />
        </DataTable>
      </TableContainer>
    </div>
  );
};
