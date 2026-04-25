# Diaspora App — Roadmap & Agent Handoff
**Last Updated**: April 25, 2026  
**Conversation ID**: 7f6d7f55-aeaf-4199-a46e-a615d2f131a0  
**Project Dir**: `c:\Users\A2Z\OneDrive\Documents\NDN Analytics\The Diaspora App`

---

## CURRENT STATE OF OPERATION

### What Exists (Files on Disk)

| File | Status | Description |
|------|--------|-------------|
| `index.html` | ✅ Complete | Landing page — luxury editorial design, hero, categories, trending |
| `login.html` | ✅ Complete | Sign-in screen with email/password + Google/Apple social buttons |
| `signup.html` | ✅ Complete | Registration form — name, email, phone, city, password |
| `otp.html` | ✅ **Just Built** | Phone OTP verification — 6-box input, countdown timer, demo code `123456` |
| `profile.html` | ✅ Complete | User profile page |
| `diaspora_review.html` | ✅ Complete | Review/rating screen |
| `auth.css` | ✅ Complete | Shared auth stylesheet |
| `DIASPORA_APP_DESIGN_SPEC.md` | ✅ Complete | Full design spec (25 pages) |
| `DIASPORA_DEV_HANDOFF.md` | ✅ Complete | Developer handoff guide (30 pages) |
| `DIASPORA_MARKETING_STRATEGY.md` | ✅ Complete | GTM and revenue strategy |
| `DIASPORA_PROJECT_SUMMARY.md` | ✅ Complete | Quick-reference summary |

### What Was Just Built (Session: April 25, 2026)

- **`otp.html`** — Full OTP verification screen with:
  - 6-digit input boxes with auto-focus/auto-advance
  - Paste support
  - 30-second countdown + resend
  - Success state with checkmark animation
  - Demo code: `123456`
  - Reads pending user from `sessionStorage.diaspora_pending`
  - On success: saves to `localStorage.diaspora_user`, redirects to `feed.html`

---

## MILESTONE TRACKER

### ✅ Phase 1: Design & Docs (COMPLETE)
- [x] Design system (Figma)
- [x] Design specification (25 pages)
- [x] Developer handoff guide
- [x] Marketing strategy
- [x] Landing page (`index.html`)

### 🔄 Phase 2: Auth Flow (IN PROGRESS — 80%)
- [x] Sign Up screen (`signup.html`)
- [x] Sign In screen (`login.html`)
- [x] OTP Verification (`otp.html`) ← **just completed**
- [ ] **Wire signup → OTP**: Update `signup.html` to save pending user to `sessionStorage.diaspora_pending` and redirect to `otp.html` instead of `profile.html`
- [ ] Forgot password flow (`forgot-password.html`)

### ⏳ Phase 3: Home Feed (NOT STARTED)
- [ ] **`feed.html`** — Main home feed with:
  - Category filter chips: Restaurants, Barbers, Stylists, Photographers, Jobs, Tailors, Beauty, Music
  - Business listing cards (image, name, rating, category badge, city)
  - Search bar with live filter
  - Infinite scroll simulation (load more button)
  - Mobile-first, card grid layout
  - Uses the existing design tokens from `index.html` (Cormorant Garamond + Inter, brass/navy palette)

### ⏳ Phase 4: Business Detail (NOT STARTED)
- [ ] **`business.html`** — Business detail page with:
  - Hero image carousel (swipeable)
  - Business name, rating, verified badge
  - Contact info box (phone, address, hours)
  - WhatsApp CTA button (pre-filled message)
  - Photo gallery grid
  - Reviews section (3 shown, "see all" link)
  - URL param: `?id=<businessId>`

### ⏳ Phase 5: Seller Dashboard (NOT STARTED)
- [ ] **`seller-dashboard.html`** — Tabbed dashboard:
  - Tab 1: Shop Profile (edit name, category, phone, hours)
  - Tab 2: Media (upload photos/videos, reorder, delete)
  - Tab 3: Analytics (views, WhatsApp clicks, peak hours)
  - Tab 4: Reviews (respond, flag)

### ⏳ Phase 6: Backend & Firebase (NOT STARTED)
- [ ] Firebase project setup
- [ ] Firebase Authentication (email/phone)
- [ ] Firestore database schema (users, businesses, reviews, media, jobs)
- [ ] Firebase Storage (photo/video uploads)
- [ ] Cloud Functions (OTP verification, analytics tracking)
- [ ] Replace localStorage with real Firestore reads/writes

### ⏳ Phase 7: Polish & Launch (NOT STARTED)
- [ ] PWA manifest + service worker
- [ ] App icons + splash screens
- [ ] Performance audit
- [ ] Security review
- [ ] Firebase Hosting deployment

---

## DESIGN SYSTEM (for next agent)

Use these exact tokens when building new screens — they match `index.html`:

```css
--ink: #0A0A0A
--graphite: #1B1D22
--ivory: #F6F2EA
--bone: #EEE7DA
--paper: #FBF8F2
--blue: #1C3D6E      /* deep navy — primary action color */
--brass: #B7924A     /* gold accent */
--brass-soft: #D9BE88
--rust: #8F3A26
--muted: #6B6357

/* Auth screens use: */
--gold: #B7924A
--bg: #F6F2EA
--surface: #FFFFFF
--line: rgba(10,10,10,0.10)
```

