# Her Circle

**Connect · Empower · Inspire** — website for Her Circle, a community of Asian women supporting each other to grow, lead, and create impact.

A static, dependency-free site (HTML, CSS, vanilla JS) built from the Her Circle brand style sheet.

## Pages

| Page | File | Contents |
| --- | --- | --- |
| Home | `index.html` | Introduction, four pillars, member spotlight, events notice, newsletter |
| About | `about.html` | Story, mission, why Her Circle exists |
| Community | `community.html` | Overview, community groups, members |
| Events | `events.html` | Upcoming (notify me), event formats, past events |
| Mentorship | `mentorship.html` | Find a mentor, how it works, become a mentor, application |
| Membership | `membership.html` | What's included, how to join, application, FAQ |
| Stories | `stories.html` | Member profiles (Kristin Ma, Kristen Kidder), share your story |
| Contact | `contact.html` | Contact form, partnership / speaking / press inquiries |
| Member login | `portal.html` | Sign-in screen for the future member area |
| Privacy Policy | `privacy.html` | What data is collected, how it's used and shared, retention, GDPR / U.S. state rights |
| Terms of Use | `terms.html` | Eligibility, membership, community conduct, content license, disclaimers, governing law |
| Cookie Policy | `cookies.html` | Browser storage in use and how to change choices |
| Not found | `404.html` | Branded error page (served automatically by GitHub Pages and most hosts) |

## Brand system

All tokens live at the top of `assets/css/styles.css`:

- **Primary:** Primary Purple `#51217D`, Royal Purple `#6D2FA3`, Soft Violet `#9564C5`
- **Secondary:** Deep Navy Blue `#074787`, Bright Brand Blue `#0876C9`
- **Accent:** Warm Gold `#D6A431` (used sparingly: section markers, active nav)
- **Neutrals:** Soft Lavender `#F3ECFA`, Lavender Gray `#E6DDF0`, Warm White `#FDFCFD`, Dark Plum `#271538` (body text)
- **Gradient:** signature gradient, used as a thin accent bar on the header
- **Type:** Playfair Display (headings), Montserrat (body), self-hosted in `assets/fonts/` (SIL Open Font License)

Photography in `assets/img/` was generated with Higgsfield in one consistent documentary style and upscaled for large screens.

## Images

Each photo is published as `NAME.jpg` (fallback) plus `NAME-800.webp`, `NAME-1600.webp` and `NAME-2400.webp`, so browsers download only the size they need. To add or replace a photo:

```sh
scripts/optimize_image.sh path/to/original.png name
```

Then use it in a page as `<img data-photo="name" alt="Describe the photo">`. The build expands this into a responsive image with dimensions and lazy loading. Add `fetchpriority="high"` for an image at the top of a page, and `sizes="..."` when it isn't full width.

## Editing

Pages are assembled from `src/` so the header, footer and icons are defined once:

```
src/partials/   layout.html, header.html, footer.html, icons.svg (menu icons)
src/pages/      one file per page (metadata comment + page body)
```

After editing anything in `src/`, rebuild the root HTML files:

```sh
python3 scripts/build.py
```

Don't edit the generated `*.html` files in the repository root directly.

## Privacy and legal

**Before launch, fill in `src/site.json`** (site URL, legal entity name, privacy contact email, mailing address, governing state) and rebuild. Setting `site_url` also turns on canonical links, absolute social-sharing URLs, and generates `sitemap.xml` and `robots.txt`. The build prints a warning while any value is still a `[placeholder]`. Have a lawyer review the Privacy Policy and Terms of Use for your organization and jurisdiction; they are a starting point, not legal advice.

**Consent banner.** Every page shows a privacy banner until the visitor chooses Accept all, Reject non-essential, or saves preferences (Essential / Analytics / Marketing). The choice is stored in the browser (`hc-consent`) and can be changed from "Privacy settings" in the footer. The banner asks again after 12 months or when `consent_version` in `src/site.json` changes, so bump that date whenever the policies change materially. A Global Privacy Control signal keeps marketing off.

**Adding analytics or marketing tools.** Don't add their scripts directly. Add them in a way that only runs after consent:

```html
<script type="text/plain" data-consent="analytics" data-src="https://example.com/analytics.js"></script>
```

Then list the tool and its cookies in `src/pages/cookies.html`, and bump `consent_version`.

**Forms** carry the notices the policies rely on: the newsletter requires an explicit opt-in checkbox, the membership form has an optional newsletter opt-in, and every form links to the Privacy Policy. When you connect the forms to a service, make sure it is listed under service providers in the Privacy Policy.

## Running locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying

The built site is in the repository root, so it can be served directly by GitHub Pages (Settings → Pages → deploy from `main`, root), Netlify, Vercel or any static host.

## Next steps

- **Forms** (newsletter, membership, mentorship, contact) show a confirmation but don't send data yet. Give each `<form data-demo>` an `action` pointing at a form service (Formspree, Netlify Forms, etc.) or your backend and it will submit normally.
- **Member login** is a placeholder screen; the member area needs authentication and a backend.
- **Content to add:** the founding story, leadership team, event dates, membership pricing, more member profiles, and member photos (Kristin Ma currently has an initials placeholder).
