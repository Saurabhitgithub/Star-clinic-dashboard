import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { PageHeading } from "../common/PageHeading";
import { Input } from "../Inputs/Input";
import { Button } from "../Buttons/Button";
import { CiBoxList } from "react-icons/ci";
import { PiKanbanThin } from "react-icons/pi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { getAllPipeline } from "../../store/apiSlices/leadApiSlice";

export const LeadsManagementHeader = ({
  onSearch,
  searchValue,
  heading,
  addButtonProps,
  totalCount,
  totalAmount,
  onPipelineChange,
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState("");

  // Determine active view
  const isListView = location.pathname === "/leadsManagement";
  const isKanbanView = location.pathname === "/leadsPipeline";

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const response = await getAllPipeline();
        if (response?.data?.data?.length > 0) {
          const data = response.data.data;
          setPipelines(data);

          // ✅ Automatically select the first pipeline
          setSelectedPipeline(data[0]._id);
          onPipelineChange?.(data[0]._id); // Notify parent component
        }
      } catch (error) {
        console.error("Error fetching pipelines:", error.message);
      }
    };

    fetchPipelines();
  }, []);

  const handlePipelineChange = (e) => {
    const value = e.target.value;
    setSelectedPipeline(value);
    onPipelineChange?.(value); // Inform parent
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  return (
    <section>
      <div className="flex items-center">
        <div>
          <PageHeading heading={heading} />
        </div>

        {/* Display total count & total amount */}
        <div className="flex items-center ml-4">
          {isListView && totalCount !== undefined && (
            <div className="font-semibold text-sm text-orange-600">{`${totalCount} Leads`}</div>
          )}

          {isKanbanView && (
            <>
              {totalAmount !== undefined && (
                <div className="ml-4 text-sm font-semibold text-lg text-gray-600">
                  {`$${totalAmount.toFixed(2)}`}
                </div>
              )}
              {totalCount !== undefined && (
                <div className="font-semibold text-sm ml-4 text-gray-600">
                  {`${totalCount} Services`}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex text-nowrap gap-[10px] flex-1 items-center">
          <div className="w-[100%] flex justify-end items-center gap-3">
            <div className="flex gap-2">
              {/* List View Icon */}
              <div
                className={`border p-1 w-10 h-10 flex items-center justify-center cursor-pointer rounded ${
                  isListView ? "bg-gray-200" : ""
                }`}
                onClick={() => navigate("/leadsManagement")}
              >
                <CiBoxList
                  className="w-6 h-6"
                  color={isListView ? "#1D4ED8" : "#475467"}
                />
              </div>

              {/* Kanban View Icon */}
              <div
                className={`border p-1 w-10 h-10 flex items-center justify-center cursor-pointer rounded ${
                  isKanbanView ? "bg-gray-200" : ""
                }`}
                onClick={() => navigate("/leadsPipeline")}
              >
                <PiKanbanThin
                  className="w-6 h-6"
                  color={isKanbanView ? "#1D4ED8" : "#475467"}
                />
              </div>
            </div>

            {/* Only Show in Kanban View */}
            {isKanbanView && (
              <>
                <select
                  className="p-2 border rounded-lg text-gray-600"
                  value={selectedPipeline}
                  onChange={handlePipelineChange}
                >
                  <option value="" disabled>
                    Select a Pipeline
                  </option>
                  {pipelines.length > 0 ? (
                    pipelines.map((pipeline) => (
                      <option key={pipeline._id} value={pipeline._id}>
                        {pipeline.pipeline_name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No pipelines found
                    </option>
                  )}
                </select>

                <div className="relative inline-block text-left" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="w-full p-2 border rounded-lg text-gray-600 bg-white hover:bg-gray-100 focus:outline-none flex items-center justify-between"
                  >
                    Options
                    <MdKeyboardArrowDown className="h-5 w-5 ml-2 text-gray-600" />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 z-10 bg-white text-gray-600 border rounded-lg shadow-lg min-w-[160px] max-w-[220px]">
                      <div
                        className="block px-4 py-2 hover:bg-gray-200 whitespace-nowrap flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/createNewPipeline");
                        }}
                        
                      >
                        <IoCreateOutline /> Create new pipeline
                      </div>
                      <div
                        className={`block px-4 py-2 hover:bg-gray-200 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                          !selectedPipeline
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                        onClick={() => {
                          if (selectedPipeline) {
                            setIsOpen(false);
                            navigate(`/editPipeline/${selectedPipeline}`);
                          }
                        }}
                      >
                        <CiEdit /> Edit pipeline
                      </div>

                      {/* <div
                        className="text-red-700 block px-4 py-2 hover:bg-gray-200 whitespace-nowrap flex items-center gap-2 cursor-pointer border-t"
                    
                        onClick={() => {
                          if (selectedPipeline) {
                            setIsOpen(false);
                            // navigate(`/delete}`);
                          }
                        }}
                      >
                        <MdOutlineDeleteOutline /> Delete pipeline
                      </div> */}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Search Input (only in List View) */}
            {isListView && (
              <Input
                placeholder="Search"
                onChange={onSearch}
                value={searchValue}
              />
            )}

            {/* Add Button */}
            {addButtonProps?.show && (
              <Button onClick={addButtonProps?.onClick} addIcon primary>
                {addButtonProps?.title}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
