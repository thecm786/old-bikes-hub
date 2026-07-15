export default function BikeDetails() {
  return (
    <main>

      <section className="bg-black py-20 text-center text-white">

        <h1 className="text-5xl font-bold">
          Royal Enfield Classic 350
        </h1>

        <p className="mt-4 text-gray-300">
          Verified Used Bike
        </p>

      </section>


      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2">


        {/* Bike Image */}

        <div className="flex h-96 items-center justify-center rounded-2xl bg-gray-200 text-5xl">
          🏍️
        </div>


        {/* Details */}

        <div>

          <h2 className="text-3xl font-bold">
            Royal Enfield Classic 350
          </h2>


          <p className="mt-4 text-3xl font-bold text-orange-500">
            ₹1,65,000
          </p>


          <div className="mt-6 space-y-3 text-gray-600">

            <p>📅 Year: 2022</p>

            <p>🛣️ KM Driven: 12000 KM</p>

            <p>👤 Owner: 1st Owner</p>

            <p>📍 Location: Muzaffarpur</p>

            <p>📄 RC Available</p>

          </div>


          <div className="mt-8 flex gap-4">

            <button className="rounded-xl bg-orange-500 px-8 py-4 font-bold text-white">
              Call Seller
            </button>


            <button className="rounded-xl bg-green-600 px-8 py-4 font-bold text-white">
              WhatsApp
            </button>


          </div>


        </div>


      </section>


    </main>
  );
}