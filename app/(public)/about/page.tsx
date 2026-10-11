import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "About Old Bikes Hub",
  "Learn how Old Bikes Hub helps buyers compare and enquire about used bikes across Bihar.",
  "/about"
);

export default function AboutPage() {
  return (
    <main className="bg-gray-100 py-10 sm:py-14">
      <section className="mx-auto max-w-4xl px-4">
        <div className="rounded-3xl bg-black px-7 py-10 text-white shadow-xl sm:px-10">
          <p className="text-sm font-bold uppercase tracking-wide text-orange-400">About Old Bikes Hub</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">A clearer way to find a used bike in Bihar</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-300">Old Bikes Hub helps buyers view used-bike listings, compare key details and enquire before arranging an inspection. A bike may be listed in Muzaffarpur or another city, while buyers from anywhere in Bihar can contact us about it.</p>
        </div>

        <div className="mt-6 space-y-6 rounded-3xl bg-white p-7 leading-7 text-gray-700 shadow-lg sm:p-10">
          <section><h2 className="text-2xl font-black text-gray-900">What we help with</h2><p className="mt-3">Listings show the available bike&apos;s brand, model, year, kilometres, asking price, photos and actual location when provided. Our team can help buyers confirm availability and discuss a suitable inspection, document check and ownership-transfer plan.</p></section>
          <section><h2 className="text-2xl font-black text-gray-900">Buy with confidence</h2><p className="mt-3">We encourage every buyer to inspect the bike, match chassis and engine numbers with the RC, check insurance and clarify the transfer process before making a payment. Listing details are a starting point and should be verified during the transaction.</p></section>
          <section><h2 className="text-2xl font-black text-gray-900">Serving buyers across Bihar</h2><p className="mt-3">Our business is based in Bihar and customers from Patna, Muzaffarpur, Gaya, Darbhanga and other cities can enquire about available bikes. Contact us before travelling so the team can confirm the current status and location.</p></section>
          <div className="flex flex-wrap gap-3 pt-2"><Link href="/buy-bikes" className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600">Browse available bikes</Link><Link href="/contact" className="rounded-xl border border-gray-300 px-5 py-3 font-bold text-gray-900 hover:border-orange-500 hover:text-orange-700">Contact Old Bikes Hub</Link></div>
        </div>
      </section>
    </main>
  );
}
