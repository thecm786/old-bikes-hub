"use client";

import Link from "next/link";

import {
  Calendar,
  Gauge,
  MapPin,
  Heart,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";


import {
  isWishlisted,
  toggleWishlist,
} from "@/lib/wishlist";



type BikeCardProps = {

  id:string;

  slug:string;

  name:string;

  brand?:string;

  price:string | number;

  year:string;

  km:string;

  location:string;

  phone?:string;

  image?:string;

  featured?:boolean;

  verified?:boolean;

  status?:string;

};






export default function BikeCard({

  id,

  slug,

  name,

  brand,

  price,

  year,

  km,

  location,

  phone,

  image,

  featured,

  verified=true,

  status="Available",

}:BikeCardProps){



  const [liked,setLiked] =
    useState(false);




  useEffect(()=>{


    setLiked(
      isWishlisted(id)
    );


  },[id]);






  const handleWishlist = ()=>{


    const value =
      toggleWishlist(id);


    setLiked(value);



    window.dispatchEvent(
      new Event("wishlistUpdated")
    );


  };





  const whatsappNumber =
    phone?.replace(
      /\D/g,
      ""
    );



  const whatsappLink =
    whatsappNumber
    ?
    `https://wa.me/${whatsappNumber}`
    :
    "#";



  const callLink =
    phone
    ?
    `tel:${phone}`
    :
    "#";






  const statusStyle =

    status === "Available"

    ?

    "bg-green-500"

    :

    status === "Pending"

    ?

    "bg-yellow-400 text-black"

    :

    "bg-red-600";








return (


<div

className="
group
overflow-hidden
rounded-3xl
bg-white
shadow-lg
transition-all
duration-500
hover:-translate-y-3
hover:shadow-2xl
"

>



{/* IMAGE */}

<div

className="
relative
overflow-hidden
"

>



{
image ?


<img

src={image}

alt={name}

className="
h-64
w-full
object-cover
transition
duration-700
group-hover:scale-110
"

/>


:



<div

className="
flex
h-64
items-center
justify-center
bg-gray-100
text-7xl
"

>

🏍️

</div>


}






{/* WISHLIST */}

<button

onClick={handleWishlist}

className="
absolute
right-4
top-4
rounded-full
bg-white
p-3
shadow-lg
"

>


<Heart

size={22}

className={

liked

?

"fill-red-500 text-red-500"

:

"text-gray-600"

}

/>


</button>







{
brand &&

<div

className="
absolute
left-4
top-4
rounded-full
bg-orange-500
px-4
py-2
text-sm
font-bold
text-white
"

>

{brand}

</div>

}







{/* STATUS BADGE */}


<div

className={`
absolute
left-4
top-16
rounded-full
px-4
py-2
text-sm
font-bold
text-white

${statusStyle}

`}

>


{
status === "Available"
&&
"🟢 Available"
}


{
status === "Pending"
&&
"🟡 Pending"
}



{
status === "Sold"
&&
"🔴 Sold"
}


</div>








{
featured &&


<div

className="
absolute
bottom-4
left-4
flex
items-center
gap-1
rounded-full
bg-yellow-400
px-3
py-2
text-sm
font-bold
"

>


<Star

size={16}

fill="currentColor"

/>


Featured


</div>


}








{
verified &&


<div

className="
absolute
bottom-4
right-4
flex
items-center
gap-1
rounded-full
bg-white
px-3
py-2
text-sm
font-bold
text-green-600
shadow
"

>


<ShieldCheck size={16}/>


Verified


</div>


}





</div>








{/* CONTENT */}


<div className="p-6">


<h3

className="
text-2xl
font-black
"

>

{name}

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
{Number(price)
.toLocaleString("en-IN")}


</p>








<div

className="
mt-5
grid
grid-cols-2
gap-3
"

>


<div className="
flex
items-center
gap-2
rounded-xl
bg-gray-100
p-3
">


<Calendar
size={18}
className="text-orange-500"
/>


{year}


</div>





<div className="
flex
items-center
gap-2
rounded-xl
bg-gray-100
p-3
">


<Gauge
size={18}
className="text-orange-500"
/>


{km} KM


</div>





<div className="
col-span-2
flex
items-center
gap-2
rounded-xl
bg-gray-100
p-3
">


<MapPin

size={18}

className="text-orange-500"

/>


{location}


</div>



</div>








<div

className="
mt-5
grid
grid-cols-2
gap-3
"

>


<a

href={whatsappLink}

target="_blank"

rel="noopener noreferrer"

className="
flex
items-center
justify-center
gap-2
rounded-xl
bg-green-500
py-3
font-bold
text-white
"

>

<MessageCircle size={18}/>

WhatsApp


</a>






<a

href={callLink}

className="
flex
items-center
justify-center
gap-2
rounded-xl
bg-blue-600
py-3
font-bold
text-white
"

>


<Phone size={18}/>

Call


</a>


</div>







<Link

href={`/bike/${slug}`}

className="
mt-5
block
rounded-xl
bg-black
py-4
text-center
font-bold
text-white
hover:bg-orange-500
"

>


View Details →


</Link>



</div>



</div>


);


}