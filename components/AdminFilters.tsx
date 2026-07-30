"use client";

import {
  Search,
  Filter,
  X,
  ArrowDownUp,
} from "lucide-react";


interface AdminFiltersProps {


  search:string;

  setSearch:(value:string)=>void;


  registrationSearch:string;

  setRegistrationSearch:(value:string)=>void;


  brand:string;

  setBrand:(value:string)=>void;


  brands:string[];



  sort:string;

  setSort:(value:string)=>void;



  status:string;

  setStatus:(value:string)=>void;


}




export default function AdminFilters({

  search,

  setSearch,

  registrationSearch,

  setRegistrationSearch,

  brand,

  setBrand,

  brands,

  sort,

  setSort,

  status,

  setStatus,

}:AdminFiltersProps){






  const clearFilters = ()=>{

  setSearch("");

  setBrand("All");

  setStatus("All");

  setSort("latest");

};





  const showClear =

  search !== "" ||

  brand !== "All" ||

  status !== "All" ||

  sort !== "latest";






  return (


    <div className="
    mb-8
    rounded-3xl
    bg-white
    p-6
    shadow-lg
    ">






      {/* Header */}


      <div className="
      mb-6
      flex
      items-center
      justify-between
      ">


        <h2 className="
        flex
        items-center
        gap-2
        text-xl
        font-black
        text-gray-900
        ">


          <Filter

            className="text-orange-500"

          />


          Inventory Filters


        </h2>






        {
          showClear && (


            <button


              onClick={clearFilters}


              className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-red-50
              px-4
              py-2
              text-sm
              font-bold
              text-red-600
              transition
              hover:bg-red-100
              "


            >


              <X size={16}/>


              Clear



            </button>



          )
        }



      </div>












      <div className="
      grid
      gap-5
      md:grid-cols-3
      ">






        {/* Search */}



        <div className="
        relative
        ">



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


            placeholder="
            Search bike, brand, location...
            "


            value={search}


            onChange={(e)=>

              setSearch(
                e.target.value
              )

            }



            className="
            w-full
            rounded-2xl
            border
            border-gray-200
            py-4
            pl-12
            pr-4
            outline-none
            transition
            focus:border-orange-500
            focus:ring-4
            focus:ring-orange-100
            "


          />



        </div>



            {/* Registration Number Search */}

<div className="relative">

  <input
    type="text"
    placeholder="Search Registration Number..."
    value={registrationSearch}
    onChange={(e) =>
      setRegistrationSearch(
        e.target.value.toUpperCase()
      )
    }
    className="
    w-full
    rounded-2xl
    border
    border-gray-200
    py-4
    px-4
    outline-none
    transition
    focus:border-orange-500
    focus:ring-4
    focus:ring-orange-100
    "
  />

</div>





        {/* Brand Filter */}



        <select


          value={brand}



          onChange={(e)=>

            setBrand(
              e.target.value
            )

          }



          className="
          rounded-2xl
          border
          border-gray-200
          px-5
          py-4
          outline-none
          transition
          focus:border-orange-500
          focus:ring-4
          focus:ring-orange-100
          "



        >



          <option value="All">

            All Brands

          </option>






          {
            brands

            .filter(

              (item)=>

              item !== "All"

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

        {/* Status */}


<select


  value={status}


  onChange={(e)=>
    setStatus(e.target.value)
  }


  className="
  rounded-2xl
  border
  border-gray-200
  px-5
  py-4
  outline-none
  transition
  focus:border-orange-500
  focus:ring-4
  focus:ring-orange-100
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









        {/* Sort */}




        <div className="
        relative
        ">



          <ArrowDownUp


            size={20}


            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            "


          />





          <select



            value={sort}



            onChange={(e)=>

              setSort(
                e.target.value
              )

            }



            className="
            w-full
            rounded-2xl
            border
            border-gray-200
            py-4
            pl-12
            pr-5
            outline-none
            transition
            focus:border-orange-500
            focus:ring-4
            focus:ring-orange-100
            "



          >



            <option value="latest">

              Latest Added

            </option>




            <option value="price-low">

              Price Low → High

            </option>





            <option value="price-high">

              Price High → Low

            </option>





            <option value="year-new">

              Newest Year

            </option>





            <option value="km-low">

              Lowest KM

            </option>




          </select>




        </div>





      </div>









      <p className="
      mt-5
      text-sm
      text-gray-500
      ">


        Search, filter and sort your bike inventory easily.



      </p>






    </div>


  );

}