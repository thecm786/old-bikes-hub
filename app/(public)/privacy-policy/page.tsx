import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Privacy Policy",
  "Read how Old Bikes Hub handles enquiry and website information.",
  "/privacy-policy"
);

const updated = "11 October 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-gray-100 py-10 sm:py-14"><article className="mx-auto max-w-4xl px-4"><div className="rounded-3xl bg-black p-7 text-white shadow-xl sm:p-10"><p className="text-sm font-bold uppercase tracking-wide text-orange-400">Old Bikes Hub</p><h1 className="mt-3 text-3xl font-black sm:text-4xl">Privacy Policy</h1><p className="mt-4 text-gray-300">Last updated: {updated}</p></div><div className="mt-6 space-y-8 rounded-3xl bg-white p-7 leading-7 text-gray-700 shadow-lg sm:p-10"><section><h2 className="text-2xl font-black text-gray-900">Information we collect</h2><p className="mt-3">When you submit a contact or sell-bike enquiry, we may collect the details you provide, such as your name, phone number, email address, location and message. We also receive basic technical and usage information through website analytics, such as pages viewed and device type.</p></section><section><h2 className="text-2xl font-black text-gray-900">How we use information</h2><p className="mt-3">We use enquiry details to respond, confirm bike availability, provide buyer or seller support and improve our website. We do not sell personal information. We may use service providers that help us host the website, measure website use or communicate with customers.</p></section><section><h2 className="text-2xl font-black text-gray-900">Cookies and analytics</h2><p className="mt-3">Our website may use cookies or similar technologies for essential website functions and analytics. These help us understand how visitors use the site so we can improve pages and services. You can control cookies in your browser settings.</p></section><section><h2 className="text-2xl font-black text-gray-900">Data sharing and security</h2><p className="mt-3">We share information only when needed to operate the service, respond to your request, comply with law or protect our rights and users. We use reasonable safeguards, but no online service can guarantee complete security.</p></section><section><h2 className="text-2xl font-black text-gray-900">Your choices and contact</h2><p className="mt-3">You can ask us to update or remove your enquiry information, subject to legal and operational requirements. For privacy questions, use the contact details on our Contact page.</p></section></div></article></main>
  );
}
