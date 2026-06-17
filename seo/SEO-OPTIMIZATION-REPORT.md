# SEO Optimization Report — The Diaspora App

**Domain:** https://www.thediaspora.app
**Date:** 2026-06-17
**Method:** `ultimate_google_seo_skill.md`, grounded against current Google Search Central docs.

> No SEO work guarantees #1. Google does not guarantee crawling, indexing, or ranking. This report maximizes *eligibility, relevance, and technical health* and avoids spam tactics.

---

## 0. Grounding corrections (where the skill is now out of date)

Verified against current Google guidance (June 2026):

| Skill says | Current Google reality | What we did |
|---|---|---|
| Add **FAQPage** schema (Phase G7) for rich results | FAQ rich results were restricted to gov/health in **Aug 2023** and have since been **removed entirely**. FAQ markup yields **no visual rich result** now. | Keep existing FAQ markup on `african-restaurants-dubai.html` (still valid, mildly helps AI parsing) but **do not invest** in FAQ schema for SERP real estate. |
| **HowTo** rich results | Deprecated. | Not used. N/A. |
| FID in Core Web Vitals | Replaced by **INP** (March 2024). | Report targets LCP / INP / CLS. |
| Positioning keywords ("diaspora networking platform") | The product is a **UAE African-business discovery marketplace** (cuisine, clothing, goods, services). | Keyword map rewritten to match real intent (Section 6). |

Sources: Google Search Central structured-data docs; Search Engine Land "rise and fall of FAQ schema"; Search Engine Journal HowTo/FAQ downgrade.

---

## 1. Current SEO score (rubric /100)

| Area | Score | Notes |
|---|---|---|
| Technical crawl/index | 18/20 | robots.txt strong; canonicals on 25 pages; HTTPS; clean URLs. −2: seed `business.html?id=b1..b8` deep links may be soft-404 if not in Firestore. |
| Metadata & appearance | 13/15 | Unique titles/descriptions; OG added to trust pages this pass. |
| Content & intent | 15/20 | Strong home + 1 vertical landing page (cuisine). −5: 3 of 4 target verticals (clothing/goods/services) have no dedicated page yet. |
| Structured data | 9/10 | Organization+WebSite (home), LocalBusiness (business), CollectionPage (restaurants/feed/best), Breadcrumb. |
| Internal linking | 8/10 | Home→landing link added; cross-links good. Room for a UAE hub. |
| Core Web Vitals | 8/10 | Vanilla HTML, fast. Watch Unsplash hero LCP + client-rendered listings. |
| Trust/brand/conversion | 9/10 | Privacy/terms/contact/verification, no-commission, badges. |
| Search Console readiness | 4/5 | Sitemap clean post-fix; needs property + submission. |
| **Total** | **~84/100** | Solid base; content cluster is the growth lever. |

---

## 2. Changes implemented this pass

