import React, { useState, useEffect } from "react";
import { CommonPagesHeader } from "../../../components/PagesHeaders/CommonPagesHeader";
import { useNavigate } from "react-router";
import { DeleteButton } from "../../../components/Buttons/DeleteButton";
import { deleteCoupon, getAllCoupont } from "../../../services/offersApis";

import { loader, toast } from "../../../utils";

const GiftVoucher = () => {
  const [search, setSearch] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    loader.start();
    try {
      const response = await getAllCoupont();
      let allVouchers = response?.data?.data || response?.data || [];

      // Normalize id from _id if necessary
      allVouchers = allVouchers.map((v) => ({
        ...v,
        id: v.id || v._id,
      }));

      setVouchers(allVouchers);
    } catch (err) {
      toast.error(err.message || "Failed to fetch vouchers");
    } finally {
      setLoading(false);
      loader.stop();
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Invalid voucher ID");
      return;
    }

    try {
      console.log("Attempting to delete voucher ID:", id);
      const response = await deleteCoupon(id);

      if (response?.data?.success || response?.status === 200 || response?.status === 204) {
        toast.success("Voucher deleted successfully");
        fetchAll();
      } else {
        toast.error("Failed to delete voucher: invalid response");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete Voucher");
    }
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <CommonPagesHeader
        heading="Gift Voucher"
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
        addButtonProps={{
          title: "Create Gift Voucher",
          show: true,
          onClick: () => navigate("/createVoucher"),
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {filteredVouchers.map((voucher) => {
          return (
            <div
              key={voucher.id}
              className={`relative w-full max-w-sm mx-auto rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r ${voucher.gradient || 'from-purple-500 to-pink-500'}`}
            >
              <div className="absolute top-3 right-3 z-10">
                <DeleteButton
                  className="pointer"
                  data={voucher.id}
                  confirmation
                  onDelete={() => {
                    if (voucher?.id) {
                      handleDelete(voucher.id);
                    } else {
                      toast.error("Voucher ID is missing");
                      console.error("Voucher missing ID:", voucher);
                    }
                  }}
                />
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold">${voucher.amount}</h2>
                <p className="text-sm mt-1">Voucher Value</p>
                <p className="text-xs mt-1">Points: {voucher.points || 0}</p>
              </div>

              <div className="mt-6 space-y-1">
                <p className="text-sm font-semibold truncate">{voucher.code}</p>
                <h3 className="text-lg font-bold">{voucher.name}</h3>
                <div className="flex justify-between text-sm mt-2">
                  <span>${voucher.amount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GiftVoucher;
