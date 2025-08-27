import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { CustomDialog } from "../../components/Dialogs/CustomDialog";
import { useNavigate, useParams } from "react-router";
import { loader, toast } from "../../utils";
import { getLabManagementDataById } from "../../services/LabTestManagement";

const PrintReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportList, setReportList] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const printRef = useRef(); // 🔁 Reference to printable area

  const { control, formState: { errors }, watch } = useForm({
    defaultValues: {
      Invoice: "",
    },
  });

  const selectedTestName = watch("Invoice");

  const fetchLabManagementData = async () => {
    try {
      loader.start();
      const response = await getLabManagementDataById(id);
      const result = response?.data;
      const list = Array.isArray(result) ? result : [result];
      setReportList(list);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch test reports");
    } finally {
      loader.stop();
    }
  };

  useEffect(() => {
    fetchLabManagementData();
  }, []);

  useEffect(() => {
    const found = reportList.find((report) => report.test_name === selectedTestName);
    setSelectedReport(found || null);
  }, [selectedTestName, reportList]);

  function onCancel() {
    navigate("/labsManagement");
  }

  // ✅ Print Function
  const handlePrint = () => {
    if (!printRef.current) return;

    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            img { max-width: 100%; }
            body { font-family: Arial, sans-serif; padding: 20px; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <CustomDialog
      onCancel={onCancel}
      open={true}
      fullWidth
      maxWidth="sm"
      title={"Print Test Report"}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mt-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Test Report
          </label>

          <Controller
            name="Invoice"
            control={control}
            rules={{ required: "Please select a test report" }}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors.Invoice ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a test report</option>
                {reportList.map((option) => (
                  <option key={option._id} value={option.test_name}>
                    {option.test_name}
                  </option>
                ))}
              </select>
            )}
          />

          {errors.Invoice && (
            <p className="text-red-500 text-sm mt-1">
              {errors.Invoice.message}
            </p>
          )}
        </div>

        {/* Preview Section */}
        {selectedReport?.fileData?.fileUrl && (
          <div className="mt-4" ref={printRef}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Report Preview
            </label>
            <img
              src={selectedReport.fileData.fileUrl}
              alt="Test Report"
              className="w-full h-auto border rounded shadow"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={onCancel} bordered type="button">
            Cancel
          </Button>
          <Button onClick={handlePrint} primary type="button">
            Print
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default PrintReport;