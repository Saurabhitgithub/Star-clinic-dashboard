import React, { useRef, useState } from "react";
import { useGetAllSplashScreenDataQuery, useUpdateSplashScreenDataByIdMutation } from "../../store/apiSlices/splashScreenApiSlice";
import { Button } from "../../components/Buttons/Button";
import { loader, toast } from "../../utils";
import { uploadMultipleDocs } from "../../services/authApis";
import { SplashScreenHeader } from "../../components/PagesHeaders/SplashScreenHeader";

export const SplashScreen = () => {
  const { data, isLoading } = useGetAllSplashScreenDataQuery();
  const [updateSplashScreen] = useUpdateSplashScreenDataByIdMutation();
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(""); // Store validation error messages

  const splashScreenImage = data?.data?.[0]?.fileData?.[0]?.fileUrl || null;
  const splashScreenId = data?.data?.[0]?._id;

  const REQUIRED_WIDTH = 1284; 
  const REQUIRED_HEIGHT = 2778;
  const MIN_FILE_SIZE_MB = 1; 
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check File Size
    const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
    if (fileSizeMB < MIN_FILE_SIZE_MB) {
      setErrorMessage(`Please upload an image larger than ${MIN_FILE_SIZE_MB}MB.`);
      return;
    }

    // Check Image Dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      if (img.width < REQUIRED_WIDTH || img.height < REQUIRED_HEIGHT) {
        setErrorMessage(`Image dimensions must be at least ${REQUIRED_WIDTH} x ${REQUIRED_HEIGHT}px.`);
        return;
      }

      setErrorMessage(""); // Clear errors
      loader.start();

      try {
        let uploadResponse = await uploadMultipleDocs([file]);
        const imageUrl = uploadResponse?.data?.data?.[0];

        if (!imageUrl) {
          throw new Error("Failed to upload image.");
        }

        const updatedData = { fileData: imageUrl };
        await updateSplashScreen({ id: splashScreenId, data: updatedData }).unwrap();

        toast.success("Splash screen updated successfully!");
      } catch (error) {
        console.error("Error updating splash screen:", error);
        toast.error("Failed to update splash screen.");
      } finally {
        loader.stop();
      }
    };
  };


  return (
    <div>
   <SplashScreenHeader/>
   <div className="flex flex-col items-center justify-center">

      <div className="mt-6 rounded-lg items-center">
        {/* Mobile Phone Frame */}
        <div className="relative w-64 h-[500px] bg-black rounded-3xl border-8 border-gray-900   shadow-lg overflow-hidden flex items-center justify-center">
          {/* Top bar of the mobile frame  */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-3 bg-gray-800 rounded-b-lg"></div>
          {isLoading ? (
            <div className="flex items-center justify-center h-full w-full bg-black text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
            </div>
          ) : splashScreenImage ? (
            <img
              src={splashScreenImage}
              alt="Splash Screen"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              No Image
            </div>
          )}
        </div>
              {/* Image Size Note */}
      <p className="mt-2 text-gray-500 text-sm">
       Image size: <strong>{REQUIRED_WIDTH} x {REQUIRED_HEIGHT} px</strong> (Min {MIN_FILE_SIZE_MB}MB)
      </p>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Update Button */}
        <div className="mt-4 flex justify-center">
          <Button primary onClick={() => fileInputRef.current.click()}>
            Update
          </Button>
        </div>
          {/* Validation Error Message */}
      {errorMessage && <p className="mt-2 text-red-500 text-sm">{errorMessage}</p>}

      </div>
    </div>
    </div>
  );
};
