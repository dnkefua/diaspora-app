# Diaspora App - Premium Design Specification
**Version 1.0** | **Budget: $10,000** | **Target Launch: Q2 2026**

---

## 1. EXECUTIVE OVERVIEW

### Vision
Diaspora App is a premium social commerce platform connecting diaspora communities worldwide with businesses, skills, and job opportunities. The MVP focuses on African diaspora communities in UAE/Dubai, with expansion to global markets.

### Core Value Proposition
- **For Users**: Discover vetted diaspora-owned businesses, get direct contact, community reviews
- **For Sellers**: Setup shops, showcase products/services, connect with diaspora community without intermediaries
- **For Job Seekers**: Access diaspora-focused job listings from trusted businesses

### Market Focus (Phase 1)
- **Geographic**: UAE/Dubai (expanding globally)
- **Verticals**: African Restaurants, Food Sellers, Barbers/Stylists, Job Postings
- **User Base Target**: 50K active users in Year 1

---

## 2. USER PERSONAS

### Persona 1: "Fatima" - Food Seller/Restaurant Owner
- **Age**: 32 | **Location**: Dubai
- **Goals**: Reach diaspora customers, reduce reliance on food delivery apps (high commission)
- **Pain Points**: High app fees, difficulty building own customer base
- **Tech Comfort**: Moderate (smartphone native)
- **Expected Activity**: Posts 3-4 times/week, checks messages daily

### Persona 2: "David" - Community Member/Diner
- **Age**: 28 | **Location**: Dubai
- **Goals**: Discover authentic African food, find trusted barbers, networking
- **Pain Points**: Hard to find authentic food, scared of low-quality services, language barriers
- **Tech Comfort**: High (tech-savvy millennial)
- **Expected Activity**: Browses 2-3 times/week, posts reviews monthly

### Persona 3: "Amara" - Job Seeker
- **Age**: 26 | **Location**: Dubai
- **Goals**: Find jobs within diaspora community, build professional network
- **Pain Points**: Limited job visibility, networking challenges
- **Tech Comfort**: High
- **Expected Activity**: Searches weekly, applies to 2-3 jobs/week

---

## 3. INFORMATION ARCHITECTURE

```
Diaspora App (Root)
├── Authentication
│   ├── Sign Up (Email/Phone)
│   ├── Login
│   └── Social Login (Google, WhatsApp)
│
├── User Feed (Authenticated)
│   ├── Home / Discover
│   │   ├── Category Filters (Restaurants, Barbers, Jobs)
│   │   ├── Search Bar
│   │   ├── Business Cards Feed
│   │   └── Sponsored/Featured
│   │
│   ├── Business / Job Listings
│   │   ├── List View
│   │   ├── Map View
│   │   ├── Detail Page
│   │   ├── Photo Gallery
│   │   ├── Review Section
│   │   ├── WhatsApp Contact Button
│   │   └── Share
│   │
│   ├── Seller Dashboard (for Sellers)
│   │   ├── Shop Profile
│   │   ├── Analytics (Views, Clicks, Contacts)
│   │   ├── Media Management
│   │   │   ├── Upload Photos
│   │   │   ├── Upload Videos
│   │   │   └── Manage Gallery
│   │   ├── Promotions
│   │   ├── Reviews Management
│   │   └── Settings
│   │
│   ├── Messages / WhatsApp
│   │   ├── Chat List
│   │   ├── Chat Detail
│   │   └── Quick Response Templates
│   │
│   ├── Profile
│   │   ├── User Info
│   │   ├── My Reviews
│   │   ├── Saved Listings
│   │   ├── My Applications (Jobs)
│   │   └── Settings
│   │
│   └── Notifications
│       ├── New Messages
│       ├── Review Alerts
│       └── Promotional
│
└── Admin Dashboard (Admin Only)
    ├── User Management
    ├── Business Verification
    ├── Content Moderation
    └── Analytics
```

---

## 4. CORE FEATURES

### 4.1 Discovery & Browsing
**Feature**: Category-based browsing with smart filtering
- **Categories**: Restaurants, Food Sellers, Barbers, Stylists, Job Postings
- **Filters**: 
  - Rating (4★+, 4.5★+)
  - Distance (1km, 5km, 10km)
  - Price Range
  - Recently Added
  - Verified Sellers Badge
- **Search**: Full-text search (business name, cuisine, skills)

