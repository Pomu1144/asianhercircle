# Her Circle

**Connect · Empower · Inspire** — website for Her Circle, a community of Asian women supporting each other to grow, lead, and create impact.

A static, dependency-free site (HTML, CSS, vanilla JS) built from the Her Circle brand style sheet.

## Pages

Follows the brand site map:

| Page | File | Sections |
| --- | --- | --- |
| Home | `index.html` | Hero, welcome, four pillars, impact stats, community spotlight, upcoming events, newsletter, call to action |
| About | `about.html` | Our story, mission, impact, leadership / team, why Her Circle exists |
| Community | `community.html` | Overview, community groups (career, wellness, business, personal growth, social), member directory, discussions, spotlights |
| Events | `events.html` | Filterable upcoming events, event calendar, past events |
| Mentorship | `mentorship.html` | Find a mentor, programs, success stories, become a mentor, resources, application form |
| Membership | `membership.html` | Benefits, tiers, FAQ, join form |
| Stories | `stories.html` | Featured woman, filterable member stories / interviews / success stories |
| Contact | `contact.html` | Contact form, partnership, speaking, media / press, social media |
| Member Portal | `portal.html` | Dashboard, profile, connections, messages, groups, registered events, saved resources, mentorship, account settings (front-end mock) |

## Brand system

All tokens live at the top of `assets/css/styles.css`:

- **Primary:** Primary Purple `#51217D`, Royal Purple `#6D2FA3`, Soft Violet `#9564C5`
- **Secondary:** Deep Navy Blue `#074787`, Bright Brand Blue `#0876C9`
- **Accent:** Warm Gold `#D6A431` (used sparingly: dividers, icons, highlights)
- **Neutrals:** Soft Lavender `#F3ECFA`, Lavender Gray `#E6DDF0`, Warm White `#FDFCFD`, Dark Plum `#271538` (body text)
- **Gradients:** signature, purple-to-blue, soft lavender
- **Type:** Playfair Display (headings), Montserrat (body), via Google Fonts

Icons are an inline SVG sprite (`src/partials/icons.svg`) matching the outline icon set in the style sheet. Photography in `assets/img/` was generated with Higgsfield.

## Editing

Pages are assembled from `src/` so the header, footer and icons are defined once:

```
src/partials/   layout.html, header.html, footer.html, icons.svg
src/pages/      one file per page (metadata comment + page body)
```

After editing anything in `src/`, rebuild the root HTML files:

```sh
python3 scripts/build.py
```

Don't edit the generated `*.html` files in the repository root directly.

## Running locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying

The built site is in the repository root, so it can be served directly by GitHub Pages (Settings → Pages → deploy from `main`, root), Netlify, Vercel or any static host.

## Next steps

- **Forms** (newsletter, join, mentorship, contact) currently show a success message without sending data. Give each `<form data-demo>` an `action` pointing at a form service (Formspree, Netlify Forms, etc.) or your backend and it will submit normally.
- **Member Portal** is a front-end mock; it needs authentication and a backend to become real.
- People, quotes, events and statistics are placeholder content — replace them with real members and data.
