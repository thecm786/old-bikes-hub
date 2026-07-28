"use client";


import {
  Search,
  Filter,
  X,
} from "lucide-react";





interface FilterSidebarProps {


  search:string;

  setSearch:(value:string)=>void;



  brand:string;

  setBrand:(value:string)=>void;



  brands:string[];



  status:string;

  setStatus:(value:string)=>void;



  mobileOpen:boolean;

  setMobileOpen:(value:boolean)=>void;


}









export default function FilterSidebar({


  search,

  setSearch,


  brand,

  setBrand,


  brands,


  status,

  setStatus,


  mobileOpen,

  setMobileOpen,


}:FilterSidebarProps){







const statuses = [

  "All",

  "Available",

  "Pending",

  "Sold",

];








return (


<>


{/* Mobile Overlay */}


{

mobileOpen && (


<div

className="
fixed
inset-0
z-40
bg-black/50
lg:hidden
"

onClick={()=>setMobileOpen(false)}

/>


)

}









<aside

className={`


fixed

top-0

left-0

z-50

h-full

w-80

overflow-y-auto

bg-white

p-6

shadow-2xl

transition-transform

duration-300



lg:static

lg:block

lg:h-fit

lg:w-full

lg:translate-x-0

lg:rounded-3xl

lg:shadow-lg



${

mobileOpen

?

"translate-x-0"

:

"-translate-x-full"

}


`}

>









<div

className="
mb-6
flex
items-center
justify-between
"

>


<h2

className="
flex
items-center
gap-2
text-2xl
font-black
"

>


<Filter

className="text-orange-500"

/>


Filters


</h2>







<button


onClick={()=>setMobileOpen(false)}


className="
rounded-full
bg-gray-100
p-2
lg:hidden
"


>


<X size={20}/>


</button>




</div>









{/* Search */}


<div className="mb-6">


<label

className="
mb-2
block
font-bold
text-gray-700
"

>

Search Bike

</label>





<div

className="
relative
"

>


<Search

size={20}

className="
absolute
left-4
top-1/2
-translate-y-1/2
text-gray-400
"

/>




<input


type="text"


value={search}


onChange={(e)=>
setSearch(e.target.value)
}


placeholder="Bike name, brand..."


className="
w-full
rounded-2xl
border
border-gray-200
py-4
pl-12
pr-4
outline-none
focus:border-orange-500
"




/>


</div>


</div>









{/* Brand */}



<div className="mb-6">


<label

className="
mb-2
block
font-bold
text-gray-700
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
w-full
rounded-2xl
border
border-gray-200
px-4
py-4
outline-none
focus:border-orange-500
"


>


<option value="All">

All Brands

</option>





{

brands

.filter(
(item)=>item!=="All"
)

.map((item)=>(


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









{/* Status */}




<div className="mb-6">


<label

className="
mb-2
block
font-bold
text-gray-700
"

>

Status

</label>






<select


value={status}


onChange={(e)=>
setStatus(e.target.value)
}


className="
w-full
rounded-2xl
border
border-gray-200
px-4
py-4
outline-none
focus:border-orange-500
"


>


<option value="All">

All Status

</option>



<option value="Available">

🟢 Available

</option>




<option value="Pending">

🟡 Pending

</option>




<option value="Sold">

🔴 Sold

</option>




</select>



</div>









<button


onClick={()=>{


setSearch("");

setBrand("All");

setStatus("All");


}}


className="
w-full
rounded-2xl
bg-black
py-4
font-bold
text-white
hover:bg-orange-500
"


>


Clear Filters


</button>







</aside>



</>


);


}