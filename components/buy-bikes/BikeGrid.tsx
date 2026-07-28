"use client";

import BikeCard from "../BikeCard";


type BikeType = {

  id:string;

  slug:string;

  name:string;

  brand?:string;

  price:string | number;

  year:string;

  km:string;

  location:string;

  phone?:string;

  image?:string;

  featured?:boolean;

  verified?:boolean;

  status?:string;

};



interface BikeGridProps {

  bikes:BikeType[];

  loading:boolean;

}



export default function BikeGrid({

  bikes,

  loading,

}:BikeGridProps){





  if(loading){


    return (

      <div className="
      grid
      gap-6
      sm:grid-cols-2
      xl:grid-cols-3
      ">


        {
          [1,2,3,4].map((item)=>(


            <div

              key={item}

              className="
              h-[450px]
              animate-pulse
              rounded-3xl
              bg-gray-200
              "

            />


          ))
        }


      </div>

    );


  }






  if(bikes.length===0){


    return (

      <div className="
      rounded-3xl
      bg-white
      p-12
      text-center
      shadow-lg
      ">


        <div className="
        text-7xl
        ">

          🏍️

        </div>



        <h2 className="
        mt-5
        text-3xl
        font-black
        ">

          No Bikes Found

        </h2>



        <p className="
        mt-2
        text-gray-500
        ">

          Try changing filters or search.

        </p>


      </div>

    );


  }







  return (

    <div className="
    grid
    gap-6
    sm:grid-cols-2
    xl:grid-cols-3
    ">


      {
        bikes.map((bike)=>(


          <BikeCard

            key={bike.id}

            id={bike.id}

            slug={bike.slug}

            name={bike.name}

            brand={bike.brand}

            price={bike.price}

            year={bike.year}

            km={bike.km}

            location={bike.location}

            phone={bike.phone}

            image={bike.image}

            featured={bike.featured}

            verified={bike.verified}

            status={bike.status}


          />


        ))
      }


    </div>

  );


}