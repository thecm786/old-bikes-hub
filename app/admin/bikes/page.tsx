"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {

collection,
deleteDoc,
doc,
updateDoc,
query,
where,
onSnapshot,

} from "firebase/firestore";

import {

Plus,
Eye,
Pencil,
Trash2,
Star,
Phone,
MessageCircle,
MapPin,
Calendar,
Gauge,
IndianRupee,
RefreshCw,
ShieldCheck,
AlertTriangle,

} from "lucide-react";

import toast from "react-hot-toast";

import { db } from "@/firebase/firebase";

import type { BikeType } from "@/types/bike";

import AdminFilters from "@/components/AdminFilters";

export default function AllBikesPage() {

const [bikes,setBikes]=
useState<BikeType[]>([]);

const [loading,setLoading]=
useState(true);

const [refreshing,setRefreshing]=
useState(false);

const [search,setSearch]=
useState("");

const [registrationSearch,setRegistrationSearch]=
useState("");

const [brand,setBrand]=
useState("All");

const [status,setStatus]=
useState("All");

const [sort,setSort]=
useState("latest");

const [selectedBikes,setSelectedBikes]=
useState<string[]>([]);

const [currentPage,setCurrentPage]=
useState(1);

const bikesPerPage=12;

const [totalPages,setTotalPages]=
useState(1);

const [deleteModal,setDeleteModal]=
useState(false);

const [deleteBikeId,setDeleteBikeId]=
useState<string|null>(null);

const [deleteLoading,setDeleteLoading]=
useState(false);

const fetchBikes=()=>{

return onSnapshot(

collection(db,"bikes"),

(snapshot)=>{

const data=snapshot.docs.map((item)=>{

const bike=item.data();

return{

id:item.id,

...(bike as Omit<BikeType,"id">),

status:
bike.status || "Pending",

};

});

data.sort((a,b)=>{

const aTime=

a.createdAt?.seconds ??

Number(a.createdAt) ??

0;

const bTime=

b.createdAt?.seconds ??

Number(b.createdAt) ??

0;

return bTime-aTime;

});

setBikes(data);

setLoading(false);

setRefreshing(false);

},

(error)=>{

console.log(error);

setLoading(false);

setRefreshing(false);

}

);

};

useEffect(()=>{

const unsubscribe=fetchBikes();

return()=>unsubscribe();

},[]);

const handleRefresh=()=>{

setRefreshing(true);

fetchBikes();

};

// ===============================
// BRANDS
// ===============================

const brands = useMemo(() => {

  return [

    "All",

    ...new Set(

      bikes.map((bike) => bike.brand)

    ),

  ];

}, [bikes]);



// ===============================
// FILTER + SORT
// ===============================

const filteredBikes = useMemo(() => {

  let result = bikes.filter((bike) => {

    const text = search.toLowerCase();

    const searchMatch =

      bike.name?.toLowerCase().includes(text) ||

      bike.brand?.toLowerCase().includes(text) ||

      bike.location?.toLowerCase().includes(text);

    const registrationMatch =

      registrationSearch === "" ||

      bike.registrationNumber
        ?.toLowerCase()
        .includes(
          registrationSearch.toLowerCase()
        );

    const brandMatch =

      brand === "All" ||

      bike.brand === brand;

    const statusMatch =

      status === "All" ||

      bike.status === status;

    return (

      searchMatch &&

      registrationMatch &&

      brandMatch &&

      statusMatch

    );

  });

  if (sort === "price-low") {

    result.sort(

      (a, b) =>

        Number(a.price) -

        Number(b.price)

    );

  }

  if (sort === "price-high") {

    result.sort(

      (a, b) =>

        Number(b.price) -

        Number(a.price)

    );

  }

  if (sort === "year-new") {

    result.sort(

      (a, b) =>

        Number(b.year) -

        Number(a.year)

    );

  }

  if (sort === "km-low") {

    result.sort(

      (a, b) =>

        Number(a.km) -

        Number(b.km)

    );

  }

  return result;

}, [

  bikes,

  search,

  registrationSearch,

  brand,

  status,

  sort,

]);



// ===============================
// PAGINATION
// ===============================

const paginatedBikes = useMemo(() => {

  const start =

    (currentPage - 1) *

    bikesPerPage;

  return filteredBikes.slice(

    start,

    start + bikesPerPage

  );

}, [

  filteredBikes,

  currentPage,

]);

useEffect(() => {

  const pages = Math.ceil(

    filteredBikes.length /

    bikesPerPage

  );

  setTotalPages(

    pages || 1

  );

  setCurrentPage(1);

}, [

  filteredBikes,

]);



// ===============================
// SELECT BIKE
// ===============================

const toggleSelectBike = (id:string)=>{

setSelectedBikes((prev)=>

prev.includes(id)

?

prev.filter((item)=>item!==id)

:

[

...prev,

id

]

);

};



// ===============================
// SELECT ALL
// ===============================

const toggleSelectAll = ()=>{

if(

selectedBikes.length===filteredBikes.length

){

setSelectedBikes([]);

}

else{

setSelectedBikes(

filteredBikes.map(

(bike)=>bike.id!

)

);

}

};



// ===============================
// CLEAR SELECTION
// ===============================

const clearSelection=()=>{

setSelectedBikes([]);

};

// ===============================
// FEATURED TOGGLE
// ===============================

const handleFeatured = async (

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

featured:!featured,

}

);

