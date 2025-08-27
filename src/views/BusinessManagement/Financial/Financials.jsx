import React, { useState, useEffect } from "react";
import { EditIcon } from "../../../components/Icons/SvgIcons";
import { TableContainer } from "../../../components/Table/TableContainer";
import { Outlet, useNavigate, useParams } from "react-router";
import { DeleteButton } from "../../../components/Buttons/DeleteButton";
import { loader, toast } from "../../../utils";
import { StatusTag } from "../../../components/common/StatusTag";
import { DataTable, TableColumn } from "../../../components/Table/DataTable";
import { ConfirmationDialog } from "../../../components/Dialogs/ConfirmationDialog";
import { CommonPagesHeader } from "../../../components/PagesHeaders/CommonPagesHeader";
import moment from "moment";
import { Menu } from "@headlessui/react";
// import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getAllFinancialsData } from "../../../services/documentManagement";
 
const Financials = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { id, docId } = useParams();
 
  const fetchfinancialData = async () => {
    if (!id) return;
    loader.start();
    try {
      const response = await getAllFinancialsData(id);
      console.log("API Response:", response.data);
      setData(response?.data?.data || response?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      loader.stop();
    }
  };
  useEffect(() => {
    fetchfinancialData();
  }, [id, docId, page]);
 
  const filteredFinancialData = data.filter((news) =>
    news?.doctorDetails?.[0]?.name?.toLowerCase().includes(search.toLowerCase())
  
  );
  return (
    <>
      <CommonPagesHeader
        heading={"Financial Management"}
        subHeading={"All Consultations of All Healthcare Providers"}
        addButtonProps={{
          title: "Add",
          show: false,
          onClick: () => navigate("Add", { replace: true }),
        }}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      <br />
      <TableContainer
        pagination
        title={"Financials Details"}
        currentPage={page}
        onPageChange={setPage}
        pageSize={pageSize}
        totalCount={data?.totalCount || 0}
      >
        <DataTable data={filteredFinancialData || []}>
          <TableColumn
            title="Doctor Name"
            body={(rowData) => rowData.doctorDetails?.[0]?.name || "N/A"}
          />
 
          <TableColumn title="Payment Id" field={"payment_id"} />
 
          {/* <TableColumn title="Location" field={"clinic_address"} /> */}
          <TableColumn
            title="Location"
            body={(rowData) => {
              const clinic = rowData.doctorDetails?.[0]?.clinic_address?.[0];
              return clinic ? `${clinic.address}, ${clinic.city}` : "N/A";
            }}
          />
 
          <TableColumn
            title=" Booking Date "
            body={(rowData) =>
              moment(rowData.booking_date).format("DD-MM-YYYY")
            }
          ></TableColumn>
 
          <TableColumn
            title="Status"
            body={(rowData) => (
              <ConfirmationDialog
                title={rowData?.status || "No Status"}
                data={rowData?.status}
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
                  status={rowData?.status || "N/A"}
                />
              </ConfirmationDialog>
            )}
          />
 
          <TableColumn title="Amount ($)" field={"booking_price"} />
 
          {/* <TableColumn
            title="Options"
            body={(rowData) => (
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="p-1">
                  <BsThreeDotsVertical className="h-5 w-5 text-gray-600 cursor-pointer" />
                </Menu.Button>
 
                <Menu.Items className="fixed top-20 right-10 w-52 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-[9999]">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            navigate("CreateCreditNotes");
                          }}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Generate Credit Note
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => window.print()}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Print
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate("EmailFinancialDetails")}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Attach PDF to Email
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            )}
          /> */}
        </DataTable>
      </TableContainer>
      <Outlet />
    </>
  );
};
 
export default Financials;