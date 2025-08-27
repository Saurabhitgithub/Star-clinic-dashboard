import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import newprofile from "../../assets/images/newprofileimage.png"

import vouchercard from"../../assets/images/vouchercard.jpg"
import { InfoIcon } from "../../components/Icons/SvgIcons";
import { loader, toast } from "../../utils";

import { getUserCardData } from "../../services/offersApis";
 
export const UserProfile = ({ userData = {} }) => {
  const location = useLocation();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
 
let {id}= useParams()
  const fetchUserCardData = async () => {
    setLoading(true);
    loader.start?.();
 
    try {
      const response = await getUserCardData(id);
      const userCard = response?.data?.data || {};
      console.log("User Card Data:", userCard);
      setData(userCard);
 
      if (location.search.includes("refresh")) {
        window.history.replaceState({}, document.title, location.pathname);
      }
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Failed to fetch user card data");
    } finally {
      setLoading(false);
      loader.stop?.();
    }
  };
  useEffect(() => {
    fetchUserCardData();
  }, []);
 
  return (
    <div className="items-center min-h-screen">
      <div className="bg-white p-6 rounded-md w-full text-center">
        {/* Profile Image */}
        <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
          <div className="w-24 h-24 rounded-full">
            <img
              src={userData?.profile_image?.fileUrl || newprofile}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto border-4 border-gray-300"
            />
          </div>
          {/* <div className="absolute space-y-5">
            <div className="bg-blue-300 rounded-full shadow-md ml-4 relative right-[-40px]">
              <InfoIcon />
            </div>
            <div className="bg-blue-300 rounded-full shadow-md absolute right-[-20px]">
              <InfoIcon />
            </div>
          </div> */}
        </div>
 
        <h4 className="text-lg font-semibold mt-2">{userData?.name}</h4>
        {/* <span className="text-green-600 font-medium text-sm">● Active</span> */}
 
        {/* Card Section */}
        {console.log("Card Data:", data)}
        {loading ? (
          <p className="text-gray-500 mt-4">Loading card data...</p>
        ) : (
          <div className="relative m-5 w-60 h-40 rounded-lg overflow-hidden shadow-md mx-auto">
            <img
              src={vouchercard}
              alt="Card"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
 
            {/* Points - top right */}
            <div className="absolute top-2 right-2 z-10">
              <p className="text-white font-semibold text-sm">
                Points: {data?.points }
              </p>
            </div>
 
            {/* Card No - bottom left */}
            <div className="absolute bottom-2 left-2 z-10 text-white text-sm">
              <p className="font-semibold">
                Card No: {data?.card_number }
              </p>
            </div>
          </div>
        )}
 
        {/* Details Section */}
        <div className="text-left mt-4 text-sm space-y-2">
          <p className=""><strong>DETAILS</strong></p>
          <div className="border p-0" />
 
          <p><strong>Patient ID</strong></p>
          <p>{userData?.patient_id || "N/A"}</p>
          <div className="border p-0" />
             <p><strong>Name</strong></p>
          <p>{userData?.name || "N/A"}</p>
          <div className="border p-0" />
 
          <p><strong>Blood Group</strong></p>
          <p>{userData?.blood_group || "N/A"}</p>
          <div className="border p-0" />
 
          <p><strong>Gender</strong></p>
          <p>{userData?.gender || "N/A"}</p>
          <div className="border p-0" />
 
          <p><strong>Address</strong></p>
          <p>{userData?.address || "N/A"}</p>
          <div className="border p-0" />
 
          <p><strong>Email</strong><br />
            <a
              href={`mailto:${userData?.email_address}`}
              className="text-blue-500 hover:underline break-words"
            >
              {userData?.email_address || "N/A"}
            </a>
          </p>
          <div className="border p-0" />
 
          <p><strong>Age</strong></p>
          <p>{userData?.age || "N/A"}</p>
          <div className="border p-0" />
 
          <p><strong className="break-words">Phone No.</strong></p>
          <p>{userData?.mobile || "N/A"}</p>
          <div className="border p-0" />
        </div>
      </div>
    </div>
  );
};
 