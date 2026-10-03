export type NewBikeGuide = {
  slug: string;
  brand: string;
  model: string;
  description: string;
  category: string;
  bestFor: string;
  image: string;
  officialUrl: string;
  usedCollection: string;
  highlights: string[];
  specifications: { label: string; value: string }[];
  usedChecks: string[];
};

export const newBikeGuides: NewBikeGuide[] = [
  {
    slug: "royal-enfield-classic-350", brand: "Royal Enfield", model: "Classic 350", category: "Retro roadster",
    description: "Official-specification guide to the Royal Enfield Classic 350 in India, plus practical checks for used-bike buyers in Bihar.",
    bestFor: "Riders who want a relaxed roadster for daily use and longer rides.", image: "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/new-classic-350/studio-shots/new/sundarban-green.png",
    officialUrl: "https://www.royalenfield.com/in/en/app/motorcycles/classic-350/", usedCollection: "/used-bikes-bihar/royal-enfield",
    highlights: ["349cc single-cylinder platform", "Dual-channel ABS on applicable variants", "Classic upright riding position"],
    specifications: [{ label: "Engine", value: "349cc" }, { label: "Power", value: "20.2 bhp at 6,100 rpm" }, { label: "Torque", value: "27 Nm at 4,000 rpm" }, { label: "Gearbox", value: "5-speed" }, { label: "Fuel tank", value: "13 litres" }, { label: "Kerb weight", value: "195 kg" }],
    usedChecks: ["Check cold start, clutch feel, gearbox shifts and chain condition.", "Inspect service records, tyres, battery and brake wear.", "Match chassis and engine numbers with the RC before payment."],
  },
  {
    slug: "bajaj-pulsar-n160", brand: "Bajaj", model: "Pulsar N160", category: "Street motorcycle",
    description: "Official-specification guide to the Bajaj Pulsar N160 in India, with a used-bike inspection checklist.",
    bestFor: "Commuters who want a sporty 160cc street motorcycle.", image: "https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/new-images/plp-pages/header-drop-down-mob/n160.webp",
    officialUrl: "https://www.bajajauto.com/bikes/pulsar/pulsar-n160/specifications", usedCollection: "/used-bikes-bihar/bajaj",
    highlights: ["164.82cc engine", "Ride modes and dual-channel ABS on applicable variants", "Street-focused chassis"],
    specifications: [{ label: "Engine", value: "164.82cc, air cooled, 2-valve" }, { label: "Power", value: "16 PS at 8,750 rpm" }, { label: "Torque", value: "14.65 Nm at 6,750 rpm" }, { label: "Gearbox", value: "5-speed" }, { label: "Fuel tank", value: "14 litres" }, { label: "Seat height", value: "795 mm" }],
    usedChecks: ["Test the brakes and ABS warning light where fitted.", "Check for fork leaks, bent wheels and uneven tyre wear.", "Confirm the exact variant because equipment differs between variants."],
  },
  {
    slug: "yamaha-r15-v4", brand: "Yamaha", model: "R15 V4", category: "Supersport motorcycle",
    description: "Official-specification guide to the Yamaha R15 V4 in India, with important checks before buying a used example.",
    bestFor: "Riders looking for a performance-focused 155cc motorcycle.", image: "https://shop.yamaha-motor-india.com/cdn/shop/files/racing_blue_c18fd6b6-e692-4795-80c5-4bf51b1953f3_600x.webp?v=1788783950",
    officialUrl: "https://shop.yamaha-motor-india.com/products/buy-r15-v4-1", usedCollection: "/used-bikes-bihar/yamaha",
    highlights: ["155cc liquid-cooled VVA engine", "Dual-channel ABS and traction control", "USD front forks and Deltabox frame"],
    specifications: [{ label: "Engine", value: "155cc, liquid-cooled, SOHC, 4-valve" }, { label: "Power", value: "18.4 PS at 10,000 rpm" }, { label: "Torque", value: "14.2 Nm at 7,500 rpm" }, { label: "Gearbox", value: "6-speed" }, { label: "Fuel tank", value: "11 litres" }, { label: "Kerb weight", value: "141 kg" }],
    usedChecks: ["Check fairing mounts, clip-ons, levers and wheels for crash damage.", "Check clutch operation, chain/sprocket wear and tyre date codes.", "Verify which electronics and quick-shifter equipment belong to the exact variant."],
  },
  {
    slug: "tvs-apache-rtr-160-4v", brand: "TVS", model: "Apache RTR 160 4V", category: "Performance commuter",
    description: "A buyer guide to the TVS Apache RTR 160 4V in India, including what to inspect when comparing used bikes.",
    bestFor: "Daily riders who prefer a sporty 160cc motorcycle.", image: "https://www.tvsmotor.com/tvs-apache/-/media/Brand-Pages/Apache/Price/160-4V-Red-Bike.png",
    officialUrl: "https://www.tvsmotor.com/-/media/Feature/AfterAprilPdf/TVS-Apache-RTR-160-4V-USD.pdf", usedCollection: "/used-bikes-bihar/tvs",
    highlights: ["160cc four-valve Apache platform", "Variant-dependent braking and riding equipment", "Sporty commuter ergonomics"],
    specifications: [{ label: "Engine family", value: "Apache RTR 160 4V" }, { label: "Segment", value: "160cc performance commuter" }, { label: "Braking", value: "Check exact variant on official specification sheet" }, { label: "Suspension", value: "Check exact variant on official specification sheet" }],
    usedChecks: ["Confirm the variant from its RC and chassis details before comparing features.", "Test the engine through the rev range and inspect clutch, chain and brakes.", "Check service records and verify that any aftermarket electrical work is safe."],
  },
  {
    slug: "honda-shine-125", brand: "Honda", model: "Shine 125", category: "Commuter motorcycle",
    description: "Official-specification guide to the Honda Shine 125 in India, with useful questions for used-bike buyers.",
    bestFor: "Everyday commuters who prioritise straightforward ownership and comfort.", image: "https://edge.sitecorecloud.io/hondamotorc388f-hmsi8ece-prodb777-e813/media/Project/HONDA2WI/honda2wheelersindia/new_asset_compressed/meta/Motorcycle/Redwing/Shine-125.jpg?h=630&iar=0&w=1200",
    officialUrl: "https://www.honda2wheelersindia.com/motorcycle/shine-125", usedCollection: "/used-bikes-bihar/honda",
    highlights: ["123.94cc PGM-FI engine", "OBD2B-compliant current model", "Digital meter and idling stop system on current model"],
    specifications: [{ label: "Engine", value: "123.94cc, single-cylinder PGM-FI" }, { label: "Power", value: "7.93 kW at 7,500 rpm" }, { label: "Torque", value: "11 Nm at 6,000 rpm" }, { label: "Front brake", value: "130mm drum or 240mm disc, by variant" }, { label: "Charging", value: "USB-C socket on current model" }],
    usedChecks: ["Check the engine is smooth at idle and during a short ride.", "Inspect tyres, chain cover, brakes and suspension for daily-use wear.", "Verify the service history and the actual variant before agreeing on price."],
  },
  {
    slug: "hero-splendor-plus", brand: "Hero", model: "Splendor Plus", category: "Commuter motorcycle",
    description: "Official guide to the Hero Splendor Plus range in India, with a practical checklist for used-bike buyers.",
    bestFor: "Riders seeking a light everyday commuter with widespread service support.", image: "https://www.heromotocorp.com/en-in/motorcycles/practical/media_1351a67f39f393e27e5d372ebed3ad5b147eb3cf3.avif?width=2000&format=webply&optimize=medium",
    officialUrl: "https://www.heromotocorp.com/en-in/products/motorcycles/splendor-plus", usedCollection: "/used-bikes-bihar/hero",
    highlights: ["97.2cc commuter platform", "Integrated Braking System", "i3S and features vary by Splendor Plus variant"],
    specifications: [{ label: "Engine", value: "97.2cc, air-cooled, single-cylinder" }, { label: "Power", value: "5.9 kW at 8,000 rpm" }, { label: "Torque", value: "8.05 Nm at 6,000 rpm" }, { label: "Gearbox", value: "4-speed" }, { label: "Fuel tank", value: "9.8 litres" }, { label: "Ground clearance", value: "165 mm" }],
    usedChecks: ["Start the engine cold and listen for unusual noise or smoke.", "Check chassis alignment, braking, tyres, battery and electrical functions.", "Identify whether it is standard, XTEC or XTEC 2.0 before comparing equipment."],
  },
];

export function getNewBikeGuide(slug: string) { return newBikeGuides.find((guide) => guide.slug === slug); }
