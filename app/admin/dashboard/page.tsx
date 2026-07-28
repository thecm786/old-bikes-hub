"use client";


import {
  useEffect,
  useMemo,
  useState,
} from "react";


import Link from "next/link";


import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";


import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Star,
  MapPin,
  Calendar,
  Gauge,
  IndianRupee,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";


import { db } from "@/firebase/firebase";


import DashboardStats from "@/components/DashboardStats";
import AdminFilters from "@/components/AdminFilters";
import RecentBikes from "@/components/admin/RecentBikes";
import DashboardAnalytics from "@/components/admin/DashboardAnalytics";
import DashboardActivity from "@/components/admin/DashboardActivity";


import type { BikeType } from "@/types/bike";





export default function AdminDashboard(){



const [bikes,setBikes] =
useState<BikeType[]>([]);



const [loading,setLoading] =
useState(true);



const [refreshing,setRefreshing] =
useState(false);



const [search,setSearch] =
useState("");



const [brand,setBrand] =
useState("All");


const [status,setStatus] =
useState("All");



const [sort,setSort] =
useState("latest");



const [selectedBikes,setSelectedBikes] =
useState<string[]>([]);





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





const data =
snapshot.docs.map((item)=>{


const bikeData =
item.data();



return {


id:item.id,


...(bikeData as Omit<
BikeType,
"id"
>),


status:
bikeData.status || "Pending"


};


});




setBikes(data);



}

catch(error){


console.log(error);


}

finally{


setLoading(false);

setRefreshing(false);


}


};







useEffect(()=>{


fetchBikes();


},[]);







// REFRESH


const handleRefresh = ()=>{


setRefreshing(true);


fetchBikes();


};








// FEATURED TOGGLE


const handleFeatured = async(

id:string,

featured:boolean

)=>{


try{


await updateDoc(

doc(
db,
"bikes",
id
),

{

featured:
!featured

}

);




setBikes((prev)=>

prev.map((bike)=>

bike.id===id

?

{

...bike,

featured:
!featured

}

:

bike

)

);



}

catch(error){


console.log(error);


}


};








// SINGLE DELETE


const handleDelete = async(

id:string

)=>{


const confirmDelete =
confirm(

"Delete this bike permanently?"

);



if(!confirmDelete)
return;





try{


await deleteDoc(

doc(

db,

"bikes",

id

)

);





setBikes((prev)=>

prev.filter(

(bike)=>

bike.id!==id

)

);



}

catch(error){


console.log(error);


}



};








// SELECT ONE BIKE


const toggleSelectBike = (

id:string

)=>{


setSelectedBikes((prev)=>


prev.includes(id)

?

prev.filter(

(item)=>item!==id

)

:

[

...prev,

id

]


);


};









// SELECT ALL


const toggleSelectAll = ()=>{


if(

selectedBikes.length === filteredBikes.length

){


setSelectedBikes([]);


}

else{


setSelectedBikes(

filteredBikes.map(

(bike)=>

bike.id!

)

);


}


};









// CLEAR SELECT


const clearSelection = ()=>{


setSelectedBikes([]);


};









// BULK DELETE


const handleBulkDelete = async()=>{


if(selectedBikes.length===0){


alert(
"Select bikes first"
);


return;


}




const confirmDelete =
confirm(

`Delete ${selectedBikes.length} bikes?`

);



if(!confirmDelete)
return;




try{


await Promise.all(

selectedBikes.map((id)=>

deleteDoc(

doc(

db,

"bikes",

id

)

)

)

);





setBikes((prev)=>

prev.filter(

(bike)=>

!selectedBikes.includes(

bike.id!

)

)

);



setSelectedBikes([]);



}

catch(error){


console.log(error);


}


};









// BULK STATUS UPDATE


const handleBulkStatus = async(

status:string

)=>{


if(selectedBikes.length===0){

alert(
"Select bikes first"
);

return;

}




try{


await Promise.all(

selectedBikes.map((id)=>

updateDoc(

doc(

db,

"bikes",

id

),

{

status:status

}

)

)

);





setBikes((prev)=>

prev.map((bike)=>

selectedBikes.includes(

bike.id!

)

?

{

...bike,

status:status

}

:

bike

)

);




setSelectedBikes([]);



}

catch(error){


console.log(error);


}


};









// BULK FEATURED / VERIFIED


const bulkUpdate = async(

field:string

)=>{


try{


await Promise.all(

selectedBikes.map((id)=>

updateDoc(

doc(

db,

"bikes",

id

),

{

[field]:true

}

)

)

);




setBikes((prev)=>

prev.map((bike)=>

selectedBikes.includes(

bike.id!

)

?

{

...bike,

[field]:true

}

:

bike

)

);



setSelectedBikes([]);



}

catch(error){


console.log(error);


}


};

