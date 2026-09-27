"use client";

import { uploadCloudinaryImage, validateImageFiles } from "@/lib/cloudinary";
import { useState } from "react";

interface MultiImageUploaderProps {
  onUpload: (urls: string[]) => void;
  existingCount?: number;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function MultiImageUploader({
  onUpload,
  existingCount = 0,
  disabled = false,
  onUploadingChange,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0 || uploading || disabled) return;
    const input = e.currentTarget;

    setUploading(true);
    onUploadingChange?.(true);

    try {
      validateImageFiles(Array.from(files), existingCount);
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        uploadedUrls.push(await uploadCloudinaryImage(file));
      }

      onUpload(uploadedUrls);

      alert("Images Uploaded Successfully");
    } catch (error) {
      console.log(error);

      alert(error instanceof Error ? error.message : "Image Upload Failed");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      input.value = "";
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
        accept="image/jpeg,image/png,image/webp"
        disabled={uploading || disabled}
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
