"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  Calendar,
  Gauge,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Star,
  ArrowLeft,
} from "lucide-react";

import Link from "next/link";

import { db } from "@/firebase/firebase";



interface BikeType {

  id:string;

  name:string;

  brand:string;

  slug:string;

  price:number | string;

  year:string;

  km:string;

  location:string;

  owner?:string;

  phone?:string;

  image?:string;

  images?:string[];

  description?:string;

  featured?:boolean;

  verified?:boolean;

  status?:string;

}





export default function BikeDetailsPage(){


  const params = useParams();


  const slug =
    params.slug as string;



  const [bike,setBike] =
    useState<BikeType | null>(null);



  const [loading,setLoading] =
    useState(true);





  useEffect(()=>{


    const fetchBike = async()=>{


      try{


        const q = query(

          collection(
            db,
            "bikes"
          ),

          where(
            "slug",
            "==",
            slug
          )

        );



        const snapshot =
          await getDocs(q);




        if(!snapshot.empty){


          const docSnap =
            snapshot.docs[0];



          setBike({

            id:docSnap.id,

            ...(docSnap.data() as Omit<BikeType,"id">)

          });


        }
        else{


          setBike(null);


        }



      }

      catch(error){


        console.log(
          "Bike Fetch Error",
          error
        );


      }

      finally{


        setLoading(false);


      }



    };



    if(slug){

      fetchBike();

    }



  },[slug]);







  if(loading){


    return (

      <div className="
      flex
      min-h-screen
      items-center
      justify-center
      ">

        <div className="
        h-14
        w-14
        animate-spin
        rounded-full
        border-4
        border-orange-500
        border-t-transparent
        "/>

      </div>

    );


  }






  if(!bike){


    return (

      <div className="
      flex
      min-h-screen
      flex-col
      items-center
      justify-center
      ">


        <h1 className="
        text-4xl
        font-black
        ">

          Bike Not Found

        </h1>



        <Link

          href="/buy-bikes"

          className="
          mt-5
          rounded-xl
          bg-orange-500
          px-6
          py-3
          font-bold
          text-white
          "

        >

          Back To Bikes

        </Link>


      </div>

    );


  }







  const images =

    bike.images &&
    bike.images.length > 0

    ?

    bike.images

    :

    bike.image

    ?

    [bike.image]

    :

    [];







  const whatsapp =

    bike.phone

    ?

    `https://wa.me/91${bike.phone.replace(/\D/g,"")}`

    :

    "#";





  const call =

    bike.phone

    ?

    `tel:${bike.phone}`

    :

    "#";









  return (

    <main className="
    min-h-screen
    bg-gray-100
    py-10
    ">


      <div className="
      mx-auto
      max-w-7xl
      space-y-8
      px-5
      ">




        <Link

          href="/buy-bikes"

          className="
          inline-flex
          items-center
          gap-2
          font-bold
          "

        >

          <ArrowLeft size={18}/>

          Back

        </Link>








        <div className="
        grid
        gap-8
        lg:grid-cols-2
        ">






          {/* IMAGES */}


          <div className="
          space-y-5
          ">


            {
              images.length > 0 ?


              images.map((img,index)=>(


                <img

                  key={index}

                  src={img}

                  alt={bike.name}

                  className="
                  h-96
                  w-full
                  rounded-3xl
                  object-cover
                  shadow-xl
                  "

                />


              ))


              :

              <div className="
              flex
              h-96
              items-center
              justify-center
              rounded-3xl
              bg-white
              text-8xl
              ">

                🏍️

              </div>

            }


          </div>









          {/* DETAILS */}


          <div className="
          rounded-3xl
          bg-white
          p-8
          shadow-xl
          ">



            <div className="
            flex
            flex-wrap
            gap-3
            ">


              <div className="
              rounded-full
              bg-orange-500
              px-4
              py-2
              font-bold
              text-white
              ">

                {bike.brand}

              </div>



              {
                bike.status &&

                <div className={`
                rounded-full
                px-4
                py-2
                font-bold

                ${
                  bike.status==="Available"
                  ?
                  "bg-green-500 text-white"
                  :
                  bike.status==="Pending"
                  ?
                  "bg-yellow-400"
                  :
                  "bg-red-600 text-white"
                }

                `}>

                  {bike.status}

                </div>

              }


            </div>






            <h1 className="
            mt-5
            text-4xl
            font-black
            ">

              {bike.name}

            </h1>






            <p className="
            mt-4
            text-4xl
            font-black
            text-orange-500
            ">

              ₹
              {Number(bike.price)
              .toLocaleString("en-IN")}

            </p>







            <div className="
            mt-6
            space-y-4
            ">


              <p className="flex items-center gap-3">

                <Calendar/>

                {bike.year}

              </p>



              <p className="flex items-center gap-3">

                <Gauge/>

                {bike.km} KM

              </p>



              <p className="flex items-center gap-3">

                <MapPin/>

                {bike.location}

              </p>


            </div>









            <div className="
            mt-6
            flex
            gap-3
            ">


              {
                bike.featured &&

                <div className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-yellow-400
                px-4
                py-2
                font-bold
                ">

                  <Star size={18}/>

                  Featured

                </div>

              }






              {
                bike.verified &&

                <div className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-green-100
                px-4
                py-2
                font-bold
                text-green-700
                ">

                  <ShieldCheck/>

                  Verified

                </div>

              }


            </div>








            <p className="
            mt-8
            leading-7
            text-gray-600
            ">

              {bike.description}

            </p>








            <div className="
            mt-8
            grid
            grid-cols-2
            gap-4
            ">



              <a

                href={whatsapp}

                target="_blank"

                rel="noopener noreferrer"

                className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-green-500
                py-4
                font-bold
                text-white
                "

              >

                <MessageCircle/>

                WhatsApp

              </a>






              <a

                href={call}

                className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                py-4
                font-bold
                text-white
                "

              >

                <Phone/>

                Call

              </a>


            </div>





          </div>





        </div>





      </div>


    </main>

  );


}