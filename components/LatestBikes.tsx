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
  Sparkles,
} from "lucide-react";

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

import SectionTitle from "./SectionTitle";
import WishlistButton from "./WishlistButton";

import type { BikeType } from "@/types/bike";



type StoredBike =
  BikeType & {
    id:string;
  };





function BikeSkeleton(){

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
p-6
space-y-4
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








export default function LatestBikes(){



const [bikes,setBikes] =
useState<StoredBike[]>([]);


const [loading,setLoading] =
useState(true);





const fetchLatestBikes =
useCallback(async()=>{


try{


const bikesQuery =
query(

collection(
db,
"bikes"
),

orderBy(
"createdAt",
"desc"
),

limit(6)

);



const snapshot =
await getDocs(
bikesQuery
);



const bikeList = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...(doc.data() as Omit<BikeType, "id">),
}));



setBikes(
bikeList
);



}

catch(error){


console.log(
"Latest Bikes Error:",
error
);


}

finally{


setLoading(false);


}


},[]);







useEffect(()=>{


fetchLatestBikes();


},[
fetchLatestBikes
]);








return (

<section
className="
bg-white
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

title="Latest Used Bikes"

subtitle="Recently added bikes available for sale"

/>







{

loading ?

(

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

[1,2,3].map(
(i)=>(

<BikeSkeleton
key={i}
/>

)

)

}

</div>

)


:


bikes.length===0

?

null


:


(



<>

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



<div

key={
bike.id
}

className="
group
overflow-hidden
rounded-3xl
bg-white
shadow-lg
transition
duration-300
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



{

bike.image

?

(

<Image

src={

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

}

alt={
bike.name
}

fill

loading="lazy"

quality={
75
}

sizes="
(max-width:768px)100vw,
(max-width:1024px)50vw,
33vw
"

className="
object-cover
transition
duration-500
group-hover:scale-110
"

/>

)


:

(

<div
className="
flex
h-64
items-center
justify-center
bg-gray-200
text-7xl
"
>

🏍️

</div>

)

}





{/* BADGE */}


<span

className="
absolute
left-4
top-4
flex
items-center
gap-2
rounded-full
bg-black
px-3
py-2
text-xs
font-bold
text-white
shadow
"

>


<Sparkles size={14}/>


Latest


</span>





<div

className="
absolute
right-4
top-4
"

>

<WishlistButton
bikeId={
bike.id
}
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

{
bike.name
}

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
{
Number(
bike.price
)
.toLocaleString(
"en-IN"
)
}


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


{
bike.year
}


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


{
bike.km
}
KM


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


{
bike.location
}


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


{
bike.brand
}


</span>


</div>







<Link

href={
`/bike/${bike.slug}`
}

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


)

)

}



</div>







<div
className="
mt-12
text-center
"
>


<Link

href="/buy-bikes"

className="
inline-block
rounded-xl
bg-orange-500
px-8
py-4
font-bold
text-white
hover:bg-orange-600
"

>

View All Bikes

</Link>


</div>



</>

)

}



</div>


</section>

);


}