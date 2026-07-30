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
  updateDoc,
  query,
  where,
  getDocs,
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
  X,
} from "lucide-react";


import { db } from "@/firebase/firebase";
import toast from "react-hot-toast";
import DashboardStats from "@/components/DashboardStats";
import AdminFilters from "@/components/AdminFilters";
import RecentBikes from "@/components/admin/RecentBikes";
import DashboardAnalytics from "@/components/admin/DashboardAnalytics";
import DashboardActivity from "@/components/admin/DashboardActivity";
import RecentSellRequests from "@/components/admin/RecentSellRequests";


import type { BikeType } from "@/types/bike";





export default function AdminDashboard(){



const [bikes,setBikes] =
useState<BikeType[]>([]);



const [loading,setLoading] =
useState(true);


const [initialLoad,setInitialLoad] =
useState(true);

const [pendingRequests,setPendingRequests] =
useState(0);


const [approvedBikes,setApprovedBikes] =
useState(0);



const [refreshing,setRefreshing] =
useState(false);



const [search,setSearch] =
useState("");

const [registrationSearch,setRegistrationSearch] =
useState("");

const [brand,setBrand] =
useState("All");

const [status,setStatus] =
useState("All");

const [sort,setSort] =
useState("latest");



const [selectedBikes,setSelectedBikes] =
useState<string[]>([]);

const [currentPage, setCurrentPage] = useState(1);

const bikesPerPage = 12;

const [totalPages, setTotalPages] = useState(1);

const [deleteModal, setDeleteModal] =
useState(false);


const [deleteBikeId, setDeleteBikeId] =
useState<string | null>(null);


const [deleteLoading, setDeleteLoading] =
useState(false);


// FETCH BIKES


const fetchBikes = () => {

  const unsubscribe = onSnapshot(
    collection(db, "bikes"),
    (snapshot) => {


      const data =
        snapshot.docs.map((item) => {

          const bikeData = item.data();


          return {

            id: item.id,

            ...(bikeData as Omit<
              BikeType,
              "id"
            >),


            status:
              bikeData.status || "Pending",

          };

        });

        data.sort((a, b) => {

  const aTime =
    a.createdAt?.seconds ??
    Number(a.createdAt) ??
    0;

  const bTime =
    b.createdAt?.seconds ??
    Number(b.createdAt) ??
    0;

  return bTime - aTime;

});


      data.sort((a, b) => {

  const aTime = a.createdAt?.seconds || 0;

  const bTime = b.createdAt?.seconds || 0;

  return bTime - aTime;

});

      setBikes(data);


      setLoading(false);

      setInitialLoad(false);

      setRefreshing(false);


    },


    (error)=>{

      console.log(
        "Realtime error:",
        error
      );


      setLoading(false);

      setRefreshing(false);

    }

  );


  return unsubscribe;

};







useEffect(() => {

 let mounted = true;

 const unsubscribeBikes = fetchBikes();
 const unsubscribeSell = fetchSellStats();


 return () => {

   mounted = false;

   unsubscribeBikes();
   unsubscribeSell();

 };

},[]);







// REFRESH

const handleRefresh = async()=>{

  setRefreshing(true);

  await fetchBikes();

  await fetchSellStats();

  setRefreshing(false);

};


const fetchSellStats = () => {


const pendingQuery = query(
  collection(db,"sellRequests"),
  where(
    "status",
    "==",
    "Pending"
  )
);


const approvedQuery = query(
  collection(db,"sellRequests"),
  where(
    "status",
    "==",
    "Approved"
  )
);



const unsubscribePending = onSnapshot(
  pendingQuery,
  (snapshot)=>{

    setPendingRequests(
      snapshot.size
    );

  }
);



const unsubscribeApproved = onSnapshot(
  approvedQuery,
  (snapshot)=>{

    setApprovedBikes(
      snapshot.size
    );

  }
);



return ()=>{

  unsubscribePending();

  unsubscribeApproved();

};

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

const handleDelete = (id: string) => {

  setDeleteBikeId(id);

  setDeleteModal(true);

};



const cancelDelete = () => {
  setDeleteModal(false);
  setDeleteBikeId(null);
};

const confirmDelete = async () => {

  if (!deleteBikeId) return;


  const toastId = toast.loading(
    "Deleting bike..."
  );


  try {

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
          bike.id !== deleteBikeId
      )
    );


    cancelDelete();


    toast.success(
      "Bike deleted successfully 🚀",
      {
        id: toastId,
      }
    );


  } catch(error){

    console.log(error);


    toast.error(
      "Delete Failed",
      {
        id: toastId,
      }
    );


  } finally {

    setDeleteLoading(false);

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

    toast.error("Select bikes first");

    return;

  }


  const confirmDelete =
  confirm(
    `Delete ${selectedBikes.length} bikes?`
  );


  if(!confirmDelete)
  return;


  const count = selectedBikes.length;


  const toastId = toast.loading(
    `Deleting ${count} bikes...`
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
      `${count} bikes deleted successfully 🚀`,
      {
        id: toastId,
      }
    );


  }

  catch(error){


    console.log(error);


    toast.error(
      "Bulk delete failed",
      {
        id: toastId,
      }
    );


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
        .includes(registrationSearch.toLowerCase());

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
    result.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sort === "price-high") {
    result.sort((a, b) => Number(b.price) - Number(a.price));
  }

  if (sort === "year-new") {
    result.sort((a, b) => Number(b.year) - Number(a.year));
  }

  if (sort === "km-low") {
    result.sort((a, b) => Number(a.km) - Number(b.km));
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

const paginatedBikes = useMemo(() => {

  const start = (currentPage - 1) * bikesPerPage;

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
    filteredBikes.length / bikesPerPage
  );

  setTotalPages(pages || 1);

  setCurrentPage(1);

}, [filteredBikes]);






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


