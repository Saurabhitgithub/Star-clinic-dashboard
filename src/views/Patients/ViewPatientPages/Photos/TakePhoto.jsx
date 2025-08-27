import React, { useState, useRef, useEffect } from "react";
import { CollapseDownIcon } from "../../../../components/Icons/SvgIcons";
import { CgSoftwareDownload } from "react-icons/cg";
import { RiSave2Fill } from "react-icons/ri";
import { FaSearchPlus } from "react-icons/fa";
import { AiOutlineRotateRight } from "react-icons/ai";
import { AiOutlineRotateLeft } from "react-icons/ai";
import { BsShare } from "react-icons/bs";
import { CiCircleChevRight } from "react-icons/ci";
import { CiCamera } from "react-icons/ci";
import { IoMdPhotos } from "react-icons/io";
import { CgArrowTopRightO } from "react-icons/cg";
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from "react-compare-slider";
import {
  addBeforeAfter,
  getAllAlbums,
  getPhotosById,
} from "../../../../services/offersApis";
import { loader, toast } from "../../../../utils";
import { useNavigate, useParams } from "react-router";
import { use } from "react";
import { uploadMultipleDocs } from "../../../../services/authApis";

export default function TakePhoto() {
  const { id, aid } = useParams();

  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  console.log(photos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewType, setViewType] = useState("Single photo");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedAlbumIndex, setSelectedAlbumIndex] = useState(0);
  const [albums, setAlbums] = useState([]);
  const fileInputRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAlbumPhotos, setSelectedAlbumPhotos] = useState([]);
  const [selectedAlbumName, setSelectedAlbumName] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const currentPhoto = photos[currentIndex];
  const nextPhoto =
    photos.length > 1 ? photos[(currentIndex + 1) % photos.length] : null;
  const [filesUpload, setFilesUpload] = useState([]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const fetchAlbums = async () => {
    try {
      loader.start();
      const response = await getAllAlbums(id);

      if (response?.data?.data) {
        setAlbums(response.data.data);
      } else {
        toast.error("Failed to load albums");
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      toast.error("Error fetching albums");
    } finally {
      loader.stop();
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchPhotos = async () => {
    try {
      loader.start();
      const response = await getPhotosById(aid);
      console.log("Fetched albums data:", response.data);

      if (response?.data?.data) {
        const album = response.data.data;
        setSelectedAlbumName(album.album_name);
        const photoArray = album.fileData.map((file) => ({
          url: file.fileUrl,
          fileName: file.fileName,
        }));
        setSelectedAlbumPhotos(photoArray);
        setPhotos(photoArray);
      } else {
        toast.error("Failed to load album");
      }
    } catch (error) {
      console.error("Error fetching album:", error);
      toast.error("Error fetching album");
    } finally {
      loader.stop();
    }
  };

  useEffect(() => {
    if (aid) {
      fetchPhotos(aid);
      setSelectedAlbumId(aid);
    }
  }, [aid]);
  const [fileData1, setFileData1] = useState();

  const handleFileChange = (e) => {
    let name = e.target.name;
    const file = e.target.files[0];
    if (file) {
      if (name === "file1") {
        setFileData1(file);
      }
      const url = URL.createObjectURL(file);
      const date = new Date();
      const newPhoto = {
        url,
        date: date.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        }),
        timestamp: date.toLocaleDateString("en-US"),
      };
      setPhotos((prev) => [...prev, newPhoto]);
      setCurrentIndex(photos.length);
    }
  };

  const handleDownload = () => {
    if (!currentPhoto) return;

    const link = document.createElement("a");
    link.href = currentPhoto.url;
    link.download = `photo-${currentPhoto.date || "download"}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async () => {
    if (!currentPhoto?.url) {
      toast.error("Please select a photo to save");
      return;
    }

    if (!selectedAlbumId) {
      toast.error("Please select an album to save to");
      return;
    }

    try {
      loader.start();
      let virIndex = currentIndex + 1 === photos.length ? 0 : currentIndex + 1;
      let uploadResponse = {
        fileName: photos[virIndex].fileName,
        fileUrl: photos[virIndex].url,
      };
      console.log(photos, currentIndex, virIndex);

      if (fileData1) {
        uploadResponse = await uploadMultipleDocs([fileData1]);
      }
      // Call the API to save the photo
console.log(uploadResponse?.data
    ? uploadResponse.data.data[0]
    : uploadResponse)
      const response = await addBeforeAfter({
        title: "",
        user_id: id,
        fileData1: {
          fileName: photos[currentIndex].fileName,
          fileUrl: photos[currentIndex].url,
        },
        fileData2: uploadResponse?.data
          ? uploadResponse.data.data[0]
          : uploadResponse,
      });
      setFileData1()
      if (response.data.success) {
        // Update local state
        const updatedAlbums = albums.map((album) => {
          if (album?._id === selectedAlbumId) {
            return {
              ...album,
              fileData: [
                ...(album.fileData || []),
                {
                  fileUrl: currentPhoto.url,
                  // Add other file properties if needed
                },
              ],
            };
          }
        });

        setAlbums(updatedAlbums);
        toast.success("Photo saved successfully!");

        fetchPhotos(selectedAlbumId);
      } else {
        toast.error(response.data.message || "Failed to save photo");
      }
    } catch (error) {
      console.error("Error saving photo:", error);
      toast.error(error.response?.data?.message || "Error saving photo");
    } finally {
      loader.stop();
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      alert("Unable to access camera.");
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    if (!video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/jpeg");

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    setCameraOpen(false);

    const date = new Date();
    const newPhoto = {
      url: imageUrl,
      date: date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      }),
      timestamp: date.toLocaleDateString("en-US"),
    };

    setPhotos((prev) => [...prev, newPhoto]);
    setCurrentIndex(photos.length);
  };

  const renderView = () => {
    if (!currentPhoto) {
      return (
        <div className="text-center text-gray-500 mt-4">
          No photos available
        </div>
      );
    }

    if (viewType === "Single photo") {
      return (
        <div className="flex flex-col items-center">
          <img
            src={currentPhoto.url}
            alt="preview"
            className="max-h-[30vh] rounded"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>
      );
    }

    if (viewType === "Comparison Slider") {
      if (!nextPhoto) {
        return (
          <div className="text-center text-red-500 mt-4">
            Comparison requires at least 2 images.
          </div>
        );
      }

      return (
        <div className="w-full">
          <div className="w-full flex justify-center items-center">
            <ReactCompareSlider
              boundsPadding={0}
              clip="both"
              itemOne={
                <ReactCompareSliderImage
                  alt="Image one"
                  src={currentPhoto.url}
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  alt="Image two"
                  src={nextPhoto.url}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    filter:
                      "saturate(1.25) contrast(1.1) drop-shadow(2px 4px 6px black)",
                  }}
                />
              }
              handle={
                <ReactCompareSliderHandle
                  buttonStyle={{
                    backgroundColor: "var(--primary-color)",
                    border: "2px solid white",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                  }}
                />
              }
              keyboardIncrement="5%"
              position={50}
              style={{
                backgroundColor: "black",
                backgroundImage: `
                                        linear-gradient(45deg, #ccc 25%, transparent 25%),
                                        linear-gradient(-45deg, #ccc 25%, transparent 25%),
                                        linear-gradient(45deg, transparent 75%, #ccc 75%),
                                        linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                backgroundSize: "20px 20px",
                width: "40%",
                borderRadius: "0.5rem",
              }}
            />
          </div>
        </div>
      );
    }

    if (viewType === "2 Vertical Side by Side") {
      return (
        <div className="flex flex-col sm:flex-row w-60 h-60 items-center justify-center gap-4">
          <img
            src={currentPhoto.url}
            alt="photo1"
            className="max-h-[60vh] rounded"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <img
            src={nextPhoto?.url || currentPhoto.url}
            alt="photo2"
            className="max-h-[60vh] rounded"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>
      );
    }

    if (viewType === "2 Horizontal Side by Side") {
      return (
        <div className="flex flex-col w-60 h-60 items-center justify-center gap-4">
          <img
            src={currentPhoto.url}
            alt="photo1"
            className="max-h-[60vh] rounded"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <img
            src={nextPhoto?.url || currentPhoto.url}
            alt="photo2"
            className="max-h-[60vh] rounded"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>
      );
    }

    if (viewType === "3 Side by Side") {
      return (
        <div className="flex flex-row w-40 h-40 items-center justify-center gap-4">
          <img
            src={currentPhoto.url}
            alt="photo1"
            className="max-h-[50vh] rounded"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <img
            src={nextPhoto?.url || currentPhoto.url}
            alt="photo2"
            className="max-h-[50vh] rounded"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <img
            src={nextPhoto?.url || currentPhoto.url}
            alt="photo3"
            className="max-h-[50vh] rounded"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>
      );
    }

    if (viewType === "4 Side by Side") {
      return (
        <div className="flex flex-wrap w-60 h-60 items-center justify-center gap-4">
          <div className="flex flex-row w-1/2 items-center justify-center gap-4">
            <img
              src={currentPhoto.url}
              alt="photo1"
              className="max-h-[60vh] rounded"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            <img
              src={nextPhoto?.url || currentPhoto.url}
              alt="photo2"
              className="max-h-[60vh] rounded"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </div>
          <div className="flex flex-row w-1/2 items-center justify-center gap-4">
            <img
              src={nextPhoto?.url || currentPhoto.url}
              alt="photo3"
              className="max-h-[60vh] rounded"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            <img
              src={nextPhoto?.url || currentPhoto.url}
              alt="photo4"
              className="max-h-[60vh] rounded"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </div>
        </div>
      );
    }

    if (viewType === "6 Side by Side") {
      return (
        <div className="flex flex-wrap w-60 h-60 items-center justify-center gap-4">
          <div className="flex flex-row w-1/2 items-center justify-center gap-4">
            <img
              src={currentPhoto.url}
              alt="photo1"
              className="max-h-[60vh] rounded"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            <img
              src={nextPhoto?.url || currentPhoto.url}
              alt="photo2"
              className="max-h-[60vh] rounded"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            <img
              src={nextPhoto?.url || currentPhoto.url}
              alt="photo3"
              className="max-h-[60vh] rounded"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </div>
          <div className="flex flex-row w-1/2 items-center justify-center gap-4">
            <img
              src={nextPhoto?.url || currentPhoto.url}
              alt="photo4"
              className="max-h-[60vh] rounded"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            <img
              src={nextPhoto?.url || currentPhoto.url}
              alt="photo5"
              className="max-h-[60vh] rounded"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
            <img
              src={nextPhoto?.url || currentPhoto.url}
              alt="photo6"
              className="max-h-[60vh] rounded"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  const viewOptions = [
    "Single photo",
    "Comparison Slider",
    "2 Vertical Side by Side",
    "2 Horizontal Side by Side",
    "3 Side by Side",
    "4 Side by Side",
    "6 Side by Side",
  ];

  return (
    <div className="w-full min-h-[90vh] bg-white flex flex-col">
      {loading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-red-500">Error: {error.message}</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setError(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg flex flex-col items-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-md rounded mb-4"
            />
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded"
              onClick={capturePhoto}
            >
              Capture
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center p-2 border-b">
        <div />
        <div className="flex items-center gap-2 my-2">
          <div className="relative">
            <button
              className="flex items-center gap-x-2 px-4 py-2 border text-blue-600 border-blue-500 rounded shadow-sm"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {viewType}
              <span className="ml-1">
                <CollapseDownIcon />
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border rounded shadow z-10">
                {viewOptions.map((option) => {
                  const icons = {
                    "Single photo": (
                      <IoMdPhotos className="w-5 h-5 text-blue-600" />
                    ),
                    "Comparison Slider": (
                      <IoMdPhotos className="w-5 h-5 text-blue-600" />
                    ),
                    "2 Vertical Side by Side": (
                      <div className="flex flex-row space-x-1">
                        <IoMdPhotos className="w-5 h-5 text-blue-600" />
                      </div>
                    ),
                    "2 Horizontal Side by Side": (
                      <div className="flex flex-col">
                        <IoMdPhotos className="w-5 h-5 text-blue-600" />
                      </div>
                    ),
                    "3 Side by Side": (
                      <IoMdPhotos className="w-5 h-5 text-blue-600" />
                    ),
                    "4 Side by Side": (
                      <IoMdPhotos className="w-5 h-5 text-blue-600" />
                    ),
                    "6 Side by Side": (
                      <IoMdPhotos className="w-5 h-5 text-blue-600" />
                    ),
                  };

                  return (
                    <div
                      key={option}
                      onClick={() => {
                        setViewType(option);
                        setDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${
                        viewType === option ? "bg-gray-100 font-medium" : ""
                      }`}
                    >
                      {icons[option]}
                      <span>{option}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* <button className="px-4 py-2 border rounded flex items-center gap-2">
                        <CgArrowTopRightO className='h-4 w-4' />Draw
                    </button>
                    <button className="px-4 py-2 border rounded flex items-center gap-2">
                        <CiCircleChevRight className='h-4 w-4' />Present
                    </button> */}
          <button
            className="px-4 py-2 border rounded flex items-center gap-2 hover:bg-gray-300"
            onClick={() =>
              window.open("https://www.instagram.com/your_username/", "_blank")
            }
          >
            <BsShare className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      <div className="flex flex-1 relative">
        <div
          className={`transition-all duration-300 bg-gray-100 border-r ${
            sidebarOpen ? "w-52" : "w-0"
          } overflow-hidden`}
        >
          <div className="p-2">
            <select
              value={selectedAlbumId}
              onChange={(e) => {
                const selectedId = e.target.value;
                setSelectedAlbumId(selectedId);
                navigate(
                  `/patientDetails/${id}/Photos/TakePhoto/${selectedId}`
                );
                const album = albums.find((a) => a._id === selectedId);
                if (album) {
                  setSelectedAlbumName(album.album_name);
                  const photoArray = album.fileData.map((file) => ({
                    url: file.fileUrl,
                  }));
                  setSelectedAlbumPhotos(photoArray);
                  setPhotos(photoArray);
                  setCurrentIndex(0);
                }
              }}
              className="w border border-gray-300 rounded-md p-3 mb-4"
            >
              <option value="" disabled>
                Select an album
              </option>
              {albums?.map((album) => (
                <option key={album?._id} value={album?._id}>
                  {album?.album_name}
                </option>
              ))}
            </select>

            {photos.map((photo, index) => (
              <div
                key={index}
                className={`cursor-pointer mb-3 rounded overflow-hidden border ${
                  index === currentIndex ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={photo.url}
                  alt={`thumb-${index}`}
                  className="w-full h-24 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-1/3 left-0 transform -translate-y-1/2 z-20"
        >
          <div className="bg-sky-500 text-white px-1 mt-6 py-6 rounded-r-full shadow-md">
            {sidebarOpen ? "<" : ">"}
          </div>
        </button>

        <div className="flex-1 flex items-center justify-center relative p-6">
          {renderView()}

          {currentPhoto && (
            <div className="absolute right-2 top-1/3 -translate-y-1/3 flex flex-col gap-3">
              <button
                className="p-2 rounded-full hover:bg-gray-100 border"
                onClick={() => setRotation((prev) => (prev + 90 + 360) % 360)}
              >
                <AiOutlineRotateRight />
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100 border"
                onClick={() => setRotation((prev) => (prev - 90) % 360)}
              >
                <AiOutlineRotateLeft />
              </button>

              {viewType === "2 Vertical Side by Side" && (
                <button
                  onClick={handleSave}
                  className="p-2 rounded-full hover:bg-gray-100 border"
                >
                  <RiSave2Fill />
                </button>
              )}

              <button
                onClick={handleDownload}
                className="p-2 rounded-full hover:bg-gray-100 border"
              >
                <CgSoftwareDownload />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 p-4 border-t">
        <button
          className="p-2 border bg-blue-500 text-white rounded-full"
          onClick={handleUploadClick}
        >
          <IoMdPhotos className="w-5 h-5" />
        </button>
        <input
          type="file"
          accept="image/*"
          name="file1"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          className="p-2 border bg-blue-500 text-white rounded-full"
          onClick={openCamera}
        >
          <CiCamera className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
