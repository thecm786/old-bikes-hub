export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-black text-white">

      <h1 className="text-2xl font-bold text-orange-500">
        Old Bikes Hub
      </h1>


      <div className="flex gap-6">

        <a href="/">
          Home
        </a>


        <a href="/buy-bikes">
          Buy Bikes
        </a>


        <a href="/sell-bike">
          Sell Bike
        </a>


        <a href="#">
          About
        </a>


        <a href="#">
          Contact
        </a>


      </div>

    </nav>
  );
}