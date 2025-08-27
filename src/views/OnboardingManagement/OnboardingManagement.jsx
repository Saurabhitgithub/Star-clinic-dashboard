import React, { useState, useEffect } from "react";
import { TableContainer } from "../../components/Table/TableContainer";
import { OnboardingHeader } from "../../components/PagesHeaders/OnboardingHeader";
import { Outlet, useNavigate } from "react-router";
import { DataTable, TableColumn } from "../../components/Table/DataTable";
import { useGetAllOnboardingDataQuery } from "../../store/apiSlices/onboardingApiSlice";
import { Button } from "../../components/Buttons/Button";

export const OnboardingManagement = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllOnboardingDataQuery({ page, pageSize });
  const onboardingScreens = data?.data ?? [];
  const totalCount = data?.totalCount || 0;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll through onboarding screens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % onboardingScreens.length
      );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [onboardingScreens.length]);

  return (
    <div className="flex gap-8 p-4 items-start">
      {/* Table Section */}
      <div className="w-2/3">
        <OnboardingHeader />
        <TableContainer title="Onboarding Screen" totalCount={totalCount}>
          <DataTable
            data={onboardingScreens.map((item, index) => ({
              ...item,
              number: (page - 1) * pageSize + index + 1,
            }))}
          >
            <TableColumn title="No" field="number" />
            <TableColumn
              title="Icon"
              body={(rowData) =>
                rowData?.fileData?.fileUrl ? (
                  <img
                    src={rowData.fileData.fileUrl}
                    alt="Onboarding Icon"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  "No Image"
                )
              }
            />
            <TableColumn title="Title" field="title" />
            <TableColumn title="Subtitle" field="subtitle" />
            <TableColumn
              title="Action"
              body={(rowData) => (
                <Button
                  primary
                  onClick={() => navigate(`update/${rowData._id}`)}
                >
                  Edit
                </Button>
              )}
            />
          </DataTable>
        </TableContainer>
        <Outlet />
      </div>

      {/* Mobile Frame Section */}
      <div className="w-1/3 flex justify-center mt-5 pt-5">
        <div className="relative w-64 h-[500px] bg-black rounded-3xl border-8 border-gray-900 shadow-lg flex items-center justify-center overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-3 bg-gray-800 rounded-b-lg flex items-center justify-center">
            <div className="w-1 h-1 bg-black rounded-full border-2 border-gray-500"></div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-full w-full bg-black text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
            </div>
          ) : onboardingScreens.length > 0 ? (
            <img
              src={onboardingScreens[currentIndex]?.fileData?.fileUrl}
              alt="Onboarding Screen"
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          ) : (
            <div className="text-white">No Image</div>
          )}
          <div className="absolute bottom-0 w-full bg-white rounded-t-3xl p-4">
            <h2 className="text-lg font-semibold text-black text-center">
              {onboardingScreens[currentIndex]?.title || "No Title"}
            </h2>
            <p className="text-sm text-gray-600 text-center">
              {onboardingScreens[currentIndex]?.subtitle || "No Subtitle"}
            </p>
            <div className="flex justify-center gap-2 my-2">
              {onboardingScreens.map((_, index) => (
                <div
                  key={index}
                  className={`w-1 h-1 flex-shrink-0 rounded-full transition-all duration-300 ${
                    currentIndex === index ? "bg-orange-600 w-2" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                ></div>
              ))}
            </div>
            <Button primary className="w-full ">
              {currentIndex === onboardingScreens.length - 1
                ? "Finish"
                : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
