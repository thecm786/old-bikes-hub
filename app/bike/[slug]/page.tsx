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
  collection,
  getDocs,
  query,
  where,
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
  Bike,
  CheckCircle,
} from "lucide-react";


import {
  db,
} from "@/firebase/firebase";





interface BikeType {


  id:string;


  name:string;


  brand:string;


  slug:string;


  price:number | string;


  year:string;


  km:string;


  location:string;


  image?:string;


  images?:string[];


  description?:string;


  featured?:boolean;


  verified?:boolean;


  status?:string;



}









export default function BikeDetailsPage(){



const params =
useParams();



const slug =
params.slug as string;





const [bike,setBike] =
useState<BikeType | null>(null);



const [activeImage,setActiveImage] =
useState("");



const [loading,setLoading] =
useState(true);









useEffect(()=>{



const fetchBike = async()=>{


try{



const q = query(


collection(
db,
"bikes"
),



where(

"slug",

"==",

slug

)



);





const snapshot =
await getDocs(q);





if(!snapshot.empty){



const data =
snapshot.docs[0];



const bikeData = {

id:data.id,

...(data.data() as Omit<
BikeType,
"id"
>)

};


setBike(bikeData);


if(bikeData.images?.length){

setActiveImage(
bikeData.images[0]
);

}

else if(bikeData.image){

setActiveImage(
bikeData.image
);

}



}

else{


setBike(null);


}



}

catch(error){


console.log(
"Bike Fetch Error",
error
);



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
h-14
w-14
animate-spin
rounded-full
border-4
border-orange-500
border-t-transparent
"

/>



</div>


);


}









if(!bike){



return(


<div

className="
flex
min-h-screen
flex-col
items-center
justify-center
"

>


<h1

className="
text-4xl
font-black
"

>

Bike Not Found

</h1>



<Link

href="/buy-bikes"

className="
mt-5
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









const images =


bike.images && bike.images.length > 0


?


bike.images


:


bike.image


?


[bike.image]


:


[];







const whatsapp =

"https://wa.me/91XXXXXXXXXX";



const call =

"tel:+91XXXXXXXXXX";




return (

<main

className="
min-h-screen
bg-gray-100
py-8
"

>


<div

className="
mx-auto
max-w-7xl
space-y-8
px-5
"

>




{/* BACK BUTTON */}


<Link

href="/buy-bikes"

className="
inline-flex
items-center
gap-2
font-bold
text-gray-700
hover:text-orange-500
"

>

<ArrowLeft size={18}/>

Back To Bikes

</Link>









<div

className="
grid
gap-8
lg:grid-cols-2
"

>








{/* IMAGE GALLERY */}



<div

className="
space-y-4
"

>


{

images.length > 0 ? (


<>


<div

className="
overflow-hidden
rounded-3xl
bg-white
shadow-xl
"

>


<img

src={activeImage || images[0]}

alt={bike.name}

className="
h-[420px]
w-full
object-cover
transition
duration-300
"

/>


</div>





{

images.length > 1 && (


<div

className="
grid
grid-cols-3
gap-3
"

>


{

images.slice(1).map((img,index)=>(


<img

key={index}

src={img}

alt={bike.name}

onClick={()=>setActiveImage(img)}

className={`
h-28
w-full
rounded-xl
object-cover
shadow
cursor-pointer
transition
hover:scale-105

${
activeImage===img
?
"ring-4 ring-orange-500"
:
""
}

`}

/>


))


}


</div>


)


}


</>



)


:


<div

className="
flex
h-[420px]
items-center
justify-center
rounded-3xl
bg-white
text-8xl
shadow-xl
"

>

🏍️

</div>


}



</div>













{/* BIKE INFORMATION */}



<div

className="
rounded-3xl
bg-white
p-6
shadow-xl
md:p-8
"

>







<div

className="
flex
flex-wrap
gap-3
"

>



<div

className="
rounded-full
bg-orange-500
px-4
py-2
text-sm
font-black
text-white
"

>


{bike.brand}


</div>








{

bike.verified && (


<div

className="
flex
items-center
gap-1
rounded-full
bg-green-100
px-4
py-2
text-sm
font-bold
text-green-700
"

>


<ShieldCheck size={16}/>


Verified


</div>


)

}





{

bike.featured && (


<div

className="
flex
items-center
gap-1
rounded-full
bg-yellow-400
px-4
py-2
text-sm
font-bold
"

>


<Star size={16}/>


Featured


</div>


)

}




</div>










<h1

className="
mt-5
text-3xl
font-black
md:text-5xl
"

>


{bike.name}


</h1>








<p

className="
mt-4
text-4xl
font-black
text-orange-600
"

>

₹

{

Number(bike.price || 0)

.toLocaleString("en-IN")

}


</p>









{/* SPEC BOX */}



<div

className="
mt-8
grid
grid-cols-2
gap-4
"

>


<div

className="
rounded-2xl
bg-gray-100
p-4
"

>

<p

className="
text-xs
text-gray-500
"

>

Year

</p>


<h3

className="
mt-1
font-black
"

>

{bike.year}

</h3>


</div>







<div

className="
rounded-2xl
bg-gray-100
p-4
"

>

<p

className="
text-xs
text-gray-500
"

>

Running

</p>


<h3

className="
mt-1
font-black
"

>

{bike.km} KM

</h3>


</div>








<div

className="
rounded-2xl
bg-gray-100
p-4
"

>

<p

className="
text-xs
text-gray-500
"

>

Location

</p>


<h3

className="
mt-1
font-black
"

>

{bike.location}

</h3>


</div>








<div

className="
rounded-2xl
bg-gray-100
p-4
"

>

<p

className="
text-xs
text-gray-500
"

>

Status

</p>


<h3

className="
mt-1
font-black
text-green-600
"

>

{bike.status || "Available"}

</h3>


</div>





</div>









<p

className="
mt-8
leading-7
text-gray-600
"

>

{bike.description}

</p>








{/* OLD BIKES HUB TRUST */}



<div

className="
mt-8
rounded-3xl
bg-black
p-6
text-white
"

>


<div

className="
flex
items-center
gap-3
"

>


<div

className="
flex
h-12
w-12
items-center
justify-center
rounded-2xl
bg-orange-500
"

>


<Bike size={26}/>


</div>




<div>


<h3

className="
text-xl
font-black
"

>

Old Bikes Hub

</h3>



<p

className="
text-sm
text-gray-400
"

>

Bihar's Trusted Used Bike Marketplace

</p>



</div>



</div>








<div

className="
mt-5
space-y-3
text-sm
text-gray-300
"

>


<p

className="
flex
items-center
gap-2
"

>


<CheckCircle size={18}
className="text-green-400"
/>


Verified Bike Listings


</p>





<p

className="
flex
items-center
gap-2
"

>


<CheckCircle size={18}
className="text-green-400"
/>


Quality Checked Bikes


</p>





<p

className="
flex
items-center
gap-2
"

>


<CheckCircle size={18}
className="text-green-400"
/>


Trusted Buying Support


</p>



</div>





</div>









{/* CONTACT BUTTONS */}



<div

className="
mt-6
grid
grid-cols-1
gap-4
sm:grid-cols-2
"

>


<a


href={whatsapp}


target="_blank"


rel="noopener noreferrer"


className="
flex
items-center
justify-center
gap-2
rounded-2xl
bg-green-500
py-4
font-black
text-white
transition
hover:bg-green-600
"

>


<MessageCircle size={22}/>


WhatsApp Inquiry


</a>








<a


href={call}


className="
flex
items-center
justify-center
gap-2
rounded-2xl
bg-orange-500
py-4
font-black
text-white
transition
hover:bg-orange-600
"

>


<Phone size={22}/>


Call Old Bikes Hub


</a>



</div>







</div>








</div>





</div>


</main>


);


}