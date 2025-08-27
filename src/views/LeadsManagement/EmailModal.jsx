import React, { useState } from "react";
import { DragAndDropInput } from "../../components/Inputs/DragAndDropInput";
import { Editor } from "../../components/Inputs/Editor";
import { Button } from "../../components/Buttons/Button";
import { toast } from "../../utils";

export const EmailModal = ({
  firstName,
  lastName,
  email,
  documents,
  setDocuments,
  onClose,
}) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    // Add send logic here
    toast.success("Email sent successfully!");
    onClose();
  };
  const handleClose = () => {
    setDocuments([]);  // clear attachments
    onClose();         // close the modal
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-700 text-white p-4 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Email</h2>
          <button onClick={onClose} className="text-white text-xl">
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="p-6 space-y-3 bg-white">
          <div>
            <label className="block text-xs font-semibold mb-1">From</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-3 py-1 border rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">To</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-3 py-1 border rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">CC</label>
            <input
              type="email"
              required
              className="w-full px-3 py-1 border rounded-md "
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Tags</label>
            <input
              type="text"
              className="w-full px-3 py-1 border rounded-md "
              placeholder="Add tags (e.g. follow-up, urgent)"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Subject</label>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-3 py-1 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Message</label>
            <div className="rounded-md">
              <Editor
                height={100}
                value={message}
                onChange={(val) => setMessage(val)}
                placeholder="Type your message..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Attachments
            </label>
            <DragAndDropInput
              fileLimit={10}
              acceptedFileTypes={["image/*", "video/*"]}
              value={documents}
              onChange={(files) => setDocuments(files)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" bordered onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" primary>
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