setBikes((prev)=>

prev.map((bike)=>

bike.id===id

?

{

...bike,

featured:!featured,

}

:

bike

)

);

toast.success("Featured Updated");

}

catch(error){

console.log(error);

toast.error("Update Failed");

}

};



// ===============================
// DELETE MODAL
// ===============================

const handleDelete=(id:string)=>{

setDeleteBikeId(id);

setDeleteModal(true);

};

const cancelDelete=()=>{

setDeleteBikeId(null);

setDeleteModal(false);

};

const confirmDelete=async()=>{

if(!deleteBikeId)return;

const toastId=toast.loading(

"Deleting Bike..."

);

try{

setDeleteLoading(true);

await deleteDoc(

doc(

db,

"bikes",

deleteBikeId

)

);

setBikes((prev)=>

prev.filter(

(bike)=>

bike.id!==deleteBikeId

)

);

toast.success(

"Bike Deleted",

{

id:toastId,

}

);

cancelDelete();

}

catch(error){

console.log(error);

toast.error(

"Delete Failed",

{

id:toastId,

}

);

}

finally{

setDeleteLoading(false);

}

};



// ===============================
// BULK DELETE
// ===============================

const handleBulkDelete=async()=>{

if(selectedBikes.length===0){

toast.error(

"Select Bikes First"

);

return;

}

const ok=confirm(

`Delete ${selectedBikes.length} Bikes ?`

);

if(!ok)return;

const toastId=toast.loading(

"Deleting Bikes..."

);

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

toast.success(

"Bikes Deleted",

{

id:toastId,

}

);

}

catch(error){

console.log(error);

toast.error(

"Delete Failed",

{

id:toastId,

}

);

}

};



// ===============================
// BULK STATUS
// ===============================

const handleBulkStatus=async(

newStatus:string

)=>{

if(selectedBikes.length===0){

toast.error(

"Select Bikes"

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

status:newStatus,

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

status:newStatus,

}

:

bike

)

);

setSelectedBikes([]);

toast.success(

"Status Updated"

);

}

catch(error){

console.log(error);

toast.error(

"Update Failed"

);

}

};



// ===============================
// LOADING
// ===============================

if(loading){

return(

<div

className="

flex

min-h-[70vh]

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

mt-5

font-bold

"

>

Loading Bikes...

</p>

</div>

</div>

);

}



// ===============================
// RETURN START
// ===============================

