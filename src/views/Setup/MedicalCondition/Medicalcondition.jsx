import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FaStar } from "react-icons/fa";
import { Button } from "../../../components/Buttons/Button";


const medicalProblems = [
  "Accutane / Ro-accutane / Isotretinoin (current or previously prescribed)",
  "Anaphylactic shock",
  "Anxiety",
  "Autoimmune disease",
  "Blackouts / fainting",
  "Cancer (Current or previous)",
  "Clotting disorders",
  "Cold sores"
];

export default function MedicalCondition() {
  const [isOpen, setIsOpen] = useState(true); // First modal open
  const [isStarred, setIsStarred] = useState(false);
  const [name, setName] = useState("");
  const [showSecondModal, setShowSecondModal] = useState(false); // Second modal state
  const [secondInput, setSecondInput] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");
  const [starred, setStarred] = useState([]);// Input for second modal

  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log({ name, isStarred });
    setShowSecondModal(true); // Open second modal
  };

  
  const filteredProblems = medicalProblems.filter((p) =>
    p.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* First Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg relative">
          <button
            onClick={() => {
              navigate("/setup");
              setIsOpen(false);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>

          <h2 className="text-xl font-semibold mb-6">Create Medical Condition</h2>

          {/* Starred Toggle */}
          <div className="flex items-center mb-4 gap-8 ">
          <div>
            <label className="text-sm font-medium mr-2">Starred</label>
            <span className="text-gray-400 text-xs mr-2 cursor-pointer">?</span>
          </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isStarred}
                onChange={() => setIsStarred(!isStarred)}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 relative transition-all duration-300">
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full" />
              </div>
            </label>
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter condition name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className=" flex justify-end">
          <Button
          primary
            
            onClick={handleSubmit}
          >
            Create
          </Button>
          </div>
        </div>
      </div>

      {/* Second Modal */}
      {showSecondModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
           onClick={() => {
              navigate("/setup");
              setIsOpen(false);
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>

          <h2 className="text-2xl font-semibold mb-4">Enter Problem</h2>

          {/* Search input */}
          <label className="block text-sm font-medium text-gray-600 mb-1">Problem</label>
          <input
            type="text"
            placeholder="Search"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Problem list */}
          <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto mb-4">
            {filteredProblems.map((problem) => (
              <div
                key={problem}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <span className="text-sm text-gray-800">{problem}</span>
                <FaStar
                  className={`cursor-pointer ${
                    starred.includes(problem) ? "text-blue-500" : "text-yellow-300"
                  }`}
                  onClick={() => toggleStar(problem)}
                />
              </div>
            ))}

            {/* Manage list */}
            <div
              className="border-t mt-1 px-4 py-2 font-medium text-gray-700 hover:underline cursor-pointer"
              onClick={() => setShowCreateModal(true)} // open custom modal
            >
              Manage list
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end space-x-2">
            <Button
            primary
              onClick={() => {
                navigate("/setup");
                setIsOpen(false);
              }}
              
            >
              Close
            </Button>
            <Button primary>
              Save & Add Another
            </Button>
            <Button  primary>
              Save
            </Button>
          </div>
        </div>
      </div>

      )}
    </>
  );
}