**Design Notes**:
- Horizontal category chips at top of feed
- Card-based listing (image, name, rating, quick info)
- Hero image for visual appeal
- 2-3 listings per scroll

### 4.2 Business Detail Pages
**Feature**: Rich business profiles with multimedia
- **Components**:
  - Hero image carousel (3-5 photos)
  - Business name, category, verified badge
  - Star rating + review count
  - Phone number + WhatsApp button (prominent)
  - Address + map pin
  - Description/bio
  - Photo gallery (user uploads)
  - Video gallery (user uploads)
  - Reviews section (chronological, with ratings breakdown)
  - Promotions/Deals (if any)
  - Share button

**WhatsApp Integration**:
- Direct WhatsApp button that opens chat with business
- Pre-filled message template: "Hi, I found your shop on Diaspora App..."
- Click tracking for analytics

### 4.3 Seller Dashboard
**Feature**: Complete shop management for sellers
- **Shop Profile**:
  - Shop name, category, verified status
  - Description/bio
  - Phone number
  - Address/location
  - Hours of operation
  - Profile photo

- **Media Management**:
  - Upload photos (grid layout, drag-to-reorder)
  - Upload videos (max 30s clips, vertical)
  - Auto-generate thumbnail from gallery
  - Delete/archive older media

- **Promotions**:
  - Create promotional posts (text + image)
  - Schedule posts
  - View engagement metrics

- **Analytics Dashboard**:
  - Total profile views (daily/weekly/monthly)
  - Click-through to WhatsApp
  - Number of reviews
  - Average rating
  - Top performing photos/videos
  - Trending periods

- **Reviews Management**:
  - View all reviews
  - Respond to reviews
  - Flag/report inappropriate reviews
  - Business response tracking

- **Settings**:
  - Edit profile
  - Change phone/contact
  - Pause/reactivate shop
  - Delete shop

### 4.4 Rating & Review System
**Feature**: Community-driven trust building
- **Review Structure**:
  - Star rating (1-5)
  - Text review (100-500 chars)
  - Photo/video attachment
  - Category tags (taste, service, cleanliness, etc.)
  - Verified purchase badge
  - Reviewer profile link
  - Helpful count (upvote)

- **Business Responses**:
  - Reply to reviews (text + quick tags)
  - Mark as resolved
  - Thank customer

- **Moderation**:
  - Flag spam/inappropriate
  - Review authenticity checks
  - Admin review queue

**Design Considerations**:
- Horizontal rating breakdown (5★ 45%, 4★ 30%, 3★ 15%, 2★ 7%, 1★ 3%)
- Most helpful reviews shown first
- Recent reviews shown
- Filter by rating

### 4.5 WhatsApp Integration
**Feature**: Seamless WhatsApp communication
- **On App**:
  - Prominent WhatsApp button on business detail
  - Click opens WhatsApp Web/App
  - Pre-filled template message
  - Click tracking

- **Chat Features**:
  - In-app chat placeholder (future enhancement)
  - Quick response templates for sellers
  - Message history logging (optional)
  - Read receipts

**Technical Approach**:
- WhatsApp Business API (for premium tier)
- Web URL scheme: `https://wa.me/[PHONE]?text=[MESSAGE]`
- Mobile: `whatsapp://send?phone=[PHONE]&text=[MESSAGE]`

### 4.6 Job Postings System
**Feature**: Diaspora-focused job marketplace
- **Posting Types**:
  - Full-time
  - Part-time
  - Contract
  - Gig

- **Job Listing Components**:
  - Job title
  - Company (diaspora-owned)
  - Location
  - Salary (optional, public/hidden)
  - Description
  - Requirements
  - Apply button (email/link)
  - Deadline

- **Seller Job Posting**:
  - Simple form to post jobs
  - Candidate management
  - Application tracking

---

## 5. USER FLOWS

### Flow 1: New User Discovery → WhatsApp Contact
```
1. User opens app → Onboarding (3 screens)
2. Select category (Restaurants, Barbers, Jobs)
3. Browse feed → See business cards
4. Tap card → Detail page
5. Review photos, ratings, description
6. Tap "Contact via WhatsApp" → Opens WhatsApp chat
7. Conversation continues on WhatsApp
```

