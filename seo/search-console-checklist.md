# Google Search Console — Setup & Request‑Indexing Checklist

Domain: **https://www.thediaspora.app** · Owner: NDN Analytics

> Note: this repo already contains `googlee134fff84b2a8946.html` — a Search Console **HTML‑file verification token**, so a URL‑prefix property may already be (partly) set up. Prefer a **Domain property** (covers http/https + all subdomains).

## A. Verify the property (do once)
**Option 1 — Domain property (recommended):**
1. Go to https://search.google.com/search-console → **Add property → Domain** → enter `thediaspora.app`.
2. Copy the **TXT record** Google shows.
3. Add it at your **domain registrar's DNS** (the registrar where `thediaspora.app` is managed) as a TXT record on the root.
4. Back in GSC, click **Verify** (DNS can take minutes–hours to propagate).

**Option 2 — URL‑prefix (fallback, already half‑done):**
1. **Add property → URL prefix** → `https://www.thediaspora.app/`.
2. Verify via the **HTML file** method — confirm `https://www.thediaspora.app/googlee134fff84b2a8946.html` loads (it's in the repo). Click **Verify**.

## B. Submit the sitemap
1. GSC → **Sitemaps** → enter `sitemap.xml` → **Submit**.
2. Confirm status becomes **Success** and it discovers ~50 URLs.

## C. Request indexing — EXACT steps (the "step 1 today" list)
For each URL below: GSC top **search bar (URL Inspection)** → paste the full URL → wait for "URL is on Google / not on Google" → click **Request Indexing** → wait for "Indexing requested".

**Priority URLs (do these 6 first — the new cluster):**
```
https://www.thediaspora.app/african-businesses-uae.html
https://www.thediaspora.app/african-restaurants-dubai.html
https://www.thediaspora.app/african-clothing-dubai.html
https://www.thediaspora.app/african-grocery-stores-dubai.html
https://www.thediaspora.app/african-services-dubai.html
https://www.thediaspora.app/
```
**Then (next 5):**
```
https://www.thediaspora.app/feed.html
https://www.thediaspora.app/best.html
https://www.thediaspora.app/news.html
https://www.thediaspora.app/verification.html
https://www.thediaspora.app/business.html?id=biz_4RrR2AY2_mq6eln02
```
Rules (per Google): request indexing **once** per URL — repeated requests do **not** speed it up. Indexing can take days to weeks.

## D. Reports to watch (after Google processes the site)
- [ ] **Page indexing** — fix anything "Crawled — currently not indexed" or "Discovered — not indexed" that should be indexed.
- [ ] **Sitemaps** — Success, URL count correct.
- [ ] **Performance** — queries, impressions, clicks, CTR, average position (per page).
- [ ] **Core Web Vitals** — appears once there's enough field (CrUX) data.
- [ ] **Enhancements / Breadcrumbs** — structured‑data validity.
- [ ] **Manual actions** + **Security issues** — must be clean.

## E. Validate structured data
- [ ] Run each cluster page through the **Rich Results Test**: https://search.google.com/test/rich-results — confirm Breadcrumb (+ no errors). (FAQ won't show a rich result — expected; see audit.)

## F. Monthly review (recurring)
- [ ] Queries with impressions but low CTR → rewrite title/description.
- [ ] Pages at positions 8–30 → add internal links + expand content.
- [ ] Indexing exclusions that should be indexed → investigate.
- [ ] New high‑intent query gaps → create content (see `content-roadmap-90day.md`).