Sync


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

pendingRequests={pendingRequests}

approvedBikes={approvedBikes}

/>






<DashboardAnalytics

bikes={bikes}

/>






<DashboardActivity

bikes={bikes}

/>


<RecentSellRequests />






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
paginatedBikes.map((bike)=>(


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
h-52
sm:h-60
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
(bike.images && bike.images.length > 0) || bike.image ? (

<img

src={
  bike.images?.[0] || bike.image
}

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

<div
className="
flex
h-full
items-center
justify-center
bg-gray-100
text-7xl
"
>
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


{
bike.images &&
bike.images.length > 1 && (

<div
className="
absolute
bottom-4
right-4
rounded-full
bg-black/70
px-3
py-1
text-xs
font-bold
text-white
"
>
📸 {bike.images.length} Photos
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


<div
className="
flex
items-center
gap-2
"
>

<Phone size={16}/>

{bike.phone || "No Phone"}

</div>


<div
  className="
  flex
  items-center
  gap-2
  rounded-lg
  bg-gray-100
  px-3
  py-2
  text-xs
  font-mono
  "
>
  <span className="font-bold text-orange-600">
    Reg:
  </span>

  {bike.registrationNumber || "N/A"}
</div>






</div>









<div className="
flex
flex-wrap
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




<a

href={`https://wa.me/91${bike.phone}`}

target="_blank"

className="
flex
h-11
w-11
items-center
justify-center
rounded-xl
bg-green-600
text-white
"

>

<MessageCircle size={18}/>

</a>



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


{/* PAGINATION */}

{filteredBikes.length > 0 && totalPages > 1 && (

  <div className="mt-8 flex items-center justify-center gap-4">

    <button
      onClick={() =>
        setCurrentPage((prev) => Math.max(prev - 1, 1))
      }
      disabled={currentPage === 1}
      className="
        rounded-xl
        border
        border-gray-300
        px-5
        py-3
        font-bold
        hover:bg-gray-100
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      ◀ Previous
    </button>

    <span className="
      rounded-xl
      bg-orange-500
      px-5
      py-3
      font-bold
      text-white
    ">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() =>
        setCurrentPage((prev) =>
          Math.min(prev + 1, totalPages)
        )
      }
      disabled={currentPage === totalPages}
      className="
        rounded-xl
        border
        border-gray-300
        px-5
        py-3
        font-bold
        hover:bg-gray-100
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      Next ▶
    </button>

  </div>

)}


{filteredBikes.length > 0 && totalPages > 1 && (

  <div className="mt-8 flex items-center justify-center gap-4">

    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="rounded-xl border px-5 py-2 font-bold disabled:opacity-50"
    >
      ◀ Previous
    </button>

    <span className="font-bold">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
      }
      disabled={currentPage === totalPages}
      className="rounded-xl border px-5 py-2 font-bold disabled:opacity-50"
    >
      Next ▶
    </button>

  </div>

)}

{
  filteredBikes.length === 0 && (
    <div className="rounded-3xl bg-white py-20 text-center shadow-lg">

      <div className="text-7xl">🏍️</div>

      <h2 className="mt-5 text-3xl font-black">
        No Bikes Found
      </h2>

      <p className="mt-2 text-gray-500">
        Try changing filter or add new bike.
      </p>

      <Link
        href="/admin/add-bike"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white"
      >
        <Plus size={18} />
        Add Bike
      </Link>

    </div>
  )
}

{/* DELETE MODAL */}

{deleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

      <div className="flex justify-center">
        <div className="rounded-full bg-red-100 p-4">
          <AlertTriangle
            size={42}
            className="text-red-600"
          />
        </div>
      </div>

      <h2 className="mt-5 text-center text-2xl font-black">
        Delete Bike?
      </h2>

      <p className="mt-3 text-center text-gray-500">
        This action cannot be undone.
        The bike will be permanently deleted.
      </p>

      <div className="mt-8 flex gap-3">

       <button
  onClick={cancelDelete}
  disabled={deleteLoading}
  className="
    flex-1
    rounded-xl
    border
    py-3
    font-bold
    disabled:opacity-50
  "
>
  Cancel
</button>

<button
  onClick={confirmDelete}
  disabled={deleteLoading}
  className="
    flex-1
    rounded-xl
    bg-red-600
    py-3
    font-bold
    text-white
    hover:bg-red-700
    disabled:opacity-50
  "
>
  {deleteLoading ? "Deleting..." : "Delete"}
</button>

      </div>

    </div>

  </div>
)}

</div>

);

}