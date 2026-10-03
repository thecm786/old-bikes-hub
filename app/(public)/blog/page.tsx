import Link from "next/link";
import { blogPosts } from "@/lib/blogPosts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Used Bike Guides for Bihar Buyers", "Helpful guides for buying and selling used bikes in Bihar. Learn about inspections, documents, prices and ownership transfer.", "/blog");

export default function BlogPage() {
  return <section className="mx-auto max-w-5xl px-4 py-10"><h1 className="text-3xl font-black">Used Bike Guides for Bihar Buyers</h1><p className="mt-4 max-w-3xl text-gray-700">Practical guides to help you check a bike, compare listings and complete a used-bike purchase with confidence.</p>
    <div className="mt-8 grid gap-6 md:grid-cols-2">{blogPosts.map(post => <article key={post.slug} className="rounded-2xl border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">{post.readTime}</p><h2 className="mt-2 text-xl font-bold"><Link href={`/blog/${post.slug}`} className="hover:text-orange-700">{post.title}</Link></h2><p className="mt-3 text-gray-700">{post.description}</p><Link href={`/blog/${post.slug}`} className="mt-5 inline-block font-semibold text-orange-700 underline">Read guide</Link></article>)}</div>
  </section>;
}
