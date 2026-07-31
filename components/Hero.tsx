"use client";

import { useState } from "react";

import {
  useRouter,
} from "next/navigation";

import Link from "next/link";

import {
  Search,
  ShieldCheck,
  BadgeCheck,
  Users,
} from "lucide-react";



export default function Hero(){


  const router = useRouter();


  const [search,setSearch] =
  useState("");




  const handleSearch = ()=>{


    if(!search.trim()){

      router.push("/buy-bikes");

      return;

    }


    router.push(
      `/buy-bikes?search=${encodeURIComponent(search)}`
    );


  };





  const brands = [

    "Royal Enfield",
    "KTM",
    "Yamaha",
    "Honda",
    "Bajaj"

  ];







return (

<section

className="
relative
overflow-hidden
bg-cover
bg-center
"

style={{

backgroundImage:

"url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1800&q=80')"

}}

>





<div

className="
absolute
inset-0
bg-black/55
"

/>







<div

className="
relative
z-10
flex
min-h-[55vh]
items-start
justify-center
px-5
pt-12
pb-8
"

>



<div

className="
mx-auto
max-w-5xl
text-center
text-white
"

>








<div

className="
mx-auto
flex
w-fit
items-center
gap-2
rounded-full
bg-orange-500/20
px-5
py-2
text-sm
font-bold
text-orange-400
backdrop-blur
"

>


<ShieldCheck size={18}/>


Bihar&apos;s Trusted Used Bike Marketplace


</div>









<h1

className="
mt-5
text-4xl
font-black
leading-tight
sm:text-5xl
md:text-6xl
"

>


Find Your


<br/>


<span

className="
text-orange-500
"

>

Dream Used Bike

</span>


</h1>







<p

className="
mx-auto
mt-3
max-w-2xl
text-sm
text-gray-200
md:text-lg
"

>


Buy verified second hand bikes,
sell your old bike and connect
directly with buyers.


</p>









{/* SEARCH */}



<div

className="
mx-auto
mt-7
flex
max-w-2xl
items-center
gap-2
rounded-2xl
bg-white
p-2
shadow-xl
"

>



<input


value={search}


onChange={(e)=>

setSearch(e.target.value)

}


onKeyDown={(e)=>{


if(e.key==="Enter"){

handleSearch();

}


}}


placeholder="
Search Royal Enfield, KTM, Yamaha...
"


className="
min-w-0
flex-1
rounded-xl
px-4
py-3
text-sm
text-black
outline-none
md:text-base
"


/>






<button


onClick={handleSearch}


className="
flex
items-center
gap-2
rounded-xl
bg-orange-500
px-5
py-3
text-sm
font-black
text-white
transition
hover:bg-orange-600
"

>


<Search size={18}/>


Search


</button>



</div>









{/* BRAND TAGS */}



<div

className="
mt-5
flex
flex-wrap
justify-center
gap-2
"

>


{

brands.map((brand)=>(


<button

key={brand}


onClick={()=>{


router.push(

`/buy-bikes?search=${brand}`

)


}}


className="
rounded-full
bg-white/15
px-4
py-2
text-xs
font-bold
backdrop-blur
transition
hover:bg-orange-500
"

>


{brand}


</button>


))

}



</div>









{/* TRUST */}



<div

className="
mt-5
flex
flex-wrap
justify-center
gap-3
"

>



<div

className="
flex
items-center
gap-2
rounded-xl
bg-white/10
px-4
py-2
text-sm
backdrop-blur
"

>


<BadgeCheck

size={16}

className="text-orange-500"

/>


Verified Bikes


</div>







<div

className="
flex
items-center
gap-2
rounded-xl
bg-white/10
px-4
py-2
text-sm
backdrop-blur
"

>


<Users

size={16}

className="text-orange-500"

/>


Direct Sellers


</div>







<div

className="
flex
items-center
gap-2
rounded-xl
bg-white/10
px-4
py-2
text-sm
backdrop-blur
"

>


<ShieldCheck

size={16}

className="text-orange-500"

/>


Safe Deals


</div>




</div>









<div

className="
mt-6
flex
flex-col
justify-center
gap-3
sm:flex-row
"

>



<Link

href="/buy-bikes"

className="
rounded-xl
bg-orange-500
px-8
py-3
font-black
text-white
transition
hover:bg-orange-600
"

>

Browse Bikes


</Link>







<Link

href="/sell-bike"

className="
rounded-xl
border-2
border-white
px-8
py-3
font-black
transition
hover:bg-white
hover:text-black
"

>

Sell Your Bike


</Link>



</div>






</div>


</div>



</section>


);


}
