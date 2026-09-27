"use client";

import { uploadCloudinaryImage } from "@/lib/cloudinary";
import { useState } from "react";


interface ImageUploaderProps {
  onUpload: (url: string) => void;
}


export default function ImageUploader({
  onUpload,
}: ImageUploaderProps) {


  const [uploading, setUploading] = useState(false);



  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {


    const file = e.target.files?.[0];


    if (!file) return;



    setUploading(true);



    try {


      const url = await uploadCloudinaryImage(file);
      onUpload(url);
      alert("Image Uploaded Successfully");
    } catch(error){


      console.log(
        "Upload Error:",
        error
      );


      alert("Something went wrong");


    }



    setUploading(false);



  };





  return (

    <div className="space-y-3">


      <label className="font-semibold">

        Upload Bike Image

      </label>




      <input


        type="file"


        accept="image/jpeg,image/png,image/webp"
        disabled={uploading}


        onChange={uploadImage}


        className="w-full rounded-lg border p-3"


      />




      {
        uploading && (

          <p className="text-orange-500">

            Uploading image...

          </p>

        )
      }



    </div>

  );

}