| File | Change | Reason |
|---|---|---|
| `sitemap.xml` | Removed `become-seller.html` (it's `noindex`) | Google/skill: never list noindex URLs in the sitemap |
| `about.html`, `contact.html` | Added Open Graph + Twitter card tags | Were missing social previews |
| `best.html`, `feed.html` | Added `CollectionPage` JSON-LD | Top discovery pages had no structured data |
| (earlier) `african-restaurants-dubai.html` | New cuisine landing page + CollectionPage/Breadcrumb/ItemList/FAQ schema, real flag images | First cluster page |
| (earlier) `privacy.html` | Account/data-deletion section + working emails | Compliance + trust |

---

## 3. Top issues & priorities (remaining)

| Priority | Issue | Affected | Fix |
|---|---|---|---|
| **P1** | Only 1 of 4 target verticals has a dedicated page | clothing/goods/services | Build the cluster (Section 7) — biggest ranking lever |
| **P1** | Seed business deep links may be soft-404 | `business.html?id=b1..b8` in sitemap | Verify b1–b8 exist in Firestore; if not, remove from sitemap (soft-404s waste crawl budget) |
| **P2** | No UAE topic hub tying verticals together | site architecture | Add `african-businesses-uae.html` hub linking the 4 verticals (topical authority) |
| **P2** | Client-rendered listings (feed/business) need JS to show content | feed, business | Already has static title/desc/schema; ensure Googlebot renders. Consider SSR/prerender of top business pages long-term |
| **P3** | OG/JSON-LD still missing on `careers.html`, `press.html`, `brand.html` | minor | Add when convenient |
| **P3** | "List your business" not indexable | become-seller (noindex) | Optional: build a separate *indexable* marketing page targeting "list your business UAE" |

---

## 4. Page inventory (key indexable pages)

| URL | Title (intent) | Canonical | Schema | CTA |
|---|---|:--:|---|---|
| `/` | Brand + premium discovery (navigational/brand) | ✅ | Organization, WebSite+SearchAction | Explore |
| `/feed.html` | Business directory (commercial) | ✅ | CollectionPage | Browse/contact |
| `/african-restaurants-dubai.html` | African restaurants Dubai (commercial-local) | ✅ | CollectionPage, Breadcrumb, ItemList, FAQ | Browse/list |
| `/best.html` | Top-rated leaderboard (commercial) | ✅ | CollectionPage | List business |
| `/news.html` | News from home (informational) | ✅ | CollectionPage | — |
| `/business.html?id=` | Individual business (transactional-local) | ✅ | LocalBusiness/FoodEstablishment, Breadcrumb | Order/WhatsApp |
| `/verification.html` `/pricing.html` | Trust / plans (commercial) | ✅ | present | Get verified |
| `/about.html` `/contact.html` | Company/trust | ✅ | OG added | Contact |

---

## 5. Structured data status

- **Home:** `Organization` + `WebSite` (with `SearchAction`) — ✅ correct, site-wide entity.
- **business.html:** category-aware `LocalBusiness`/`FoodEstablishment`/`BeautySalon` + `BreadcrumbList` + `AggregateRating` (only when real reviews exist — good, no fake ratings).
- **Landing/discovery:** `CollectionPage` (+ `ItemList` from live listings on the cuisine page).
- **FAQ:** present on cuisine page; **no rich-result value anymore** (see Section 0) — kept for AI parsing only.
- Validate any new types in the [Rich Results Test](https://search.google.com/test/rich-results).

---

## 6. Keyword map (rewritten for real positioning)

Primary market: **UAE (Dubai-led)**. Model: **marketplace / local discovery**.

| Page | Primary keyword | Secondary | Intent |
|---|---|---|---|
| `/african-restaurants-dubai.html` | African restaurants Dubai | African food Dubai, Cameroonian/Nigerian/Ethiopian restaurant Dubai, African cuisine UAE | commercial-local |
| **(build)** `/african-clothing-dubai.html` | African clothing Dubai | Ankara Dubai, African fashion UAE, African tailor Dubai | commercial-local |
| **(build)** `/african-grocery-stores-dubai.html` | African grocery Dubai | African store/shop UAE, African foodstuff Dubai | commercial-local |
| **(build)** `/african-services-dubai.html` | African hair salon Dubai | African braiding Dubai, African barber UAE, African beauty Dubai | commercial-local |
| **(build)** `/african-businesses-uae.html` (hub) | African businesses UAE | diaspora businesses Dubai, African owned businesses UAE | commercial |
| `/best.html` | best African restaurants Dubai | top diaspora businesses UAE | commercial |
| `/news.html` | African news today | Cameroon news, African newspapers online | informational |
| `/` | The Diaspora App | — | brand/navigational |

Rules applied: one primary intent per page; no cannibalization; natural, entity-rich language; no stuffing.

---

## 7. 90-day content roadmap (the actual growth lever)

**Weeks 1–3 — complete the UAE cluster** (replicate the proven cuisine template, Cameroon-first, real flag images):
- `african-clothing-dubai.html`, `african-grocery-stores-dubai.html`, `african-services-dubai.html`
- `african-businesses-uae.html` hub linking all four + cross-link the four to each other
- Add all to `sitemap.xml`; add a homepage footer "Popular in the UAE" column

**Weeks 4–8 — supporting blog cluster** (topical authority, link up to the money pages):
- "Where to find African food in Dubai (by neighbourhood)"
- "A guide to Cameroonian dishes — fufu & eru, achu, ekwang"
- "How to find an African hair braider in Dubai"
- "Ankara & African fashion tailors in the UAE"

**Weeks 9–12 — depth + city expansion:**
- Abu Dhabi variants only where real listings exist (avoid thin/doorway pages — Google penalizes those)
- Encourage real reviews (feeds `best.html` ranking signal)

**Off-page (owner actions — not codeable):**
1. Google Search Console: add domain property (DNS verify) → submit `sitemap.xml` → URL-inspect the cuisine page + home.
2. Google Business Profiles for the directory and verified businesses (Map-pack visibility for "African restaurant Dubai").
3. Backlinks: UAE expat/African-community directories, event pages, socials.

---

## 8. Search Console submission checklist

- [ ] Add domain property `thediaspora.app`, verify via DNS
- [ ] Submit `https://www.thediaspora.app/sitemap.xml`
- [ ] URL-inspect + request indexing: `/`, `/african-restaurants-dubai.html`, `/feed.html`, `/best.html`
- [ ] Check Page Indexing for soft-404s (esp. `business.html?id=b1..b8`)
- [ ] Monitor: Performance (queries/CTR), Core Web Vitals, Rich results, Manual actions, Security

---

## 9. Risks & disclaimers

Rankings depend on competition, domain authority, backlinks, content quality, user satisfaction, and Google's systems — none fully in our control. This work maximizes eligibility and relevance; it does not and cannot guarantee position #1.
