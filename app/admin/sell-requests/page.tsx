"use client";


import {
  useEffect,
  useMemo,
  useState,
} from "react";


import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";


import {
  db,
} from "@/firebase/firebase";


import {
  Check,
  X,
  Search,
} from "lucide-react";





type SellRequest = {


  id:string;


  name:string;


  mobile:string;


  brand:string;


  model:string;


  year:string;


  km:string;


  price:string;


  location:string;


  description:string;


  images?:string[];


  status:string;


};









export default function SellRequestsPage(){



const [requests,setRequests] =

useState<SellRequest[]>([]);





const [loading,setLoading] =

useState(true);





const [search,setSearch] =

useState("");





const [statusFilter,setStatusFilter] =

useState("All");











// FETCH SELL REQUESTS


const fetchRequests = async()=>{


try{


const snapshot =

await getDocs(

collection(

db,

"sellRequests"

)

);





const data =

snapshot.docs.map((item)=>(


{


id:item.id,


...(item.data() as Omit<SellRequest,"id">)


}


));





setRequests(data);



}


catch(error){


console.log(error);


}

finally{


setLoading(false);


}


};









useEffect(()=>{


fetchRequests();


},[]);












// APPROVE BIKE


const approveBike = async(


bike:SellRequest


)=>{


try{





await addDoc(


collection(

db,

"bikes"

),


{


name:

`${bike.brand} ${bike.model}`,



brand:

bike.brand,





slug:

`${bike.brand}-${bike.model}-${Date.now()}`

.toLowerCase()

.replace(/\s+/g,"-"),





price:

bike.price,





year:

bike.year,





km:

bike.km,





location:

bike.location,





owner:

bike.name,





phone:

bike.mobile,





image:

bike.images?.[0] || "",





images:

bike.images || [],





description:

bike.description,





featured:false,





verified:true,





status:"Available",





createdAt:

serverTimestamp()



}


);









await updateDoc(


doc(

db,

"sellRequests",

bike.id

),


{


status:"Approved"


}


);






fetchRequests();



}


catch(error){


console.log(error);


alert("Approve failed");


}



};













// REJECT BIKE


const rejectBike = async(


id:string


)=>{


try{


await updateDoc(


doc(

db,

"sellRequests",

id

),


{


status:"Rejected"


}


);





fetchRequests();



}

catch(error){


console.log(error);


}



};













// SEARCH + FILTER


const filteredRequests = useMemo(()=>{


return requests.filter((bike)=>{



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



bike.model

?.toLowerCase()

.includes(text)



||



bike.mobile

?.includes(search);







const statusMatch =



statusFilter==="All"



||



bike.status===statusFilter;







return searchMatch && statusMatch;



});



},[

requests,

search,

statusFilter

]);













if(loading){


return(


<div className="

flex

min-h-screen

items-center

justify-center

">


<h1 className="

text-3xl

font-black

">


Loading Requests...


</h1>


</div>


);


}
return(


<main className="

min-h-screen

bg-gray-100

p-6

md:p-8

">







<h1 className="

mb-8

text-4xl

font-black

">


🏍️ Sell Bike Requests


</h1>








{/* SEARCH FILTER */}


<div className="

mb-8

grid

gap-4

rounded-3xl

bg-white

p-6

shadow-xl

md:grid-cols-2

">





<div className="

relative

">


<Search

size={20}

className="

absolute

left-4

top-4

text-gray-400

"

/>




<input


value={search}


onChange={(e)=>

setSearch(e.target.value)

}


placeholder="Search seller, bike, mobile..."


className="

w-full

rounded-xl

border

py-3

pl-12

pr-4

outline-none

"


/>



</div>









<select


value={statusFilter}


onChange={(e)=>

setStatusFilter(e.target.value)

}


className="

rounded-xl

border

px-4

py-3

"


>


<option value="All">

All Requests

</option>



<option value="Pending">

Pending

</option>



<option value="Approved">

Approved

</option>



<option value="Rejected">

Rejected

</option>



</select>





</div>













{/* REQUEST CARDS */}



<div className="

grid

gap-8

lg:grid-cols-2

">





{


filteredRequests.length===0 && (


<div className="

rounded-3xl

bg-white

p-10

text-center

shadow-xl

lg:col-span-2

">


<h2 className="

text-2xl

font-black

">


No Requests Found


</h2>



</div>



)


}









{

filteredRequests.map((bike)=>(



<div


key={bike.id}


className="

rounded-3xl

bg-white

p-6

shadow-xl

"


>









{/* IMAGES */}


{


bike.images &&

bike.images.length>0 && (


<div className="

grid

grid-cols-3

gap-3

">


{


bike.images.map((img,index)=>(


<img


key={index}


src={img}


alt="bike"


className="

h-32

w-full

rounded-xl

object-cover

"


/>



))


}


</div>



)


}









<h2 className="

mt-6

text-2xl

font-black

">


{bike.brand} {bike.model}


</h2>








<p className="

mt-3

text-3xl

font-black

text-orange-500

">


₹

{

Number(bike.price)

.toLocaleString("en-IN")

}



</p>









<div className="

mt-5

space-y-2

text-gray-600

">


<p>

👤 {bike.name}

</p>



<p>

📞 {bike.mobile}

</p>



<p>

📍 {bike.location}

</p>



<p>

📅 {bike.year}

</p>



<p>

⚡ {bike.km} KM

</p>



</div>









<p className="

mt-5

rounded-xl

bg-gray-100

p-4

text-gray-700

">


{bike.description || 

"No description"}

</p>









<div className="

mt-6

flex

gap-4

">





<button


disabled={bike.status==="Approved"}


onClick={()=>approveBike(bike)}


className="

flex-1

rounded-xl

bg-green-500

py-3

font-bold

text-white

disabled:opacity-50

"


>


<span className="

flex

items-center

justify-center

gap-2

">


<Check size={18}/>


Approve


</span>



</button>









<button


disabled={bike.status==="Rejected"}


onClick={()=>rejectBike(bike.id)}


className="

flex-1

rounded-xl

bg-red-500

py-3

font-bold

text-white

disabled:opacity-50

"


>


<span className="

flex

items-center

justify-center

gap-2

">


<X size={18}/>


Reject


</span>



</button>






</div>









<div className="

mt-5

font-bold

">


Status:


<span className="

ml-2

text-orange-600

">


{bike.status}


</span>


</div>








</div>



))


}





</div>







</main>


);


}