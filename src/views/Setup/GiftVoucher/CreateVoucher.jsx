import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "../../../components/Buttons/Button";
import { addCoupon } from "../../../services/offersApis";
import { toast } from "../../../utils";


// Dummy loader (replace with your actual loader if available)
const loader = {
  start: () => console.log("Loader started"),
  stop: () => console.log("Loader stopped"),
};

const VoucherBuilder = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      terms: "",
      amount: "",
      points: "",
    },
  });

  const watchAmount = watch("amount");
  const watchPoints = watch("points");
  const watchName = watch("name");
  const watchTerms = watch("terms");

  const FormSubmit = async (data) => {
    try {
      loader.start();
      const response = await addCoupon(data);

      if (response?.data) {
        toast.success("Voucher saved successfully!");
        navigate("/giftVoucher", { replace: true });
      } else {
        toast.error("No response data from server");
      }
    } catch (error) {
      toast.error("Failed to save voucher");
    } finally {
      loader.stop();
    }
  };
  const onCancel = () => {
    navigate("/giftVoucher");
  };

  return (
    <div className="min-h-full bg-gray-50 p-8">
      <h2 className="text-xl font-bold mb-4">Create Gift Voucher</h2>
      <form onSubmit={handleSubmit(FormSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Side - Form */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            {/* Voucher Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Voucher Name
              </label>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Voucher name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Simple Glow Voucher"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Terms & Conditions
              </label>
              <Controller
                name="terms"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows="4"
                    placeholder="Enter terms here..."
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                )}
              />
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Amount</label>
              <Controller
                name="amount"
                control={control}
                rules={{ required: "Amount is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter amount"
                      className="w-full p-2 border rounded pl-8"
                    />
                  </div>
                )}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Points */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Points</label>
              <Controller
                name="points"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    placeholder="Enter points"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                )}
              />
            </div>
            
            {/* Save Button */}
            <div
              className="flex justify-end gap-4"
              onClick={() => navigate("/giftVoucher")}
            >
              <Button onClick={onCancel} bordered type="button">
              Cancel
            </Button>
              <Button type="submit" primary>
                Create
              </Button>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="flex justify-center items-start">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white w-full max-w-md shadow-lg relative">
              <div className="text-center mt-10">
                <h2 className="text-3xl font-bold">${watchAmount || "0"}</h2>
                <p className="text-sm mt-1">Voucher Value</p>
                <p className="text-xs mt-1">Points: {watchPoints || "N/A"}</p>
              </div>

              <div className="mt-10">
                <p className="text-sm font-semibold">
                  #{Math.floor(Math.random() * 999999)}
                </p>
                <h3 className="text-lg font-bold">
                  {watchName || "Voucher Preview"}
                </h3>
                <p className="text-xs text-gray-200">
                  {watchTerms ? watchTerms.slice(0, 30) : "..."}
                </p>

                <div className="flex justify-between text-sm mt-2">
                  <span>${watchAmount || "0"}</span>
                </div>
              </div>

              <button className="absolute top-4 right-4 text-white text-2xl">
                ⋮
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VoucherBuilder;