### Flow 2: Seller Shop Setup
```
1. Sign up as seller
2. Verify phone via OTP
3. Create shop profile (name, category, phone, address)
4. Upload shop photos (min 3)
5. (Optional) Upload videos
6. Add description
7. Activate shop
8. Share shop link on social media
9. Start receiving WhatsApp messages
```

### Flow 3: Seller Uploads Photos/Videos
```
1. Login to dashboard
2. Tap "Media Management"
3. Upload photos (camera or gallery)
4. Reorder photos (drag-drop)
5. Upload video clip
6. Preview
7. Save & publish
8. Monitor views/engagement
```

### Flow 4: User Reviews Business
```
1. User visited business (verified via check-in or GPS)
2. Click "Write Review" on detail page
3. Rate (1-5 stars)
4. Add text review (optional photo)
5. Select category tags (taste, service, cleanliness)
6. Submit review
7. Review appears on business listing
8. Business can respond
```

---

## 6. DESIGN SYSTEM

### 6.1 Color Palette (Premium African Theme)
```
Primary Gold:     #F2C206 (warmth, prosperity)
Primary Orange:   #F27300 (energy, growth)
Deep Navy:        #0A2758 (trust, professionalism)
Forest Green:     #297A45 (community, sustainability)
Light Gray:       #F5F5F5 (clean space)
Text Dark:        #1A1A1A (readability)
Text Light:       #666666 (secondary)
Success Green:    #10B981 (WhatsApp green #25D366)
Error Red:        #EF4444 (validation)
Border:           #E5E7EB (subtle dividers)
```

### 6.2 Typography
```
Headlines:     Inter Bold / Poppins Bold, 24-32px
Subheads:      Inter Semibold / Poppins Semibold, 16-20px
Body Text:     Inter Regular, 14px
Small Text:    Inter Regular, 12px
Captions:      Inter Light, 10px (use sparingly)

Font Weights:  300 (Light), 400 (Regular), 600 (Semibold), 700 (Bold)
Line Height:   1.6x for body, 1.2x for headlines
```

### 6.3 Component Library

**Buttons**:
- Primary CTA (Gold bg, Navy text, 12px radius)
- Secondary (Navy outline, Navy text)
- WhatsApp (WhatsApp Green bg, white text)
- Danger (Red bg, white text)
- Size options: Large (50px), Medium (44px), Small (36px)

**Cards**:
- Business Card (image + 2-line info)
- Review Card (rating + text + author)
- Job Card (title + company + salary)
- Stat Card (number + label)

**Input Fields**:
- Text input (light gray bg, navy border on focus)
- Textarea (for reviews, with char counter)
- Dropdown (category, rating filter)
- Star rating input

**Navigation**:
- Bottom tab bar (5 icons max)
- Icons: Home, Search, Messages, Profile, More
- Active state: Gold color + underline

**Modals & Overlays**:
- Confirmation dialogs (50% opacity overlay)
- Bottom sheets for filters
- Toast notifications (top corner, auto-dismiss)

### 6.4 Spacing & Layout
```
Mobile First: 375px baseline
Gutters: 20px
Card padding: 16px
Component spacing: 16px (between sections)
Safe area: 44px bottom (home indicator)

Grid: 8px baseline
Radius: 8-12px for cards, 6px for buttons
```

### 6.5 Icons & Imagery
- **Icon Set**: Feather Icons / Heroicons (consistent stroke)
- **Photography**: High-quality, authentic diaspora community imagery
- **Placeholder**: Blurred abstract colors (not gray boxes)
- **Hero Images**: 16:9 ratio, crisp, food/people focused

---

## 7. TECHNICAL SPECIFICATIONS

### 7.1 Platform & Devices
- **Mobile First**: iOS 13+, Android 11+
- **Tablet**: iPad/Android Tablet support
- **Web**: Responsive web app (future)
- **Screen Sizes**:
  - Mobile: 375px - 414px
  - Tablet: 768px - 1024px
  - Desktop: 1280px+

### 7.2 Technology Stack (Recommended)
**Frontend**:
- React Native (iOS + Android)
- Or: Flutter (Android + iOS)
- UI Library: React Native Paper or Flutter Material

**Backend**:
- Node.js + Express or Firebase
- Database: Postgres / MongoDB
- File Storage: AWS S3 / Firebase Storage
- Authentication: JWT + Phone OTP

