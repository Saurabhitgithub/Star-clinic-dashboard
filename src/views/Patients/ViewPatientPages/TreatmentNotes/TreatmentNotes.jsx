
import { useState, useRef, useEffect } from "react";
import { TableContainer } from "../../../../components/Table/TableContainer";
import { DataTable, TableColumn } from "../../../../components/Table/DataTable";
import { Button } from "../../../../components/Buttons/Button";
// import TreatmentsNotes from "./../TreatmentNotes"; // Ensure correct import path

const data = [
  { name: "Quick Sign Form", createdBy: "AA", lastCompleted: "a month ago", lastModified: "14 days ago" },
  { name: "Treatment Note (GENERAL)", createdBy: "DD", lastCompleted: "a month ago", lastModified: "21 days ago" },
  { name: "Laser Treatment Note", createdBy: "AA", lastCompleted: "a month ago", lastModified: "a month ago" },
  { name: "Standard Treatment Note", createdBy: "DD", lastCompleted: "a month ago", lastModified: "a month ago" },
  { name: "Dermal Filler - Treatment Note", createdBy: "AA", lastCompleted: "a month ago", lastModified: "2 hours ago" },
  { name: "General - Treatment Form", createdBy: "AA", lastCompleted: "a month ago", lastModified: "2 months ago" },
];

export default function TreatmentsNote() {
  
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const modalRef = useRef(null);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-80 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
        primary
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
          onClick={() => setIsModalOpen(true)}
        >
          Create Notes
        </Button>
      </div>

      <TableContainer title="Treatment Notes">
        <DataTable data={filteredData}>
          <TableColumn
            title="Name"
            body={(rowData) => (
              <span
                className=" cursor-pointer"
                onClick={() => {
                  setSelectedNote(rowData);
                  setIsModalOpen(true);
                }}
              >
                {rowData.name}
              </span>
            )}
          />
          <TableColumn
            title="Created By"
            body={(rowData) => (
              <span
                className={`inline-block px-3 py-3 text-white rounded-full ${
                  rowData.createdBy === "DD" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {rowData.createdBy}
              </span>
            )}
          />
          <TableColumn title="Last Completed" field="lastCompleted" />
          <TableColumn title="Last Modified" field="lastModified" />
        </DataTable>
      </TableContainer>

      {/* Modal */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div ref={modalRef} className="bg-white p-1 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <TreatmentsNotes note={selectedNote} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )} */}
    </div>
  );
}
