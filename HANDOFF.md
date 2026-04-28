# Diaspora App — Engineering Handoff

> Last update: **2026-04-28** by an AI assistant during the premium-redesign pass.
> Read this **before** picking up the next phase of work.

---

## 1 · What was done in the previous session

Comprehensive premium redesign + SEO/security/LLM-crawler foundation. Detailed in the commit `Premium redesign, security headers, LLM-crawler SEO`. High-level:

- **Landing page (`index.html`) redesigned** — single H1, decluttered (dropped duplicate ad-strip, second hero, redundant sponsor-cats and city-spotlight, chapter quote, dual ad-rail, hours block, inline ad-sales pricing), new animations (word-by-word title reveal, parallax with cursor glow, scroll progress bar, magnetic CTAs, animated grain, brass corner-bracket card hovers, animated city counters, staggered grid reveals, hover-pause spotlight with progress bars).
- **Working homepage search** that submits to `feed.html?country=…&city=…&category=…&q=…`.
- **Trending tabs filter** properly (food / beauty / photo / jobs).
- **Real stub pages** created where dead `href="#"` used to live: `about.html`, `pricing.html`, `contact.html`, `careers.html`, `press.html`, `privacy.html`, `terms.html`, `cookies.html` — all sharing `page.css`.
- **404 page** added at `404.html`.
- **`firebase.json` rewrites bug fixed** (was breaking every non-index page on Firebase Hosting). Full security headers added: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP. Per-asset cache rules.
- **`firestore.rules`** + **`storage.rules`** written with owner-only writes, public reads, append-only clicks, default deny.
- **`robots.txt`** rewritten with explicit opt-in for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, Claude-Web, Google-Extended, PerplexityBot, Perplexity-User, CCBot, cohere-ai, Meta-ExternalAgent, Meta-ExternalFetcher, FacebookBot, Bytespider, Amazonbot, Applebot-Extended, DiffBot, omgilibot, Timpibot, ImagesiftBot, YouBot, Mistralai-User. Auth pages disallowed.
- **Sitemap index** + `sitemap-pages.xml`, `sitemap-blog.xml`, `sitemap-events.xml`, `sitemap-images.xml`.
- **`llms.txt`** expanded + new **`llms-full.txt`** with rich content for AI assistants.
- **`manifest.webmanifest`** with shortcuts.
- **Structured data** added: Organization, WebSite (SearchAction), WebPage, BreadcrumbList, FAQPage on home; LocalBusiness on business; Product/Offer on pricing; ContactPage on contact; CollectionPage on feed.
- **`hreflang`** (en, en-AE, en-GB, en-NG, x-default) on home + market-specific pages.
- **Preconnects** to fonts.googleapis.com, fonts.gstatic.com, images.unsplash.com on every page; **preload** for the hero image (LCP).
- **Auth pages** (`signup-firebase.html`, `login-firebase.html`, `signup.html`, `login.html`, `otp.html`, `profile.html`, `seller-dashboard.html`) hardened with `referrer` policy, theme-color, and proper `noindex,nofollow` already in place.
- **Newsletter capture** in footer is Firestore-ready (writes to `newsletter/{email}`, allowed by the new rules).
- **Firebase analytics events** wired on the homepage: `search_submit`, `trend_filter`, `newsletter_signup`.
- **Skip link**, `:focus-visible` ring system, `prefers-reduced-motion` respected throughout.
- **`firebase.json` `ignore`** updated so dev artifacts (`diaspora_review.html`, `test-firebase.html`, `seed-data.js`, internal `.md` docs) don't ship to production.

---

## 2 · ⚠️ What still needs to be done — pick up here

### 🔴 Priority 1 — pre-prod blockers

#### 2.1 Replace client-side OTP generation with Firebase Phone Auth
- **Where:** `firebase-config.js` exports a `generateOTP()` that returns `Math.floor(...)` — this is **not** an OTP. Anything calling it (`otp.html` and any signup/profile flow that uses phone verification) is **insecure**.
- **What to do:** Use Firebase Phone Auth (`signInWithPhoneNumber` + reCAPTCHA Verifier) or a Cloud Function that generates and SMS-delivers a real one-time code with a 10-minute TTL stored server-side in `otps/{phone}` (with a TTL field — Firestore will auto-delete).
- **Acceptance:** No code path on the client invents an OTP value. The verifier check must run server-side.

