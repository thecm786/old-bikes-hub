import Link from "next/link";

import {
  Bike,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";


export default function Footer(){


return (

<footer className="
bg-black
text-white
">


<div className="
mx-auto
grid
max-w-7xl
gap-10
px-6
py-16
sm:grid-cols-2
lg:grid-cols-4
">





{/* BRAND */}


<div>


<div className="
flex
items-center
gap-3
">


<Bike

size={42}

className="
text-orange-500
"

/>


<div>

<h2 className="
text-2xl
font-black
">

Old Bikes Hub

</h2>


<p className="
text-sm
text-orange-500
">

India's Trusted Used Bike Marketplace

</p>


</div>


</div>





<p className="
mt-5
leading-7
text-gray-400
">

Buy, sell and exchange verified
second hand bikes across India.
Find your dream bike at the best price.

</p>



</div>









{/* LINKS */}



<div>


<h3 className="
mb-5
text-xl
font-bold
">

Quick Links

</h3>


<div className="
flex
flex-col
gap-3
text-gray-400
">


<Link
href="/"
className="hover:text-orange-500"
>

Home

</Link>


<Link
href="/buy-bikes"
className="hover:text-orange-500"
>

Buy Bikes

</Link>


<Link
href="/sell-bike"
className="hover:text-orange-500"
>

Sell Bike

</Link>


<Link
href="/wishlist"
className="hover:text-orange-500"
>

Wishlist

</Link>


</div>


</div>










{/* SERVICES */}



<div>


<h3 className="
mb-5
text-xl
font-bold
">

Why Choose Us

</h3>


<ul className="
space-y-3
text-gray-400
">


<li>
✓ Verified Used Bikes
</li>


<li>
✓ Direct Seller Contact
</li>


<li>
✓ Best Market Price
</li>


<li>
✓ Easy Bike Selling
</li>


</ul>


</div>









{/* CONTACT */}



<div>


<h3 className="
mb-5
text-xl
font-bold
">

Contact

</h3>




<div className="
space-y-4
text-gray-400
">



<p className="
flex
gap-3
">

<MapPin
className="text-orange-500"
/>

India

</p>





<a

href="tel:+918789192394"

className="
flex
gap-3
hover:text-orange-500
"

>

<Phone
className="text-orange-500"
/>

+91 8789192394

</a>






<a

href="mailto:support@oldbikeshub.com"

className="
flex
gap-3
hover:text-orange-500
"

>

<Mail
className="text-orange-500"
/>

support@oldbikeshub.com

</a>







<a

href="https://wa.me/918789192394"

target="_blank"

className="
flex
items-center
gap-3
rounded-xl
bg-green-500
px-4
py-3
font-bold
text-white
hover:bg-green-600
"

>

<MessageCircle size={20}/>

WhatsApp

</a>





</div>


</div>






</div>









<div className="
border-t
border-gray-800
py-6
text-center
text-sm
text-gray-500
">


© {new Date().getFullYear()} Old Bikes Hub.
All Rights Reserved.


</div>




</footer>

);


}