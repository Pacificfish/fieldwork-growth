# Fieldwork Growth

A responsive, static website for a done-for-you customer acquisition and booked-estimate service for specialty contractors. Plain HTML, CSS, and JavaScript; no build step or package installation.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173. You can also open `dist/index.html` directly to review the page; serve it over HTTP when testing an inquiry endpoint.

## Files

- `dist/index.html`: complete page, copy, metadata, and favicon reference.
- `dist/styles.css`: responsive styles, including reduced-motion and keyboard-focus states.
- `dist/app.js`: mobile navigation, niche selection, form validation, delivery states, and request download.
- `dist/config.js`: booking and contact settings.
- `dist/assets/marine-dock.jpg`: optimized, AI-generated illustrative dock image; not a client project or case study.
- `dist/assets/fieldwork-growth-logo.png`: the transparent Fieldwork Growth logo used in the header and footer.
- `dist/favicon.svg`: a simplified geometric F mark matching the new logo.
- `.openai/hosting.json`: private Sites preview identity and static asset directory.

## Finalize before public launch

1. Confirm the business name. **Fieldwork Growth is a working name**, not a registered or trademark-cleared identity. Update the visible name, title, metadata, favicon, footer, download copy, and README if it changes.
2. Activate the FormSubmit destination and verify an inquiry arrives in `everett@fieldwork-growth.com` (see below).
3. Confirm the operational service scope. No performance metrics, contractor results, client logos, or testimonials have been invented.
4. Keep service pricing off-page until the pilot scope is discussed. The page says “Pilot programs available” and distinguishes ad spend from the service fee.
5. Replace `noindex,nofollow` with `index,follow` once the name, delivery integration, and public domain are final. Add an absolute canonical URL, matching `og:url`, and a sitemap for the final public domain. The private review version intentionally excludes search indexing.
6. Confirm the short form privacy statement matches your actual handling of inquiries; add your business privacy policy if appropriate to your production setup.

## Booking and inquiry delivery

The form is configured to deliver inquiries through FormSubmit to **everett@fieldwork-growth.com**. FormSubmit requires a one-time activation email before forwarding submissions. Submit a setup inquiry from the live website, open the activation email in that inbox (check spam), and confirm the destination. Then submit a second test and verify it arrives. Until that final inbox check, delivery is not verified.

A direct email link is also available below the form. No mailbox password or mail-reading access is needed.

Edit the three public settings in `dist/config.js`. These settings must never contain API keys or secrets.

- `bookingUrl`: your real HTTPS scheduling link. When set, a “Choose a call time” button appears beside the inquiry form. The scheduler handles appointment availability and confirmation. No prospect details are passed in the URL.
- `formEndpoint`: your HTTPS form service or same-origin endpoint. The form sends JSON via POST. Use an endpoint you control or a form provider configured to accept JSON and CORS from your final site origin.
- `contactEmail`: your business inbox. If no endpoint is configured, a valid email enables an email-draft fallback. Visitors review and send through their own email app. The page never claims this draft was delivered.

Delivery precedence: a configured form endpoint handles submission; otherwise the email-draft fallback is used; otherwise the form remains explicitly in preview mode. Preview mode validates fields and lets the visitor download a text request. It does **not** send, store, or book anything. A booking link works independently of these options. The preview banner disappears only when a valid endpoint or email is present.

The JSON fields are `name`, `company`, `email`, `phone`, `trade`, `territory`, `projects`, `website_url` (empty honeypot), and `source`. Required fields are name, company, email, trade, and territory. Optional text is bounded in the HTML. A successful endpoint must return a 2xx response **only after accepting the inquiry**; error status codes show the retry state and preserve the visitor's inputs. Requests time out after 15 seconds. The success message confirms receipt, not an appointment.

Server-side requirements: validate and bound every field, reject spam, rate-limit abuse, restrict allowed origins, and use appropriate retention/access controls. Browser validation and the honeypot are usability aids, not server security. The static site itself has no database, email sender, CRM integration, or automatic text messaging.

Test a real inquiry from the deployed domain before sending prospects to the site. Verify receipt in the destination inbox/CRM, the error path, and the actual scheduling workflow. The provider response is checked for acceptance and activation requirements; failed requests preserve the details. Replying to a received inquiry uses the visitor's email address. FormSubmit documentation: https://formsubmit.co/documentation and https://formsubmit.co/ajax-documentation.

## Deploy

### Railway (current host)

Website: https://www.fieldwork-growth.com

Railway URL: https://website-production-1c68.up.railway.app

Project: https://railway.com/project/082ddf4a-3e6c-4fd9-9da1-568870e26fd6

The `website` service in the `fieldwork-growth` project serves the unchanged `dist/` assets with Caddy. `Dockerfile`, `Caddyfile`, and `railway.json` define the production server and health check. Railway terminates HTTPS; Caddy listens on the assigned `PORT` (8080 by default). Only public website assets are copied into the container.

### GitHub source and deployment

Repository: https://github.com/Pacificfish/fieldwork-growth (private)

Production branch: `main`

The existing Railway `website` service is connected to `Pacificfish/fieldwork-growth` and deploys the `main` branch. Railway builds the website directly from GitHub.

To restore this connection if needed, use the service Source settings or a current Railway CLI:

```sh
railway service source connect --repo Pacificfish/fieldwork-growth --branch main --service website --environment production --project 082ddf4a-3e6c-4fd9-9da1-568870e26fd6
```

After pushing `main`, check that Railway deployed the new commit. If no deployment starts, explicitly deploy the latest GitHub source with a current CLI:

```sh
npx --yes --package @railway/cli@latest railway deployment redeploy --service website --environment production --from-source --yes
```

Use the existing service so its Railway URL and custom domain remain attached. `Dockerfile` and `railway.json` are already in the repository. Version the script and stylesheet URLs in `index.html` when updating these assets so returning visitors receive the current form settings.

For local changes:

```sh
git clone https://github.com/Pacificfish/fieldwork-growth.git
cd fieldwork-growth
# Make and review changes, then commit and push main.
```

Direct-upload fallback, if explicitly needed:

```sh
railway link --project 082ddf4a-3e6c-4fd9-9da1-568870e26fd6 --environment production --service website
railway up --service website
```

Reference: [Railway GitHub autodeploys](https://docs.railway.com/deployments/github-autodeploys).

The Railway deployment is public. The previous Sites URL remains an owner-private review copy; Railway updates do not automatically update that copy. No database, volume, or paid add-on was added. Hosting uses the existing Railway account and its usage billing.

The inquiry form uses the FormSubmit destination in `dist/config.js`. Email activation and an inbox receipt test are required before relying on delivery. Search indexing remains disabled until the business identity and contact integration are finalized, as described above.

Deployment references: [Railway CLI deployment](https://docs.railway.com/cli/deploying), [Caddy static files](https://caddyserver.com/docs/caddyfile/directives/file_server).

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
