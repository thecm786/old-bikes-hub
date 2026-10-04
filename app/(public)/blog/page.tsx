import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blogPosts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Used Bike Guides for Bihar Buyers", "Helpful guides for buying and selling used bikes in Bihar. Learn about inspections, documents, prices and ownership transfer.", "/blog");

export default function BlogPage() {
  return <section className="bg-gray-100 py-10"><div className="mx-auto max-w-5xl px-4"><div className="rounded-3xl bg-black px-6 py-10 shadow-xl sm:px-10"><p className="text-sm font-bold uppercase tracking-wide text-orange-400">Old Bikes Hub guides</p><h1 className="mt-2 text-3xl font-black text-white">Used Bike Guides for Bihar Buyers</h1><p className="mt-4 max-w-3xl text-gray-300">Practical guides to help you check a bike, compare listings and complete a used-bike purchase with confidence.</p></div>
    <div className="mt-8 grid gap-6 md:grid-cols-2">{blogPosts.map(post => <article key={post.slug} className="overflow-hidden rounded-3xl bg-white shadow-lg"><div className="relative h-48"><Image src={post.coverImage} alt={post.coverAlt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div><div className="p-6"><p className="text-sm font-semibold text-orange-600">{post.readTime}</p><h2 className="mt-2 text-xl font-black text-gray-900"><Link href={`/blog/${post.slug}`} className="hover:text-orange-700">{post.title}</Link></h2><p className="mt-3 text-gray-700">{post.description}</p><Link href={`/blog/${post.slug}`} className="mt-5 inline-block rounded-xl bg-black px-4 py-2 font-bold text-white hover:bg-orange-500">Read guide</Link></div></article>)}</div>
  </div></section>;
}
