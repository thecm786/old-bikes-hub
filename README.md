# Old Bikes Hub

Used-bike marketplace built with Next.js 16.3.6, React 19, TypeScript, Tailwind CSS 4, Firebase Authentication/Firestore and Cloudinary. The original foundation notes describe an earlier Supabase plan, not the current implementation.

## Verification

Use Node.js 22.18+ for the regression tests (native TypeScript support).

```sh
npm ci
npm test
npx tsc --noEmit --incremental false
npm run lint
npm run build
```

The build downloads Google Fonts and needs network access. Unit tests cover settings privacy/defaults, sell-form validation, upload errors/limits, image URL compatibility and request decisions without accessing live services. Images use responsive sizing; older third-party and signed Firebase photo URLs retain direct delivery.

## Settings and rules rollout

### Dependency maintenance

`gaxios@6.7.1` is scoped to patched `uuid@11.1.1` through an npm override. Its CommonJS v4 multipart boundary behavior is covered by a local transport test with no network requests. The remaining three moderate audit entries are the Firebase CLI → Pub/Sub → OpenTelemetry chain; resolving that chain currently requires a major dependency change. Recheck upstream Firebase CLI updates before rollout. No forced downgrade or incompatible OpenTelemetry override is applied.

### Live-site compatibility fixes

Featured bikes fall back to a single-field query and local date sorting when the composite index is unavailable. The desired index is recorded in `firestore.indexes.json` for a separately reviewed deployment; no production index is created by local checks.

Editing an existing bike preserves its published slug. Sell-request approval now reads the current request and writes the listing/status in one Firestore transaction, so a retry cannot approve an already completed request again. Existing approved requests and existing photo URLs are left intact; no migration or cleanup is performed.

Admin add/edit forms wait for uploads to finish and append new photos. Failed settings loads block saving until a successful retry, preventing defaults from overwriting saved settings. The add-bike duplicate-registration lookup is inside the error-handled save flow.

`npm test` exercises approval/rejection decisions with a simulated transaction. `npm run test:rules` runs 9 further checks against the local Firestore emulator, including actual concurrent approvals, private/public access and input validation. The emulator uses only `demo-old-bikes-hub`, never the production project. Java 21+ must be on PATH. The portable runtime downloaded for this workspace is under `node_modules/.cache/obh-java/` and is not committed.

Admin settings live in `settings/site` with admin-only access. Saving atomically writes public business fields to `publicSettings/site`; private admin name/email are excluded. Public footer/contact details and the sell-form WhatsApp destination subscribe to the public document. Missing settings use `lib/siteConfig.ts` defaults. The footer name/description are configurable; SEO metadata and listing-policy toggles remain separate from this contact-settings integration.

Local changes do not deploy Firebase rules. With Firebase CLI installed and authorized for the intended project, publish the rules before deploying the frontend:

```sh
firebase deploy --only firestore:rules --project old-bikes-hub
```

After deployment, save Admin → Settings once to create the public document, including when migrating existing settings. Verify phone/email/WhatsApp/address from a signed-out browser.

The emulator suite verifies that anonymous visitors cannot read private settings, sell requests or contact messages; non-admins cannot change listings/settings; admins can save both settings documents atomically; valid public submissions succeed; malformed fields, unexpected keys, forged status/timestamps and invalid image URLs fail. These tests validate the local rules; they do not verify which rules are currently deployed to production.

## Uploads and public submissions

Uploads accept up to 8 JPG/PNG/WebP photos, 5 MB each. Failed responses and missing/invalid image URLs are rejected. The sell form waits for uploads to finish. Firestore rules repeat sell/contact field validation.

The existing Cloudinary cloud `w4eee6vd` uses unsigned preset `old-bikes-hub`. Configure matching file-format/size restrictions in that preset: client checks cannot restrict direct API uploads. Schema validation does not rate-limit valid anonymous submissions; App Check/server-side abuse controls require separate production configuration.

Firebase client configuration is in `firebase/firebase.ts`. Admin accounts require the `admin: true` custom claim. Keep the ignored service-account JSON private and out of shared archives.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
