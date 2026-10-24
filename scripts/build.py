#!/usr/bin/env python3
"""Assemble the static site.

Each file in src/pages/ starts with a metadata comment:

    <!--
    title: About
    description: Our story, mission and team.
    nav: about
    -->

The rest of the file is the page body. {{site.key}} placeholders in pages
and partials are filled from src/site.json.

<img data-photo="name" alt="..."> expands to a responsive image using
assets/img/name.jpg and its name-800/1600/2400.webp versions (made by
scripts/optimize_image.sh). Photos load lazily unless the tag sets
loading or fetchpriority. It is wrapped with the shared
partials in src/partials/ and written to the repository root, so the
site can be served as-is (e.g. GitHub Pages from the root of main).

Usage: python3 scripts/build.py
"""
import html
import json
import re
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
PARTIALS = SRC / "partials"

META_RE = re.compile(r"\A\s*<!--(.*?)-->\s*", re.S)
SITE_RE = re.compile(r"\{\{site\.(\w+)\}\}")
PHOTO_RE = re.compile(r'<img data-photo="([\w-]+)"([^>]*)>')
IMG = ROOT / "assets" / "img"
NAV_KEYS = ["home", "about", "community", "events", "mentorship", "membership", "stories", "contact"]


def read_partial(name):
    return (PARTIALS / name).read_text(encoding="utf-8")


def parse_page(text):
    match = META_RE.match(text)
    if not match:
        raise ValueError("page is missing its metadata comment")
    meta = {}
    for line in match.group(1).strip().splitlines():
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip()
    return meta, text[match.end():]


def fill_site(text, site):
    def value(match):
        key = match.group(1)
        if key not in site:
            raise KeyError(f"src/site.json has no '{key}'")
        return html.escape(site[key])
    return SITE_RE.sub(value, text)


def jpeg_size(path):
    data = path.read_bytes()
    i = 2
    while i < len(data):
        marker, length = data[i + 1], struct.unpack(">H", data[i + 2:i + 4])[0]
        if marker in (0xC0, 0xC1, 0xC2):
            height, width = struct.unpack(">HH", data[i + 5:i + 9])
            return width, height
        i += 2 + length
    raise ValueError(f"no size found in {path}")


def expand_photos(text):
    def photo(match):
        name, rest = match.group(1), match.group(2)
        jpg = IMG / f"{name}.jpg"
        width, height = jpeg_size(jpg)
        srcset = ", ".join(f"assets/img/{name}-{w}.webp {w}w" for w in (800, 1600, 2400) if (IMG / f"{name}-{w}.webp").exists())
        lazy = "" if ("loading=" in rest or "fetchpriority=" in rest) else ' loading="lazy" decoding="async"'
        sizes = "" if "sizes=" in rest else ' sizes="100vw"'
        return (f'<img src="assets/img/{name}.jpg" srcset="{srcset}"{sizes} width="{width}" height="{height}"'
                f'{rest}{lazy}>')
    return PHOTO_RE.sub(photo, text)


def is_placeholder(value):
    return value.startswith("[")


def seo_tags(page, site):
    """Canonical URL, absolute social image and Organization data. URLs need site_url to be set."""
    base = "" if is_placeholder(site["site_url"]) else site["site_url"].rstrip("/") + "/"
    path = "" if page.stem == "index" else page.name
    tags = []
    if base:
        tags.append(f'  <link rel="canonical" href="{base}{path}">')
        tags.append(f'  <meta property="og:url" content="{base}{path}">')
    tags.append(f'  <meta property="og:image" content="{base}assets/img/hero.jpg">')
    if page.stem == "index":
        org = {"@context": "https://schema.org", "@type": "Organization", "name": "Her Circle",
               "description": "A community of women supporting each other to grow, lead, and create impact.",
               "slogan": "Connect. Empower. Inspire."}
        if base:
            org.update(url=base, logo=base + "assets/icons/icon-512.png")
        if not is_placeholder(site["contact_email"]):
            org["email"] = site["contact_email"]
        tags.append('  <script type="application/ld+json">' + json.dumps(org) + "</script>")
    return "\n".join(tags)


def write_sitemap(pages, site):
    if is_placeholder(site["site_url"]):
        return False
    base = site["site_url"].rstrip("/") + "/"
    urls = "".join(f"  <url><loc>{base}{'' if p.stem == 'index' else p.name}</loc></url>\n"
                   for p in pages if p.stem != "404")
    (ROOT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n'
                                      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                                      f"{urls}</urlset>\n", encoding="utf-8")
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {base}sitemap.xml\n", encoding="utf-8")
    return True


def mark_current(header, nav):
    for key in NAV_KEYS:
        current = ' aria-current="page"' if key == nav else ""
        header = header.replace("{{current:%s}}" % key, current)
    return header


def build():
    layout = read_partial("layout.html")
    header = read_partial("header.html")
    footer = read_partial("footer.html")
    icons = read_partial("icons.svg")
    site = json.loads((SRC / "site.json").read_text(encoding="utf-8"))

    pages = sorted((SRC / "pages").glob("*.html"))
    for page in pages:
        meta, body = parse_page(page.read_text(encoding="utf-8"))
        title = meta.get("title", "")
        full_title = "Her Circle" if page.stem == "index" else f"{title} | Her Circle"
        html_out = (
            layout.replace("{{title}}", full_title)
            .replace("{{description}}", meta.get("description", ""))
            .replace("{{seo}}", seo_tags(page, site))
            .replace("{{icons}}", icons)
            .replace("{{header}}", mark_current(header, meta.get("nav", "")))
            .replace("{{footer}}", footer)
            .replace("{{body_class}}", meta.get("body_class", ""))
            .replace("{{content}}", body.strip())
        )
        html_out = expand_photos(fill_site(html_out, site))
        out = ROOT / page.name
        out.write_text("<!-- Generated by scripts/build.py from src/pages/%s. Edit the source, not this file. -->\n%s"
                       % (page.name, html_out), encoding="utf-8")
        print(f"built {out.relative_to(ROOT)}")

    if write_sitemap(pages, site):
        print("built sitemap.xml, robots.txt")

    unfilled = [k for k, v in site.items() if not k.startswith("_") and is_placeholder(v)]
    if unfilled:
        print("warning: fill in src/site.json before launch: " + ", ".join(unfilled))


if __name__ == "__main__":
    build()