// BRANDS

const brands =
useMemo(()=>{


return [

"All",

...new Set(

bikes.map(

(bike)=>

bike.brand

)

)

];


},[bikes]);








// FILTER + SORT


const filteredBikes =

useMemo(()=>{


let result = bikes.filter((bike)=>{


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

bike.location
?.toLowerCase()
.includes(text);




const brandMatch =

brand==="All"

||

bike.brand===brand;



return (

searchMatch

&&

brandMatch

);


});







if(sort==="price-low"){


result.sort(

(a,b)=>

Number(a.price)

-

Number(b.price)

);


}







if(sort==="price-high"){


result.sort(

(a,b)=>

Number(b.price)

-

Number(a.price)

);


}







if(sort==="year-new"){


result.sort(

(a,b)=>

Number(b.year)

-

Number(a.year)

);


}







if(sort==="km-low"){


result.sort(

(a,b)=>

Number(a.km)

-

Number(b.km)

);


}





return result;



},[

bikes,

search,

brand,

sort

]);











// LOADING


if(loading){


return (

<div className="
flex
min-h-[70vh]
items-center
justify-center
">


<div className="text-center">


<div className="
mx-auto
h-14
w-14
animate-spin
rounded-full
border-4
border-orange-500
border-t-transparent
"/>



<p className="
mt-5
font-bold
text-gray-700
">

Loading Admin Dashboard...

</p>



</div>


</div>

);


}








