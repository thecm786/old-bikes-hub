"use client";


import {
  useEffect,
  useState,
} from "react";


import Link from "next/link";


import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";


import {
  User,
  Bike,
  IndianRupee,
  MapPin,
  ArrowRight,
} from "lucide-react";


import { db } from "@/firebase/firebase";





interface SellRequest {


  id:string;

  name:string;

  mobile:string;

  brand:string;

  model:string;

  price:string;

  location:string;

  status:string;


}







export default function RecentSellRequests(){



const [requests,setRequests] =
useState<SellRequest[]>([]);


const [loading,setLoading] =
useState(true);






useEffect(()=>{


const fetchRequests = async()=>{


try{


const q = query(

collection(
db,
"sellRequests"
),

orderBy(
"createdAt",
"desc"
),

limit(5)

);





const snapshot =
await getDocs(q);





const data =
snapshot.docs.map((doc)=>(

{

id:doc.id,

...(doc.data() as Omit<SellRequest,"id">)

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



fetchRequests();



},[]);









if(loading){


return null;


}









return (


<section className="

rounded-3xl

bg-white

p-6

shadow-xl

">


<div className="

mb-6

flex

items-center

justify-between

">


<h2 className="

text-2xl

font-black

">


Recent Sell Requests


</h2>





<Link

href="/admin/sell-requests"

className="

flex

items-center

gap-2

rounded-xl

bg-orange-500

px-4

py-2

font-bold

text-white

"

>


View All

<ArrowRight size={18}/>


</Link>



</div>









<div className="space-y-4">


{

requests.length===0 ?


(

<p className="text-gray-500">

No sell requests found

</p>

)


:


requests.map((item)=>(


<div

key={item.id}

className="

rounded-2xl

bg-gray-100

p-5

"

>


<div className="

flex

flex-col

gap-4

md:flex-row

md:items-center

md:justify-between

">





<div>


<h3 className="

text-lg

font-black

">


{item.name}


</h3>



<p className="

flex

items-center

gap-2

text-gray-600

">


<Bike size={16}/>


{item.brand} {item.model}


</p>



<p className="

flex

items-center

gap-2

text-gray-600

">


<MapPin size={16}/>


{item.location}


</p>



</div>







<div className="text-right">


<p className="

flex

items-center

justify-end

gap-1

font-black

text-orange-600

">


<IndianRupee size={16}/>


{item.price}


</p>





<span className="

rounded-full

bg-yellow-400

px-3

py-1

text-xs

font-bold

text-black

">


{item.status}


</span>



</div>






</div>


</div>



))


}



</div>






</section>


);


}