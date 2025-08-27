import React, { useState } from "react";
import moment from "moment";
import UserAvatar from "../../components/UI/UserAvatar";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaNotesMedical } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { updateLeadData } from "../../store/apiSlices/leadApiSlice";
import { EmailModal } from "./EmailModal";
import { NotesModal } from "./NotesModal";

export const LeadUserProfileCard = ({ data, setLeadData }) => {
  const [editField, setEditField] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);

  if (!data) return null;

  const {
    first_name,
    last_name,
    email,
    mobile,
    dob,
    gender,
    treatment_interested,
    lead_location,
    lead_stage,
    pipelineDetails,
  } = data;

  const pipeline = pipelineDetails?.[0];
  const pipelineName = pipeline?.pipeline_name || "N/A";
  const stageName =
    pipeline?.stages?.find((stage) => stage._id === lead_stage)?.stage_name ||
    "N/A";

  const handleEditClick = (field) => {
    let initialValue = data[field] || "";
    if (field === "dob" && initialValue) {
      initialValue = moment(initialValue).format("YYYY-MM-DD");
    }
    setEditField(field);
    setEditedValues((prev) => ({ ...prev, [field]: initialValue }));
  };

  const handleInputChange = (e) => {
    setEditedValues((prev) => ({ ...prev, [editField]: e.target.value }));
  };

  const handleSave = async () => {
    const updatedValue = editedValues[editField];
    setEditField(null);

    if (!updatedValue || updatedValue === data[editField]) return;

    try {
      const payload = { [editField]: updatedValue };
      await updateLeadData(data._id, payload);
      console.log("Updated successfully:", payload);

      //  Immediately update local UI without full refresh
      if (setLeadData) {
        setLeadData((prev) => ({
          ...prev,
          [editField]: updatedValue,
        }));
      }
    } catch (error) {
      console.error("Error updating field:", editField, error);
    }
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const renderEditableField = (label, fieldKey) => {
    const rawValue = data[fieldKey];
    const formattedValue =
      fieldKey === "dob" && rawValue
        ? moment(rawValue).format("MM-DD-YYYY")
        : fieldKey === "first_name" || fieldKey === "last_name"
        ? capitalize(rawValue)
        : rawValue || "N/A";

    return (
      <div className="flex items-center gap-2 group" key={fieldKey}>
        <dt className="font-semibold text-gray-700 w-32">{label}:</dt>
        <dd className="flex-1 relative">
          {editField === fieldKey ? (
            <input
              autoFocus
              type={fieldKey === "dob" ? "date" : "text"}
              value={editedValues[fieldKey]}
              onChange={handleInputChange}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
              className="border rounded px-2 py-1 text-sm w-full"
            />
          ) : (
            <span className="group-hover:pr-6 transition-all duration-150">
              {formattedValue}
            </span>
          )}
        </dd>
        {editField !== fieldKey && (
          <CiEdit
            size={20}
            onClick={() => handleEditClick(fieldKey)}
            className="text-gray-500 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
          />
        )}
      </div>
    );
  };

  return (
    <div className="items-center  border h-[79vh]">
      <div className="bg-white rounded-md w-full h-full py-4">
        {/* Avatar & Name */}
        <div className="p-3">
          <div className="flex justify-center m-2">
            <UserAvatar size={50} />
          </div>
          <div className="text-center">
            <div className="text-md font-semibold">
              {capitalize(first_name)} {capitalize(last_name)}
            </div>
            <span className="text-gray-600 text-sm">{email}</span>
          </div>

          {/* Call / Email Icons */}
          <div className="flex gap-4 justify-center my-4">
            <a href={`tel:${mobile}`}>
              <div className="w-10 h-10 rounded-full border flex justify-center items-center bg-gray-100">
                <IoCall size={20} className="text-gray-600" />
              </div>
            </a>
            <div>
              {/* Email Icon */}
              <div
                onClick={() => setShowEmailModal(true)}
                className="w-10 h-10 rounded-full border flex justify-center items-center bg-gray-100 cursor-pointer"
              >
                <MdEmail size={20} className="text-gray-600" />
              </div>

              {/* Email Modal */}
              {showEmailModal && (
                <EmailModal
                  firstName={first_name}
                  lastName={last_name}
                  email={email}
                  documents={[]}
                  setDocuments={() => {}} // or use a real setter
                  onClose={() => setShowEmailModal(false)}
                />
              )}
            </div>
            <div
              onClick={() => setShowNotesModal(true)}
              className="w-10 h-10 rounded-full border flex justify-center items-center bg-gray-100 cursor-pointer"
            >
              <FaNotesMedical size={20} className="text-gray-600" />
            </div>
            {showNotesModal && (
              <NotesModal
                firstName={first_name}
                lastName={last_name}
                onClose={() => setShowNotesModal(false)}
              />
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="border-y p-4">
          <h3 className="font-semibold text-md mb-3">About</h3>
          <dl className="space-y-2">
            {renderEditableField("First name", "first_name")}
            {renderEditableField("Last name", "last_name")}
            {renderEditableField("Email", "email")}
            {renderEditableField("Phone", "mobile")}
            {renderEditableField("Gender", "gender")}
            {renderEditableField("Date of Birth", "dob")}
          </dl>
        </div>

        {/* Lead Details Section */}
        <div className="border-b p-4">
          <h3 className="font-semibold text-md mb-3">Lead Details</h3>
          <dl className="space-y-2">
            <div className="flex gap-2">
              <dt className="font-semibold text-gray-700 w-32">Location:</dt>
              <dd>{lead_location || "N/A"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-gray-700 w-32">Pipeline:</dt>
              <dd>{pipelineName}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-gray-700 w-32">Stage:</dt>
              <dd>{stageName}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