**Fonts**: `Cormorant Garamond` (headings, serif) + `Inter` (body, UI)  
**Button radius**: 999px (pills) or 14px (cards)  
**Design feel**: Luxury editorial, Gaia-inspired, dark navy + gold

---

## DATA MODEL (localStorage — used by current prototypes)

```js
// Current logged-in user
localStorage.diaspora_user = {
  firstName, lastName, email, phone, city,
  joined: ISO string, avatar: null | url, bio: string
}

// All registered accounts (keyed by email)
localStorage.diaspora_accounts = {
  "email@x.com": { password: "...", profile: { ...user } }
}

// Pending signup (waiting for OTP) — sessionStorage only
sessionStorage.diaspora_pending = { ...user object }
```

---

## IMMEDIATE NEXT TASKS (Priority Order)

1. **Fix signup → OTP wiring** in `signup.html`:
   - Change `handleSignup()` to save user to `sessionStorage.diaspora_pending`
   - Redirect to `otp.html` instead of `profile.html`
   - (Currently skips OTP and goes straight to profile)

2. **Build `feed.html`** — Home feed page:
   - Category filter chips at top
   - Business card grid (mock data, 12-16 cards)
   - Search/filter functionality
   - Link each card to `business.html?id=<id>`
   - Bottom nav bar (Home, Search, Messages, Profile)

3. **Build `business.html`** — Business detail:
   - Read `?id=` param, show matching mock business
   - WhatsApp button: `https://wa.me/<phone>?text=...`
   - Back button → `feed.html`
   - Review cards section

4. **Connect navigation** — Update `index.html` nav:
   - "Sign in" → `login.html` ✅ (already done)
   - "Join Diaspora" → `signup.html` ✅ (already done)  
   - "Explore the App" → `feed.html` (needs `feed.html` to exist)

---

## MOCK DATA (use for feed.html and business.html)

```js
const BUSINESSES = [
  { id:'b1', name:'Mama Titi Kitchen', category:'Restaurants', city:'Dubai', area:'Deira',
    rating:4.9, reviews:214, phone:'+971501234567', verified:true,
    image:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800',
    desc:'Authentic Nigerian cuisine in the heart of Deira. Jollof rice, egusi soup, suya grills.' },
  { id:'b2', name:'Kwame\'s Barbershop', category:'Barbers', city:'Dubai', area:'Al Karama',
    rating:4.8, reviews:189, phone:'+971502345678', verified:true,
    image:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800',
    desc:'Premium fades and line-ups by West African master barbers.' },
  { id:'b3', name:'Zara African Hair', category:'Hair Stylists', city:'Dubai', area:'Bur Dubai',
    rating:4.7, reviews:156, phone:'+971503456789', verified:false,
    image:'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800',
    desc:'Braiding, weaves, locs, and natural hair care specialists.' },
  { id:'b4', name:'Kofi Lens Photography', category:'Photographers', city:'Dubai', area:'Downtown',
    rating:5.0, reviews:88, phone:'+971504567890', verified:true,
    image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
    desc:'Wedding, event, and portrait photography. Ghanaian storytelling through your lens.' },
  { id:'b5', name:'Adunola Fashion House', category:'Tailors & Fashion', city:'Dubai', area:'JLT',
    rating:4.6, reviews:72, phone:'+971505678901', verified:true,
    image:'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800',
    desc:'Bespoke Ankara and African prints. Wedding attire and everyday fashion.' },
  { id:'b6', name:'Grace Beauty Studio', category:'Beauty & Makeup', city:'Dubai', area:'Jumeirah',
    rating:4.8, reviews:131, phone:'+971506789012', verified:true,
    image:'https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=800',
    desc:'Bridal makeup, glam looks, and skincare for melanin-rich skin.' },
  { id:'b7', name:'Nairobi Bites', category:'Restaurants', city:'London', area:'Peckham',
    rating:4.5, reviews:203, phone:'+447911234567', verified:true,
    image:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800',
    desc:'Kenyan nyama choma, ugali, and sukuma wiki in the heart of South London.' },
  { id:'b8', name:'AfroTech Jobs — Dubai', category:'Jobs', city:'Dubai', area:'DIFC',
    rating:4.3, reviews:44, phone:'+971507890123', verified:true,
    image:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800',
    desc:'Tech and finance roles at diaspora-friendly companies across the UAE.' },
];
```

---

## TECH DECISIONS MADE

| Decision | Choice | Reason |
|----------|--------|--------|
| Frontend | Vanilla HTML/CSS/JS | No build step, fast iteration, matches existing files |
| Auth storage | localStorage + sessionStorage | Prototype only — replace with Firebase Auth later |
| Styling | Inline CSS per page + shared `auth.css` | Matches existing pattern |
| Backend | None yet | Phase 6 — Firebase planned |
| Hosting | None yet | Firebase Hosting planned |

---

## NOTES FOR NEXT AGENT

- **Do NOT** use React/Vue/frameworks — keep vanilla HTML/CSS/JS to match existing files
- **Do NOT** change the design tokens — the luxury editorial feel is intentional
- The OTP demo code is `123456` — mention this in any UI hint text
- All pages should have a **bottom nav bar** once `feed.html` is built: Home | Search | Messages | Profile
- WhatsApp links use format: `https://wa.me/971501234567?text=Hi%2C%20I%20found%20you%20on%20Diaspora%20App`
- Ratings display as `⭐ 4.8 (214 reviews)` — use gold star emoji
- Category filter active state: navy background (`#0A2758`) + white text

---

*This file should be updated at the end of each dev session.*
