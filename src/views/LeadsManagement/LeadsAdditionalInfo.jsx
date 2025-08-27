import React, { useState } from "react";
import { MdEmail, MdPhone } from "react-icons/md";
import { FaNotesMedical } from "react-icons/fa6";
import { EmailModal } from "./EmailModal";
import { NotesModal } from "./NotesModal";
import { RxUpdate } from "react-icons/rx";
import { AiFillBell } from "react-icons/ai";
import { FaRegBell } from "react-icons/fa";

const tabs = ["Activity", "Notes", "Emails", "Calls"];

const tabIcons = {
  Notes: <FaNotesMedical className="w-5 h-5" />,
  Emails: <MdEmail className="w-5 h-5" />,
  Calls: <MdPhone className="w-5 h-5" />,
};

export const LeadsAdditionalInfo = ({ data }) => {
  if (!data) return null; 
  const [activeTab, setActiveTab] = useState("Notes");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const { _id: leadId } = data; 


  const {
    createdAt,
    updatedAt,
    first_name,
    last_name,
    email,
    mobile,
    lead_stage,
    pipelineDetails,
  } = data;

  const pipeline = pipelineDetails?.[0];
  const stage = pipeline?.stages?.find((stage) => stage._id === lead_stage);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Activity":
        return (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Activities</h2>
            <div className="space-y-2">
              <div className="flex gap-4 ">
                <div className="w-5 h-5 rounded-full  flex justify-center items-center bg-orange-600 ">
                  <FaRegBell size={10} className="text-white" />
                </div>
                <div className="text-sm font-semibold">
                  {" "}
                  Lead created
                  <span className="block text-gray-600 text-sm">
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 ">
                <div className="w-5 h-5 rounded-full  flex justify-center items-center bg-orange-600 ">
                  <FaRegBell size={10} className="text-white" />
                </div>
                <div className="text-sm font-semibold">
                  {" "}
                  Lead updated
                  <span className="block text-gray-600 text-sm">
                    {new Date(updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case "Notes":
        return (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Notes</h2>
            <p className="text-gray-600 text-sm">
              Client prefers evening calls. Interested in premium treatment
              plans.
            </p>
          </div>
        );
      case "Emails":
        return (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Email</h2>
            <p className="text-gray-600 text-sm">Last email sent</p>
          </div>
        );
      case "Calls":
        return (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Call Logs</h2>
            <ul className="text-gray-600 text-sm">
              <li> Call on April 5, 2025 - No answer</li>
              <li>Call on April 6, 2025 - Follow-up scheduled</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  const handleIconClick = () => {
    switch (activeTab) {
      case "Emails":
        setShowEmailModal(true);
        break;
      case "Calls":
        window.location.href = `tel:${mobile}`;
        break;
      case "Notes":
        setShowNotesModal(true);
        break;
      case "Activity":
        alert("Show activity timeline");
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative bg-white p-4  border h-[79vh]">
      <div>
        <nav className="flex space-x-6 border-b border-gray-200" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-2 text-sm font-medium text-gray-600 hover:text-black ${
                activeTab === tab ? "text-black" : ""
              }`}
              role="tab"
              aria-selected={activeTab === tab}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-900 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-4">{renderTabContent()}</div>
      </div>

      {tabIcons[activeTab] && (
        <button
          onClick={handleIconClick}
          className="absolute bottom-4 right-4 bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-full shadow-md"
          title={`Action for ${activeTab}`}
        >
          {tabIcons[activeTab]}
        </button>
      )}

      {showEmailModal && (
        <EmailModal
          firstName={first_name}
          lastName={last_name}
          email={email}
          documents={documents}
          setDocuments={setDocuments}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      {showNotesModal && (
        <NotesModal
          firstName={first_name}
          lastName={last_name}
          leadId={leadId}
          onClose={() => setShowNotesModal(false)}
        />
      )}
    </div>
  );
};
