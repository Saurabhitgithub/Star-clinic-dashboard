import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import style from './input.module.css';
import { Label } from './Label';
import { CrossIcon, UploadIcon } from '../Icons/SvgIcons';
import { toast } from '../../utils';
import { Box, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Button } from '../Buttons/Button';

export const DragAndDropInput = ({
  className,
  error,
  required,
  fileLimit,
  label,
  onChange,
  value,
  setDeleted,
  disabled,
  acceptedFileTypes
}) => {
  const [files, setFiles] = useState([]);
  console.log(value)
  useEffect(() => {
    setFiles([...value]); // Initialize with existing uploaded files
  }, [value]);

  // Check if a URL is a Blob (local preview)
  const isBlobUrl = (url) => url.startsWith("blob:");

  // Extract file extension from a URL or filename
  const getFileExtension = (file) => {
    if (!file) return '';

    if (isBlobUrl(file.fileUrl)) {
      return file.fileName?.split('.').pop()?.toLowerCase() || '';
    }

    try {
      return new URL(file.fileUrl).pathname.split('.').pop()?.toLowerCase() || '';
    } catch {
      return '';
    }
  };


  // Determine file type based on extension
  const getFileType = (file) => {
    const ext = getFileExtension(file);
    if (!ext) return 'unknown';

    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) ? "image" :
      ['mp4', 'webm', 'ogg', 'avi', 'mov', 'm3u8'].includes(ext) ? "video" : "unknown";
  };
  console.log(getFileType(), "tytytytytytyt")
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.info('Invalid file type. Please upload a valid file.');
      return;
    }
    if (fileLimit < files.length + acceptedFiles.length) {
      toast.info(`You can upload only ${fileLimit} file(s)`);
      return;
    }
    if (disabled) return;

    const newFiles = [
      ...files,
      ...acceptedFiles.map(file => ({
        file, // Keep file reference for later upload
        fileUrl: URL.createObjectURL(file), // Create preview for local files
        fileName: file.name
      }))
    ];

    setFiles(newFiles);
    onChange(newFiles);
  }, [files, fileLimit, disabled, onChange]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    onDrop
  });

  const removeFile = useCallback((event, file, index) => {
    event.stopPropagation();
    if (!file.file) {
      setDeleted && setDeleted(prev => [...prev, file.fileName]);
    }
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange(updatedFiles);
  }, [files, onChange, setDeleted]);

  return (
    <>
      <Label required>{label}</Label>
      <div className='bg-white'>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div
            className={`${style.dragAndDrop_main_con} ${className}`}
            style={{ borderColor: error ? 'red' : '#d3d3d3' }}
          >
            {files.length === 0 ? (
              <div className='h-100 mt-4'>
                <div className='flex flex-col items-center'>
                  <div className={style.dragAndDrop_upload_icon_con}>
                    <UploadIcon />
                  </div>
                  <p className={`${style.browse_text} my-3`}>
                    <span className={style.dragAndDrop_click_upload}> Click to upload </span>
                    or drag and drop
                    <br />
                    Images (JPG, PNG, GIF) or Videos (MP4, WEBM)
                  </p>
                </div>
              </div>
            ) : (
              <div className='flex flex-wrap gap-3 p-4'>
                {files.map((file, index) => {
                  const fileUrl = file.fileUrl || file; // Use fileUrl or fallback to file link
                  const fileType = getFileType(file);

                  return (
                    <div className={`${style.drop_image_con} p-2`} key={index} onClick={(e) => e.stopPropagation()}>
                      {!disabled && (
                        <div
                          onClick={e => removeFile(e, file, index)}
                          className={`${style.drop_remove_icon}`}
                        >
                          <CrossIcon fill={'var(--primary-color)'} />
                        </div>
                      )}
                      {fileType === "image" ? (
                        <img src={fileUrl} alt={file.fileName || "Uploaded Image"} className={style.previewImage} />
                      ) : fileType === "video" ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          <ViewVideo fileUrl={fileUrl} />
                        </div>

                      ) : (
                        <p className='text-sm text-gray-500'>Unsupported file type</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

function ViewVideo({ fileUrl }) {
  const [dialog, setDialog] = useState(false);

  return (
    <>
      <div onClick={(e) => {
        e.stopPropagation();
        setDialog(true);
      }} className='flex justify-center mt-5'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
          <polygon points="10 9 15 12 10 15" />
        </svg>
      </div>

      <Dialog open={dialog} onClose={() => setDialog(false)}>
        <DialogTitle>Video</DialogTitle>
        <Box p={2}>
          <video controls className={style.previewVideo}>
            {/* Ensure the MIME type is set correctly */}
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
        <DialogActions>
          <Button onClick={() => setDialog(false)} bordered>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