**Third-party Integrations**:
- WhatsApp Business API (for premium)
- Google Maps API (location)
- Firebase Analytics
- Sentry (error tracking)

### 7.3 Performance Targets
- App Load: < 3 seconds
- Feed Scroll: 60 FPS
- Image Load: < 2 seconds
- Search Results: < 1 second

### 7.4 Security & Compliance
- End-to-end encryption for messages (future)
- Data privacy: GDPR/local UAE compliance
- User data: Encrypted at rest
- Phone verification: OTP-based
- Business verification: Manual review + ID check

---

## 8. MONETIZATION STRATEGY (Premium Features)

### Free Tier
- Browse businesses
- Search
- View reviews
- Contact via WhatsApp

### Premium Seller Tier ($10-30/month)
- Featured listing position
- Unlimited photo/video uploads
- Advanced analytics (real-time)
- Promotional tools
- Review response templates
- WhatsApp Business API integration
- Priority support

### Enterprise/Job Board Tier ($50-100/month)
- Job posting limits (unlimited)
- Candidate management tools
- Advanced filtering
- Recruiting dashboard

### Ad Network (Future)
- Sponsored listings
- Category ads
- Retargeting

---

## 9. ROADMAP

### Phase 1: MVP (Q2 2026)
- User registration & login
- Browse restaurants/food sellers
- Business detail pages
- Review/rating system
- WhatsApp integration (URL scheme)
- Seller dashboard (basic)
- Analytics (basic views/clicks)

### Phase 2: Polish & Growth (Q3 2026)
- Job posting system
- Barber/stylist category
- Premium seller features
- In-app chat (beta)
- Video uploads
- Photo gallery v2

### Phase 3: Scale (Q4 2026)
- Geographic expansion (Africa)
- WhatsApp Business API
- Advanced seller analytics
- Community features (follow, feed)
- Loyalty/rewards system

### Phase 4: Platform (2027)
- Web app launch
- Marketplace (booking, payments)
- Subscription tier
- API for partners
- Global diaspora network

---

## 10. SUCCESS METRICS

### User Engagement
- DAU (Daily Active Users): 5K → 50K in Year 1
- Session duration: 8+ minutes
- Listings viewed per session: 5+
- WhatsApp contact rate: 20%+ of detail views

### Seller Performance
- Seller sign-ups: 500 in Q1, 2K by EOY
- Average reviews per seller: 5+
- Monthly active sellers: 80%+
- Seller satisfaction: 4.5★+

### Business Impact
- App downloads: 100K+
- Conversion (user → seller): 2%
- Retention (Day 30): 40%+
- Revenue: $50K ARR by EOY

---

## 11. DESIGN DELIVERABLES

### Figma File
- **URL**: [Diaspora App Design System](https://www.figma.com/design/ornKDkGmPrKuRmeaYRlbrD)
- **Contents**:
  - Design system (colors, typography, components)
  - 25+ mobile screens
  - 10+ tablet layouts
  - Interactive prototypes
  - Animation specs
  - Developer handoff notes

### Documentation
- Design spec (this document)
- Component guidelines
- Accessibility checklist
- Animation specifications
- Copy style guide

### Assets
- Icon library (200+ icons)
- Placeholder imagery
- Color swatches
- Typography pairings
- Responsive breakpoints

---

## 12. BUDGET ALLOCATION ($10,000)

```
Design & UX:            $4,000 (40%)
  - Wireframes & IA
  - Visual design
  - Prototypes
  - Animations

Figma Setup & Assets:   $2,000 (20%)
  - Component library
  - Icon library
  - Design systems
  - Developer handoff

Research & Strategy:    $1,500 (15%)
  - User research
  - Competitor analysis
  - Copy strategy
  - Feature prioritization

Documentation:          $1,000 (10%)
  - Design spec
  - Component guides
  - Accessibility audit
  - Brand guidelines

Contingency:            $1,500 (15%)
  - Revisions
  - Additional screens
  - Interactive flows
```

---

## 13. NEXT STEPS

1. **Week 1**: Validate designs with 5-10 users (diaspora community members)
2. **Week 2**: Iterate on feedback, finalize component library
3. **Week 3**: Prepare developer handoff (detailed specs, assets export)
4. **Week 4**: Begin frontend development (React Native or Flutter)

---

**Design System Owner**: Dez Dezzydez  
**Last Updated**: 2026-04-24  
**Status**: Ready for Development  
