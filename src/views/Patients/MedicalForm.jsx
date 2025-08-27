import { useState } from "react";

export default function MedicalForm() {
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [patientName, setPatientName] = useState("DaphneGreen");
  const [text, setText] = useState("");

  return (
    <>
      <div className=" h-auto p-6 m-auto bg-white shadow-md rounded-lg w-[850px]">
        {/* Header Section */}
        <div className="mb-6 flex justify-between items-center">
          <label className="text-lg text-gray-700 font-semibold">Appointment</label>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Copy previous
          </button>
        </div>

        {/* Appointment Select */}
        <div className="mb-6">
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={selectedAppointment}
            onChange={(e) => setSelectedAppointment(e.target.value)}
          >
            <option value="">Select Appointment</option>
            <option value="checkup">Check-up</option>
            <option value="consultation">Consultation</option>
          </select>
        </div>

        {/* Footer Section */}
        <div className="text-center border-t pt-4 mb-6">
          <h1 className="text-2xl p-2 font-bold text-gray-800">
            MANIERA <span className="text-teal-500">MEDICAL</span>
          </h1>
          <p className="text-gray-600">Maniera Medical</p>
          <p className="text-gray-500">www.manieramedical.com</p>
        </div>

        {/* Patient Name Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Patient Name:</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>

        {/* Voice Note Section */}
        <div className="w-full max-w-4xl p-6 shadow-md border rounded-lg bg-white">
          <h3 className="text-sm font-semibold mb-2">Voice Note:</h3>
          <textarea
            className="w-full h-64 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type # to add a macro"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          {/* Alert Message */}
          <div className="flex items-center bg-yellow-100 text-yellow-700 text-xs p-2 mt-2 rounded-md">
            <span className="w-4 h-4 mr-2">⚠️</span>
            The audio and the typed text may differentiate based on what was edited after doing the dictation/consultation
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-4">
              <button className="p-2 rounded-full hover:bg-gray-200">👥</button>
              <button className="p-2 rounded-full hover:bg-gray-200">🌙</button>
            </div>
            <div className="flex gap-4">
              <button className="p-2 rounded-full hover:bg-gray-200 text-red-500">🎤</button>
              <button className="p-2 rounded-full hover:bg-gray-200">📤</button>
            </div>
          </div>
        </div>

        
        <div className="mb-6 mt-4">
          <label className="block text-gray-700 font-medium mb-2">Practitioner :</label>
          <input
            type="text"
            placeholder="Defend.D"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>

        <div className="mb-6 mt-4">
          <label className="block text-gray-700 font-medium mb-2">Draw on area treated:</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
        <div className=" flex justify-center items-center">
  <button className="text-center bg-red-500 border m-2 p-2 rounded">Save Form</button>
</div>

      </div>
    </>
  );
}
