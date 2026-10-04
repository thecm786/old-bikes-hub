import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewBikeGuide, newBikeGuides } from "@/lib/newBikeGuides";
import { jsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return newBikeGuides.map((guide) => ({ slug: guide.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getNewBikeGuide((await params).slug);
  return guide ? pageMetadata(`${guide.brand} ${guide.model} Guide India | Specs and Used-Bike Checks`, guide.description, `/new-bikes-india/${guide.slug}`) : {};
}

export default async function NewBikeGuidePage({ params }: Props) {
  const guide = getNewBikeGuide((await params).slug);
  if (!guide) notFound();
  const url = `${SITE_URL}/new-bikes-india/${guide.slug}`;
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: `${guide.brand} ${guide.model} Guide India`, description: guide.description, mainEntityOfPage: url, author: { "@type": "Organization", name: "Old Bikes Hub" }, publisher: { "@type": "Organization", name: "Old Bikes Hub", url: SITE_URL } };
  return <article className="bg-gray-100 py-10"><div className="mx-auto max-w-4xl px-4">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    <div className="overflow-hidden rounded-3xl bg-black p-7 shadow-xl"><p className="text-sm font-bold uppercase tracking-wide text-orange-400">{guide.brand} · {guide.category}</p><h1 className="mt-2 text-3xl font-black text-white">{guide.brand} {guide.model}: India guide</h1><p className="mt-4 text-lg text-gray-300">{guide.description}</p></div>
    <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-lg"><img src={guide.image} alt={`${guide.brand} ${guide.model}`} className="h-72 w-full object-contain p-6 sm:h-96" /></div>
    <div className="mt-6 rounded-3xl bg-white p-5 shadow-lg"><h2 className="font-black text-gray-900">Before you decide</h2><p className="mt-1 text-gray-700">{guide.bestFor} Model features, prices and specifications can differ by variant and location. Confirm the current details with the manufacturer or an authorised dealer.</p></div>
    <section className="mt-9"><h2 className="text-2xl font-bold">Key specifications</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{guide.specifications.map((spec) => <div key={spec.label} className="rounded-xl border bg-white p-4"><dt className="text-sm text-gray-500">{spec.label}</dt><dd className="mt-1 font-semibold">{spec.value}</dd></div>)}</div></section>
    <section className="mt-9"><h2 className="text-2xl font-bold">Key highlights</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">{guide.highlights.map((item) => <li key={item}>{item}</li>)}</ul></section>
    <section className="mt-9"><h2 className="text-2xl font-bold">If you are buying this model used</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">{guide.usedChecks.map((item) => <li key={item}>{item}</li>)}</ul></section>
    <section className="mt-9 rounded-2xl bg-gray-900 p-6 text-white"><h2 className="text-xl font-bold">Find used {guide.brand} bikes in Bihar</h2><p className="mt-2 text-gray-200">Old Bikes Hub shows the actual listed location. Buyers from any Bihar city can enquire and confirm inspection, transfer and delivery arrangements.</p><Link href={guide.usedCollection} className="mt-4 inline-block rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white">View used {guide.brand} bikes</Link></section>
    <p className="mt-7 text-sm text-gray-600">Specification source: <a className="font-semibold text-orange-700 underline" href={guide.officialUrl} target="_blank" rel="noopener noreferrer">official {guide.brand} model page</a>.</p>
  </div></article>;
}
