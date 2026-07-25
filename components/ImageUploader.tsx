"use client";

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


      const formData = new FormData();



      formData.append(
        "file",
        file
      );



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



      console.log(
        "Cloudinary Response:",
        data
      );



      if(data.secure_url){


        onUpload(data.secure_url);


        alert("Image Uploaded Successfully");


      }
      else {


        alert("Image Upload Failed");


        console.log(
          "Cloudinary Error:",
          data
        );


      }



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


        accept="image/*"


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