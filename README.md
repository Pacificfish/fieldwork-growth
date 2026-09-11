# Fieldwork Growth

A responsive, static website for a done-for-you customer acquisition and booked-estimate service for specialty contractors. Plain HTML, CSS, and JavaScript; no build step or package installation.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173. You can also open `dist/index.html` directly to review the page; serve it over HTTP when testing an inquiry endpoint.

## Files

- `dist/index.html`: complete page, copy, metadata, and embedded favicon.
- `dist/styles.css`: responsive styles, including reduced-motion and keyboard-focus states.
- `dist/app.js`: mobile navigation, niche selection, form validation, delivery states, and request download.
- `dist/config.js`: booking and contact settings.
- `dist/assets/marine-dock.jpg`: optimized, AI-generated illustrative dock image; not a client project or case study.
- `dist/favicon.svg`: replaceable working brand favicon. Update the embedded favicon in the HTML too when branding changes.
- `.openai/hosting.json`: private Sites preview identity and static asset directory.

## Finalize before public launch

1. Confirm the business name. **Fieldwork Growth is a working name**, not a registered or trademark-cleared identity. Update the visible name, title, metadata, favicon, footer, download copy, and README if it changes.
2. Fill in a real booking or inquiry destination in `dist/config.js` (see below).
3. Confirm the operational service scope. No performance metrics, contractor results, client logos, or testimonials have been invented.
4. Keep service pricing off-page until the pilot scope is discussed. The page says “Pilot programs available” and distinguishes ad spend from the service fee.
5. Replace `noindex,nofollow` with `index,follow` once the name, delivery integration, and public domain are final. Add an absolute canonical URL, matching `og:url`, and a sitemap for the final public domain. The private review version intentionally excludes search indexing.
6. Confirm the short form privacy statement matches your actual handling of inquiries; add your business privacy policy if appropriate to your production setup.

## Booking and inquiry delivery

Edit the three public settings in `dist/config.js`. These settings must never contain API keys or secrets.

- `bookingUrl`: your real HTTPS scheduling link. When set, a “Choose a call time” button appears beside the inquiry form. The scheduler handles appointment availability and confirmation. No prospect details are passed in the URL.
- `formEndpoint`: your HTTPS form service or same-origin endpoint. The form sends JSON via POST. Use an endpoint you control or a form provider configured to accept JSON and CORS from your final site origin.
- `contactEmail`: your business inbox. If no endpoint is configured, a valid email enables an email-draft fallback. Visitors review and send through their own email app. The page never claims this draft was delivered.

Delivery precedence: a configured form endpoint handles submission; otherwise the email-draft fallback is used; otherwise the form remains explicitly in preview mode. Preview mode validates fields and lets the visitor download a text request. It does **not** send, store, or book anything. A booking link works independently of these options. The preview banner disappears only when a valid endpoint or email is present.

The JSON fields are `name`, `company`, `email`, `phone`, `trade`, `territory`, `projects`, `website_url` (empty honeypot), and `source`. Required fields are name, company, email, trade, and territory. Optional text is bounded in the HTML. A successful endpoint must return a 2xx response **only after accepting the inquiry**; error status codes show the retry state and preserve the visitor's inputs. Requests time out after 15 seconds. The success message confirms receipt, not an appointment.

Server-side requirements: validate and bound every field, reject spam, rate-limit abuse, restrict allowed origins, and use appropriate retention/access controls. Browser validation and the honeypot are usability aids, not server security. The static site itself has no database, email sender, CRM integration, or automatic text messaging.

Test a real inquiry from the deployed domain before sending prospects to the site. Verify receipt in the destination inbox/CRM, the error path, and the actual scheduling workflow. No live delivery could be tested without your destination.

## Deploy

### Static hosting

Upload the contents of `dist/` to any static host, or select `dist` as the publish/output directory with no build command. A separate backend or external form service is required for submissions. All image, script, and stylesheet paths are relative. No SPA rewrite is needed.

### Sites

The included manifest identifies the private review Site. Update and publish that same Site using the Sites workflow. Do not create a replacement identity for routine edits. Private hosting is for owner review; public access and a custom domain are separate launch steps.

### Other hosting providers

On a static host such as Netlify or Cloudflare Pages, publish `dist/` with no build command. This project does not use provider-specific form handling automatically: configure a JSON endpoint or email fallback as above.

## Design and accessibility

Responsive layouts include 760px and 1050px breakpoints. The site uses semantic sections, one H1, labeled form fields, native FAQ disclosures, a skip link, keyboard focus indicators, mobile menu Escape handling, a live status region, and reduced-motion support. Google Fonts provides DM Sans; Arial/sans-serif is the fallback if that request is unavailable. No analytics or marketing trackers are included.

## Verification performed

- JavaScript syntax and local asset/anchor checks.
- Desktop visual review and mobile layout review.
- Inquiry preview validation and explicit unsent state.
- Mobile navigation, FAQ interactions, and image loading.

Actual campaign execution, CRM workflows, response automation, and client calendars described in the offer are services to implement during onboarding, not functionality supplied by this marketing website.
