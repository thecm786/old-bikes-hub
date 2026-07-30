"use client";


import {
  useEffect,
  useMemo,
  useState,
} from "react";


import Link from "next/link";


import {
  useSearchParams,
} from "next/navigation";


import {
  collection,
  getDocs,
} from "firebase/firestore";


import {
  Search,
  SlidersHorizontal,
  Bike,
  ShieldCheck,
  X,
  MapPin,
  Calendar,
  Gauge,
} from "lucide-react";


import {
  db,
} from "@/firebase/firebase";


import {
  bikes as defaultBikes,
} from "@/lib/bikes";


import type {
  BikeType,
} from "@/types/bike";







export default function BuyBikesPage(){



const searchParams =
useSearchParams();





const initialSearch =
searchParams.get("search") || "";






const [bikes,setBikes] =
useState<BikeType[]>([]);



const [loading,setLoading] =
useState(true);




const [search,setSearch] =
useState(initialSearch);





const [brand,setBrand] =
useState("All");



const [price,setPrice] =
useState("All");



const [year,setYear] =
useState("All");



const [filterOpen,setFilterOpen] =
useState(false);








// FETCH BIKES


const fetchBikes = async()=>{


try{


const snapshot =
await getDocs(

collection(
db,
"bikes"
)

);




const firebaseBikes =

snapshot.docs.map((item)=>{


return {

id:item.id,

...(item.data() as Omit<
BikeType,
"id"
>)

};


});






const combined = [

...defaultBikes,

...firebaseBikes

];





setBikes(combined);



}

catch(error){


console.log(error);


setBikes(defaultBikes);


}


finally{


setLoading(false);


}


};










useEffect(()=>{


fetchBikes();


},[]);











// BRANDS


const brands =

useMemo(()=>{


return [

"All",

...new Set(

bikes.map(

(item)=>

item.brand

)

)

];


},[bikes]);











// FILTER LOGIC


const filteredBikes =

useMemo(()=>{


let result =


bikes.filter((bike)=>{



const text =

search.toLowerCase();






const searchMatch =



bike.name
?.toLowerCase()
.includes(text)



||



bike.brand
?.toLowerCase()
.includes(text)



||



false;








const brandMatch =



brand==="All"



||



bike.brand===brand;










let priceMatch = true;




if(price==="under1"){


priceMatch =

Number(bike.price)

<

100000;


}




if(price==="1to2"){


priceMatch =


Number(bike.price)>=100000

&&

Number(bike.price)<=200000;


}




if(price==="above2"){


priceMatch =


Number(bike.price)>200000;


}









let yearMatch = true;




if(year!=="All"){


yearMatch =

Number(bike.year)>=Number(year);


}







return (

searchMatch

&&

brandMatch

&&

priceMatch

&&

yearMatch

);


});





return result;



},[

bikes,

search,

brand,

price,

year

]);











// LOADING SCREEN


if(loading){


return (

<div

className="
flex
min-h-screen
items-center
justify-center
"

>


<div

className="
text-center
"

>


<div

className="
mx-auto
h-14
w-14
animate-spin
rounded-full
border-4
border-orange-500
border-t-transparent
"

/>



<p

className="
mt-4
font-bold
"

>

Loading Bikes...

</p>



</div>


</div>

);


}

return (

<main

className="
min-h-screen
bg-gray-100
px-4
py-8
"

>





{/* PREMIUM HEADER */}



{/* PREMIUM HEADER */}

<section

className="
mx-auto
max-w-7xl
rounded-3xl
bg-gradient-to-r
from-black
via-gray-900
to-orange-500
px-6
py-6
text-white
shadow-lg
md:px-8
"

>

<div

className="
flex
flex-col
gap-5
md:flex-row
md:items-center
md:justify-between
"

>


<div>

<div

className="
flex
items-center
gap-2
text-sm
font-bold
text-orange-400
"

>

<ShieldCheck size={18}/>

Verified Used Bikes

</div>


<h1

className="
mt-2
text-3xl
font-black
md:text-4xl
"

>

Explore Used Bikes

</h1>


<p

className="
mt-1
text-sm
text-gray-300
"

>

{filteredBikes.length} bikes available

</p>

</div>



<div

className="
w-full
md:max-w-sm
"

>

<div

className="
flex
items-center
rounded-xl
bg-white
p-2
"

>

<Search

size={20}

className="
ml-2
text-gray-400
"

/>


<input

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

placeholder="Search bikes..."

className="
w-full
px-3
py-2
text-sm
text-black
outline-none
"

/>

</div>

</div>


</div>

</section>









{/* FILTER BUTTON MOBILE */}



<button


onClick={()=>setFilterOpen(true)}


className="
mt-6
flex
items-center
gap-2
rounded-xl
bg-black
px-5
py-3
font-bold
text-white
lg:hidden
"


>


<SlidersHorizontal size={18}/>


Filters


</button>









<div

className="
mx-auto
mt-6
flex
max-w-7xl
flex-col
gap-6
lg:flex-row
"

>











{/* FILTER SIDEBAR */}



<aside


className={

`

rounded-3xl
bg-white
p-6
shadow-lg

lg:block
lg:w-72

${

filterOpen

?

"fixed left-5 right-5 top-20 z-50 max-h-[80vh] overflow-y-auto"

:

"hidden lg:block"

}

`

}



>


<div

className="
flex
items-center
justify-between
"

>


<h2

className="
text-2xl
font-black
"

>

Filters


</h2>




<button

onClick={()=>setFilterOpen(false)}

className="
lg:hidden
"

>

<X size={22}/>


</button>



</div>









{/* BRAND FILTER */}



<div

className="
mt-6
"

>


<label

className="
font-bold
"

>

Brand


</label>



<select


value={brand}


onChange={(e)=>
setBrand(e.target.value)
}


className="
mt-2
w-full
rounded-xl
border
p-3
"


>


{

brands.map((item)=>(


<option

key={item}

value={item}

>

{item}

</option>


))

}



</select>


</div>









{/* PRICE FILTER */}



<div

className="
mt-5
"

>


<label

className="
font-bold
"

>

Price


</label>



<select


value={price}


onChange={(e)=>
setPrice(e.target.value)
}


className="
mt-2
w-full
rounded-xl
border
p-3
"


>


<option value="All">

All Price

</option>


<option value="under1">

Below ₹1 Lakh

</option>


<option value="1to2">

₹1 - ₹2 Lakh

</option>


<option value="above2">

Above ₹2 Lakh

</option>



</select>



</div>









{/* YEAR FILTER */}



<div

className="
mt-5
"

>


<label

className="
font-bold
"

>

Year


</label>




<select


value={year}


onChange={(e)=>
setYear(e.target.value)
}


className="
mt-2
w-full
rounded-xl
border
p-3
"


>


<option value="All">

All Years

</option>


<option value="2024">

2024+

</option>


<option value="2022">

2022+

</option>


<option value="2020">

2020+

</option>



</select>



</div>









<button


onClick={()=>{


setBrand("All");

setPrice("All");

setYear("All");

setSearch("");


}}


className="
mt-8
w-full
rounded-xl
bg-orange-500
py-3
font-black
text-white
"


>


Reset Filters


</button>





</aside>

{/* PREMIUM BIKE GRID */}


<section

className="
grid
w-full
gap-6
sm:grid-cols-2
xl:grid-cols-3
"

>


{

filteredBikes.map((bike)=>(


<div

key={bike.id}

className="
group
overflow-hidden
rounded-3xl
bg-white
shadow-md
transition-all
duration-300
hover:-translate-y-1
hover:shadow-2xl
"

>


{/* IMAGE AREA */}


<div

className="
relative
h-52
overflow-hidden
bg-gray-100
"

>


{

bike.image ? (


<img

src={bike.image}

alt={bike.name}

className="
h-full
w-full
object-cover
transition
duration-500
group-hover:scale-105
"

/>


):

(


<div

className="
flex
h-full
items-center
justify-center
text-6xl
"

>

🏍️

</div>


)


}






{/* VERIFIED BADGE */}


{

bike.verified && (


<div

className="
absolute
left-4
top-4
flex
items-center
gap-1
rounded-full
bg-green-600
px-3
py-1
text-xs
font-bold
text-white
shadow
"

>


<ShieldCheck size={14}/>


Verified


</div>


)

}






{/* PRICE BADGE */}



<div

className="
absolute
bottom-4
right-4
rounded-xl
bg-white
px-3
py-2
text-sm
font-black
text-orange-600
shadow-lg
"

>

₹

{

Number(bike.price || 0)

.toLocaleString("en-IN")

}


</div>






</div>










{/* CONTENT */}



<div

className="
p-5
"

>


<h2

className="
line-clamp-1
text-xl
font-black
text-gray-900
"

>

{bike.name}


</h2>




<p

className="
mt-1
text-sm
font-semibold
text-gray-500
"

>

{bike.brand}


</p>








<div

className="
mt-4
grid
grid-cols-2
gap-3
"

>


<div

className="
rounded-xl
bg-gray-100
p-3
text-center
"

>


<p className="text-xs text-gray-500">

Year

</p>


<p className="font-bold">

{bike.year}

</p>


</div>







<div

className="
rounded-xl
bg-gray-100
p-3
text-center
"

>


<p className="text-xs text-gray-500">

KM

</p>


<p className="font-bold">

{bike.km}

</p>


</div>



</div>









<div

className="
mt-4
flex
items-center
gap-2
text-sm
font-semibold
text-gray-600
"

>

<MapPin size={16}/>


{bike.location}


</div>









<Link

href={`/bike/${bike.slug}`}

className="
mt-5
block
rounded-xl
bg-black
py-3
text-center
font-black
text-white
transition
hover:bg-orange-500
"

>


View Details


</Link>





</div>





</div>



))


}


</section>









</div>









{/* EMPTY STATE */}



{

filteredBikes.length===0 && (



<div

className="
mx-auto
mt-10
max-w-3xl
rounded-3xl
bg-white
p-10
text-center
shadow-xl
"

>


<div

className="
text-6xl
"

>

🏍️

</div>



<h2

className="
mt-4
text-3xl
font-black
"

>


No Bikes Found


</h2>




<p

className="
mt-2
text-gray-500
"

>


Try changing your filters.


</p>



</div>



)

}






</main>


);


}