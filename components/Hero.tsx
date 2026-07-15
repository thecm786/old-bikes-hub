export default function Hero() {
  return (
    <section className="bg-black text-white py-24 text-center">
      <h1 className="text-5xl font-bold">
        Find Your Dream Bike
      </h1>

      <p className="mt-4 text-gray-300">
        Buy, Sell & Exchange Used Bikes Across India
      </p>

      <div className="mt-8">
        <input
          type="text"
          placeholder="Search your bike..."
          className="w-80 rounded-lg px-4 py-3 text-black"
        />

        <button className="ml-3 rounded-lg bg-orange-500 px-6 py-3 text-white">
          Search
        </button>
      </div>
    </section>
  );
}