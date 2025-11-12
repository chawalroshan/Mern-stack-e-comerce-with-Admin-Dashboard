import React, { useState } from 'react';
import { FaRegImages } from "react-icons/fa6";
import {  uploadImages } from '../../utils/api.js';

const UploadBox = ({ url, multiple = false, onChange }) => {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onChangeFile = async (e) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const formData = new FormData();
      setUploading(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/jpg" ||
          file.type === "image/webp"
        ) {
          const previewUrl = URL.createObjectURL(file);
          setPreviews((prev) => [...prev, previewUrl]);
          formData.append("images", file);
        }
      }

      // Upload images
      const response = await uploadImages('/api/category/uploadImage', formData, true);

      const uploadedImages = response?.images || [];

      if (typeof onChange === 'function') {
        onChange(uploadedImages);
      }

      setPreviews(uploadedImages);
      setUploading(false);
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploading(false);
    }
  };

  return (
    <div className="uploadbox p-3 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
      {uploading ? (
        <p className="text-sm text-gray-500">Uploading...</p>
      ) : previews.length > 0 ? (
        <img
          src={previews[0]}
          alt="Preview"
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <>
          <FaRegImages className="text-[40px] opacity-40 pointer-events-none" />
          <h4 className="text-[14px] pointer-events-none mt-1">
            Upload Image
          </h4>
        </>
      )}

      <input
        type="file"
        multiple={multiple}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        onChange={onChangeFile}
      />
    </div>
  );
};

export default UploadBox;
