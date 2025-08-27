import React, { useState } from "react";
import { Button } from "../../components/Buttons/Button";
import { toast } from "../../utils";
import { Editor } from "../../components/Inputs/Editor";
import { addLeadNote } from "../../store/apiSlices/leadApiSlice";

export const NotesModal = ({ firstName, lastName, leadId, onClose }) => {
  console.log("Creating note for lead:", leadId);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !note.trim()) {
      toast.error("Both title and note are required.");
      return;
    }

    try {
      await addLeadNote({
        title,
        description: note,
        lead_id: leadId,
      });

      toast.success("Note saved successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save note.");
      console.error("Error saving note:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-700 text-white p-4 flex justify-between items-center">
          <h2 className="font-semibold text-lg">
            New Note for {firstName} {lastName}
          </h2>
          <button onClick={onClose} className="text-white text-xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white">
          {/* Title input */}
          <div>
            <label className="block text-xs font-semibold mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* Editor for note */}
          <div>
            <label className="block text-xs font-semibold mb-1">Notes</label>
            <Editor
              height={150}
              value={note}
              onChange={(val) => setNote(val)}
              placeholder="Type your note..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button bordered type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" primary>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
