import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Privacy Policy",
  "Read how Old Bikes Hub handles enquiries, analytics and advertising information.",
  "/privacy-policy"
);

const updated = "14 October 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-gray-100 py-10 sm:py-14">
      <article className="mx-auto max-w-4xl px-4">
        <div className="rounded-3xl bg-black p-7 text-white shadow-xl sm:p-10">
          <p className="text-sm font-bold uppercase tracking-wide text-orange-400">
            Old Bikes Hub
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Privacy Policy</h1>
          <p className="mt-4 text-gray-300">Last updated: {updated}</p>
        </div>

        <div className="mt-6 space-y-8 rounded-3xl bg-white p-7 leading-7 text-gray-700 shadow-lg sm:p-10">
          <section>
            <h2 className="text-2xl font-black text-gray-900">Information we collect</h2>
            <p className="mt-3">
              When you submit a contact, buy-bike or sell-bike enquiry, we may collect the details you provide,
              such as your name, phone number, email address, location and message. We also receive limited
              technical and usage information, such as pages viewed, browser or device type, IP address and cookie
              identifiers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900">How we use information</h2>
            <p className="mt-3">
              We use enquiry details to respond, confirm bike availability, provide buyer or seller support and
              improve our website. We do not sell personal information. We may use service providers that help us
              host the website, measure website use, show advertising or communicate with customers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900">Google services and advertising</h2>
            <p className="mt-3">
              We use Google Analytics to understand aggregate website use and may use Google AdSense to support our
              website with advertising. Google and other advertising partners may collect or receive technical
              information, including page URLs, IP address, browser or device details, cookies and similar
              identifiers. This information may be used to serve and measure ads, limit repeat ads, prevent fraud
              and, where allowed by your settings and applicable consent, personalize ads.
            </p>
            <p className="mt-3">
              We do not send the contents of enquiry forms or WhatsApp messages to Google Analytics. We use
              aggregate website events to understand which pages and contact methods are useful to visitors.
            </p>
            <p className="mt-3">
              Third parties, including Google, may place or read cookies on your browser or use web beacons and
              similar technologies when ads are served on this website. Learn more about{" "}
              <a
                className="font-semibold text-orange-700 underline decoration-orange-300 underline-offset-2 hover:text-orange-900"
                href="https://policies.google.com/technologies/partner-sites"
                rel="noopener noreferrer"
                target="_blank"
              >
                how Google uses information from sites and apps that use its services
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900">Cookies and your choices</h2>
            <p className="mt-3">
              Our website may use cookies or similar technologies for essential functions, analytics and advertising.
              You can control or delete cookies in your browser settings. You can also manage Google ad
              personalization through{" "}
              <a
                className="font-semibold text-orange-700 underline decoration-orange-300 underline-offset-2 hover:text-orange-900"
                href="https://myadcenter.google.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                My Ad Center
              </a>
              . Blocking cookies may affect some website features, and you may still see non-personalized ads.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900">Service providers</h2>
            <p className="mt-3">
              We use trusted service providers to operate Old Bikes Hub. This includes Vercel for website hosting,
              Firebase and Firestore for enquiries and alert subscriptions, Cloudinary for seller-uploaded bike
              photos, Google for analytics and advertising services, and WhatsApp or Meta when you choose to contact
              us on WhatsApp. Information is shared only when it is needed to provide the relevant service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900">Data sharing and security</h2>
            <p className="mt-3">
              We share information only when needed to operate the service, respond to your request, comply with law
              or protect our rights and users. We use reasonable safeguards, but no online service can guarantee
              complete security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900">Your choices and contact</h2>
            <p className="mt-3">
              You can ask us to update or remove your enquiry information, subject to legal and operational
              requirements. You can also ask us to withdraw a WhatsApp alert subscription at any time. For privacy
              questions or requests, email{" "}
              <a
                className="font-semibold text-orange-700 underline decoration-orange-300 underline-offset-2 hover:text-orange-900"
                href="mailto:admin@oldbikeshub.com"
              >
                admin@oldbikeshub.com
              </a>
              {" "}or use the contact details on our Contact page.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
