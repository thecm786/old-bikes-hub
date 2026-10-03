import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, blogPosts } from "@/lib/blogPosts";
import { jsonLd, pageMetadata, SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return blogPosts.map(post => ({ slug: post.slug })); }
export async function generateMetadata({ params }: Props) {
  const post = getPost((await params).slug);
  return post ? pageMetadata(post.title, post.description, `/blog/${post.slug}`) : { robots: { index: false } };
}
export default async function BlogPostPage({ params }: Props) {
  const post = getPost((await params).slug); if (!post) notFound();
  const article = { "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.description, datePublished: post.date, dateModified: post.date, mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`, author: { "@type": "Organization", name: "Old Bikes Hub" }, publisher: { "@type": "Organization", name: "Old Bikes Hub", url: SITE_URL } };
  return <article className="mx-auto max-w-3xl px-4 py-10"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(article) }} /><Link href="/blog" className="text-sm font-semibold text-orange-700 underline">← All guides</Link><p className="mt-6 text-sm text-gray-500">{post.readTime}</p><h1 className="mt-2 text-3xl font-black leading-tight">{post.title}</h1><p className="mt-5 text-lg text-gray-700">{post.description}</p>{post.sections.map(section => <section key={section.heading} className="mt-9"><h2 className="text-2xl font-bold">{section.heading}</h2>{section.paragraphs.map(text => <p key={text} className="mt-3 leading-7 text-gray-700">{text}</p>)}{section.bullets && <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}</section>)}{post.slug === "used-bike-ownership-transfer-documents-india" && <p className="mt-8"><a className="font-semibold text-orange-700 underline" href="https://vahan.parivahan.gov.in/vahanservice/vahan/" target="_blank" rel="noreferrer">Open the official VAHAN ownership-transfer service</a></p>}<aside className="mt-10 rounded-xl bg-orange-50 p-5"><h2 className="font-bold">Browse live used bikes across Bihar</h2><p className="mt-2 text-gray-700">Every listed bike can be enquired about from any Bihar city. Confirm its actual location, inspection and transport before buying.</p><Link href="/used-bikes-bihar" className="mt-3 inline-block font-semibold text-orange-700 underline">View available bikes</Link></aside></article>;
}
