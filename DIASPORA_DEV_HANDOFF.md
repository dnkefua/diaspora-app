# Diaspora App - Developer Handoff Guide
**For**: Frontend & Backend Developers  
**Design Source**: [Figma - Diaspora App Design System](https://www.figma.com/design/ornKDkGmPrKuRmeaYRlbrD)

---

## 1. PROJECT SETUP CHECKLIST

### Development Environment
```bash
# Frontend (React Native)
- Node.js 18+
- React Native 0.72+
- Expo CLI or React Native CLI
- Android Studio + iOS Xcode (for native builds)

# Backend
- Node.js 18+
- PostgreSQL 14+ (or MongoDB)
- Firebase (optional, for real-time DB)
- Docker (for containerization)
```

### Required Keys & Credentials
- [ ] Firebase config (if using)
- [ ] Google Maps API key
- [ ] WhatsApp Business API credentials
- [ ] AWS S3 bucket (for file storage)
- [ ] SendGrid/Twilio (for SMS/OTP)
- [ ] Stripe/Flutterwave (for payments, Phase 2)

---

## 2. CORE SCREENS SPECIFICATIONS

### Screen 1: Onboarding (3 screens)

**Screen 1.1: Welcome**
- Hero image/animation (diaspora-themed)
- Headline: "Welcome to Diaspora"
- Subheadline: "Connect with diaspora communities & businesses worldwide"
- Two CTAs: "Sign Up" | "Sign In"
- Skip button (optional, goes to feed as guest)

**Layout**:
```
┌─────────────────┐
│   [Hero Image]  │
├─────────────────┤
│   Welcome Text  │
├─────────────────┤
│  [Sign Up CTA]  │
│  [Sign In CTA]  │
└─────────────────┘
```

**Screen 1.2: Sign Up**
- Form fields:
  - Full Name (required)
  - Email (required)
  - Phone (required)
  - Password (required, 8+ chars)
  - I agree to ToS (checkbox)
- Validation: Real-time feedback
- Error states: Red border + error message
- Success state: Proceed to OTP verification

**Screen 1.3: Phone Verification**
- Display phone number (masked): "+234 ***-****-6789"
- OTP input (6 digits, auto-focus next field)
- "Didn't receive code?" link → Resend after 30s
- Loading state during verification
- Error state if OTP invalid

**API Endpoints Needed**:
```
POST /auth/register
Body: { fullName, email, phone, password }
Response: { userId, otpSent: true }

POST /auth/verify-otp
Body: { phone, otp }
Response: { token, user: { id, name, email, phone } }

POST /auth/resend-otp
Body: { phone }
Response: { success: true, expiresIn: 30 }
```

---

### Screen 2: Home / Discovery Feed

**Layout**:
```
┌──────────────────────────┐
│  [Logo]  [Search]  [Menu]│  ← Header (Navy bg, Gold text)
├──────────────────────────┤
│  [Restaurants] [Barbers] │  ← Category chips (horizontal scroll)
│  [Jobs]                  │
├──────────────────────────┤
│  ┌──────────────────────┐│
│  │  [Business Image]    ││  ← Business card (repeating)
│  │  "Restaurant Name"   ││
│  │  ⭐ 4.8 (124 reviews)││
│  └──────────────────────┘│
├──────────────────────────┤
│  [Load More / Infinite]  │
└──────────────────────────┘
```

**Components**:
- **Header**: Logo + Search icon + Menu (3-dot)
- **Category Chips**: Horizontal scroll, active state (gold bg)
- **Search Bar**: Modal overlay with:
  - Text input (auto-focus on open)
  - Recent searches
  - Trending searches
  - Filter button
- **Business Cards**:
  - Image (16:9 ratio)
  - Business name (capped at 1 line, ellipsis)
  - Rating (⭐) + count
  - Category badge
  - On tap: Go to detail page

**API Endpoints Needed**:
```
GET /businesses?category=restaurants&limit=10&offset=0
Response: {
  businesses: [
    {
      id, name, category, imageUrl, rating, reviewCount,
      location, verified, phone
    }
  ],
  hasMore: true
}

GET /businesses/search?q=jollof
Response: { businesses: [...] }

GET /categories
Response: {
  categories: [
    { id, name, icon, count }
  ]
}
```

**Infinite Scroll Implementation**:
- Load 10 items per request
- Trigger load at 80% scroll position
- Show loading spinner while fetching
- No duplicate items if user scrolls while loading

---

### Screen 3: Business Detail Page

**Layout**:
```
┌──────────────────────────┐
│  [Back] [Share]          │  ← Header overlay on image
├──────────────────────────┤
│  [Hero Image Carousel]   │
│  ◁ ● ● ●                 │  ← Pagination dots
├──────────────────────────┤
│  Business Name           │
│  ⭐ 4.8/5.0 (124 reviews)│
│  Category Badge          │
├──────────────────────────┤
│  ┌──────────────────────┐│
│  │ 📞 +234 812 3456789 ││  ← Info box
│  │ 📍 Dubai, UAE        ││
│  │ 🕐 9AM - 9PM         ││
│  │ ✓ Verified           ││
│  └──────────────────────┘│
├──────────────────────────┤
│  About                   │
│  [Business description]  │
├──────────────────────────┤
│  [WhatsApp Button]       │  ← CTA (prominent, green)
├──────────────────────────┤
│  Photo Gallery           │
│  [Grid of 3x3 photos]    │
├──────────────────────────┤
│  Reviews                 │
│  [Review cards]          │
│  [See All Reviews]       │
└──────────────────────────┘
```

**Key Components**:
- **Image Carousel**: Swipeable horizontal, auto-play (optional)
- **WhatsApp Button**: On tap, open WhatsApp with pre-filled message:
  ```
  "Hi, I found your shop on Diaspora App. I'm interested in your products/services."
  ```
- **Gallery**: 
  - Tap to open full-screen modal
  - Swipe to navigate
  - Long-press to save/share
- **Reviews Section**:
  - Show 3 reviews, link to "See All"
  - Sort by: Recent, Helpful, Highest Rating
  - Filter by rating (5★, 4★, etc.)

**API Endpoints Needed**:
```
GET /businesses/:id
Response: {
  business: {
    id, name, category, description, phone, address,
    hours, verified, imageUrls: [...],
    rating, reviewCount, totalViews, totalContacts
  }
}

GET /businesses/:id/reviews?limit=10&sort=recent
Response: {
  reviews: [
    {
      id, rating, text, photos: [...], authorName,
      authorImage, createdAt, helpfulCount, businessResponse
    }
  ]
}

POST /businesses/:id/contact
Body: { source: "whatsapp" }
Response: { success: true, whatsappUrl: "..." }
```

---

### Screen 4: Seller Dashboard

**Tab-based Navigation**:
```
┌──────────────────────────┐
│  My Shop                 │
├──────────────────────────┤
│  [Shop Profile] [Media]  │  ← Tabs
│  [Analytics] [Reviews]   │
├──────────────────────────┤
│  [Content changes based] │
│  [on selected tab]       │
└──────────────────────────┘
```

#### Tab 4.1: Shop Profile
**Fields**:
- Shop Name (text input)
- Category (dropdown)
- Phone (text, editable)
- Address (text area with Google Places autocomplete)
- Hours of Operation (time picker, multi-day)
- Shop Description (textarea, max 500 chars)
- Profile Photo (upload/edit)
- Verified Badge (info only, shows status)

**Actions**:
- Save button (appears after edits)
- Deactivate/Activate shop toggle
- Delete shop (confirmation dialog)

#### Tab 4.2: Media Management
**Layout**:
```
┌──────────────────────────┐
│  [+ Add Photos]          │
│  [+ Add Video]           │
├──────────────────────────┤
│  [Photo 1] [Photo 2]     │  ← Masonry grid
│  [Photo 3] [Photo 4]     │
│  [Photo 5] [+ Add]       │
│                          │
│  Video:                  │
│  [▶ Video Thumbnail]     │
│  [X] Delete              │
└──────────────────────────┘
```

**Photo Features**:
- Upload max 20 photos
- Drag to reorder (long-press on mobile)
- Delete with swipe or tap icon
- Compress automatically (max 5MB each)
- Show upload progress

**Video Features**:
- Max 1 video (30 seconds)
- Auto-generate thumbnail
- Compress to 50MB max
- Show upload progress

#### Tab 4.3: Analytics
**Metrics Shown**:
- Total Profile Views (today, this week, this month)
- WhatsApp Clicks (today, this week, this month)
- Total Reviews
- Average Rating
- Top Performing Photo (by views)
- Peak Hours (when most people view)

**Visualization**:
- Line chart: Views over time (7 days / 30 days)
- Bar chart: Clicks by day
- Stats cards: Current counts

#### Tab 4.4: Reviews
**Layout**:
```
├──────────────────────────┤
│  ⭐ 4.8/5.0              │
│  124 total reviews       │
├──────────────────────────┤
│  [Rating Filter Tabs]    │
│  5★ (45) | 4★ (30) | ... │
├──────────────────────────┤
│  [Review Card]           │
│  ⭐⭐⭐⭐⭐             │
│  "Excellent service!"    │
│  By: David, 2 days ago   │
│  [Respond] [Flag]        │
├──────────────────────────┤
│  Business Response:      │
│  [Response text]         │
│  - Owner, 1 day ago      │
└──────────────────────────┘
```

**Actions**:
- Respond to review (modal with text input)
- Mark response as resolved
- Flag inappropriate review (reason dropdown)
- Delete own response

**API Endpoints Needed**:
```
GET /sellers/dashboard
Response: {
  shop: { id, name, phone, address, ... },
  stats: {
    totalViews, viewsToday, viewsWeek,
    whatsappClicks, totalReviews, avgRating
  }
}

POST /sellers/:id/media
Body: { type: "photo"|"video", file: FormData }
Response: { mediaId, url, thumbnail }

DELETE /sellers/:id/media/:mediaId
Response: { success: true }

GET /sellers/:id/analytics?period=week
Response: {
  views: [{ date, count }, ...],
  clicks: [{ date, count }, ...],
  topPhoto: { id, views, url }
}

POST /businesses/:id/reviews/:reviewId/respond
Body: { text }
Response: { response: { id, text, createdAt } }
```

---

### Screen 5: Reviews & Ratings

**Write Review Screen**:
```
┌──────────────────────────┐
│  Rate Your Experience    │
├──────────────────────────┤
│  ☆ ☆ ☆ ☆ ☆             │  ← Tap to rate
│  (5 = Excellent)         │
├──────────────────────────┤
│  [Category Tags]         │
│  [Taste] [Service]       │  ← Multiple select
│  [Cleanliness] [Price]   │
├──────────────────────────┤
│  Write your review       │
│  (optional)              │
│  [Text area, 500 chars]  │
│  [200/500 chars]         │
├──────────────────────────┤
│  [+ Add Photo]           │
│  (optional)              │
├──────────────────────────┤
│  [Submit Review]         │
│  [Cancel]                │
└──────────────────────────┘
```

**Features**:
- Star rating is required
- Text review is optional
- Photo is optional
- Validation: Star selected, char count display
- Success state: Toast "Review submitted" + return to detail page

**API Endpoints**:
```
POST /businesses/:id/reviews
Body: {
  rating: 1-5,
  text: "...",
  tags: ["taste", "service"],
  photoUrl: "..." (optional)
}
Response: { reviewId, rating, text, createdAt }
```

---

## 3. BOTTOM NAVIGATION

**5 Tabs** (mobile only):
```
├─ Home
├─ Search
├─ Messages
├─ Profile
└─ More (menu)
```

**Styling**:
- Inactive: Gray icon + label
- Active: Gold icon + label + underline
- No badge on Tab 1 (Home)
- Message badge shows unread count (Tab 3)

---

## 4. COMMON COMPONENTS

### Input Field
```tsx
<TextInput
  placeholder="Enter name"
  value={value}
  onChangeText={setValue}
  style={styles.input}
  placeholderTextColor="#999"
/>
// Styling:
// Border: #E5E7EB, 1px
// Focus: #F2C206 (gold) border
// Padding: 12px 16px
// Border radius: 8px
```

### Button (Primary)
```tsx
<TouchableOpacity 
  style={styles.primaryBtn}
  onPress={handlePress}
>
  <Text style={styles.btnText}>Get Started</Text>
</TouchableOpacity>
// Styling:
// BG: #F2C206 (gold)
// Text: #0A2758 (navy), bold, 14px
// Padding: 16px 24px
// Border radius: 10px
// Active: Scale 0.98
```

### Rating Display
```tsx
<View style={styles.rating}>
  <Text style={styles.stars}>⭐ 4.8</Text>
  <Text style={styles.count}>(124 reviews)</Text>
</View>
// Styling: Stars 16px, count 12px gray
```

### Business Card
```tsx
<TouchableOpacity 
  onPress={() => navigate('Detail', {id})}
  style={styles.card}
>
  <Image source={{uri: imageUrl}} style={styles.image} />
  <View style={styles.info}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.rating}>⭐ {rating}</Text>
  </View>
</TouchableOpacity>
// Card: 335px wide, 16px margin, shadow
```

---

## 5. API ARCHITECTURE

### Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.diaspora.app/api/v1
```

### Authentication
```
Header: Authorization: Bearer {token}
Token: JWT with payload:
  { userId, email, role: "user"|"seller"|"admin" }
```

### Common Response Format
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2026-04-24T10:30:00Z"
}

// On error:
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Email already exists"
  }
}
```

### Error Codes
```
200: OK
201: Created
400: Bad Request (invalid input)
401: Unauthorized (token invalid)
403: Forbidden (insufficient permissions)
404: Not Found
409: Conflict (duplicate email, etc.)
500: Internal Server Error
```

---

## 6. DATABASE SCHEMA (PostgreSQL)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  role ENUM('user', 'seller', 'admin'),
  avatar_url VARCHAR(500),
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Businesses Table
```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY,
  seller_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50), -- 'restaurant', 'barber', 'stylist', 'job'
  description TEXT,
  phone VARCHAR(20),
  address VARCHAR(500),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  hours_open TIME,
  hours_close TIME,
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  rating_avg DECIMAL(2, 1),
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  whatsapp_click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  user_id UUID REFERENCES users(id),
  rating INT (1-5),
  text TEXT,
  photo_urls TEXT[], -- JSON array of URLs
  tags TEXT[], -- JSON array: ['taste', 'service', ...]
  helpful_count INTEGER DEFAULT 0,
  flagged BOOLEAN DEFAULT false,
  flag_reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE business_responses (
  id UUID PRIMARY KEY,
  review_id UUID REFERENCES reviews(id),
  business_id UUID REFERENCES businesses(id),
  text TEXT NOT NULL,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Media Table
```sql
CREATE TABLE media (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  type ENUM('photo', 'video'),
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  position INTEGER, -- For ordering
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Jobs Table
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  title VARCHAR(255),
  description TEXT,
  location VARCHAR(255),
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  salary_hidden BOOLEAN,
  employment_type ENUM('full-time', 'part-time', 'contract', 'gig'),
  deadline DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. IMPLEMENTATION PRIORITY

### Week 1: Authentication & Home Feed
- [ ] User registration & login flow
- [ ] Phone OTP verification
- [ ] Home feed with category filters
- [ ] Business listing cards

### Week 2: Business Detail & WhatsApp
- [ ] Business detail page with image carousel
- [ ] WhatsApp integration (URL scheme)
- [ ] Contact tracking/analytics
- [ ] Business info layout

### Week 3: Seller Dashboard
- [ ] Seller authentication & profile setup
- [ ] Media management (photos/videos)
- [ ] Shop profile editing
- [ ] Basic analytics dashboard

### Week 4: Reviews & Polish
- [ ] Review/rating system
- [ ] Business response to reviews
- [ ] Review moderation
- [ ] Bug fixes & performance optimization
- [ ] Testing & QA

---

## 8. TESTING CHECKLIST

### Functional Testing
- [ ] User can register with email/phone
- [ ] OTP verification works
- [ ] Home feed loads and infinite scrolls
- [ ] Search returns correct results
- [ ] Business detail page loads images
- [ ] WhatsApp button opens correct URL
- [ ] Seller can upload photos/videos
- [ ] Analytics dashboard shows correct data
- [ ] Review submission saves to DB

### Performance Testing
- [ ] App loads in < 3 seconds
- [ ] Feed scrolls at 60 FPS
- [ ] Images load in < 2 seconds
- [ ] Search returns in < 1 second

### Responsive Design
- [ ] Mobile (375px) looks correct
- [ ] Tablet (768px) layout works
- [ ] All text is readable
- [ ] Images scale properly

### Security Testing
- [ ] JWT token validation works
- [ ] Users can't access others' data
- [ ] Seller can't edit others' shops
- [ ] Input validation on all forms

---

## 9. DEPLOYMENT CHECKLIST

### Pre-Launch
- [ ] All screens implemented & tested
- [ ] Backend APIs deployed
- [ ] Database migrations run
- [ ] WhatsApp integration live
- [ ] AWS S3 bucket configured
- [ ] Firebase Analytics setup
- [ ] Error tracking (Sentry) live
- [ ] Performance monitoring active

### App Store Submission
- [ ] iOS: Build archived, signed, ready
- [ ] Android: APK/AAB built & tested
- [ ] Privacy policy written & in-app
- [ ] Screenshots captured for store
- [ ] App description & metadata ready
- [ ] Icon & splash screen designed

---

## 10. RESOURCES & LINKS

- **Figma Design**: https://www.figma.com/design/ornKDkGmPrKuRmeaYRlbrD
- **Design Spec**: DIASPORA_APP_DESIGN_SPEC.md
- **React Native Docs**: https://reactnative.dev
- **Firebase Docs**: https://firebase.google.com/docs
- **WhatsApp Business API**: https://www.whatsapp.com/business/api
- **Google Maps API**: https://developers.google.com/maps

---

**Questions?** Contact design lead or refer to design spec for clarifications.
