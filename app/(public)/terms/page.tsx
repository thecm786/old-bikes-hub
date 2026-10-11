import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Terms of Use",
  "Terms for using Old Bikes Hub and enquiring about used bike listings.",
  "/terms"
);

export default function TermsPage() {
  return (
    <main className="bg-gray-100 py-10 sm:py-14"><article className="mx-auto max-w-4xl px-4"><div className="rounded-3xl bg-black p-7 text-white shadow-xl sm:p-10"><p className="text-sm font-bold uppercase tracking-wide text-orange-400">Old Bikes Hub</p><h1 className="mt-3 text-3xl font-black sm:text-4xl">Terms of Use</h1><p className="mt-4 text-gray-300">Last updated: 11 October 2026</p></div><div className="mt-6 space-y-8 rounded-3xl bg-white p-7 leading-7 text-gray-700 shadow-lg sm:p-10"><section><h2 className="text-2xl font-black text-gray-900">Using this website</h2><p className="mt-3">You may use Old Bikes Hub to browse listings and submit genuine enquiries. Do not misuse the website, interfere with its operation, submit false information or use content from the site without permission.</p></section><section><h2 className="text-2xl font-black text-gray-900">Listings and availability</h2><p className="mt-3">Bike details, prices, photos, kilometres and availability can change. Listing information is provided to help you compare options and is not a final offer or guarantee. Confirm the bike&apos;s current availability, actual location and all details with Old Bikes Hub before travelling or paying.</p></section><section><h2 className="text-2xl font-black text-gray-900">Buyer responsibility</h2><p className="mt-3">Before purchase, inspect the bike, verify the RC, engine and chassis numbers, insurance, service history and ownership-transfer requirements. Agree the price and handover terms directly with the relevant parties. Do not make a payment until you are satisfied with the verification and arrangement.</p></section><section><h2 className="text-2xl font-black text-gray-900">Content and links</h2><p className="mt-3">Guides are general information and do not replace a mechanic, legal adviser or official transport authority. External websites have their own terms and privacy practices.</p></section><section><h2 className="text-2xl font-black text-gray-900">Contact</h2><p className="mt-3">For a website or listing question, contact Old Bikes Hub through our Contact page. We may update these terms when the service changes.</p></section></div></article></main>
  );
}