#### 2.2 Enable Firebase App Check
- **Why:** Without it, anyone with the public Firebase config can call your Firestore/Storage from outside the app, abuse Auth, and rack up billing.
- **Where:** Firebase Console → App Check → register the web app with **reCAPTCHA Enterprise** (or v3 to start). Enforce on Firestore, Storage, Auth.
- **Code change:** In `firebase-config.js` add:
  ```js
  import { initializeAppCheck, ReCaptchaV3Provider } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-app-check.js';
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('SITE_KEY_HERE'),
    isTokenAutoRefreshEnabled: true
  });
  ```
- **Acceptance:** App Check is enforced (not "monitored") on Firestore + Storage + Auth in the console.

#### 2.3 Self-host hero / spotlight imagery
- **Why:** `index.html`, `closing-bg`, spotlight slides, every category card, every featured-rail card, and the editorial section all pull from `images.unsplash.com`. Free Unsplash imagery is **not** licensed for indefinite commercial use as the primary brand asset, and the URLs can disappear.
- **What to do:** License (or commission) photography. Drop into `Media resources/`. Create `<picture>` elements with AVIF + WebP + JPG fallbacks at 480/960/1440/2400 widths. Update `index.html`, `feed.html`, the blog/event pages, and `sitemap-images.xml`.
- **Acceptance:** Zero `images.unsplash.com` references in the production HTML.

#### 2.4 Optimize the 1.6 MB logo PNG
- **File:** `Media resources/TheDiaspora app logo 3D.png` is 1.6 MB and loads on every page (hero, nav, drawer, footer, OG card).
- **What to do:** Generate a proper favicon set (16, 32, 48, 96, 180, 192, 512) + maskable icon variants + an AVIF/WebP version at 512px (~30–80 KB). Update `manifest.webmanifest` icon entries and every `<link rel="icon">` and `<img>` reference in HTML.
- **Acceptance:** Total icon-and-logo bytes per pageview drops below 100 KB.

#### 2.5 Wire up `business.html` (currently static)
- **What:** `business.html` should accept `?id=<businessId>`, fetch from Firestore `businesses/{id}`, and render. Its `LocalBusiness` JSON-LD must be populated dynamically too.
- **Reviews subcollection:** `businesses/{id}/reviews/{reviewId}` — write the form + list + owner-response UI. Rules already allow `userId == request.auth.uid` writes; the form must include `userId` and `rating ∈ [1,5]`.
- **Acceptance:** A real business doc renders end-to-end with photos, hours, WhatsApp CTA, reviews, owner response.

---

### 🟡 Priority 2 — productization

#### 2.6 PWA service worker
- **Why:** PWA install on iOS/Android, offline shell, faster repeat loads. Half-done — the manifest exists, but no SW.
- **What:** Add `sw.js` (Workbox is overkill; a hand-rolled cache-first for static, network-first for HTML, stale-while-revalidate for images is fine). Register in `index.html`. Update CSP `script-src` to allow it (`'self'` already covers it).
- **Acceptance:** Lighthouse PWA category passes; "Install" prompt appears on Chrome desktop and Android.

#### 2.7 MapLibre cities map
- **What:** Replace the 8-tile `cities-grid` with an actual world map dotted with brass markers per active city (uses MapLibre + Natural Earth tiles, no API key). Click a marker → goes to `feed.html?city=<name>`.
- **Acceptance:** Map renders, markers click-through, mobile shows a simplified version.

#### 2.8 Dark mode
- **Why:** Palette is already half there (`--ink`, `--graphite` exist).
- **What:** Add `[data-theme=dark]` overrides in `index.html` `<style>`, save preference to localStorage, respect `prefers-color-scheme: dark`. Toggle button in nav.
- **Acceptance:** Toggle works, preference persists, all pages render coherently.

#### 2.9 Form validation + reusable toast
- **What:** Replace remaining `alert()` calls (e.g. `login-firebase.html` social login) with a global toast component. Inline field errors (red border + helper text). Roll the same component into the contact form.
- **Acceptance:** No `alert()` in production; toasts work; inline validation works on Tab/blur.

