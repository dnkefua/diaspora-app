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
| `login.html` | ✅ Complete (legacy) | Sign-in screen with localStorage auth |
| `login-firebase.html` | ✅ Complete | Firebase Auth sign-in with email/password |
| `signup.html` | ✅ Complete (legacy) | Registration form with localStorage auth |
| `signup-firebase.html` | ✅ Complete | Firebase Auth signup with Firestore user docs |
| `otp.html` | ✅ Complete | Phone OTP verification — 6-box input, countdown timer, demo code `123456` |
| `profile.html` | ✅ Complete | User profile page |
| `feed.html` | ✅ Complete | Home feed with category filters, search, business cards, bottom nav |
| `business.html` | ✅ Complete | Business detail page with WhatsApp CTA, gallery, reviews |
| `diaspora_review.html` | ✅ Complete | Review/rating screen |
| `auth.css` | ✅ Complete | Shared auth stylesheet |
| `firebase-config.js` | ✅ Complete | Firebase initialization + exports for auth/firestore/storage |
| `seed-data.js` | ✅ Complete | Script to populate Firestore with initial business data |
| `FIREBASE_SETUP.md` | ✅ Complete | Complete Firebase setup guide with security rules |
| `DIASPORA_APP_DESIGN_SPEC.md` | ✅ Complete | Full design spec (25 pages) |
| `DIASPORA_DEV_HANDOFF.md` | ✅ Complete | Developer handoff guide (30 pages) |
| `DIASPORA_MARKETING_STRATEGY.md` | ✅ Complete | GTM and revenue strategy |
| `DIASPORA_PROJECT_SUMMARY.md` | ✅ Complete | Quick-reference summary |

### What Was Just Built (Session: April 25, 2026)

**Core Flow:**
- **`otp.html`** — Full OTP verification screen with:
  - 6-digit input boxes with auto-focus/auto-advance
  - Paste support
  - 30-second countdown + resend
  - Success state with checkmark animation
  - Demo code: `123456`
  - Reads pending user from `sessionStorage.diaspora_pending`
  - On success: saves to `localStorage.diaspora_user`, redirects to `feed.html`

- **`feed.html`** — Home feed page with:
  - Category filter chips (All, Restaurants, Barbers, Stylists, Photographers, Jobs, Tailors, Beauty)
  - Business card grid with images, ratings, descriptions
  - Live search filtering
  - Bottom navigation bar (Explore, Search, Messages, Profile)
  - Links to `business.html?id=<id>` for each card

- **`business.html`** — Business detail page with:
  - Hero image with gradient overlay
  - Business name, rating, verified badge, category
  - WhatsApp CTA button with pre-filled message
  - Contact details (phone, location, hours)
  - Photo gallery grid
  - Mock reviews section
  - Bottom navigation bar

**Firebase Integration:**
- **`firebase-config.js`** — Firebase initialization module with:
  - App initialization for project `the-diaspora-app`
  - Exports for Auth, Firestore, Storage
  - Helper functions (getCurrentUser, onAuthReady, generateOTP)

- **`signup-firebase.html`** — Firebase Auth signup with:
  - Email/password registration via `createUserWithEmailAndPassword`
  - Firestore user document creation
  - Session storage for OTP flow

- **`login-firebase.html`** — Firebase Auth login with:
  - Email/password sign-in
  - Firestore user document lookup
  - Session persistence

- **`seed-data.js`** — Database seeding script with 8 initial businesses

---

## MILESTONE TRACKER

### ✅ Phase 1: Design & Docs (COMPLETE)
- [x] Design system (Figma)
- [x] Design specification (25 pages)
- [x] Developer handoff guide
- [x] Marketing strategy
- [x] Landing page (`index.html`)

### ✅ Phase 2: Auth Flow (COMPLETE)
- [x] Sign Up screen (`signup.html`)
- [x] Sign In screen (`login.html`)
- [x] OTP Verification (`otp.html`)
- [x] **Wire signup → OTP**: `signup.html` saves to `sessionStorage.diaspora_pending` and redirects to `otp.html`
- [ ] Forgot password flow (`forgot-password.html`)

### ✅ Phase 3: Home Feed (COMPLETE)
- [x] **`feed.html`** — Main home feed with:
  - Category filter chips: All, Restaurants, Barbers, Stylists, Photographers, Jobs, Tailors, Beauty
  - Business listing cards (image, name, rating, category badge, city)
  - Search bar with live filter
  - Load more button
  - Mobile-first, card grid layout
  - Uses the existing design tokens from `index.html` (Cormorant Garamond + Inter, brass/navy palette)

