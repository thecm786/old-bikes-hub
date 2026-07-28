"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";


import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";


import {
  Bike,
  CheckCircle,
  Save,
  ArrowLeft,
  ImagePlus,
  IndianRupee,
  Calendar,
  Gauge,
  MapPin,
  User,
  Phone,
} from "lucide-react";


import {
  db,
} from "@/firebase/firebase";


import MultiImageUploader from "@/components/MultiImageUploader";






export default function AddBike(){



  const router = useRouter();



  const [saving,setSaving] =
    useState(false);



  const [success,setSuccess] =
    useState("");



  const [form,setForm] = useState({


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

    images:[] as string[],


  });









  const handleChange = (

    e:React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >

  )=>{


    setForm((prev)=>({


      ...prev,


      [e.target.name]:
      e.target.value,


    }));


  };









  const generateSlug = ()=>{


    return (

      `${form.brand}-${form.name}`

      .toLowerCase()

      .replace(
        /[^a-z0-9]+/g,
        "-"
      )

      .replace(
        /^-+|-+$/g,
        ""

      )

    );


  };









  const handleFeatured = (

    e:React.ChangeEvent<HTMLInputElement>

  )=>{


    setForm((prev)=>({


      ...prev,


      featured:
      e.target.checked,


    }));


  };









  const handleVerified = (

    e:React.ChangeEvent<HTMLInputElement>

  )=>{


    setForm((prev)=>({


      ...prev,


      verified:
      e.target.checked,


    }));


  };









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









  const validateForm = ()=>{


    if(!form.brand)
    {
      alert(
        "Enter bike brand"
      );

      return false;
    }



    if(!form.name)
    {
      alert(
        "Enter bike model"
      );

      return false;
    }




    if(!form.price || Number(form.price)<=0)
    {

      alert(
        "Enter valid price"
      );

      return false;

    }




    if(
      form.phone &&
      form.phone.length!==10
    )
    {

      alert(
        "Enter valid mobile number"
      );

      return false;

    }




    if(form.images.length===0)
    {

      alert(
        "Upload bike image"
      );

      return false;

    }



    return true;


  };









  const handleSubmit = async(

    e:React.FormEvent

  )=>{


    e.preventDefault();



    if(!validateForm())
      return;





    try{


      setSaving(true);




      await addDoc(

        collection(
          db,
          "bikes"
        ),

        {


          slug:
          generateSlug(),



          name:
          form.name,



          brand:
          form.brand,



          price:
          Number(form.price),



          year:
          form.year,



          km:
          form.km,



          owner:
          form.owner,



          phone:
          form.phone,



          location:
          form.location,



          description:
          form.description,



          featured:
          form.featured,



          verified:
          form.verified,
        
          
          status:
          "Pending",

          


          image:
          form.images[0],



          images:
          form.images,



          createdAt:
          serverTimestamp(),


        }


      );




      setSuccess(
        "Bike Added Successfully 🚀"
      );



      setTimeout(()=>{


        router.push(
          "/admin/dashboard"
        );


      },1200);




    }
    catch(error){


      console.log(error);


      alert(
        "Something went wrong"
      );


    }
    finally{


      setSaving(false);


    }



  };
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
      py-8
      ">


        {/* Header */}

        <div className="
        mb-8
        flex
        flex-col
        gap-5
        rounded-3xl
        bg-black
        p-8
        text-white
        shadow-2xl
        lg:flex-row
        lg:items-center
        lg:justify-between
        ">


          <div>

            <div className="
            mb-4
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-orange-500
            ">

              <Bike size={34}/>

            </div>


            <h1 className="
            text-4xl
            font-black
            ">

              Add New Bike 🚀

            </h1>


            <p className="
            mt-2
            text-gray-300
            ">

              Create premium bike listing for Old Bikes Hub.

            </p>


          </div>





          <Link

            href="/admin/dashboard"

            className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-gray-700
            px-5
            py-3
            font-bold
            hover:bg-white/10
            "

          >

            <ArrowLeft size={18}/>

            Dashboard

          </Link>


        </div>








        {
          success && (

            <div className="
            mb-6
            flex
            items-center
            gap-3
            rounded-2xl
            bg-green-50
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

          onSubmit={handleSubmit}

          className="
          rounded-3xl
          bg-white
          p-6
          shadow-xl
          lg:p-10
          "

        >





          {/* Images */}

          <section className="mb-10">


            <h2 className="
            mb-5
            flex
            items-center
            gap-3
            text-2xl
            font-black
            ">


              <ImagePlus className="text-orange-500"/>

              Bike Images

            </h2>





            <MultiImageUploader

              onUpload={(urls)=>


                setForm((prev)=>({

                  ...prev,

                  images:urls,

                }))


              }

            />






            {
              form.images.length > 0 && (

                <div className="
                mt-6
                grid
                grid-cols-2
                gap-4
                md:grid-cols-4
                ">


                  {
                    form.images.map((img,index)=>(


                      <div

                        key={index}

                        className="
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        "

                      >


                        <img

                          src={img}

                          alt="bike"

                          className="
                          h-40
                          w-full
                          object-cover
                          group-hover:scale-110
                          transition
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
                          font-bold
                          text-white
                          "

                        >

                          ×

                        </button>


                      </div>


                    ))
                  }


                </div>

              )
            }


          </section>









          {/* Bike Information */}


          <section className="mb-10">


            <h2 className="
            mb-6
            text-2xl
            font-black
            ">

              Bike Information

            </h2>





            <div className="
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-3
            ">


              <Input
                icon={<Bike/>}
                name="brand"
                placeholder="Bike Brand"
                value={form.brand}
                onChange={handleChange}
              />


              <Input
                icon={<Bike/>}
                name="name"
                placeholder="Bike Model"
                value={form.name}
                onChange={handleChange}
              />



              <Input
                icon={<IndianRupee/>}
                name="price"
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={handleChange}
              />



              <Input
                icon={<Calendar/>}
                name="year"
                placeholder="Model Year"
                value={form.year}
                onChange={handleChange}
              />



              <Input
                icon={<Gauge/>}
                name="km"
                placeholder="KM Driven"
                value={form.km}
                onChange={handleChange}
              />



              <Input
                icon={<User/>}
                name="owner"
                placeholder="Owner Name"
                value={form.owner}
                onChange={handleChange}
              />



              <Input
                icon={<Phone/>}
                name="phone"
                placeholder="Phone Number"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />



              <Input
                icon={<MapPin/>}
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
              />



            </div>


          </section>









          {/* Description */}


          <section className="mb-8">


            <label className="
            mb-3
            block
            text-xl
            font-black
            ">

              Description

            </label>



            <textarea

              name="description"

              value={form.description}

              onChange={handleChange}

              rows={6}

              placeholder="Write complete bike details..."

              className="
              w-full
              rounded-2xl
              border
              p-4
              outline-none
              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-100
              "

            />


          </section>









          {/* Settings */}


          <div className="
          mb-10
          grid
          gap-5
          md:grid-cols-2
          ">


            <label className="
            flex
            cursor-pointer
            items-center
            gap-4
            rounded-2xl
            border
            bg-orange-50
            p-5
            ">


              <input

                type="checkbox"

                checked={form.featured}

                onChange={handleFeatured}

                className="h-5 w-5"

              />


              <div>

                <p className="font-black">

                  Featured Bike ⭐

                </p>

                <p className="text-sm text-gray-500">

                  Show on homepage

                </p>

              </div>


            </label>







            <label className="
            flex
            cursor-pointer
            items-center
            gap-4
            rounded-2xl
            border
            bg-green-50
            p-5
            ">


              <input

                type="checkbox"

                checked={form.verified}

                onChange={handleVerified}

                className="h-5 w-5"

              />


              <div>

                <p className="font-black">

                  Verified Seller ✔

                </p>


                <p className="text-sm text-gray-500">

                  Display verified badge

                </p>

              </div>


            </label>



          </div>









          {/* Save Button */}


          <button

            type="submit"

            disabled={saving}

            className="
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
            hover:bg-orange-600
            disabled:opacity-50
            "

          >

            <Save size={22}/>


            {
              saving
              ?
              "Saving Bike..."
              :
              "Save Bike"
            }


          </button>



        </form>


      </div>


    </main>

  );


}







interface InputProps {


  icon:React.ReactNode;

  name:string;

  value:string;

  placeholder:string;

  type?:string;


  onChange:
  (
    e:React.ChangeEvent<HTMLInputElement>
  )=>void;


}








function Input({

  icon,

  name,

  value,

  placeholder,

  type="text",

  onChange,

}:InputProps){



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

        onChange={onChange}

        type={type}

        placeholder={placeholder}

        className="
        w-full
        outline-none
        "

      />


    </div>

  );


}