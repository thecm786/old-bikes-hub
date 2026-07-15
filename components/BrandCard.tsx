type BrandCardProps = {
  name: string;
  bikes: string;
};

export default function BrandCard({ name, bikes }: BrandCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-md hover:shadow-xl">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
        🏍️
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {name}
      </h3>

      <p className="mt-2 text-gray-500">
        {bikes} Used Bikes Available
      </p>

      <button className="mt-4 font-semibold text-orange-500">
        View Bikes →
      </button>

    </div>
  );
}