#### 2.10 Skeleton loaders
- **Where:** `feed.html`, `business.html`, `seller-dashboard.html`. Currently no loading states.
- **What:** Bone-colored shimmer placeholders matching final layout while Firestore queries resolve.

---

### 🟢 Priority 3 — polish

#### 2.11 GA4 (or GTM) install
- Currently events fire via `gtag(...)` if it's loaded — but it isn't loaded yet. Add a GA4 measurement-id snippet and add the relevant script-src host to `firebase.json` CSP if you go through GTM (already allows `googletagmanager.com`).

#### 2.12 Real OG cards (1200×630) per major page
- The current OG image is the logo. Generate proper marketing cards for home / blog hub / events hub / each blog post / pricing / about. Drop into `Media resources/og/` and update `og:image` and `twitter:image`.

#### 2.13 Body-text contrast pass
- `--muted: #5A5247` on `--paper: #FBF8F2` measures roughly 5.8:1 (passes AA). The original `#6B6357` was borderline at ~4.0:1 — this is now fixed across `page.css` and `index.html` but verify across **all** older pages (feed/blog/events still use their own variants).

#### 2.14 Inline critical CSS, defer the rest
- `index.html` is one big `<style>` block (~700 lines). Split: ~6 KB above-the-fold inline, rest in `home.css` loaded via `<link rel="preload" as="style">`.

#### 2.15 Trim Google Fonts payload
- Currently shipping 4 weights of Cormorant + 3 of Inter on most pages. Audit each page; ship only what it uses.

---

## 3 · Known issues

- **`profile.html`**, **`seller-dashboard.html`** — were not redesigned in this pass; they retain the older visual language. They function but feel less premium than the new pages. Rebuild against `page.css` / new design tokens when you have time.
- **`auth.css`** — older auth pages share this stylesheet. It's serviceable but doesn't match the new brand polish. Consider rebuilding the auth pages on `page.css` too.
- **The `feed.html` UI** — works, but visually predates the new design system. Worth a refresh when you tackle 2.5.
- **Newsletter Firestore writes** depend on the `newsletter/{email}` rule in `firestore.rules`. If you change the email collection name, update both.
- **GitHub Actions** in `.github/workflows/` deploys on push to **`master`** only. Feature branches don't auto-deploy.

---

## 4 · How to verify a deploy

After `firebase deploy --only hosting`:

```bash
# All routes should 200 (not 301-rewrite to /)
curl -I https://www.thediaspora.app/about.html
curl -I https://www.thediaspora.app/pricing.html
curl -I https://www.thediaspora.app/feed.html
curl -I https://www.thediaspora.app/blog.html
curl -I https://www.thediaspora.app/events.html

# Sitemaps + robots
curl -s https://www.thediaspora.app/robots.txt | head -20
curl -s https://www.thediaspora.app/sitemap.xml | head -10
curl -s https://www.thediaspora.app/llms.txt | head -10

# Security headers should be present
curl -I https://www.thediaspora.app/ | grep -iE 'strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy'

# 404 should serve 404.html (not /)
curl -I https://www.thediaspora.app/this-page-does-not-exist
```

Then in Lighthouse: aim for ≥95 Performance, ≥95 Accessibility, ≥100 Best Practices, ≥100 SEO on the homepage.

---

## 5 · Useful filenames

| File | Purpose |
|---|---|
| `index.html` | Redesigned landing |
| `page.css` | Shared styles for stub pages |
| `firestore.rules` | Firestore security rules |
| `storage.rules` | Storage security rules |
| `firebase.json` | Hosting config + headers + cache + ignore list |
| `manifest.webmanifest` | PWA manifest |
| `robots.txt` | Crawler directives (incl. all major LLMs) |
| `sitemap.xml` | Sitemap index |
| `sitemap-pages.xml` / `-blog.xml` / `-events.xml` / `-images.xml` | Section sitemaps |
| `llms.txt` / `llms-full.txt` | LLM crawler context |
| `404.html` | Real 404 (was missing) |
| `_partial-head.html` | Reference fragment for a `<head>` partial — copy/paste, not auto-included |
| `HANDOFF.md` | This file |
