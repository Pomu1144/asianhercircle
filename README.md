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
| Stories | `stories.html` | Member profiles (Kristin Ma), share your story |
| Contact | `contact.html` | Contact form, partnership / speaking / press inquiries |
| Member login | `portal.html` | Sign-in screen for the future member area |

## Brand system

All tokens live at the top of `assets/css/styles.css`:

- **Primary:** Primary Purple `#51217D`, Royal Purple `#6D2FA3`, Soft Violet `#9564C5`
- **Secondary:** Deep Navy Blue `#074787`, Bright Brand Blue `#0876C9`
- **Accent:** Warm Gold `#D6A431` (used sparingly: section markers, active nav)
- **Neutrals:** Soft Lavender `#F3ECFA`, Lavender Gray `#E6DDF0`, Warm White `#FDFCFD`, Dark Plum `#271538` (body text)
- **Gradients:** signature, purple-to-blue, soft lavender
- **Type:** Playfair Display (headings), Montserrat (body), via Google Fonts

Photography in `assets/img/` was generated with Higgsfield.

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
