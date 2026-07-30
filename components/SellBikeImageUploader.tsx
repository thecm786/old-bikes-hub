"use client";

import { useState } from "react";

import {
  Upload,
  X,
} from "lucide-react";



interface Props {

  images:string[];

  setImages:(images:string[])=>void;

}



export default function SellBikeImageUploader({

  images,

  setImages,

}:Props){



  const [uploading,setUploading] =
    useState(false);





  const uploadImages = async(
    e:React.ChangeEvent<HTMLInputElement>
  )=>{


    const files =
      e.target.files;


    if(!files) return;




    setUploading(true);



    try{


      const uploadedImages = [
        ...images
      ];



      for(
        let i=0;
        i<files.length;
        i++
      ){



        const formData =
          new FormData();



        formData.append(
          "file",
          files[i]
        );



        formData.append(
          "upload_preset",
          "old-bikes-hub"
        );




        const response =
         await fetch(
         "https://api.cloudinary.com/v1_1/w4eee6vd/image/upload",
        {
         method: "POST",
         body: formData,
        }
        );




        const data =
          await response.json();



        uploadedImages.push(
          data.secure_url
        );



      }



      setImages(
        uploadedImages
      );



    }

    catch(error){

      console.log(error);

      alert(
        "Image upload failed"
      );

    }

    finally{

      setUploading(false);

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

          Select multiple images

        </p>




        <input

          type="file"

          multiple

          accept="image/*"

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


                <img

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