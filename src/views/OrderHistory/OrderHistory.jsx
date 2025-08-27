import React, { useState, useEffect } from "react";
import { TableContainer } from "../../components/Table/TableContainer";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { CommonPagesHeader } from "../../components/PagesHeaders/CommonPagesHeader";
import { loader, toast } from "../../utils";
import {
  getAllPaymentData,
  updateOrderStatus,
} from "../../services/offersApis";
import { EyeIcon } from "../../components/Icons/SvgIcons";
export default function OrderHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editedStatus, setEditedStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Available order statuses
  const statusOrder = ["shipped", "in-transit", "delivered"];
  useEffect(() => {
    if (isLoading) {
      loader.start();
    } else {
      loader.stop();
    }
  }, [isLoading]);

  // Fetch payment data
  const fetchPaymentData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllPaymentData();

      if (response?.data?.data) {
        const formattedPayments = response.data.data.map((payment) => ({
          _id: payment._id,
          order_status: payment.order_status, // Use order_status from API response
          amount: `${(payment.paymentAmount / 100).toFixed(2)} ${
            payment.paymentCurrency
          }`,
          date: new Date(payment.paymentDate).toLocaleDateString(),
          method: payment.paymentMethod,
          mode: payment.paymentMode,
          paymentStatus: payment.paymentStatus,
          transactionId: payment.transactionId,
          productDetails: payment.productDetails || [],
        }));
        setPayments(formattedPayments);
      } else {
        toast.error("Failed to load payment history");
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      toast.error("Error fetching payment history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  // Handle status change
  const handleStatusChange = async (newStatus, row) => {
    try {
      await updateOrderStatus(row._id, { order_status: newStatus });
      setPayments((prev) =>
        prev.map((p) =>
          p._id === row._id ? { ...p, order_status: newStatus } : p
        )
      );
      toast.success("Order status updated!");
    } catch (err) {
      toast.error("Failed to update status.");
      console.error(err);
    }
  };

  const statusTextColors = {
    shipped: "text-orange-800",
    "in-transit": "text-blue-800",
    delivered: "text-green-800",
    cancelled: "text-gray-700",
    processing: "text-yellow-700",
  };
  const handleShow = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const filteredPayments = payments.filter(
    (payment) =>
      payment.amount.toLowerCase().includes(search.toLowerCase()) ||
      // payment.method.toLowerCase().includes(search.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <CommonPagesHeader
        heading={"Order"}
        subHeading={"Order History"}
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
      <TableContainer title="Payment" className="mt-4 mb-2">
        <DataTable data={filteredPayments} loading={isLoading}>
          <TableColumn title="Transaction ID" field="transactionId" />
          <TableColumn title="Payment Amount" field="amount" />

          <TableColumn title="Payment Method" field="method" />
          <TableColumn title="Payment Mode" field="mode" />
          <TableColumn title="Payment Date" field="date" />
          <TableColumn title="Payment Status" field="paymentStatus" />
          <TableColumn title="Order Status" field="order_status" />

          <TableColumn
            title="Action"
            body={(row) => (
              <button
                onClick={() => handleShow(row)}
                className="p-1 text-purple-600 hover:text-purple-800 transition"
                title="View"
              >
                <EyeIcon />
              </button>
            )}
          />

          {/* <TableColumn
            title="Order Status"
            body={(row) => {
              const currentStatus = row.order_status;
              const currentIndex = statusOrder.indexOf(currentStatus);

              return (
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value, row)}
                  className={`border border-gray-300 rounded px-2 py-1 text-sm ${
                    statusTextColors[currentStatus] || ""
                  }`}
                  disabled={currentStatus === "cancelled"}
                >
             
                  {currentIndex === -1 && (
                    <option
                      value={currentStatus}
                      disabled
                      className="text-gray-700 bg-gray-100"
                    >
                      {currentStatus.charAt(0).toUpperCase() +
                        currentStatus.slice(1)}
                    </option>
                  )}

                  {statusOrder.map((status, index) => {
                    const isDisabled = index < currentIndex;
                    return (
                      <option
                        key={status}
                        value={status}
                        disabled={isDisabled}
                        className={`${statusTextColors[status]} ${
                          isDisabled ? "bg-gray-100 text-gray-500" : ""
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    );
                  })}
                </select>
              );
            }}
          /> */}
        </DataTable>
      </TableContainer>
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] max-w-full overflow-y-auto max-h-[90vh] relative">
            {/* Close Icon */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Product Details
            </h2>

            <div className="flex gap-2">
              {selectedProduct.productDetails &&
              selectedProduct.productDetails.length > 0 ? (
                selectedProduct.productDetails.map((product, index) => (
                  <div key={product._id || index} className="pb-4 text-xs">
                    <img
                      src={product.fileData?.[0]?.fileUrl}
                      alt={product.name}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                    <p>
                      <strong>Name:</strong> {product.name}
                    </p>
                    <p>
                      <strong>Price:</strong> €{product.price}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {product.quantity}
                    </p>
                  </div>
                ))
              ) : (
                <p>No product details available.</p>
              )}
            </div>

            <div className="mt-4 flex flex-col justify-end border-b pb-4 mb-4">
              <label className="block mb-1 text-sm font-semibold">
                Order Status:
              </label>
              <div className="relative">
                <select
                  value={editedStatus ?? selectedProduct.order_status}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  className={`border border-gray-300 rounded px-2 py-1 text-xs ${
                    statusTextColors[
                      editedStatus ?? selectedProduct.order_status
                    ] || ""
                  }`}
                  disabled={selectedProduct.order_status === "cancelled"}
                >
                  {!statusOrder.includes(selectedProduct.order_status) && (
                    <option
                      value={selectedProduct.order_status}
                      disabled
                      className="text-gray-700 bg-gray-100"
                    >
                      {selectedProduct.order_status.charAt(0).toUpperCase() +
                        selectedProduct.order_status.slice(1)}
                    </option>
                  )}

                  {statusOrder.map((status, index) => {
                    const currentIndex = statusOrder.indexOf(
                      selectedProduct.order_status
                    );
                    const isDisabled = index < currentIndex;
                    return (
                      <option
                        key={status}
                        value={status}
                        disabled={isDisabled}
                        className={`${statusTextColors[status]} ${
                          isDisabled ? "bg-gray-100 text-gray-500" : ""
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    );
                  })}
                </select>

                {/* Display a message if the status is cancelled */}
                {selectedProduct.order_status === "cancelled" && (
                  <div className="absolute top-12 left-0 text-red-600 text-xs mt-2">
                    <span className="italic">
                      Order status is cancelled and cannot be updated.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="mt-3 px-3 py-1 border text-xs rounded hover:bg-gray-100 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`mt-3 px-3 py-1 text-xs rounded transition ${
                  editedStatus && editedStatus !== selectedProduct.order_status
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                disabled={
                  !editedStatus || editedStatus === selectedProduct.order_status
                }
                onClick={async () => {
                  if (
                    editedStatus &&
                    editedStatus !== selectedProduct.order_status
                  ) {
                    await handleStatusChange(editedStatus, selectedProduct);
                    setSelectedProduct({
                      ...selectedProduct,
                      order_status: editedStatus,
                    });
                    setEditedStatus(null);
                    setIsModalOpen(false);
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
