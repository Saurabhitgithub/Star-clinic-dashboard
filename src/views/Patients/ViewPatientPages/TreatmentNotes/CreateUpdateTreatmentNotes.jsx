

import { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material";
import { InfoIcon } from "../../../../components/Icons/SvgIcons";

export default function CreateUpdateTreatmentNotes() {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [patientName, setPatientName] = useState("DaphneGreen");
  const [showMicModal, setShowMicModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSave = () => {
    window.location.reload();
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      console.log("Available devices:", devices);
    });
  }, []);
  const handleClick = async () => {
    if (!recording) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(device => device.kind === "audioinput");

        if (audioDevices.length === 0) {
          alert("No microphone found. Please connect one.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: audioDevices[0].deviceId }
        });

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
          const a = document.createElement("a");
          a.href = audioUrl;
          a.download = "recording.wav";
          a.click();
        };

        mediaRecorder.start();
        setRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Microphone access denied or unavailable.");
      }
    } else {
      mediaRecorderRef.current?.stop();
      setRecording(false);
    }
  };

  return (
    <>


      <div className=" h-auto p-6 m-auto bg-white shadow-md rounded-lg w-full">
        <h1 className=" text-3xl mb-5 font-bold">Treatment Notes</h1>

        <div className="mb-6 flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">
          <label className="text-lg text-gray-700 font-semibold">Appointment</label>

          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full sm:w-auto">
            Copy previous
          </button>
        </div>

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

        <div className="text-center border-t pt-4 mb-6">
          <h1 className="text-2xl p-2 font-bold text-gray-800 md:text-5xl">
            MANIERA <br /><span className="text-teal-500">MEDICAL</span>
          </h1>

          <p className="text-gray-600">Maniera Medical</p>
          <p className="text-gray-500">www.manieramedical.com</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Patient Name:</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>


        <div className="w-full  p-6 shadow-md border rounded-lg bg-white">
          <h3 className="text-sm font-semibold mb-2">Voice Note:</h3>
          <textarea
            className="w-full h-64 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type # to add a macro"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          <div className="flex items-center bg-yellow-100 text-yellow-700 text-xs p-2 mt-2 rounded-md">
            <span className="w-4 h-4 mr-2">⚠️</span>
            The audio and the typed text may differentiate based on what was edited after doing the dictation/consultation
          </div>

          <div className="flex flex-wrap md:flex-nowrap justify-between items-center mt-4 gap-2">
            <div className="flex items-center border rounded-xl p-2 w-full bg-gray-100 shadow-sm">
              <span className="text-gray-500">👥</span>
              <input
                type="text"
                placeholder="Ask AI to write anything..."
                className="w-full px-4 py-1 bg-transparent outline-none text-gray-700"
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="flex space-x-2">
                <button className="p-1 rounded border hover:bg-gray-100"> <InfoIcon /></button>
                <button className="p-1 rounded border hover:bg-gray-100"> <InfoIcon /></button>
              </div>
            </div>

            <div className="flex gap-2 m-2 w-full md:w-auto justify-center">
              <button className="p-2 rounded border hover:bg-gray-200"
                onClick={() => setShowMicModal(true)}>🎤
              </button>

              {showMicModal && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-30 flex justify-end items-center "
                  onClick={() => setShowMicModal(false)}
                >
                  <div
                    className="w-80 bg-white shadow-lg p-3 border rounded border-gray-200 max-h-[60vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Content */}
                    <h2 className="font-semibold text-gray-700 text-sm">Speech Mode</h2>
                    <p className="m-2 text-sm">Choose the speech mode for this note</p>

                    <div className="space-y-2">
                      {/* Dictation Option */}
                      <div className="border p-2">
                        <div className="flex space-x-2">
                          <p className="text-sm">👥</p>
                          <p className="text-sm">Dictation</p>
                        </div>
                        <p className="text-xs text-gray-600">
                          Dictation converts spoken words into text in real time using Pabau speech technology.
                        </p>
                      </div>

                      {/* Transcription Option */}
                      <div className="border p-2">
                        <div className="flex space-x-2">
                          <p className="text-sm">👥</p>
                          <p className="text-sm">Transcription</p>
                        </div>
                        <p className="text-xs text-gray-600">
                          Dictation converts spoken words into text in real time using Pabau speech technology.
                        </p>
                      </div>

                      {/* Consultation Option */}
                      <div className="border p-2">
                        <div className="flex space-x-2">
                          <p className="text-sm">👥</p>
                          <p className="text-sm">Consultation</p>
                        </div>
                        <p className="text-xs text-gray-600">
                          Dictation converts spoken words into text in real time using Pabau speech technology.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              <button className="p-2 rounded border hover:bg-gray-100"
                onClick={() => setShowInfoModal(true)} > <InfoIcon /></button>

              {showInfoModal && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-30 flex justify-end items-center"
                  onClick={() => setShowInfoModal(false)}
                >
                  <div
                    className="w-80 bg-white shadow-lg p-3 border rounded border-gray-200 max-h-[60vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Content */}
                    <h2 className="text-sm font-semibold text-gray-700">Brain Hemisphere</h2>
                    <p className=" m-1 text-xs">
                      choose the type of thinking that processes your encounter
                    </p>

                    <div className="space-y-2 ">
                      <div className="border p-2">
                        <div className="flex space-x-2">
                          <p className="text-sm">👥</p>
                          <p className="text-sm">Dictation</p>
                        </div>
                        <p className="text-xs text-gray-600">
                          Dictation converts spoken words into text in real time using Pabau speech AI technology.
                        </p>
                      </div>
                      <div className="border p-2">
                        <div className="flex space-x-2">
                          <p className="text-sm">👥</p>
                          <p className="text-sm">Dictation</p>
                        </div>
                        <p className="text-xs text-gray-600">
                          Dictation converts spoken words into text in real time using Pabau speech AI technology.
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center justify-end cursor-pointer space-x-2 m-2">
                      <span className="text-gray-500 font-sm text-sm">Remember</span>
                      <div
                        className={`relative w-10 h-5 bg-gray-300 rounded-full p-1 transition ${isChecked ? "bg-gray-500" : ""
                          }`}
                        onClick={() => setIsChecked(!isChecked)}
                      >
                        <div
                          className={`w-4 h-3 bg-white rounded-full shadow-md transform transition ${isChecked ? "translate-x-5" : "translate-x-0"
                            }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>
              )}
              <button className="p-2 rounded border hover:bg-gray-200">👥</button>

              <button
                onClick={handleClick}
                className="p-2 rounded border hover:bg-gray-100"
              >
                {recording ? "⏹️ Stop" : "🎤 "}
              </button>
            </div>
          </div>


        </div>


        <div className="mb-6 mt-4">
          <label className="block text-gray-700 font-medium mb-2">Practitioner :</label>
          <input
            type="text"
            placeholder="Defend.D"
            className="w-full p-3 border border-gray-300 rounded-lg"

          />
        </div>
        <div className="mb-6 mt-4">
          <label className="block text-gray-700 font-medium mb-2">Draw on area treated:</label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

            <div className="w-full p-6 border bg-blue-100">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <span className="p-2 flex items-center space-x-2">
                  👥 <p>Draw</p>
                </span>
                {/* <input type="text" className="w-full bg-blue-100 p-2 bg-white" /> */}
              </div>
            </div>

            {/* Plot Section */}
            <div className="w-full p-6 border bg-blue-100">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <span className="p-2 flex items-center space-x-2">
                  👥 <p>Plot</p>
                </span>
                {/* <input type="text" className="w-full border p-2 bg-white bg-blue-100" /> */}
              </div>
            </div>

          </div>
        </div>


        <div className=" flex justify-end  items-center">
          <button className="text-center bg-blue-500  m-2 p-3 w-full" onClick={handleSave}>Save Form</button>
        </div>

      </div>


    </>
  );
}

