import React, { useEffect, useState } from "react";
import forgot from "../../assets/images/forgotPassImg.png";
import { Label } from "../../components/Inputs/Label";
import { CommonPagesHeader } from "../../components/PagesHeaders/CommonPagesHeader";
import { Outlet, useNavigate } from "react-router";
import { Button } from "../../components/Buttons/Button";
import { RiShareBoxFill } from "react-icons/ri";
import { deleteEducationDataById, getAllEducation } from "../../services/offersApis";
import { useParams } from "react-router";
import { loader, toast } from "../../utils";
import { MdTextFields } from "react-icons/md"; // For text type
import {
  FaBookOpen,
  FaQuestionCircle,
  FaRegNewspaper,
  FaUsers,
  FaVideo,
} from "react-icons/fa";
import { LuBookOpenText } from "react-icons/lu";
import { VscShare } from "react-icons/vsc";
import AddEducationInfo from "./AddEducationInfo";
import { DeleteButton } from "../../components/Buttons/DeleteButton";
 
// ✅ Responsive Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl  overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
 
export default function SetupPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDataDropdown, setShowDataDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [showEducationModal, setShowEducationModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [showResources, setShowResources] = useState(false);
 
  const items = [
    { label: "Services", path: "/services" },
    { label: "Packages", path: "/packages" },
    {
      label: "Resources",
      children: [
        { label: "Room", path: "/resourceRoom" },
        { label: "Equipment", path: "/resourceEquipment" },
      ],
    },
    { label: "Gift Voucher", path: "/giftVoucher" },
    { label: "Online Booking", path: "/booking" },
    { label: "Client Portal", path: "/clientPortal" },
  ];
 
  useEffect(() => {
    if (showEducationModal) {
      fetchAllEducation();
    }
  }, [showEducationModal]);
 
  const fetchAllEducation = async () => {
    try {
      setLoading(true);
      const response = await getAllEducation();
      console.log("API Response:", response.data.data);
      setData(response?.data?.data || []);
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Failed to fetch education data");
    } finally {
      setLoading(false);
    }
  };
 
   async function deleteSpec(id) {
      try {
        loader.start();
        let res = await deleteEducationDataById(id);
        toast.success(res?.data.data);
        const response = await getAllEducation();
        console.log("API Response:", response);
        setData(response?.data.data|| []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete team.");
      } finally {
        loader.stop();
      }
    }
  return (
    <div className="bg-white min-h-screen font-sans px-4 sm:px-6 lg:px-8">
      <CommonPagesHeader
        heading="SetUp"
        searchValue={search}
        onSearch={(e) => setSearch(e.target.value)}
      />
 
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-6">
        {[
          {
            title: "Blog",
            subtitle: "53 posts / month",
            icon: (
              <FaRegNewspaper className="text-gray-500 text-2xl hover:text-black transition" />
            ),
          },
          {
            title: "Community",
            subtitle: "25 topics / week",
            icon: (
              <FaUsers className="text-gray-500 text-2xl hover:text-black transition" />
            ),
          },
          {
            title: "Video guides",
            subtitle: "50+ Videos",
            icon: (
              <FaVideo className="text-gray-500 text-2xl hover:text-black transition" />
            ),
          },
          {
            title: "Help guides",
            subtitle: "100+ Help Guides",
            icon: (
              <div className="flex items-center gap-1">
                <FaBookOpen className="text-gray-500 text-2xl hover:text-black transition" />
              </div>
            ),
          },
        ].map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer flex justify-between items-center bg-white"
          >
            <div className="flex gap-4 items-center">
              <div className="h-12 w-12 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.subtitle}</p>
              </div>
            </div>
 
            <VscShare className="text-gray-500 text-2xl hover:text-black transition" />
          </div>
        ))}
      </div>
 
      <div className="border-t mb-6"></div>
 
      {/* Main Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Business */}
        <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
          <img
            src={forgot}
            alt="Business"
            className="mb-4 mx-auto h-56 object-contain"
          />
          <h3 className="font-bold text-lg mb-4">Business</h3>
          <ul className="space-y-2">
            <div
              className="border-t "
              onClick={() => navigate("/businessDetail")}
            >
              <Label className="text-blue-600 hover:underline cursor-pointer">
                Business Details
              </Label>
            </div>

             <div className="border-t"   onClick={() => navigate("/locationManagement")}>
                <Label
                  className="text-blue-600 hover:underline cursor-pointer"
                
                >
                  Location
                </Label>
              </div>
                     {/* <div className="border-t"
           onClick={() => navigate("/financialDetails")}>
          <Label
            className="text-blue-600 hover:underline cursor-pointer"
         
          >
          Financials
          </Label>
        </div> */}
            {/* <div className="border-t">
                <Label
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => navigate("/location")}
                >
                  Location
                </Label>
              </div>
              <div className="border-t">
                <Label
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => setShowDataDropdown(!showDataDropdown)}
                >
                  Data ▼
                </Label>
              </div> */}
            {showDataDropdown && (
              <li
                className="ml-4 text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/billing")}
              >
                Billing
              </li>
            )}
          </ul>
        </div>
 
              {/* Services */}

        <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
          <img
            src={forgot}
            alt="Services"
            className="mb-4 mx-auto h-56 object-contain"
          />
          <h3 className="font-bold text-lg mb-4">Services</h3>
          <ul className="space-y-2 text-sm ">
            {items.map((item, i) => (
              <li key={i} className="border-t">
                {item.children ? (
                  <>
                    <div
                      className="hover:underline cursor-pointer py-2 flex justify-between items-center"
                      onClick={() => setShowResources((prev) => !prev)}
                    >
                      {item.label}
                      <span>{showResources ? "▲" : "▼"}</span>
                    </div>
                    {showResources && (
                      <ul className="ml-4 mt-1 space-y-1 text-sm ">
                        {item.children.map((child, j) => (
                          <li
                            key={j}
                            className="hover:underline cursor-pointer"
                            onClick={() => navigate(child.path)}
                          >
                            {child.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <div
                    className="hover:underline cursor-pointer py-2"
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
 
        {/* Clinical */}
        <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
          <img
            src={forgot}
            alt="Clinical"
            className="mb-4 mx-auto h-56 object-contain"
          />
          <h3 className="font-bold text-lg mb-4">Clinical</h3>
          <ul className="space-y-2 text-blue-600">
            {/* <div className="border-t">
              <Label className="hover:underline cursor-pointer">
                Care Pathways
              </Label>
            </div> */}
          <div className="border-t" onClick={() => navigate("/BlankForm")}>
              <Label className="hover:underline cursor-pointer">Form</Label>
            </div>
            <div className="border-t" onClick={() => navigate("/medical-form")}>
              <Label className="hover:underline cursor-pointer">
                Medical Form Templates
              </Label>
            </div>
            <div
              className="border-t  "
              onClick={() => setShowEducationModal(true)}
            >
              <Label className="hover:underline cursor-pointer ">
                Education
              </Label>
            </div>
            {/* <div className="border-t">
              <Label className="hover:underline cursor-pointer">Labs</Label>
            </div> */}
            <div
              className="border-t"
              onClick={() => navigate("/labsManagement")}
            >
              <Label className="hover:underline cursor-pointer">Labs</Label>
            </div>
            <div className="border-t" onClick={() => navigate("/setup/drug")}>
              <Label className="hover:underline cursor-pointer">Drugs</Label>
            </div>
            {/* <div
              className="border-t"
              onClick={() => navigate("/medical-condition")}
            >
              <Label className="hover:underline cursor-pointer">
                Medical Condition
              </Label>
            </div> */}
          </ul>
        </div>
      </div>
 
      {/* ✅ Modal */}
      <Modal
        isOpen={showEducationModal}
        onClose={() => setShowEducationModal(false)}
        title="Manage Education"
      >
        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading...</div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto mt-4 rounded border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Send Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                   Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {item.educationType === "text" ? (
                          <>
                            <LuBookOpenText className="text-gray-600" />
                            <span>Text</span>
                          </>
                        ) : (
                          <>
                            <FaVideo className="text-gray-600" />
                            <span>Video</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {item.sendTime || "Immediately"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                <div className="flex gap-2">
                  {/* Optional Edit Icon */}
                  {/* <EditIcon
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/teamManagement/update/${item._id}`);
                    }}
                  /> */}
                  <DeleteButton
                    className="cursor-pointer"
                    data={item._id}
                    confirmation
                    onDelete={deleteSpec}
                  />
                </div>
              </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
 
        <div className="flex justify-end pt-4">
          <Button
            primary
            onClick={() => {
              setIsModalOpen(true);
              setShowEducationModal(false);
              setShowEducationModal(true);
            }}
          >
            Add
          </Button>
        </div>
 
        <AddEducationInfo
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          fetchAllEducation={fetchAllEducation}
        />
      </Modal>
      <Outlet />
    </div>
  );
}
 