return(

<div

className="

space-y-8

"

>

{/* ===============================
HEADER
=============================== */}

<div className="
flex
flex-col
gap-4
md:flex-row
md:items-center
md:justify-between
">


<div>

<h1 className="
text-3xl
font-bold
">
All Bikes
</h1>


<p className="
text-gray-500
">
Manage all listed bikes from here
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
border
px-4
py-2
hover:bg-gray-50
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
py-2
font-semibold
text-white
hover:bg-orange-600
"

>

<Plus size={18}/>

Add Bike

</Link>


</div>


</div>





{/* ===============================
FILTERS
=============================== */}


<AdminFilters

search={search}

setSearch={setSearch}

registrationSearch={registrationSearch}

setRegistrationSearch={setRegistrationSearch}

brand={brand}

setBrand={setBrand}

brands={brands}

status={status}

setStatus={setStatus}

sort={sort}

setSort={setSort}

/>





{/* ===============================
BULK ACTION BAR
=============================== */}


{
selectedBikes.length > 0 && (

<div className="
flex
flex-wrap
items-center
justify-between
gap-4
rounded-xl
bg-orange-50
p-4
">


<div className="
font-semibold
">

{selectedBikes.length} Bikes Selected

</div>



<div className="
flex
gap-3
">


<button

onClick={()=>handleBulkStatus("Available")}

className="
rounded-lg
bg-green-600
px-4
py-2
text-white
"

>

Available

</button>



<button

onClick={()=>handleBulkStatus("Sold")}

className="
rounded-lg
bg-yellow-500
px-4
py-2
text-white
"

>

Sold

</button>



<button

onClick={handleBulkDelete}

className="
flex
items-center
gap-2
rounded-lg
bg-red-600
px-4
py-2
text-white
"

>

<Trash2 size={16}/>

Delete

</button>



<button

onClick={clearSelection}

className="
rounded-lg
border
px-4
py-2
"

>

Clear

</button>



</div>


</div>

)

}





{/* ===============================
SELECT ALL
=============================== */}


<div className="
flex
items-center
gap-3
">


<input

type="checkbox"

checked={

selectedBikes.length===filteredBikes.length &&

filteredBikes.length>0

}

onChange={toggleSelectAll}

className="
h-5
w-5
"

/>


<span className="
text-sm
text-gray-600
">

Select All

</span>


<span className="
ml-auto
text-sm
text-gray-500
">

Total : {filteredBikes.length}

</span>


</div>





{/* ===============================
BIKE GRID
=============================== */}


<div className="
grid
gap-6
sm:grid-cols-2
lg:grid-cols-3
xl:grid-cols-4
">


{
paginatedBikes.map((bike)=>(


<div

key={bike.id}

className="
group
overflow-hidden
rounded-2xl
border
bg-white
shadow-sm
transition
hover:shadow-xl
"

>


{/* IMAGE */}

<div className="
relative
h-52
overflow-hidden
bg-gray-100
">


<input

type="checkbox"

checked={selectedBikes.includes(bike.id!)}

onChange={()=>toggleSelectBike(bike.id!)}

className="
absolute
left-3
top-3
z-10
h-5
w-5
"

/>



<img

src={

bike.image ||

"/bike-placeholder.png"

}

alt={bike.name}

className="
h-full
w-full
object-cover
transition
group-hover:scale-110
"

/>



{
bike.featured &&

<div className="
absolute
right-3
top-3
rounded-full
bg-yellow-400
p-2
">

<Star

size={16}

fill="white"

/>

</div>

}


</div>





{/* CONTENT */}


<div className="
p-5
space-y-3
">


<h3 className="
text-lg
font-bold
">

{bike.name}

</h3>



<div className="
flex
items-center
gap-2
text-sm
text-gray-500
">

<MapPin size={15}/>

{bike.location}

</div>



<div className="
flex
items-center
gap-2
text-sm
text-gray-500
">

<Calendar size={15}/>

{bike.year}

</div>



{/* Registration Number */}

{
bike.registrationNumber && (

<div className="
flex
items-center
gap-2
text-sm
text-gray-500
">

<ShieldCheck size={15}/>

<span>
Reg: {bike.registrationNumber}
</span>

</div>

)

}



<div className="
flex
items-center
gap-2
text-sm
text-gray-500
">

<Gauge size={15}/>

{bike.km} KM

</div>



<div className="
flex
items-center
gap-1
text-xl
font-bold
text-orange-600
">

<IndianRupee size={18}/>

{bike.price}

</div>





{/* STATUS */}

<div>

<span className="
rounded-full
bg-green-100
px-3
py-1
text-xs
font-semibold
text-green-700
">

{bike.status}

</span>

</div>





{/* ACTIONS */}


<div className="
flex
gap-2
pt-3
">


<Link

href={`/bike/${bike.slug}`}

target="_blank"

className="
flex-1
rounded-lg
bg-black
py-2
text-center
text-white
"

>

<Eye

size={16}

className="inline"

/>

</Link>



<Link

href={`/admin/edit-bike/${bike.id}`}

className="
flex-1
rounded-lg
border
py-2
text-center
"

>

<Pencil

size={16}

className="inline"

/>

</Link>



<button

onClick={()=>handleFeatured(

bike.id!,

!!bike.featured

)}

className="
rounded-lg
border
px-3
"

>

<Star size={16}/>

</button>



<button

onClick={()=>handleDelete(bike.id!)}

className="
rounded-lg
bg-red-500
px-3
text-white
"

>

<Trash2 size={16}/>

</button>



</div>



</div>



</div>


))

}


</div>

{/* ===============================
EMPTY STATE
=============================== */}


{
paginatedBikes.length === 0 && (

<div className="
rounded-2xl
border
bg-white
p-10
text-center
">


<AlertTriangle

size={45}

className="
mx-auto
text-orange-500
"

/>


<h3 className="
mt-4
text-xl
font-bold
">

No Bikes Found

</h3>


<p className="
mt-2
text-gray-500
">

Try changing filters or add a new bike.

</p>



<Link

href="/admin/add-bike"

className="
mt-5
inline-flex
items-center
gap-2
rounded-xl
bg-orange-500
px-5
py-3
font-semibold
text-white
"

>

<Plus size={18}/>

Add New Bike

</Link>


</div>

)

}





{/* ===============================
PAGINATION
=============================== */}


{
totalPages > 1 && (

<div className="
flex
items-center
justify-center
gap-3
pt-5
">


<button

disabled={currentPage===1}

onClick={()=>setCurrentPage(

prev=>prev-1

)}

className="
rounded-lg
border
px-4
py-2
disabled:opacity-40
"

>

Previous

</button>





<div className="
flex
gap-2
">

{

Array.from(

{

length:totalPages

}

).map((_,index)=>(


<button

key={index}

onClick={()=>setCurrentPage(index+1)}

className={

`
rounded-lg
px-4
py-2
border

${

currentPage===index+1

?

"bg-orange-500 text-white"

:

""

}

`

}

>

{index+1}

</button>


))

}

</div>





<button

disabled={currentPage===totalPages}

onClick={()=>setCurrentPage(

prev=>prev+1

)}

className="
rounded-lg
border
px-4
py-2
disabled:opacity-40
"

>

Next

</button>



</div>

)

}






{/* ===============================
DELETE MODAL
=============================== */}


{

deleteModal && (

<div className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/50
">


<div className="
w-[90%]
max-w-md
rounded-2xl
bg-white
p-6
shadow-xl
">


<div className="
flex
items-center
gap-3
"

>

<AlertTriangle

className="
text-red-500
"

/>


<h2 className="
text-xl
font-bold
">

Delete Bike?

</h2>


</div>





<p className="
mt-4
text-gray-600
">

Are you sure you want to delete this bike?

This action cannot be undone.

</p>





<div className="
mt-6
flex
justify-end
gap-3
">


<button

onClick={cancelDelete}

disabled={deleteLoading}

className="
rounded-lg
border
px-5
py-2
"

>

Cancel

</button>





<button

onClick={confirmDelete}

disabled={deleteLoading}

className="
rounded-lg
bg-red-600
px-5
py-2
text-white
"

>


{

deleteLoading

?

"Deleting..."

:

"Delete"

}


</button>



</div>


</div>


</div>

)

}






</div>

);

}

