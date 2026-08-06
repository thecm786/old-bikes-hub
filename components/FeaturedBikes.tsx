"use client";

import {
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  Calendar,
  Gauge,
  MapPin,
  Star,
} from "lucide-react";

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

import SectionTitle from "./SectionTitle";
import WishlistButton from "./WishlistButton";

import type { BikeType } from "@/types/bike";


type StoredBike = BikeType & {
  id: string;
};




// =======================
// SKELETON
// =======================

function FeaturedSkeleton(){

  return (

    <div
      className="
      overflow-hidden
      rounded-3xl
      bg-white
      shadow-lg
      animate-pulse
      "
    >

      <div
        className="
        h-64
        bg-gray-200
        "
      />


      <div
        className="
        space-y-4
        p-6
        "
      >

        <div
          className="
          h-6
          w-3/4
          rounded
          bg-gray-200
          "
        />


        <div
          className="
          h-10
          w-1/2
          rounded
          bg-gray-200
          "
        />


        <div
          className="
          h-20
          rounded-xl
          bg-gray-200
          "
        />


        <div
          className="
          h-12
          rounded-xl
          bg-gray-200
          "
        />

      </div>

    </div>

  );

}




// =======================
// BIKE CARD
// =======================

const BikeCard = memo(
function BikeCard({
  bike,
}:{
  bike:StoredBike;
}){


const imageUrl =

bike.image

?

bike.image.includes(
"res.cloudinary.com"
)

?

bike.image.replace(
"/upload/",
"/upload/f_auto,q_auto,w_700/"
)

:

bike.image

:

"/placeholder-bike.webp";



return (

<div

className="
group
overflow-hidden
rounded-3xl
bg-white
shadow-lg
transition-all
duration-500
hover:-translate-y-2
hover:shadow-2xl
"

>


{/* IMAGE */}

<div
className="
relative
h-64
overflow-hidden
"
>


<Image

src={imageUrl}

alt={bike.name}

fill

quality={75}

sizes="
(max-width:768px) 100vw,
(max-width:1024px) 50vw,
33vw
"

className="
object-cover
transition
duration-500
group-hover:scale-110
"

/>



{/* BADGE */}

<div

className="
absolute
left-4
top-4
flex
items-center
gap-2
rounded-full
bg-orange-500
px-3
py-2
text-xs
font-bold
text-white
shadow
"

>

<Star
size={14}
fill="white"
/>

Featured

</div>




<div

className="
absolute
right-4
top-4
"

>

<WishlistButton

bikeId={bike.id}

/>

</div>



</div>





{/* CONTENT */}


<div
className="
p-6
"
>


<h3

className="
text-2xl
font-black
text-gray-900
"

>

{bike.name}

</h3>




<p

className="
mt-3
text-3xl
font-black
text-orange-500
"

>

₹
{Number(
bike.price
)
.toLocaleString(
"en-IN"
)}

</p>





<div

className="
mt-5
grid
grid-cols-2
gap-3
text-sm
"

>


<div

className="
flex
items-center
gap-2
rounded-xl
bg-gray-100
p-3
"

>

<Calendar
size={18}
className="text-orange-500"
/>

{bike.year}

</div>





<div

className="
flex
items-center
gap-2
rounded-xl
bg-gray-100
p-3
"

>

<Gauge

size={18}

className="text-orange-500"

/>

{bike.km} KM

</div>





<div

className="
col-span-2
flex
items-center
gap-2
rounded-xl
bg-gray-100
p-3
"

>


<MapPin

size={18}

className="text-orange-500"

/>


{bike.location}


</div>


</div>





<div
className="
mt-5
"
>

<span

className="
rounded-full
bg-orange-100
px-4
py-2
text-sm
font-bold
text-orange-600
"

>

{bike.brand}

</span>


</div>






<Link

href={`/bike/${bike.slug}`}

className="
mt-6
block
rounded-xl
bg-black
py-4
text-center
font-bold
text-white
transition
hover:bg-orange-500
"

>

View Details →

</Link>



</div>


</div>


);


});


BikeCard.displayName =
"FeaturedBikeCard";







// =======================
// MAIN COMPONENT
// =======================


export default function FeaturedBikes(){


const [
bikes,
setBikes
]=useState<StoredBike[]>([]);



const [
loading,
setLoading
]=useState(true);





const fetchFeatured =
useCallback(async()=>{


try{


const q = query(

collection(
db,
"bikes"
),

where(
"featured",
"==",
true
),

orderBy(
"createdAt",
"desc"
),

limit(6)

);



const snapshot =
await getDocs(q);



const data =
snapshot.docs.map(
(doc)=>({

id:doc.id,

...(doc.data() as Omit<
BikeType,
"id"
>)

})
);



setBikes(data);



}

catch(error){

console.log(
"Featured Bikes Error",
error
);

}


finally{

setLoading(false);

}



},[]);







useEffect(()=>{

fetchFeatured();

},[
fetchFeatured
]);







if(loading){


return (

<section
className="
bg-gray-100
py-20
"
>

<div
className="
mx-auto
max-w-7xl
px-6
"
>


<div
className="
grid
gap-8
md:grid-cols-2
lg:grid-cols-3
"
>

{

[1,2,3].map(
(item)=>(

<FeaturedSkeleton
key={item}
/>

)

)

}

</div>


</div>


</section>

);


}






if(
bikes.length===0
){

return null;

}






return (

<section

className="
bg-gray-100
py-20
"

>

<div

className="
mx-auto
max-w-7xl
px-6
"

>


<SectionTitle

title="🔥 Featured Bikes"

subtitle="Premium bikes handpicked for you"

/>





<div

className="
mt-12
grid
gap-8
md:grid-cols-2
lg:grid-cols-3
"

>

{

bikes.map(
(bike)=>(

<BikeCard

key={bike.id}

bike={bike}

/>

)

)

}


</div>


</div>


</section>

);


}