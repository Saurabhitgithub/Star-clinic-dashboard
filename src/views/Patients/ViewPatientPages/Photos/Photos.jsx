import React, { useState, useRef, useEffect } from "react";
import Avatar from "/src/assets/images/image.png";
import {
  CrossIcon,
  GridIcon,
  ListIcon,
  SplashIcon,
  UploadIcon,
} from "../../../../components/Icons/SvgIcons";
import { Button } from "../../../../components/Buttons/Button";
import { DragAndDropInput } from "../../../../components/Inputs/DragAndDropInput";
import { useNavigate, useParams } from "react-router";
import {
  addPhotos,
  getAllAlbums,
  updatePhotosById,
} from "../../../../services/offersApis";
import { loader, toast } from "../../../../utils";
import { uploadMultipleDocs } from "../../../../services/authApis";
import { useForm, Controller } from "react-hook-form";
import { IMAGES_EXTENSIONS } from "../../../../utils/constants";
import { useGetPatientByIdQuery } from "../../../../store/apiSlices/patientApiSlice";

export default function Photos() {
  const { id } = useParams();
  const [albums, setAlbums] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [isUploadPhotoOpen, setIsUploadPhotoOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedAlbumIndex, setSelectedAlbumIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isTakePhotoOpen, setIsTakePhotoOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const uploadInputRef = useRef();
  const {
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();
  const { data: patientData, isLoading: isPatientLoading } =
    useGetPatientByIdQuery(id);
  useEffect(() => {
    if (patientData?._id) {
      setValue("user_id", patientData._id);
    }
  }, [patientData, setValue]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateAlbum = async () => {
    if (newAlbumName.trim() && patientData?._id) {
      const newAlbum = {
        album_name: newAlbumName.trim(),
        user_id: patientData._id,
      };
      setAlbums((prev) => [newAlbum, ...prev]);
      setNewAlbumName("");
      setIsCreateAlbumOpen(false);

      try {
        loader.start();
        const response = await addPhotos(newAlbum);
        if (response && response.data) {
          toast.success("Created new album successfully!");
        } else {
          toast.error("Error: No response data received");
        }
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("Error saving data");
      } finally {
        loader.stop();
        await fetchAlbums(patientData._id);
      }
    } else if (!patientData?._id) {
      toast.error("User ID not available yet.");
    }
  };

  const handleUpload = async () => {
    const selectedAlbum = albums[selectedAlbumIndex];
    if (!selectedAlbum || !selectedAlbum._id) {
      toast.error("Invalid album selected.");
      return;
    }

    try {
      loader.start();

      const fileEntries = getValues().fileData || [];
      const filesUpload = fileEntries
        .filter((entry) => entry.file instanceof File)
        .map((entry) => entry.file);

      let uploadedUrls = [];

      if (filesUpload.length > 0) {
        const uploadResponse = await uploadMultipleDocs(filesUpload);
        if (!uploadResponse?.data?.data) {
          throw new Error("Failed to upload files");
        }
        uploadedUrls = uploadResponse.data.data;
      }

      // Create file objects for uploaded files
      // Use uploaded file objects as-is
      const newFiles = uploadedUrls;

      // Combine form files (excluding raw File objects) with newly uploaded ones
      const existingFiles = (fileEntries || []).filter(
        (entry) => !(entry.file instanceof File)
      );
      const combinedFiles = [...existingFiles, ...newFiles];

      const saveData = {
        album_name: selectedAlbum.album_name,
        fileData: combinedFiles,
      };

      const saveResponse = await updatePhotosById(selectedAlbum._id, saveData);

      if (saveResponse && saveResponse.data) {
        toast.success("Photos uploaded successfully!");
        await fetchAlbums(patientData._id);
        setIsUploadPhotoOpen(false);
        setUploadedFiles([]);
      } else {
        throw new Error("Failed to save photos to album");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "An error occurred during upload.");
    } finally {
      loader.stop();
    }
  };
  const fetchAlbums = async (userId) => {
    try {
      loader.start();
      const response = await getAllAlbums(userId); // Pass userId to the API function

      console.log("Fetched albums data:", response.data);
      if (response && response.data && response.data.data) {
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
    if (patientData?._id) {
      fetchAlbums(patientData._id);
    }
  }, [patientData]);
  useEffect(() => {
    if (isUploadPhotoOpen && albums.length > 0) {
      const currentFiles = albums[selectedAlbumIndex]?.fileData || [];
      // Filter out invalid entries that cause startsWith error
      const safeFiles = currentFiles.filter((file) => {
        const url =
          file?.fileUrl || file?.url || (file?.file && file.file.name) || "";
        return typeof url === "string" && url.length > 0;
      });
      setValue("fileData", safeFiles);
    }
  }, [isUploadPhotoOpen, selectedAlbumIndex, albums, setValue]);

  return (
    <div className="bg-white-200 relative min-h-screen overflow-x-hidden overflow-y-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 relative gap-3">
        <h1 className="text-2xl font-semibold">Albums</h1>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex border rounded overflow-hidden">
            <Button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 ${
                viewMode === "grid" ? "bg-gray-300" : ""
              }`}
            >
              <GridIcon />
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 ${
                viewMode === "list" ? "bg-gray-300" : ""
              }`}
            >
              <ListIcon />
            </Button>
          </div>

          <div className="relative" ref={dropdownRef}>
            <Button
              primary
              addIcon
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Create
            </Button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setShowDropdown(false);
                    setIsCreateAlbumOpen(true);
                  }}
                >
                  Create Album
                </button>
              <button
  className="w-full px-4 py-2 text-left hover:bg-gray-100"
  onClick={() => {
    setShowDropdown(false);
    setSelectedAlbumIndex(0); // Reset to first album or default
    setUploadedFiles([]);
    setValue("fileData", []); // Clear form field
    setIsUploadPhotoOpen(true); // Open modal after resetting
    setTimeout(() => {
      uploadInputRef.current?.reset?.();
      uploadInputRef.current?.openFileDialog();
    }, 100);
  }}
>
  Upload Photo
</button>

                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setShowDropdown(false);
                    setIsTakePhotoOpen(true);
                  }}
                >
                  Take Photo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 my-4" />

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 "
            : "flex gap-2 flex-wrap mb-2"
        }
      >
        {albums.length > 0 ? (
          albums.map((album, albumIndex) => (
            <div
              key={album._id || albumIndex}
              className="border  rounded-lg p-3 shadow-sm bg-white "
            >
              <div className="flex flex-wrap gap-4 ">
                {album.fileData && album.fileData.length > 0 ? (
                  album.fileData.map((file, imageIndex) => (
                    <div
                      key={`${album._id}-${imageIndex}`}
                      className="aspect-square overflow-hidden rounded-md cursor-pointer relative group w-[7rem] h-[7rem] sm:w-[8rem] sm:h-[8rem]"
                      onClick={() =>
                        navigate(`../Photos/TakePhoto/${album._id}`, {
                          state: { albumName: album.album_name },
                        })
                      }
                    >
                      <img
                        src={
                          file?.fileUrl ||
                          file?.url ||
                          file?.file?.url ||
                          Avatar
                        }
                        alt={`album-${album.album_name}-${imageIndex}`}
                        className="object-cover w-full h-full "
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    No photos yet in this album.
                  </div>
                )}
              </div>
              <h2 className="font-semibold mt-3">{album.album_name}</h2>
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">No albums found.</div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative max-w-lg w-full bg-white rounded-lg shadow-lg">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-1 right-1 text-black text-xl font-bold"
            >
              <CrossIcon className="bg-red-500 rounded-full h-5 w-5" />
            </button>
            <img
              src={selectedImage}
              alt="preview"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}

      {isCreateAlbumOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[95%] sm:w-96">
            <h2 className="text-lg font-semibold ">Create New Album</h2>
            <input
              type="text"
              placeholder="Enter album name"
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button bordered onClick={() => setIsCreateAlbumOpen(false)}>
                Cancel
              </Button>
              <Button primary onClick={handleCreateAlbum}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {isUploadPhotoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[95%] sm:w-[450px]">
            <h2 className="text-lg font-semibold mb-4">Upload Photos</h2>
            <select
              value={selectedAlbumIndex}
              onChange={(e) => {
                const newAlbumIndex = Number(e.target.value);
                setSelectedAlbumIndex(newAlbumIndex);
                setUploadedFiles([]);
                uploadInputRef.current?.reset?.();
              }}
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
            >
              {albums.map((album, index) => (
                <option key={index} value={index}>
                  {album.album_name}
                </option>
              ))}
            </select>

            <Controller
              name="fileData"
              control={control}
              defaultValue={null}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                return (
                  <DragAndDropInput
                    required
                    error={!!errors?.fileData}
                    label={"Upload Media"}
                    value={value || []}
                    acceptedFileTypes={IMAGES_EXTENSIONS}
                    onChange={(e) => onChange(e)}
                  />
                );
              }}
            />

            <div className="flex justify-end mt-4 gap-2">
<Button
 bordered
  onClick={() => {
    setIsUploadPhotoOpen(false);
    setUploadedFiles([]);
    setValue("fileData", []);
    setSelectedAlbumIndex(0);
    uploadInputRef.current?.reset?.();
  }}
>
  Cancel
</Button>

              <Button
                primary
                onClick={() => {
                  handleUpload();
                  uploadInputRef.current?.reset?.();
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {isTakePhotoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[95%] sm:w-[600px] rounded-lg shadow-md relative">
            <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center rounded-t">
              <span className="font-semibold">Take photo</span>
              <Button
                onClick={() => setIsTakePhotoOpen(false)}
                className="text-white text-xl"
              >
                <CrossIcon />
              </Button>
            </div>

            <div className="flex-1 text-gray-600 border-dashed border-2 border-gray-300 m-4 rounded-lg p-6 sm:p-10 text-center">
              <DragAndDropInput
                value={images.map((img) => img.file?.name || img.id)}
                acceptedFileTypes={["image/*"]}
                label=""
                onFilesSelected={(files) => {
                  const newImages = files.map((file) => ({
                    id: URL.createObjectURL(file),
                    file,
                  }));
                  setImages((prev) => [...prev, ...newImages]);
                }}
                showFileNames
              />
            </div>

            <div className="flex px-4 space-x-2 mb-2 overflow-x-auto">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative w-20 h-20 rounded overflow-hidden border border-gray-300"
                >
                  <img
                    src={img.id}
                    alt={`upload-${idx}`}
                    className="object-cover w-full h-full"
                  />
                  <Button
                    onClick={() => {
                      URL.revokeObjectURL(img.id);
                      setImages((prev) => prev.filter((i) => i.id !== img.id));
                    }}
                    className="absolute top-0 right-0 text-white bg-black bg-opacity-50 p-1 text-xs rounded-bl"
                  >
                    <CrossIcon />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center px-4 py-3 bg-gray-800 text-white rounded-b">
              <span>
                {images.length} photo{images.length !== 1 ? "s" : ""}
              </span>
              <div className="flex-1 flex justify-center">
                <button
                  onClick={() => alert("Open camera")}
                  className="bg-red-500 hover:bg-red-600 p-3 rounded-full text-xl"
                >
                  <SplashIcon />
                </button>
              </div>
              <button
                onClick={() => {
                  images.forEach((img) => URL.revokeObjectURL(img.id));
                  setImages([]);
                  setIsTakePhotoOpen(false);
                }}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