return (


<div className="space-y-8">







<section className="
overflow-hidden
rounded-3xl
bg-gradient-to-r
from-black
via-gray-900
to-orange-600
p-8
text-white
shadow-2xl
">


<div className="
flex
flex-col
gap-6
lg:flex-row
lg:items-center
lg:justify-between
">



<div>


<p className="
text-sm
text-orange-200
">

OLD BIKES HUB ADMIN

</p>




<h1 className="
mt-2
text-4xl
font-black
">

Dashboard 🚀

</h1>




<p className="
mt-3
text-gray-200
">

Manage your complete used bike marketplace.

</p>


</div>





<div className="
flex
gap-3
">


<button

onClick={handleRefresh}

className="
flex
items-center
gap-2
rounded-xl
bg-white/20
px-5
py-3
font-bold
"

>


<RefreshCw

size={18}

className={
refreshing
?
"animate-spin"
:
""
}

/>


Refresh


</button>






<Link

href="/admin/add-bike"

className="
flex
items-center
gap-2
rounded-xl
bg-orange-500
px-5
py-3
font-bold
"

>


<Plus size={18}/>

Add Bike


</Link>



</div>



</div>


</section>










<DashboardStats

bikes={bikes}

/>






<DashboardAnalytics

bikes={bikes}

/>






<DashboardActivity

bikes={bikes}

/>






<RecentBikes

bikes={bikes}

/>









{/* SELECT ALL */}



<div className="
mb-6
flex
items-center
justify-between
rounded-2xl
bg-white
p-5
shadow-lg
">


<div className="
flex
items-center
gap-3
">


<input

type="checkbox"

checked={

selectedBikes.length>0 &&

selectedBikes.length===filteredBikes.length

}

onChange={toggleSelectAll}

className="
h-5
w-5
cursor-pointer
"

/>



<p className="
font-bold
">

Select All Bikes

</p>



</div>






<p className="
font-bold
text-orange-600
">

{selectedBikes.length} Selected

</p>



</div>









{/* BULK ACTION BAR */}



{

selectedBikes.length>0 && (


<div className="
rounded-3xl
bg-black
p-6
text-white
shadow-xl
">


<div className="
flex
flex-wrap
gap-3
">



<button

onClick={()=>handleBulkStatus("Available")}

className="
rounded-xl
bg-green-500
px-5
py-3
font-bold
"

>

🟢 Available

</button>





<button

onClick={()=>handleBulkStatus("Pending")}

className="
rounded-xl
bg-yellow-400
px-5
py-3
font-bold
text-black
"

>

🟡 Pending

</button>






<button

onClick={()=>handleBulkStatus("Sold")}

className="
rounded-xl
bg-red-600
px-5
py-3
font-bold
"

>

🔴 Sold

</button>







<button

onClick={()=>bulkUpdate("featured")}

className="
rounded-xl
bg-orange-500
px-5
py-3
font-bold
"

>

⭐ Featured

</button>






<button

onClick={()=>bulkUpdate("verified")}

className="
rounded-xl
bg-blue-600
px-5
py-3
font-bold
"

>

✔ Verified

</button>







<button

onClick={handleBulkDelete}

className="
rounded-xl
bg-white
px-5
py-3
font-bold
text-red-600
"

>

🗑 Delete

</button>







<button

onClick={clearSelection}

className="
rounded-xl
bg-gray-700
px-5
py-3
font-bold
"

>

Cancel

</button>




</div>


</div>


)

}









<AdminFilters

  search={search}

  setSearch={setSearch}

  brand={brand}

  setBrand={setBrand}

  brands={brands}

  status={status}

  setStatus={setStatus}

  sort={sort}

  setSort={setSort}

/>





{
filteredBikes.length>0 && (

<div className="
grid
gap-6
sm:grid-cols-2
xl:grid-cols-3
2xl:grid-cols-4
">
{
filteredBikes.map((bike)=>(


<div

key={bike.id}

className="
group
overflow-hidden
rounded-3xl
bg-white
shadow-lg
transition
hover:-translate-y-2
hover:shadow-2xl
"

>


<div className="
relative
h-60
overflow-hidden
">





{/* SELECT CHECKBOX */}


<input

type="checkbox"

checked={
selectedBikes.includes(
bike.id!
)
}

onChange={()=>
toggleSelectBike(
bike.id!
)
}

className="
absolute
left-4
top-4
z-20
h-6
w-6
cursor-pointer
rounded
"

/>







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
group-hover:scale-110
"

/>


)

:

(


<div className="
flex
h-full
items-center
justify-center
bg-gray-100
text-7xl
">

🏍️

</div>


)

}









{/* STATUS BADGE */}


<div className="
absolute
right-4
top-4
">


{

bike.status==="Available" && (

<span className="
rounded-full
bg-green-500
px-3
py-1
text-xs
font-black
text-white
">

🟢 Available

</span>

)

}





{

bike.status==="Pending" && (

<span className="
rounded-full
bg-yellow-400
px-3
py-1
text-xs
font-black
text-black
">

🟡 Pending

</span>

)

}







{

bike.status==="Sold" && (

<span className="
rounded-full
bg-red-600
px-3
py-1
text-xs
font-black
text-white
">

🔴 Sold

</span>

)

}



</div>








{
bike.featured && (


<div className="
absolute
left-4
bottom-4
flex
items-center
gap-1
rounded-full
bg-yellow-400
px-3
py-1
text-xs
font-black
text-black
">


<Star

size={14}

fill="currentColor"

/>


Featured


</div>


)

}







{
bike.verified && (


<div className="
absolute
left-4
top-14
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
">


<ShieldCheck size={14}/>


Verified


</div>


)

}





</div>









<div className="
space-y-4
p-6
">






<div>


<h2 className="
text-xl
font-black
text-gray-900
">

{bike.name}

</h2>



<p className="
text-sm
text-gray-500
">

{bike.brand}

</p>


</div>









<div className="
space-y-2
text-sm
text-gray-600
">





<div className="
flex
items-center
gap-2
font-bold
text-orange-600
">


<IndianRupee size={16}/>


₹
{

Number(
bike.price || 0
)
.toLocaleString("en-IN")

}


</div>






<div className="
flex
items-center
gap-2
">

<Calendar size={16}/>

{bike.year}

</div>







<div className="
flex
items-center
gap-2
">

<Gauge size={16}/>

{bike.km} KM

</div>







<div className="
flex
items-center
gap-2
">

<MapPin size={16}/>

{bike.location}

</div>






</div>









<div className="
flex
gap-3
pt-3
">







<Link

href={`/bike/${bike.slug}`}

className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-black
text-white
"

>


<Eye size={18}/>


</Link>









<button

onClick={()=>handleFeatured(

bike.id!,

!!bike.featured

)}

className={`
flex
h-11
w-11
items-center
justify-center
rounded-xl
text-white

${
bike.featured
?
"bg-yellow-500"
:
"bg-gray-400"
}

`}

>


<Star size={18}/>


</button>








<Link

href={`/admin/edit-bike/${bike.id}`}

className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-blue-600
text-white
"

>


<Pencil size={18}/>


</Link>









<button

onClick={()=>handleDelete(

bike.id!

)}

className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-red-600
text-white
"

>


<Trash2 size={18}/>


</button>








</div>





</div>





</div>



))

}



</div>


)

}





{

filteredBikes.length===0 && (


<div className="
rounded-3xl
bg-white
py-20
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

Try changing filter or add new bike.

</p>




<Link

href="/admin/add-bike"

className="
mt-6
inline-flex
items-center
gap-2
rounded-xl
bg-orange-500
px-6
py-3
font-bold
text-white
"

>


<Plus size={18}/>

Add Bike


</Link>



</div>


)

}



</div>

);

}