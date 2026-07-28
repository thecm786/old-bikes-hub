"use client";


import {
  useEffect,
  useState,
} from "react";


import {
  useParams,
  useRouter,
} from "next/navigation";


import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";


import {
  db
} from "@/firebase/firebase";


import MultiImageUploader from "@/components/MultiImageUploader";


import {
  Bike,
  ImagePlus,
  IndianRupee,
  Calendar,
  Gauge,
  MapPin,
  User,
  Phone,
  CheckCircle,
  ShieldCheck,
  Save,
} from "lucide-react";








type FormType = {


brand:string;


name:string;


price:string;


year:string;


km:string;


owner:string;


phone:string;


location:string;


description:string;


featured:boolean;


verified:boolean;


status:string;


images:string[];


};









export default function EditBike(){



const params = useParams();


const router = useRouter();



const id = params.id as string;







const [loading,setLoading] =
useState(true);



const [saving,setSaving] =
useState(false);



const [success,setSuccess] =
useState("");









const [form,setForm] =
useState<FormType>({


brand:"",


name:"",


price:"",


year:"",


km:"",


owner:"",


phone:"",


location:"",


description:"",


featured:false,


verified:false,


status:"Available",


images:[],


});













// LOAD BIKE DATA


useEffect(()=>{


const loadBike = async()=>{


try{


const snap = await getDoc(

doc(

db,

"bikes",

id

)

);





if(snap.exists()){



const data = snap.data();





setForm({


brand:data.brand || "",



name:data.name || "",



price:String(

data.price || ""

),



year:String(

data.year || ""

),



km:String(

data.km || ""

),




owner:data.owner || "",




phone:data.phone || "",




location:data.location || "",




description:data.description || "",





featured:

data.featured || false,





verified:

data.verified ?? false,





status:

data.status || "Available",





images:


Array.isArray(data.images)


?


data.images


:


data.image


?


[data.image]


:


[],





});



}



}


catch(error){


console.log(error);


}

finally{


setLoading(false);


}



};





if(id){


loadBike();


}



},[id]);











// INPUT CHANGE


const handleChange = (

e:

React.ChangeEvent<

HTMLInputElement |

HTMLTextAreaElement |

HTMLSelectElement

>

)=>{


const {

name,

value

}=e.target;





setForm((prev)=>({


...prev,


[name]:value,


}));



};











// CHECKBOX CHANGE


const handleToggle = (

e:

React.ChangeEvent<HTMLInputElement>

)=>{


const {

name,

checked

}=e.target;





setForm((prev)=>({


...prev,


[name]:checked,


}));



};











// REMOVE IMAGE


const removeImage = (

index:number

)=>{


setForm((prev)=>({


...prev,


images:

prev.images.filter(

(_,i)=>i!==index

),



}));



};











// SLUG


const generateSlug = ()=>{


return (

`${form.brand}-${form.name}-${id}`

)


.toLowerCase()


.replace(

/[^a-z0-9]+/g,

"-"

)


.replace(

/^-+|-+$/g,

""

);



};

// UPDATE BIKE


const handleUpdate = async(

e:React.FormEvent

)=>{


e.preventDefault();





const cleanPhone =

form.phone.replace(

/\D/g,

""

);






if(cleanPhone.length !== 10){


alert(
"Enter valid 10 digit mobile number"
);


return;


}







if(form.images.length===0){


alert(
"Please add bike image"
);


return;


}







try{


setSaving(true);





await updateDoc(

doc(

db,

"bikes",

id

),


{


brand:

form.brand,



name:

form.name,



slug:

generateSlug(),



price:

Number(form.price),



year:

form.year,



km:

form.km,



owner:

form.owner,



phone:

cleanPhone,



location:

form.location,



description:

form.description,



featured:

form.featured,



verified:

form.verified,



status:

form.status,



image:

form.images[0] || "",



images:

form.images,



}


);





setSuccess(

"Bike Updated Successfully 🚀"

);






setTimeout(()=>{


router.push(

"/admin/dashboard"

);


},1500);





}


catch(error){


console.log(error);



alert(

"Update Failed"

);


}


finally{


setSaving(false);


}



};










if(loading){


return (


<main className="
flex
min-h-screen
items-center
justify-center
bg-gray-100
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



<h1 className="
mt-5
text-2xl
font-bold
">

Loading Bike...

</h1>



</div>


</main>


);


}









return (


<main className="
min-h-screen
bg-gradient-to-br
from-gray-100
via-white
to-orange-50
">


<div className="
mx-auto
max-w-7xl
px-5
py-10
">







<div className="
mb-8
rounded-3xl
bg-black
p-8
text-white
shadow-xl
">


<Bike

size={45}

className="text-orange-500"

/>



<h1 className="
mt-4
text-4xl
font-black
">

Edit Bike Listing

</h1>




<p className="
mt-2
text-gray-300
">

Update bike details and marketplace information.

</p>



</div>









{
success && (


<div className="
mb-6
flex
items-center
gap-3
rounded-2xl
bg-green-100
p-5
font-bold
text-green-700
">


<CheckCircle/>


{success}


</div>


)

}









<form

onSubmit={handleUpdate}

className="
rounded-3xl
bg-white
p-6
shadow-xl
lg:p-10
"

>









<h2 className="
mb-6
flex
items-center
gap-3
text-2xl
font-black
">


<ImagePlus className="text-orange-500"/>


Images


</h2>









<MultiImageUploader


onUpload={(urls)=>


setForm((prev)=>({


...prev,


images:[

...prev.images,

...urls

]


}))


}


/>









{
form.images.length>0 && (


<div className="
mt-6
grid
grid-cols-2
gap-4
md:grid-cols-4
">


{

form.images.map(

(img,index)=>(


<div

key={index}

className="
relative
overflow-hidden
rounded-2xl
"

>


<img

src={img}

alt="bike"

className="
h-36
w-full
object-cover
"

/>





<button

type="button"

onClick={()=>removeImage(index)}

className="
absolute
right-2
top-2
rounded-full
bg-red-600
px-3
py-1
text-white
"

>

×

</button>





</div>


)

)

}


</div>


)

}









<div className="
mt-10
grid
gap-5
md:grid-cols-2
">
<Input

icon={<Bike/>}

name="brand"

value={form.brand}

placeholder="Brand"

onChange={handleChange}

/>



<Input

icon={<Bike/>}

name="name"

value={form.name}

placeholder="Bike Name"

onChange={handleChange}

/>



<Input

icon={<IndianRupee/>}

name="price"

value={form.price}

placeholder="Price"

type="number"

onChange={handleChange}

/>



<Input

icon={<Calendar/>}

name="year"

value={form.year}

placeholder="Year"

onChange={handleChange}

/>



<Input

icon={<Gauge/>}

name="km"

value={form.km}

placeholder="KM Driven"

onChange={handleChange}

/>



<Input

icon={<User/>}

name="owner"

value={form.owner}

placeholder="Owner Name"

onChange={handleChange}

/>



<Input

icon={<Phone/>}

name="phone"

value={form.phone}

placeholder="Phone Number"

onChange={handleChange}

/>



<Input

icon={<MapPin/>}

name="location"

value={form.location}

placeholder="Location"

onChange={handleChange}

/>




</div>









{/* STATUS */}



<div className="
mt-6
">


<label className="
mb-3
block
font-black
text-lg
">

Bike Status

</label>




<select

name="status"

value={form.status}

onChange={handleChange}

className="
w-full
rounded-2xl
border
px-5
py-4
outline-none
focus:border-orange-500
focus:ring-4
focus:ring-orange-100
"

>


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









{/* DESCRIPTION */}



<textarea


name="description"


value={form.description}


onChange={handleChange}


rows={6}


placeholder="Bike description"


className="
mt-8
w-full
rounded-2xl
border
p-5
outline-none
focus:border-orange-500
focus:ring-4
focus:ring-orange-100
"


/>









{/* FEATURED VERIFIED */}



<div className="
mt-8
grid
gap-4
md:grid-cols-2
">





<label className="
flex
items-center
gap-3
rounded-2xl
bg-orange-50
p-5
cursor-pointer
">


<input

type="checkbox"

name="featured"

checked={form.featured}

onChange={handleToggle}

/>



<span className="
font-bold
">

Featured Bike ⭐

</span>


</label>








<label className="
flex
items-center
gap-3
rounded-2xl
bg-green-50
p-5
cursor-pointer
">


<input

type="checkbox"

name="verified"

checked={form.verified}

onChange={handleToggle}

/>



<span className="
flex
items-center
gap-2
font-bold
">


<ShieldCheck

className="text-green-600"

/>


Verified Seller


</span>


</label>




</div>









{/* UPDATE BUTTON */}



<button


disabled={saving}


className="
mt-10
flex
w-full
items-center
justify-center
gap-3
rounded-2xl
bg-orange-500
py-5
text-lg
font-black
text-white
shadow-lg
hover:bg-orange-600
disabled:opacity-50
"


>


<Save size={22}/>



{

saving

?

"Updating Bike..."

:

"Update Bike"

}



</button>







</form>



</div>



</main>



);



}












// INPUT COMPONENT



function Input({


icon,


name,


value,


placeholder,


onChange,


type="text"


}:any){



return (



<div className="
flex
items-center
gap-3
rounded-2xl
border
px-4
py-4
focus-within:border-orange-500
focus-within:ring-4
focus-within:ring-orange-100
">





<span className="
text-orange-500
">

{icon}

</span>





<input


required


name={name}


value={value}


type={type}


placeholder={placeholder}


onChange={onChange}


className="
w-full
outline-none
"


/>





</div>



);


}