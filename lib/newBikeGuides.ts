export type NewBikeGuide = {
  slug: string;
  brand: string;
  model: string;
  description: string;
  category: string;
  bestFor: string;
  image?: string;
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

const additionalGuides: NewBikeGuide[] = [
  { slug: "hero-xtreme-125r", brand: "Hero", model: "Xtreme 125R", category: "Sporty commuter", description: "Hero Xtreme 125R guide for Indian buyers, with practical inspection points for pre-owned examples.", bestFor: "Riders who want a sporty daily 125cc motorcycle.", officialUrl: "https://www.heromotocorp.com/en-in/motorcycles/xtreme-125r.html", usedCollection: "/used-bikes-bihar/hero", highlights: ["125cc commuter segment", "Sporty street styling", "Check variant-specific braking equipment"], specifications: [{ label: "Segment", value: "125cc sporty commuter" }, { label: "Details", value: "Confirm current variant on Hero's official page" }], usedChecks: ["Inspect tyres, forks and brake condition.", "Confirm service history and the exact variant." ] },
  { slug: "hero-hf-deluxe", brand: "Hero", model: "HF Deluxe", category: "Commuter motorcycle", description: "Hero HF Deluxe guide for Indian commuters and used-bike buyers.", bestFor: "Budget-conscious daily commuting.", officialUrl: "https://www.heromotocorp.com/en-in/motorcycles/hf-deluxe.html", usedCollection: "/used-bikes-bihar/hero", highlights: ["97.2cc commuter platform", "Simple everyday ownership", "Wide service network"], specifications: [{ label: "Engine", value: "97.2cc" }, { label: "Details", value: "Confirm current variant on Hero's official page" }], usedChecks: ["Check cold start, smoke and engine noise.", "Inspect chain, tyres and registration details." ] },
  { slug: "tvs-raider", brand: "TVS", model: "Raider", category: "Sporty commuter", description: "TVS Raider guide for riders comparing a popular 125cc motorcycle in India.", bestFor: "Young riders wanting a feature-focused commuter.", officialUrl: "https://www.tvsmotor.com/tvs-raider", usedCollection: "/used-bikes-bihar/tvs", highlights: ["125cc commuter category", "Sporty riding position", "Variant features differ"], specifications: [{ label: "Segment", value: "125cc commuter" }, { label: "Details", value: "Confirm current variant on TVS's official page" }], usedChecks: ["Test clutch, gearbox and brakes.", "Check the meter and electrical functions." ] },
  { slug: "tvs-apache-rtr-200-4v", brand: "TVS", model: "Apache RTR 200 4V", category: "Performance street motorcycle", description: "TVS Apache RTR 200 4V guide with points for buyers comparing new and used bikes.", bestFor: "Riders who want a performance-focused street motorcycle.", officialUrl: "https://www.tvsmotor.com/tvs-apache/motorcycle/tvs-apache-rtr-200-4v", usedCollection: "/used-bikes-bihar/tvs", highlights: ["200cc performance segment", "Street-bike ergonomics", "Check exact variant features"], specifications: [{ label: "Segment", value: "200cc street motorcycle" }, { label: "Details", value: "Confirm current variant on TVS's official page" }], usedChecks: ["Inspect engine response, brakes and suspension.", "Look for crash damage and non-standard wiring." ] },
  { slug: "tvs-jupiter-110", brand: "TVS", model: "Jupiter 110", category: "Family scooter", description: "TVS Jupiter 110 guide for everyday scooter buyers in India.", bestFor: "Urban commuting and family use.", officialUrl: "https://www.tvsmotor.com/tvs-jupiter", usedCollection: "/used-bikes-bihar/tvs", highlights: ["110cc scooter category", "Practical daily use", "Storage and features vary by variant"], specifications: [{ label: "Segment", value: "110cc scooter" }, { label: "Details", value: "Confirm current variant on TVS's official page" }], usedChecks: ["Check CVT smoothness and cold start.", "Inspect tyres, brakes and service history." ] },
  { slug: "tvs-ntorq-125", brand: "TVS", model: "Ntorq 125", category: "Sporty scooter", description: "TVS Ntorq 125 guide for sporty scooter buyers in India.", bestFor: "City riders who prefer a performance-oriented scooter.", officialUrl: "https://www.tvsmotor.com/tvs-ntorq", usedCollection: "/used-bikes-bihar/tvs", highlights: ["125cc scooter segment", "Sporty styling", "Multiple variants available"], specifications: [{ label: "Segment", value: "125cc scooter" }, { label: "Details", value: "Confirm current variant on TVS's official page" }], usedChecks: ["Check CVT, brakes and tyre wear.", "Verify all digital-console features work." ] },
  { slug: "honda-sp-125", brand: "Honda", model: "SP 125", category: "Commuter motorcycle", description: "Honda SP 125 guide for riders researching a daily-use motorcycle in India.", bestFor: "Comfortable everyday commuting.", officialUrl: "https://www.honda2wheelersindia.com/motorcycle/sp125", usedCollection: "/used-bikes-bihar/honda", highlights: ["125cc commuter category", "Daily-use focused", "Check exact variant equipment"], specifications: [{ label: "Segment", value: "125cc commuter" }, { label: "Details", value: "Confirm current variant on Honda's official page" }], usedChecks: ["Check engine smoothness, chain and brakes.", "Verify service history before paying." ] },
  { slug: "honda-activa-6g", brand: "Honda", model: "Activa 6G", category: "Family scooter", description: "Honda Activa 6G guide for new and used scooter buyers in India.", bestFor: "Reliable everyday city commuting.", officialUrl: "https://www.honda2wheelersindia.com/scooter/activa-6g", usedCollection: "/used-bikes-bihar/honda", highlights: ["Popular 110cc scooter category", "Family-friendly utility", "Variant features can differ"], specifications: [{ label: "Segment", value: "110cc scooter" }, { label: "Details", value: "Confirm current variant on Honda's official page" }], usedChecks: ["Check scooter start, CVT response and brakes.", "Inspect body panels and service records." ] },
  { slug: "bajaj-pulsar-150", brand: "Bajaj", model: "Pulsar 150", category: "Street commuter", description: "Bajaj Pulsar 150 guide for Indian riders comparing a familiar street motorcycle.", bestFor: "Riders wanting a practical 150cc street bike.", officialUrl: "https://www.bajajauto.com/bikes/pulsar/pulsar-150", usedCollection: "/used-bikes-bihar/bajaj", highlights: ["150cc street segment", "Established Pulsar range", "Current features vary by variant"], specifications: [{ label: "Segment", value: "150cc street commuter" }, { label: "Details", value: "Confirm current variant on Bajaj's official page" }], usedChecks: ["Inspect frame, forks and brake wear.", "Check service records and RC match." ] },
  { slug: "bajaj-pulsar-ns200", brand: "Bajaj", model: "Pulsar NS200", category: "Performance street motorcycle", description: "Bajaj Pulsar NS200 guide for riders researching a 200cc street motorcycle in India.", bestFor: "Performance-focused city and highway riders.", officialUrl: "https://www.bajajauto.com/bikes/pulsar/pulsar-ns200/specifications", usedCollection: "/used-bikes-bihar/bajaj", highlights: ["199.5cc liquid-cooled engine", "6-speed gearbox", "Dual-channel ABS"], specifications: [{ label: "Engine", value: "199.5cc liquid-cooled" }, { label: "Gearbox", value: "6-speed" }, { label: "Braking", value: "Dual-channel ABS" }], usedChecks: ["Check suspension, brakes and tyre condition.", "Inspect for crash repairs and hard use." ] },
  { slug: "yamaha-mt-15-v2", brand: "Yamaha", model: "MT-15 V2", category: "Naked street motorcycle", description: "Yamaha MT-15 V2 guide for Indian riders comparing a premium 155cc street bike.", bestFor: "Riders who want a light performance street bike.", officialUrl: "https://www.yamaha-motor-india.com/yamaha-mt-15-v2.html", usedCollection: "/used-bikes-bihar/yamaha", highlights: ["155cc street-bike category", "Naked motorcycle styling", "Variant equipment differs"], specifications: [{ label: "Segment", value: "155cc street motorcycle" }, { label: "Details", value: "Confirm current variant on Yamaha's official page" }], usedChecks: ["Inspect fork seals, wheels and body panels.", "Check chain, clutch and service record." ] },
  { slug: "royal-enfield-hunter-350", brand: "Royal Enfield", model: "Hunter 350", category: "Retro roadster", description: "Royal Enfield Hunter 350 guide for Indian riders researching a modern retro roadster.", bestFor: "City riders who like relaxed 350cc roadster styling.", officialUrl: "https://www.royalenfield.com/in/en/motorcycles/hunter-350/", usedCollection: "/used-bikes-bihar/royal-enfield", highlights: ["350cc roadster category", "Compact Royal Enfield platform", "Variant-dependent equipment"], specifications: [{ label: "Segment", value: "350cc retro roadster" }, { label: "Details", value: "Confirm current variant on Royal Enfield's official page" }], usedChecks: ["Test engine, clutch and brakes on a cold start.", "Inspect for oil leaks and accident repairs." ] },
  { slug: "royal-enfield-meteor-350", brand: "Royal Enfield", model: "Meteor 350", category: "Cruiser motorcycle", description: "Royal Enfield Meteor 350 guide for buyers comparing a cruiser motorcycle in India.", bestFor: "Relaxed riders who value a cruiser-style seating position.", officialUrl: "https://www.royalenfield.com/in/en/motorcycles/meteor/", usedCollection: "/used-bikes-bihar/royal-enfield", highlights: ["350cc cruiser segment", "Relaxed riding ergonomics", "Variant features differ"], specifications: [{ label: "Segment", value: "350cc cruiser" }, { label: "Details", value: "Confirm current variant on Royal Enfield's official page" }], usedChecks: ["Inspect chassis, tyres and brake performance.", "Check service records and exact variant." ] },
  { slug: "suzuki-access-125", brand: "Suzuki", model: "Access 125", category: "Family scooter", description: "Suzuki Access 125 guide for riders researching a 125cc daily-use scooter in India.", bestFor: "Families and city commuters who want a practical scooter.", officialUrl: "https://www.suzukimotorcycle.co.in/product-details/access-125", usedCollection: "/used-bikes-bihar", highlights: ["125cc scooter category", "Practical everyday use", "Check exact current variant"], specifications: [{ label: "Segment", value: "125cc scooter" }, { label: "Details", value: "Confirm current variant on Suzuki's official page" }], usedChecks: ["Check CVT operation, brakes and tyres.", "Verify registration, insurance and service history." ] },
];

newBikeGuides.push(...additionalGuides);

export function getNewBikeGuide(slug: string) { return newBikeGuides.find((guide) => guide.slug === slug); }

const verifiedGuideImages: Record<string, string> = {
  "bajaj-pulsar-n160": "/new-bikes/bajaj-pulsar-n160.png",
  "hero-splendor-plus": "/new-bikes/hero-splendor-plus.png",
  "hero-xtreme-125r": "https://www.heromotocorp.com/content/dam/hero-commerce/in/en/products/performance/content-fragments/xtreme-125r/assets/banner/Xtreme-125-Latest-Mob-Banner.png",
  "hero-hf-deluxe": "https://www.heromotocorp.com/content/dam/hero-commerce/in/en/products/practical/content-fragments/hf-deluxe/assets/hf-deluxe-mobile-banner_720x564pxl.jpg",
  "tvs-raider": "https://www.tvsmotor.com/tvs-raider/-/media/TVSv2/Brand-Pages/Raider2/360View/Bike_Yellow/1.png",
  "tvs-apache-rtr-200-4v": "/new-bikes/tvs-apache-rtr-200-4v.png",
  "tvs-jupiter-110": "/new-bikes/tvs-jupiter-110.png",
  "tvs-ntorq-125": "/new-bikes/tvs-ntorq-125.png",
  "honda-sp-125": "/new-bikes/honda-sp-125.png",
  "honda-activa-6g": "/new-bikes/honda-activa-6g.png",
  "bajaj-pulsar-150": "/new-bikes/bajaj-pulsar-150.png",
  "bajaj-pulsar-ns200": "/new-bikes/bajaj-pulsar-ns200.png",
  "yamaha-mt-15-v2": "/new-bikes/yamaha-mt-15-v2.png",
  "royal-enfield-hunter-350": "/new-bikes/royal-enfield-hunter-350.png",
  "royal-enfield-meteor-350": "/new-bikes/royal-enfield-meteor-350.png",
};

const guidesWithoutVerifiedPhoto = new Set<string>();

export function getNewBikeGuideImage(guide: NewBikeGuide) {
  if (guidesWithoutVerifiedPhoto.has(guide.slug)) return undefined;
  return verifiedGuideImages[guide.slug] ?? guide.image;
}
