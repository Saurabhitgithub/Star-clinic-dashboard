import React, { useState } from "react";
import { DashboardIcon, MsgIcon } from "../Icons/SvgIcons";
import { useNavigate } from "react-router";
import { UserProfile } from "./UserProfile";

const Dashboard = () => {
  const [isEMROpen, setIsEMROpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Treatment-Notes"); // Change "/new-page" to your desired route
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
      <div>
        {/* User Profile Section */}
        <div>
          <UserProfile />
        </div>
      </div>
        <div className="relative">
          <button
            className="lg:hidden bg-blue-500 text-white px-4 py-2 rounded-md m-4"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "Close Menu" : "Open Menu"}
          </button>



        <div
          className={`bg-white shadow-md p-6 mt-5 h-full w-64 lg:w-64 transform transition-transform duration-300 rounded min-h-screen
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:translate-x-0`}
         
        >
            <h2 className="text-lg font-bold text-blue-500 pb-4">Dashboard</h2>

            <ul className="mt-4 space-y-3 text-gray-700 font-semibold">
              <li className="flex justify-between pb-2">
                Appointments
                <span className="text-blue-500 border border-blue-500 bg-blue-100 rounded-full px-2">
                  122
                </span>
              </li>
              <li className="flex justify-between pb-2">
                Packages
                <span className="text-blue-500 border border-blue-500 bg-blue-100 rounded-full px-2">
                  8
                </span>
              </li>
              <li className="flex justify-between pb-2">
                Financials
                <span className="text-blue-500 border border-blue-500 bg-blue-100 rounded-full px-2">
                  83
                </span>
              </li>
              <li className="flex justify-between pb-2">
                Communications
                <span className="text-blue-500 border border-blue-500 bg-blue-100 rounded-full px-2">
                  396
                </span>
              </li>

              {/* EMR Section */}
              <li>
                <button
                  onClick={() => setIsEMROpen(!isEMROpen)}
                  className="flex justify-between w-full "
                >
                  <span>EMR</span>
                  <span className={isEMROpen ? "rotate-180" : ""}>^</span>
                </button>

                {isEMROpen && (
                  <ul className="ml-4 mt-2 space-y-2 text-gray-600 font-medium">
                    <li className="flex justify-between pb-2">
                      Forms
                      <span className="text-blue-500 border border-blue-500 bg-blue-100 rounded-full px-2">
                        50
                      </span>
                    </li>
                    <li className="flex justify-between pb-2">
                      Photos
                      <span className="text-blue-500 border border-blue-500 bg-blue-100 rounded-full px-2">
                        2
                      </span>
                    </li>
                    <li className="flex justify-between pb-2">
                      Prescriptions
                      <span className="text-blue-500 border border-blue-500 bg-blue-100 rounded-full px-2">
                        36
                      </span>
                    </li>
                    <li className="flex justify-between pb-2">
                      Documents
                      <span className="text-blue-500 border border-blue-500 bg-blue-100 rounded-full px-2">
                        4
                      </span>
                    </li>
                    <li className="flex justify-between pb-2">
                      Lab Tests
                      <span className="text-blue-500 border border-blue-500 bg-blue-100 rounded-full px-2">
                        0
                      </span>
                    </li>
                    <li className="flex justify-between pb-2">
                      Gift Voucher
                      <span className="text-blue-500 border border-blue-500 bg-blue-100 rounded-full px-2">
                        1
                      </span>
                    </li>
                    <li className="flex justify-between pb-2">
                      Activities
                      <span className="text-blue-500 border border-blue-500 bg-blue-100 rounded-full px-2">
                        0
                      </span>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Next Appointment */}
          <div className="border border-gray-200 bg-white shadow-md rounded-lg p-6 mb-6 w-[850px]">
            <h3 className="text-gray-600 font-semibold mb-4">
              Next Appointment
            </h3>
            <div className="border-b mb-4"></div>
            <div className="flex flex-col items-center">
              <MsgIcon />
              <p className="text-gray-500 pt-5">No Upcoming Appointment</p>
            </div>
          </div>

          {/* Medical History & Medication History */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {/* Medical History */}
            <div className="border border-gray-200 bg-white shadow-md rounded-lg p-6">
              <h3 className="text-gray-600 font-semibold mb-4">
                Family History
              </h3>
              <div className="border-b mb-4"></div>
              <div className=" flex justify-center p-3">
                <MsgIcon />
              </div>
              <p className="text-gray-500 flex justify-center   ">
                No Family history
              </p>
            </div>

            {/* Medication History */}
            <div className="border border-gray-200 bg-white shadow-md rounded-lg p-6">
              <h3 className="text-gray-600 font-semibold mb-4">
                Social History
              </h3>
              <div className="border-b mb-4"></div>
              <div className=" flex justify-center p-3">
                <MsgIcon />
              </div>
              <p className="text-gray-500 flex justify-center">
                No Social History
              </p>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="border border-gray-200 bg-white shadow-md rounded-lg p-6 mt-6">
            <h3 className="text-gray-700 font-semibold text-lg mb-2">Alerts</h3>
            <div className="border-b mb-4"></div>
            <h4 className="text-gray-600 font-medium mb-2">Staff Alerts</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Influencer, to be gifted a Hydrafacial - Grace K.",
                "Fainter",
                "Pregnant",
                "Allergic",
              ].map((alert, index) => (
                <span
                  key={index}
                  className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md font-medium"
                >
                  {alert}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5">
            {/* Family History */}
            <div className="border border-gray-200 bg-white shadow-md rounded-lg p-6">
              <h3 className="text-gray-600 font-semibold mb-4">
                Medical History
              </h3>
              <div className="border-b mb-4"></div>
              <div className=" flex justify-center p-3">
                <MsgIcon />
              </div>
              <p className="text-gray-500 flex justify-center">
                No Medical History
              </p>
            </div>

            {/* Social History */}
            <div className="border border-gray-200 bg-white shadow-md rounded-lg p-6">
              <h3 className="text-gray-600 font-semibold mb-4">
                Meditation History
              </h3>
              <div className="border-b mb-4"></div>
              <div className=" flex justify-center p-3">
                <MsgIcon />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm">7 Jun 2022</p>
                <span className="text-gray-400 text-xl tracking-widest">
                  ●●●
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5">
            {/* Family History */}
            <div className="border border-gray-200 bg-white shadow-md rounded-lg p-6">
              <h3 className="text-gray-600 font-semibold mb-4">Product</h3>
              <div className="border-b mb-4"></div>
              <div className=" flex justify-center p-3">
                <MsgIcon />
              </div>
              <p className="text-gray-500 flex justify-center">No Product</p>
            </div>

            {/* Social History */}
            <div className="border border-gray-200 bg-white shadow-md rounded-lg p-6">
              <h3 className="text-gray-600 font-semibold mb-4">
                product heading
              </h3>
              <div className="border-b mb-4"></div>
              <div className=" flex justify-center p-3">
                <MsgIcon />
              </div>
              <p className="text-gray-500 flex justify-center">No Product</p>
            </div>

            <div className="fixed bottom-6 right-6">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-700 text-lg font-bold"
              >
                +
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute bottom-full mb-2 w-60 right-6 bg-white border rounded-lg shadow-md max-h-80 
                             overflow overflow-y-auto scrollbar "
                >
                  <div class="max-w-sm mx-auto bg-white shadow-lg rounded-lg p-4">
                    <h2 class="text-lg font-semibold mb-4">Create</h2>
                    <ul class="space-y-3">
                      <li class="flex items-center space-x-3">
                        <span class="bg-purple-500 text-white p-2 rounded-full">
                          ✏️
                        </span>
                        <span onClick={handleClick}>
                          <p class="font-medium pointer">Treatment note</p>
                          <p class="text-gray-500 text-sm">
                            Create a treatment note
                          </p>
                        </span>
                      </li>
                      <li class="flex items-center space-x-3">
                        <span class="bg-green-500 text-white p-2 rounded-full">
                          📜
                        </span>
                        <span>
                          <p class="font-medium">Consent Form</p>
                          <p class="text-gray-500 text-sm">
                            Create a consent form
                          </p>
                        </span>
                      </li>
                      <li class="flex items-center space-x-3">
                        <span class="bg-blue-500 text-white p-2 rounded-full">
                          🧪
                        </span>
                        <span>
                          <p class="font-medium">Request Labs</p>
                          <p class="text-gray-500 text-sm">
                            Create a lab request
                          </p>
                        </span>
                      </li>
                      <li class="flex items-center space-x-3">
                        <span class="bg-yellow-500 text-white p-2 rounded-full">
                          💊
                        </span>
                        <span>
                          <p class="font-medium">Prescription</p>
                          <p class="text-gray-500 text-sm">
                            Write a prescription
                          </p>
                        </span>
                      </li>
                      <li class="flex items-center space-x-3">
                        <span class="bg-orange-500 text-white p-2 rounded-full">
                          💰
                        </span>
                        <span>
                          <p class="font-medium">Sale</p>
                          <p class="text-gray-500 text-sm">
                            Create a transaction
                          </p>
                        </span>
                      </li>
                      <li class="flex items-center space-x-3">
                        <span class="bg-indigo-500 text-white p-2 rounded-full">
                          📄
                        </span>
                        <span>
                          <p class="font-medium">Quote</p>
                          <p class="text-gray-500 text-sm">Create a quote</p>
                        </span>
                      </li>
                      <li class="flex items-center space-x-3">
                        <span class="bg-teal-500 text-white p-2 rounded-full">
                          📞
                        </span>
                        <span>
                          <p class="font-medium">Activity</p>
                          <p class="text-gray-500 text-sm">
                            Log a call, email, or anything else
                          </p>
                        </span>
                      </li>
                      <li class="flex items-center space-x-3">
                        <span class="bg-red-500 text-white p-2 rounded-full">
                          🎓
                        </span>
                        <span>
                          <p class="font-medium">Education</p>
                          <p class="text-gray-500 text-sm">
                            Send infocare, prepare or any other kind of
                            education
                          </p>
                        </span>
                      </li>
                      <li class="flex items-center space-x-3">
                        <span class="bg-gray-500 text-white p-2 rounded-full">
                          🎤
                        </span>
                        <span>
                          <p class="font-medium">Dictation</p>
                          <p class="text-gray-500 text-sm">
                            Record a voice clip
                          </p>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
