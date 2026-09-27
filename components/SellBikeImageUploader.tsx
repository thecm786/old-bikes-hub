"use client";
import SiteImage from "@/components/SiteImage";


import { uploadCloudinaryImage, validateImageFiles } from "@/lib/cloudinary";
import { useState } from "react";

import {
  Upload,
  X,
} from "lucide-react";



interface Props {

  images:string[];
  disabled?: boolean;
  onUploadingChange: (uploading: boolean) => void;

  setImages:(images:string[])=>void;

}



export default function SellBikeImageUploader({

  images,

  setImages,
  disabled = false,
  onUploadingChange,

}:Props){



  const [uploading,setUploading] =
    useState(false);





  const uploadImages = async(
    e:React.ChangeEvent<HTMLInputElement>
  )=>{


    const files =
      e.target.files;


    if (!files?.length || uploading || disabled) return;
    const input = e.currentTarget;




    setUploading(true);
    onUploadingChange(true);



    try{
      validateImageFiles(Array.from(files), images.length);


      const uploadedImages = [
        ...images
      ];



      for(
        let i=0;
        i<files.length;
        i++
      ){



        uploadedImages.push(await uploadCloudinaryImage(files[i]));



      }



      setImages(
        uploadedImages
      );



    }

    catch(error){

      console.log(error);

      alert(
        error instanceof Error ? error.message : "Image upload failed"
      );

    }

    finally{

      setUploading(false);
      onUploadingChange(false);
      input.value = "";

    }



  };







  const removeImage = (
    url:string
  )=>{


    setImages(

      images.filter(
        (img)=>img!==url
      )

    );


  };






  return (

    <div
      className="
      space-y-5
      "
    >



      <label

        className="
        flex
        cursor-pointer
        flex-col
        items-center
        justify-center
        rounded-2xl
        border-2
        border-dashed
        border-orange-400
        p-8
        text-center
        hover:bg-orange-50
        "

      >


        <Upload
          size={35}
          className="
          text-orange-500
          "
        />



        <p
          className="
          mt-3
          font-bold
          "
        >

          {
            uploading

            ?

            "Uploading Images..."

            :

            "Upload Bike Photos"

          }

        </p>



        <p
          className="
          text-sm
          text-gray-500
          "
        >

          Up to 8 JPG, PNG or WebP photos, 5 MB each

        </p>




        <input

          type="file"

          multiple

          accept="image/jpeg,image/png,image/webp"
          disabled={uploading || disabled}

          onChange={uploadImages}

          className="hidden"

        />



      </label>







      <div
        className="
        grid
        grid-cols-2
        gap-4
        md:grid-cols-4
        "
      >


        {
          images.map(
            (img,index)=>(


              <div
                key={index}
                className="
                relative
                "
              >


                <SiteImage width={320} height={256} sizes="(max-width: 768px) 50vw, 180px"

                  src={img}

                  alt="bike"

                  className="
                  h-32
                  w-full
                  rounded-xl
                  object-cover
                  "

                />



                <button

                  type="button"
                  disabled={uploading || disabled}

                  onClick={()=>
                    removeImage(img)
                  }

                  className="
                  absolute
                  right-2
                  top-2
                  rounded-full
                  bg-red-500
                  p-1
                  text-white
                  "

                >

                  <X size={16}/>

                </button>



              </div>


            )
          )
        }


      </div>



    </div>

  );


}