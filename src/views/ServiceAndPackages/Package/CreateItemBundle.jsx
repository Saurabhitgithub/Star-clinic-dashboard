import React, { useEffect, useState } from "react";
import { Button } from "../../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/Inputs/Input";
import { CustomDialog } from "../../../components/Dialogs/CustomDialog";
import { useNavigate, useParams } from "react-router";
import {
  addBundleItemData,
  updateBundleItemDataById,
  getAllPackageData,
  getBundleItemDataById,
} from "../../../services/ServiceCategory";
import { loader, toast } from "../../../utils";
import { useOutletContext } from "react-router";

const CreateItemBundle = () => {
  const { id, docId } = useParams();
  const isAddMode = !docId;
  const navigate = useNavigate();

  const fetchItemData = useOutletContext();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      package_id: "",
      quantity: "",
      bundle_id: "",
    },
  });

  const [availablePackages, setAvailablePackages] = useState([]);
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [initialData, setInitialData] = useState(null);
  const selectedPackageId = watch("package_id");
  const quantity = watch("quantity");

  useEffect(() => {
    if (isAddMode && id) {
      setValue("bundle_id", id);
    }
  }, [id, isAddMode, setValue]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getAllPackageData();
        const data = response?.data?.data || [];
        const formatted = data.map((pkg) => ({
          id: pkg._id,
          name: pkg.package_name,
          price: pkg.package_price,
          quantity: pkg.package_quantity,
        }));
        setAvailablePackages(formatted);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    const selected = availablePackages.find(
      (pkg) => String(pkg.id) === String(selectedPackageId)
    );
    if (selected) {
      setUnitPrice(selected.price);
    } else {
      setUnitPrice(0);
    }
  }, [selectedPackageId, availablePackages]);

  useEffect(() => {
    const qty = parseInt(quantity, 10);
    if (!isNaN(qty) && qty > 0 && unitPrice > 0) {
      setTotalPrice(qty * unitPrice);
    } else {
      setTotalPrice(0);
    }
  }, [quantity, unitPrice]);



   useEffect(() => {
      if (!isAddMode && docId) {
        getBundleItemDataById(docId)
          .then((response) => {
            if (!response?.data) {
              console.error("Error: No data received from API");
              return;
            }
            const data = response.data;
            console.log("Fetched Data:", data);
            setInitialData(data);
            setValue("package_id", data.package_id || "");
            setValue("quantity", data.quantity || "");
            setValue("price", data.price || "");
            setValue("bundle_id", data.bundle_id || {});
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            toast.error("Error fetching data");
          });
      }
    }, [id, docId]);

  const onSubmit = async (data) => {
    const payload = {
      package_id: data.package_id,
      quantity: parseInt(data.quantity, 10),
      price: totalPrice,
      bundle_id: data.bundle_id,
    };

    try {
      loader.start();
      let response;
      if (isAddMode) {
        response = await addBundleItemData(payload);
      } else {
        response = await updateBundleItemDataById(docId, payload);
      }

      if (response && response.data) {
        toast.success(`Item ${isAddMode ? "added" : "updated"} successfully!`);
        navigate(`/packages/item/${id}`);
      } else {
        toast.error("Error: No response data received");
      }
      fetchItemData();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    } finally {
      loader.stop();
    }
  };

  const onCancel = () => navigate(`/packages/item/${id}`);

  return (
    <div>
      <CustomDialog
        onCancel={onCancel}
        open={true}
        fullWidth
        maxWidth="sm"
        title={`${isAddMode ? "Add" : "Update"} Bundle Item Record`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Select Package */}
          <div className="mt-3">
            <Controller
              name="package_id"
              control={control}
              rules={{ required: "Package is required" }}
              render={({ field }) => (
                <div>
                  <label className="block mb-1 font-medium">
                    Select Package
                  </label>
                  <select {...field} className="w-full border p-2 rounded">
                    <option value="">-- Select Package --</option>
                    {availablePackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                  {errors.package_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.package_id.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Price (unit) - read only */}
          <div className="mt-3">
            <Input
              label="Price (per unit)"
              value={unitPrice}
              placeholder="Price"
              type="number"
              readOnly
            />
          </div>

          {/* Quantity */}
          <div className="mt-3">
            <Controller
              name="quantity"
              control={control}
              rules={{ required: "Quantity is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  label="Quantity"
                  placeholder="Enter quantity"
                  type="number"
                  error={!!errors.quantity}
                />
              )}
            />
          </div>

          {/* Total Price */}
          <div className="mt-3">
            <Input
              label="Total Price"
              value={totalPrice}
              placeholder="Total Price"
              type="number"
              readOnly
            />
          </div>

          {/* Hidden bundle_id */}
          <Controller
            name="bundle_id"
            control={control}
            render={({ field }) => <input type="hidden" {...field} />}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={onCancel} bordered type="button">
              Cancel
            </Button>
            <Button primary type="submit">
              {isAddMode ? "Add" : "Update"}
            </Button>
          </div>
        </form>
      </CustomDialog>
    </div>
  );
};

export default CreateItemBundle;
