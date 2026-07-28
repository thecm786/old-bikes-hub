"use client";

import { useState } from "react";

interface MultiImageUploaderProps {
  onUpload: (urls: string[]) => void;
}

export default function MultiImageUploader({
  onUpload,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();

        formData.append("file", file);

        formData.append(
          "upload_preset",
          "old-bikes-hub"
        );

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/w4eee6vd/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }

      onUpload(uploadedUrls);

      alert("Images Uploaded Successfully");
    } catch (error) {
      console.log(error);

      alert("Image Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">

      <label className="font-semibold">
        Upload Bike Images
      </label>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={uploadImages}
        className="w-full rounded-lg border p-3"
      />

      {uploading && (
        <p className="font-semibold text-orange-500">
          Uploading Images...
        </p>
      )}
    </div>
  );
}