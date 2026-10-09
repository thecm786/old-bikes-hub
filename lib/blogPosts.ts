export type BlogPost = {
  slug: string; title: string; description: string; date: string; readTime: string;
  coverImage: string; coverAlt: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "best-second-hand-bikes-daily-use-bihar", date: "2026-10-09", readTime: "6 min read",
    coverImage: "/blog/used-bike-guide-cover.png", coverAlt: "Reliable used commuter motorcycle for daily riding",
    title: "Best Second Hand Bikes for Daily Use in Bihar: How to Choose",
    description: "A practical guide for Bihar buyers comparing reliable used commuter bikes, their condition, running costs and documents.",
    sections: [
      { heading: "Choose the bike for your daily route", paragraphs: ["For regular commuting, focus on comfort, fuel use, parts availability and a model that local workshops understand. A commuter bike can suit office travel, college routes and everyday family use when it has been maintained well. Consider your usual distance, road condition, pillion use and whether you need a motorcycle or a scooter."] },
      { heading: "Compare condition before comparing brand", paragraphs: ["A Honda, Hero, TVS or Bajaj commuter with clear service history can be a better purchase than a newer-looking bike with neglected maintenance. Compare similar model years, kilometres, tyre condition, brake wear, battery health and insurance status. The bike's actual condition matters more than a low asking price alone."] },
      { heading: "Check the total cost after purchase", paragraphs: ["Keep a part of your budget aside for insurance renewal, ownership transfer, a basic service and wear items such as tyres, chain-sprocket set or battery. Ask about recent maintenance and check whether the quoted price includes any accessories. This helps you compare two listings fairly."] },
      { heading: "Inspect before buying a second hand bike", paragraphs: ["See the bike in person before payment. Start it from cold, test the clutch, gearbox, brakes, lights and indicators, and look for oil leaks or accident repairs. Match the engine and chassis numbers with the RC, check the available insurance and agree the ownership-transfer process before finalising the deal."], bullets: ["Confirm the bike is available before travelling.", "Check the actual location shown on the listing.", "Take a trusted mechanic if you are unsure about the condition."] },
      { heading: "Find available used bikes across Bihar", paragraphs: ["Old Bikes Hub shows the year, kilometres, price, photos and actual location for available listings. Buyers from Patna, Muzaffarpur, Gaya, Darbhanga and other Bihar cities can compare options and enquire before arranging an inspection."] },
    ],
  },
  {
    slug: "tvs-victor-second-hand-price-bihar", date: "2026-10-09", readTime: "5 min read",
    coverImage: "/blog/used-bike-guide-cover.png", coverAlt: "Used commuter motorcycle ready for inspection",
    title: "TVS Victor Second Hand Price in Bihar: What to Check",
    description: "A practical guide to comparing a used TVS Victor’s price, condition, documents and running costs before buying in Bihar.",
    sections: [
      { heading: "Why TVS Victor second hand prices vary", paragraphs: ["A used TVS Victor does not have one fixed market price. The year, kilometres, service history, tyre condition, insurance validity, location and ownership record all affect the value. Compare listings with a similar year and condition before treating an asking price as fair."] },
      { heading: "Compare the full cost, not only the bike price", paragraphs: ["Keep room in your budget for a service, insurance renewal, RC transfer and any wear items found during inspection. A lower-priced bike can cost more after purchase if tyres, battery, chain-sprocket set or brakes need attention."] },
      { heading: "Inspect a used TVS Victor before buying", paragraphs: ["Start the motorcycle from cold, listen for unusual engine noise and test the clutch, gears, brakes, lights and indicators. Check the frame, fork area, tyres and chain for damage or heavy wear. Match the engine and chassis numbers with the RC before paying."], bullets: ["Confirm the model year and odometer reading.", "Ask for service records and insurance details where available.", "Arrange an in-person inspection before travel or payment."] },
      { heading: "Buying from Muzaffarpur or another Bihar city", paragraphs: ["Old Bikes Hub listings show the bike's actual location. Whether you are buying from Muzaffarpur, Patna, Gaya, Darbhanga or another Bihar city, confirm the bike is available and agree inspection, documents and ownership-transfer arrangements before making a payment."] },
    ],
  },
  {
    slug: "used-bike-buying-checklist-bihar", date: "2026-10-03", readTime: "6 min read",
    coverImage: "/blog/used-bike-buying-checklist-bihar.png", coverAlt: "Customer inspecting a used motorcycle before buying",
    title: "Used Bike Buying Checklist for Bihar Buyers",
    description: "A practical checklist for checking a second hand bike’s condition, documents, price and location before you buy.",
    sections: [
      { heading: "Start with the listing details", paragraphs: ["Compare the model, year, kilometres, asking price and actual location. Ask if the bike is still available before travelling. A low price is not enough by itself; the documents and condition should match the listing."] },
      { heading: "Inspect the bike in person", paragraphs: ["Check cold start, engine sound, brakes, tyres, lights, chain or belt, suspension and visible leaks. Take a test ride only after the owner or dealer agrees. If you are unsure about a mechanical issue, bring a trusted mechanic."], bullets: ["Match the chassis and engine numbers with the registration details.", "Look for accident damage, uneven paint and worn tyres.", "Check the odometer reading against service records where available."] },
      { heading: "Confirm documents before payment", paragraphs: ["Ask to see the registration certificate, valid insurance and available service history. Check whether there is an active loan or hypothecation. Keep copies of the agreed price, seller details and delivery date."] },
      { heading: "Buy from any Bihar city with clarity", paragraphs: ["A bike can be listed in Muzaffarpur and bought by a customer from Patna, Motihari, Gaya or another Bihar city. Confirm inspection, transport and ownership-transfer arrangements before paying any amount."] },
    ],
  },
  {
    slug: "best-used-bikes-under-50000-bihar", date: "2026-10-03", readTime: "5 min read",
    coverImage: "/blog/best-used-bikes-under-50000-bihar.png", coverAlt: "Affordable used commuter bikes in a showroom",
    title: "How to Choose a Used Bike Under ₹50,000 in Bihar",
    description: "How to choose a reliable second hand motorcycle or scooter within a ₹50,000 budget in Bihar.",
    sections: [
      { heading: "Keep money aside after the purchase", paragraphs: ["Do not spend your full budget only on the bike price. Reserve an amount for insurance, ownership transfer, a service, tyre or battery replacement if needed. This makes a budget bike safer to use from day one."] },
      { heading: "Prioritise condition over a newer year", paragraphs: ["A well-maintained older bike can be a better choice than a newer bike with neglected servicing. Compare kilometres, service records, tyres, brakes and engine condition before deciding."] },
      { heading: "Popular budget choices", paragraphs: ["Commuter bikes and scooters are often practical at this budget because parts and servicing are widely available. Select by your daily distance, road conditions, pillion use and availability of local service support."], bullets: ["Choose a model with easily available parts.", "Check RC, insurance and ownership-transfer feasibility.", "Inspect before you pay or arrange transport."] },
    ],
  },
  {
    slug: "used-royal-enfield-classic-350-buying-guide", date: "2026-10-03", readTime: "6 min read",
    coverImage: "/blog/used-royal-enfield-classic-350-buying-guide.png", coverAlt: "Classic style used motorcycle in a showroom",
    title: "Used Royal Enfield Classic 350 Buying Guide",
    description: "What to inspect before buying a used Royal Enfield Classic 350 in Bihar: condition, service history, documents and price comparison.",
    sections: [
      { heading: "Compare more than the asking price", paragraphs: ["Classic 350 prices differ by model year, variant, kilometres, condition and service history. Compare several listings with the same year range before you decide. Photos help, but an in-person inspection is essential."] },
      { heading: "Check condition carefully", paragraphs: ["Look at the engine start, clutch, gearbox shifts, brake feel, tyres, chain, suspension and electrical functions. Check for oil leaks, unusual sounds and signs of accident repair. A test ride can reveal issues that photos cannot show."] },
      { heading: "Documents and transfer", paragraphs: ["Verify the RC and insurance details with the seller. Confirm the chassis number matches the documentation and that there is no unresolved loan. Agree the ownership-transfer process before payment."] },
    ],
  },
  {
    slug: "used-bike-ownership-transfer-documents-india", date: "2026-10-03", readTime: "4 min read",
    coverImage: "/blog/used-bike-ownership-transfer-documents-india.png", coverAlt: "Used bike ownership transfer documents and keys",
    title: "Used Bike Ownership Transfer: What to Check Before You Buy",
    description: "A simple guide to preparing for used bike ownership transfer and verifying the key registration details.",
    sections: [
      { heading: "Make transfer part of the purchase", paragraphs: ["Do not treat transfer as an afterthought. Confirm who will initiate the application, when the required details will be shared and how you will receive confirmation. Keep the seller’s contact details until the process is complete."] },
      { heading: "Verify the basics", paragraphs: ["Check the RC, insurance status, matching chassis number and whether the registration has a loan or hypothecation. Ask the seller to clarify any mismatch before you proceed."] },
      { heading: "Use the official service", paragraphs: ["Parivahan’s VAHAN citizen service provides an ownership-transfer service and its process can change by state or case. Use the official portal and follow the current instructions for your vehicle rather than relying on old screenshots or unofficial forms."], bullets: ["Review the official transfer process before payment.", "Confirm required documents and fees for the current case.", "Keep application and payment acknowledgements."] },
    ],
  },
];

export function getPost(slug: string) { return blogPosts.find(post => post.slug === slug); }
