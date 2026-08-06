"use client";

import {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Bike,
} from "lucide-react";

import {
  collection,
  getDocs,
  limit,
  query,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";
import { bikes as defaultBikes } from "@/lib/bikes";



interface BikeData {

  id?: string | number;

  brand:string;

}




const brandLogos:Record<string,string>={


"Royal Enfield":
"/brands/royal-enfield.png",

Hero:
"/brands/hero.png",

Honda:
"/brands/honda.png",

TVS:
"/brands/tvs.png",

Bajaj:
"/brands/bajaj.png",

Yamaha:
"/brands/yamaha.png",

KTM:
"/brands/ktm.png",

Suzuki:
"/brands/suzuki.png",

Kawasaki:
"/brands/kawasaki.png",

};









const BrandLogo = memo(
function BrandLogo({

brand,
index

}:{
brand:string;
index:number;

}){


const logo =
brandLogos[brand];



return (

<div

className="
mx-auto
flex
h-32
w-32
items-center
justify-center
rounded-full
bg-white
ring-4
ring-orange-100
shadow-xl
transition-all
duration-300
group-hover:scale-105
group-hover:ring-orange-300
"

>


{

logo ?


<Image

src={logo}

alt={`${brand} logo`}

width={110}

height={110}

priority={index < 4}

className="
h-24
w-24
object-contain
p-2
select-none
"

 />


:



<Bike

size={55}

className="
text-orange-500
"

/>


}


</div>


);


});


BrandLogo.displayName =
"BrandLogo";









function Skeleton(){


return (

<div

className="
h-80
rounded-3xl
bg-white
animate-pulse
"

/>

);


}











export default function PopularBrands(){


const [
bikes,
setBikes
]=useState<BikeData[]>([]);



const [
loading,
setLoading
]=useState(true);






useEffect(()=>{


const loadBrands=async()=>{


try{


const q =
query(

collection(
db,
"bikes"
),

limit(100)

);



const snapshot =
await getDocs(q);



const firebaseBikes:BikeData[] =

snapshot.docs.map(doc=>(

{

id:doc.id,

...(doc.data() as BikeData)

}

));




const localBikes:BikeData[] =

defaultBikes.map(
bike=>(

{

...bike,

id:String(bike.id)

}

)

);





setBikes([

...localBikes,

...firebaseBikes

]);



}


catch(error){


console.log(
"Brand Error",
error
);



setBikes(
defaultBikes.map(
bike=>({

...bike,

id:String(bike.id)

})

)

);


}


finally{


setLoading(false);


}



};



loadBrands();


},[]);









const brands =

useMemo(()=>{


const count:Record<string,number>={};



bikes.forEach(
(bike)=>{


if(!bike.brand)
return;



count[bike.brand]=

(count[bike.brand] || 0)+1;



}

);



return Object.entries(count)

.sort(
(a,b)=>b[1]-a[1]
)

.slice(0,8);



},[bikes]);









if(loading){


return (

<section className="
bg-gray-50
py-20
">


<div className="
mx-auto
grid
max-w-7xl
grid-cols-2
gap-6
px-5
lg:grid-cols-4
">


{

[1,2,3,4,5,6,7,8]

.map(i=>(

<Skeleton
key={i}
/>

))

}


</div>


</section>


);


}









return (

<section

className="
bg-gray-50
py-20
"

>


<div

className="
mx-auto
max-w-7xl
px-5
"

>



<div className="
mb-14
text-center
">


<span

className="
rounded-full
bg-orange-100
px-5
py-2
text-sm
font-bold
text-orange-600
"

>

Browse By Brand

</span>



<h2

className="
mt-5
text-4xl
font-black
text-gray-900
md:text-5xl
"

>

Popular Used Bike Brands

</h2>


<p className="
mt-4
text-gray-500
">

Choose your favourite brand and explore bikes.

</p>


</div>










<div

className="
grid
gap-7
sm:grid-cols-2
lg:grid-cols-4
"

>


{


brands.map(
([brand,count],index)=>(


<Link

key={brand}

href={`/buy-bikes?brand=${encodeURIComponent(brand)}`}

className="
group
rounded-3xl
bg-white
p-8
text-center
shadow-md
transition-all
duration-300
hover:-translate-y-3
hover:shadow-2xl
"

>


<BrandLogo

brand={brand}

index={index}

/>





<h3

className="
mt-7
text-2xl
font-black
text-gray-900
group-hover:text-orange-500
"

>

{brand}

</h3>






<p className="
mt-3
text-gray-500
">

🚲

<span className="
font-black
text-orange-600
">

{count}

</span>

 Bikes Available


</p>






<div

className="
mt-7
inline-flex
items-center
gap-2
rounded-full
bg-black
px-6
py-3
font-bold
text-white
transition
group-hover:bg-orange-500
"

>

Explore Bikes

<ArrowRight size={18}/>

</div>




</Link>


)

)

}



</div>




</div>


</section>


);


}