### ✅ Phase 4: Business Detail (COMPLETE)
- [x] **`business.html`** — Business detail page with:
  - Hero image with gradient overlay
  - Business name, rating, verified badge
  - Contact info box (phone, address, hours)
  - WhatsApp CTA button (pre-filled message)
  - Photo gallery grid
  - Reviews section (3 shown, "see all" link)
  - URL param: `?id=<businessId>`
  - Bottom navigation bar

### ✅ Phase 5: Seller Dashboard (COMPLETE)
- [x] **`seller-dashboard.html`** — Tabbed dashboard:
  - Tab 1: Shop Profile (edit name, category, phone, hours)
  - Tab 2: Media (upload photos/videos, reorder, delete)
  - Tab 3: Analytics (views, WhatsApp clicks, peak hours)
  - Tab 4: Reviews (respond, flag)
  - Auth-gated with Firebase Auth check
  - Toast notifications for feedback
  - localStorage fallback for demo mode

### ✅ Phase 6: Backend & Firebase (COMPLETE)
- [x] Firebase project created: `the-diaspora-app`
- [x] Firebase configuration file (`firebase-config.js`)
- [x] Firebase Authentication (email/password) — `signup-firebase.html`, `login-firebase.html`
- [x] Firestore database schema defined (users, businesses, reviews)
- [x] Firebase Storage configuration ready
- [x] Seed data script for initial businesses
- [x] `feed.html` reads from Firestore with fallback to mock data
- [x] `business.html` loads business details from Firestore
- [x] `otp.html` verifies OTP codes against Firestore
- [x] `test-firebase.html` connection test page
- [ ] **ACTION NEEDED**: Replace placeholder credentials in `firebase-config.js` with real ones from Firebase Console
- [ ] **ACTION NEEDED**: Enable Email/Password auth in Firebase Console
- [ ] **ACTION NEEDED**: Create Firestore database and run seed script

### 🔄 Phase 7: Polish & Launch (IN PROGRESS — 80%)
- [x] Firebase Hosting configuration (`firebase.json`, `.firebaserc`)
- [x] Deployment documentation (`DEPLOY.md`)
- [ ] PWA manifest + service worker
- [ ] App icons + splash screens
- [ ] Performance audit
- [ ] Security review
- [ ] **ACTION**: Run `firebase login` then `firebase deploy --only hosting`

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

✅ **COMPLETED** — Signup → OTP → Feed → Business flow is complete!
✅ **COMPLETED** — Firebase integration (Auth, Firestore, Storage)
✅ **COMPLETED** — Seller dashboard with 4 tabs
✅ **COMPLETED** — Firebase Hosting configuration

### Next Steps:

1. **Deploy to Firebase Hosting** (one-time setup):
   - [ ] Open terminal in project directory
   - [ ] Run `firebase login` (interactive browser auth)
   - [ ] Run `firebase deploy --only hosting`
   - [ ] Visit `https://the-diaspora-app.web.app` to verify
   - [ ] See `DEPLOY.md` for full instructions

2. **Complete Firebase Backend Setup** (production):
   - [ ] Go to [Firebase Console](https://console.firebase.google.com/project/the-diaspora-app)
   - [ ] Enable Email/Password authentication
   - [ ] Create Firestore database (test mode to start)
   - [ ] Copy `firebaseConfig` and update `firebase-config.js`
   - [ ] Run `node seed-data.js` to populate businesses
   - [ ] See `FIREBASE_SETUP.md` for security rules

3. **Optional Enhancements**:
   - [ ] Add PWA manifest + service worker for offline support
   - [ ] Generate app icons and splash screens
   - [ ] Set up custom domain in Firebase Console

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
| Auth storage | localStorage (prototype) + Firebase Auth (prod) | Firebase Auth ready — update `firebase-config.js` with credentials |
| Database | Firestore | Real-time sync, offline support, scales with app |
| Styling | Inline CSS per page + shared `auth.css` | Matches existing pattern |
| Backend | Firebase (Auth + Firestore + Storage) | Serverless, managed infrastructure |
| Hosting | Firebase Hosting (planned) | Fast global CDN, free tier, easy deploys |

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
