# Technical SEO Audit — The Diaspora App

- **Domain:** https://www.thediaspora.app
- **Audited:** 2026-06-30
- **Scope:** Public web app (Firebase App Hosting; vanilla HTML/CSS/JS, server `dev-server.js`)
- **Method:** Code audit + live Lighthouse (Chrome DevTools) + grounding against current Google Search Central docs.

> **Honest framing (per Google):** Google does not guarantee crawling, indexing, or ranking. This audit maximizes technical eligibility and content quality. Ranking for competitive UAE terms also requires off‑page work (backlinks, Google Business Profiles, reviews) and time — see `search-console-checklist.md` and `content-roadmap-90day.md`.

## Lighthouse — flagship landing page (mobile)
`african-restaurants-dubai.html`, representative of the 5 cluster pages:

| Category | Before | After fixes (expected) |
|---|---|---|
| SEO | **100** | 100 |
| Accessibility | 92 | ~100 |
| Best Practices | 77 | ~96 |
| Agentic Browsing | 100 | 100 |

## Issues found & fixes applied (this pass)

| Priority | Issue | Pages | Fix |
|---|---|---|---|
| P2 | **Color contrast fails WCAG AA** — brass `#D4AF37` gold text on light bg = 2.1:1 (kicker, heading `<em>`, "more" links, ratings) | all 5 landing pages | Switched gold **text** to `#8C6A0A` (5.0:1, passes AA) in `landing.css` + cuisine inline. Bright brass kept for borders/accents. |
| P2 | **Third‑party cookie** (`NID` from `apis.google.com`) + inspector issue | all 5 landing pages | Landing pages now use a **Firestore‑Lite** client (`firestore-landing.js`) — no Firebase Auth/Analytics → no gapi/Google‑Sign‑In load → no third‑party cookie, and less JS (faster). |
| P1 | **`noindex` page in sitemap** (`become-seller.html` is an onboarding flow) | sitemap | Removed from `sitemap.xml`. |
| P2 | Missing **Open Graph** on trust pages | `about.html`, `contact.html` | Added OG + Twitter card tags. |
| P3 | Missing **JSON‑LD** on top discovery pages | `best.html`, `feed.html` | (Pending) add `CollectionPage` — recommended, not yet applied. |

## Verified healthy ✅
- **HTTPS** everywhere; new pages return 200; `robots.txt` + `sitemap.xml` accessible (200).
- **robots.txt** welcomes Googlebot + AI crawlers; does not block CSS/JS/images; disallows auth/admin/config only.
- **Crawlable content in static HTML** on landing pages (titles, copy, grids, FAQ) — not JS‑dependent. Live business listings are progressive enhancement (JS), with static fallback text.
- **Canonicals** present on 25+ pages; **unique titles/descriptions**; one H1 per page; semantic `<main>/<section>/<header>/<footer>`.
- **Structured data** valid: Organization + WebSite (+SearchAction) on home; CollectionPage + BreadcrumbList on the 5 cluster pages; LocalBusiness/FoodEstablishment + Breadcrumb on `business.html`; ItemList injected from live listings.
- **Business deep links** `business.html?id=b1…b8` confirmed to resolve to real Firestore docs (no soft‑404s).
- Real `<a href>` internal links; new **"Popular in the UAE"** homepage footer column + hub↔vertical cross‑linking.

## Grounded corrections to common SEO advice (current Google docs)
- **FAQ rich results are effectively gone.** Google restricted FAQ rich results to authoritative gov/health sites (Aug 2023) and removed them entirely (2026). FAQ markup now yields **no visual rich result** for a marketplace. We keep visible FAQs (good for users + AI parsing) but do **not** rely on FAQPage schema for SERP features. (Sources: Search Engine Land, Search Engine Journal.)
- **HowTo rich results** are also deprecated — not used.
- Still fully supported & used here: **Organization, WebSite, BreadcrumbList, ItemList, LocalBusiness/FoodEstablishment, CollectionPage, Article/BlogPosting**.

## Remaining / owner decisions
- **Core Web Vitals (LCP/INP/CLS) field data**: not yet available (new/low‑traffic site → no CrUX). Lab signals are good (lightweight static pages). Re‑check in PageSpeed Insights after traffic builds.
- `best.html` / `feed.html` `CollectionPage` JSON‑LD — recommended, pending.
- Other site pages (home, about, etc.) still use bright brass `#D4AF37` for some text — same contrast trade‑off. Decide whether to darken site‑wide (brand decision) or leave.
- Landing pages no longer fire Google Analytics (lite client). **Measure their SEO performance in Search Console** (per‑page impressions/clicks/position), which is the SEO‑relevant data anyway.
