import Link from "next/link";


type BikeCardProps = {

  slug: string;

  name: string;

  price: string;

  year: string;

  km: string;

  location: string;

  image?: string;

};



export default function BikeCard({

  slug,

  name,

  price,

  year,

  km,

  location,

  image,

}: BikeCardProps) {


  return (

    <div className="rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-2 hover:shadow-xl">


      <div className="h-48 overflow-hidden rounded-xl bg-gray-200">


        {image ? (

          <img

            src={image}

            alt={name}

            className="h-full w-full object-cover"

          />

        ) : (

          <div className="flex h-full items-center justify-center text-5xl">

            🏍️

          </div>

        )}


      </div>




      <h3 className="mt-5 text-xl font-bold">

        {name}

      </h3>




      <p className="mt-2 text-2xl font-bold text-orange-500">

        {price}

      </p>




      <div className="mt-3 flex justify-between text-gray-600">


        <span>

          {year}

        </span>


        <span>

          {km} KM

        </span>


      </div>




      <p className="mt-3 text-gray-500">

        📍 {location}

      </p>




      <Link href={`/bike/${slug}`}>

        <button className="mt-5 w-full rounded-xl bg-black py-3 font-semibold text-white hover:bg-orange-500">

          View Details

        </button>

      </Link>



    </div>

  );

}