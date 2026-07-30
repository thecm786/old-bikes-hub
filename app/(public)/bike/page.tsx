"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import Link from "next/link";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  Calendar,
  Gauge,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Star,
  ArrowLeft,
  Share2,
  User,
} from "lucide-react";

import { db } from "@/firebase/firebase";



interface BikeType {

  id:string;

  name:string;

  brand:string;

  slug:string;

  price:number | string;

  year:string;

  km:string;

  location:string;

  owner?:string;

  phone?:string;

  image?:string;

  images?:string[];

  description?:string;

  featured?:boolean;

  verified?:boolean;

  status?:string;

}





export default function BikeDetailsPage(){


const params = useParams();


const slug = params.slug as string;



const [bike,setBike] =
useState<BikeType | null>(null);


const [loading,setLoading] =
useState(true);



const [activeImage,setActiveImage] =
useState("");





useEffect(()=>{


const fetchBike = async()=>{


try{


const snap =
await getDoc(
doc(
db,
"bikes",
slug
)
);



if(snap.exists()){


const data = {

id:snap.id,

...(snap.data() as Omit<BikeType,"id">)

};



setBike(data);



if(data.images && data.images.length){

setActiveImage(data.images[0]);

}

else if(data.image){

setActiveImage(data.image);

}



}

else{


setBike(null);


}



}

catch(err){

console.log(err);

}

finally{

setLoading(false);

}



};



if(slug){

fetchBike();

}



},[slug]);








if(loading){

return(

<div className="
flex
min-h-screen
items-center
justify-center
">

<div className="
h-14
w-14
animate-spin
rounded-full
border-4
border-orange-500
border-t-transparent
"/>

</div>

);

}







if(!bike){

return(

<div className="
flex
min-h-screen
flex-col
items-center
justify-center
gap-5
">


<h1 className="
text-4xl
font-black
">

Bike Not Found

</h1>



<Link

href="/buy-bikes"

className="
rounded-xl
bg-orange-500
px-6
py-3
font-bold
text-white
"

>

Back To Bikes

</Link>


</div>

);

}







const gallery =

bike.images && bike.images.length

?

bike.images

:

bike.image

?

[bike.image]

:

[];







const whatsapp =

bike.phone

?

`https://wa.me/${bike.phone.replace(/\D/g,"")}`

:

"#";




const call =

bike.phone

?

`tel:${bike.phone}`

:

"#";






const shareBike = async()=>{


try{


await navigator.share({

title:bike.name,

text:`Check this ${bike.name} on Old Bikes Hub`,

url:window.location.href

});


}

catch(err){

console.log(err);

}


};










return(


<main className="
min-h-screen
bg-gray-100
py-10
">


<div className="
mx-auto
max-w-7xl
space-y-8
px-6
">





<Link

href="/buy-bikes"

className="
inline-flex
items-center
gap-2
font-bold
"

>

<ArrowLeft size={18}/>

Back To Bikes

</Link>








<div className="
grid
gap-8
lg:grid-cols-2
">







{/* IMAGE SECTION */}



<div className="
space-y-5
">



<div className="
overflow-hidden
rounded-3xl
bg-white
shadow-xl
">


{
activeImage ?

<img

src={activeImage}

alt={bike.name}

className="
h-[500px]
w-full
object-cover
"

/>

:

<div className="
flex
h-[500px]
items-center
justify-center
text-8xl
">

🏍️

</div>

}


</div>







<div className="
grid
grid-cols-4
gap-3
">


{

gallery.map((img,index)=>(


<button

key={index}

onClick={()=>setActiveImage(img)}

className={`

overflow-hidden
rounded-xl
border-4


${
activeImage===img

?

"border-orange-500"

:

"border-transparent"

}

`}

>


<img

src={img}

alt="bike"

className="
h-24
w-full
object-cover
"

/>


</button>


))

}


</div>




</div>









{/* DETAILS */}



<div className="
rounded-3xl
bg-white
p-8
shadow-xl
">





<div className="
flex
flex-wrap
gap-3
">


<div className="
rounded-full
bg-orange-500
px-5
py-2
font-bold
text-white
">

{bike.brand}

</div>



{
bike.status &&

<div className={`
rounded-full
px-5
py-2
font-bold
text-white

${
bike.status==="Available"

?

"bg-green-500"

:

bike.status==="Pending"

?

"bg-yellow-400 text-black"

:

"bg-red-600"

}

`}>

{bike.status}

</div>

}


</div>








<h1 className="
mt-6
text-4xl
font-black
">

{bike.name}

</h1>







<div className="
mt-5
flex
items-center
justify-between
">


<p className="
text-4xl
font-black
text-orange-500
">

₹{Number(bike.price).toLocaleString("en-IN")}

</p>



<button

onClick={shareBike}

className="
flex
items-center
gap-2
rounded-xl
bg-gray-100
px-4
py-3
font-bold
"

>

<Share2 size={18}/>

Share

</button>


</div>








<div className="
mt-8
space-y-4
">


<div className="
flex
gap-3
rounded-xl
bg-gray-100
p-4
">

<Calendar/>

{bike.year}

</div>




<div className="
flex
gap-3
rounded-xl
bg-gray-100
p-4
">

<Gauge/>

{bike.km} KM

</div>





<div className="
flex
gap-3
rounded-xl
bg-gray-100
p-4
">

<MapPin/>

{bike.location}

</div>



</div>









<div className="
mt-6
flex
gap-4
">


{
bike.featured &&

<div className="
flex
items-center
gap-2
rounded-xl
bg-yellow-400
px-4
py-3
font-bold
">

<Star/>

Featured

</div>

}




{
bike.verified &&

<div className="
flex
items-center
gap-2
rounded-xl
bg-green-100
px-4
py-3
font-bold
text-green-700
">

<ShieldCheck/>

Verified

</div>

}


</div>








<h2 className="
mt-8
text-2xl
font-black
">

Description

</h2>


<p className="
mt-3
text-gray-600
">

{bike.description || "No description"}

</p>








<div className="
mt-8
rounded-2xl
bg-gray-100
p-5
">


<h2 className="
flex
items-center
gap-2
text-2xl
font-black
">

<User/>

Seller Details

</h2>


<p className="mt-3">

<b>Name:</b> {bike.owner || "Owner"}

</p>


<p>

<b>Location:</b> {bike.location}

</p>


</div>









<div className="
mt-8
grid
grid-cols-2
gap-4
">



<a

href={whatsapp}

target="_blank"

className="
flex
justify-center
items-center
gap-2
rounded-xl
bg-green-500
py-4
font-bold
text-white
"

>

<MessageCircle/>

WhatsApp

</a>





<a

href={call}

className="
flex
justify-center
items-center
gap-2
rounded-xl
bg-blue-600
py-4
font-bold
text-white
"

>

<Phone/>

Call

</a>



</div>









<div className="
mt-8
rounded-2xl
bg-orange-50
p-5
">


<h3 className="
font-black
text-orange-600
">

⚠️ Safety Tips

</h3>


<ul className="
mt-3
list-disc
pl-5
text-sm
">

<li>Check RC before buying</li>

<li>Verify seller details</li>

<li>Meet at safe location</li>

</ul>


</div>







</div>






</div>


</div>


</main>


);


}