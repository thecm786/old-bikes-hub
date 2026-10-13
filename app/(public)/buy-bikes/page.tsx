import BuyBikesClient, { type BuyBike } from "@/components/BuyBikesClient";
import { bikes as defaultBikes } from "@/lib/bikes";
import { normalizeBikeBrand } from "@/lib/bikeBrands";
import { bikePath } from "@/lib/bikeUrls";
import { getPublicInventory, type PublicBike } from "@/lib/publicInventory";
import { jsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

export const revalidate = 3600;
const INITIAL_INVENTORY_LIMIT = 200;

export const metadata = pageMetadata(
  "Used Bikes for Sale in Bihar | Browse by Brand, Price & Year",
  "Browse available second hand bikes in Bihar. Compare real prices, kilometres, model year and photos, then enquire with Old Bikes Hub.",
  "/buy-bikes"
);

type SearchParams = {
  brand?: string | string[];
  search?: string | string[];
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function toBuyBike(bike: PublicBike): BuyBike {
  return {
    id: bike.id,
    slug: bike.slug,
    name: bike.name,
    brand: normalizeBikeBrand(bike.brand),
    price: bike.price,
    year: bike.year,
    km: bike.km,
    location: bike.location,
    phone: bike.phone,
    image: bike.image,
    images: bike.images,
    featured: bike.featured,
    verified: bike.verified,
    status: bike.status,
  };
}

function getBrands(bikes: BuyBike[]) {
  return [
    "All",
    ...Array.from(
      new Set(
        [...defaultBikes, ...bikes]
          .map((bike) => normalizeBikeBrand(bike.brand || ""))
          .filter(Boolean)
      )
    ).sort(),
  ];
}

export default async function BuyBikesPage({ searchParams }: Props) {
  const [params, inventory] = await Promise.all([searchParams, getPublicInventory()]);
  const bikes = inventory.slice(0, INITIAL_INVENTORY_LIMIT).map(toBuyBike);
  const availableBikes = inventory.filter((bike) => bike.status === "Available");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Used Bikes for Sale in Bihar",
        description: "Available second hand bikes listed by Old Bikes Hub. Compare price, year, kilometres and actual location before you enquire.",
        url: `${SITE_URL}/buy-bikes`,
      },
      {
        "@type": "ItemList",
        name: "Available used bikes in Bihar",
        numberOfItems: availableBikes.length,
        itemListElement: availableBikes.slice(0, 24).map((bike, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${bike.brand} ${bike.name} ${bike.year}`.trim(),
          url: `${SITE_URL}${bikePath(bike)}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Buy Used Bikes", item: `${SITE_URL}/buy-bikes` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <BuyBikesClient
        initialBikes={bikes}
        initialBrands={getBrands(bikes)}
        initialBrand={firstValue(params.brand)}
        initialSearch={firstValue(params.search)}
      />
    </>
  );
}
