export type BlogPost = {
  slug: string; title: string; description: string; date: string; readTime: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "used-bike-buying-checklist-bihar", date: "2026-10-03", readTime: "6 min read",
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
