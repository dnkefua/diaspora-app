# Diaspora App — Firebase Setup Guide

## Project ID: `the-diaspora-app`

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter project name: `the-diaspora-app`
4. Enable/disable Google Analytics (your choice)
5. Click **Create project**

## Step 2: Register Web App

1. In Firebase Console, click the **Web** icon (`</>`)
2. Register app nickname: `Diaspora Web`
3. Copy the `firebaseConfig` object provided
4. Click **Continue to console**

## Step 3: Update firebase-config.js

Open `firebase-config.js` and replace the placeholder config with your actual values:

```js
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "the-diaspora-app.firebaseapp.com",
  projectId: "the-diaspora-app",
  storageBucket: "the-diaspora-app.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 4: Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**:
   - Click Email/Password
   - Toggle **Enable**
   - Click **Save**
3. (Optional) Enable **Google** and **Apple** providers:
   - Requires OAuth credentials from Google/Apple developer consoles

## Step 5: Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **test mode** (for development)
4. Choose a location (recommend `us-central` or closest to your users)
5. Click **Enable**

### Firestore Security Rules (Development)

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to authenticated users during development
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Firestore Security Rules (Production)

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Businesses: public read, write for owners
    match /businesses/{bizId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      resource.data.ownerId == request.auth.uid;
    }
    
    // Reviews: authenticated users can write
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 6: Enable Firebase Storage

1. Go to **Storage**
2. Click **Get started**
3. Start in **test mode**
4. Use same location as Firestore
5. Click **Done**

### Storage Security Rules

```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload business images
    match /businesses/{bizId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 7: Seed Initial Data

To populate the database with initial business data:

1. Create a temporary HTML file:

```html
<!DOCTYPE html>
<html>
<head><title>Seed Data</title></head>
<body>
  <h1>Seeding Firestore...</h1>
  <script type="module" src="seed-data.js"></script>
</body>
</html>
```

2. Serve the files locally (e.g., `npx serve` or VS Code Live Server)
3. Open the page in browser
4. Check Console for "Database seeded successfully!"

## Step 8: Update HTML Files

To use Firebase-enabled auth, update your HTML references:

**For signup:**
```html
<!-- Change from: -->
<a href="signup.html">Join Diaspora</a>
<!-- To: -->
<a href="signup-firebase.html">Join Diaspora</a>
```

**For login:**
```html
<!-- Change from: -->
<a href="login.html">Sign in</a>
<!-- To: -->
<a href="login-firebase.html">Sign in</a>
```

## Step 9: Deploy to Firebase Hosting (Optional)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. Initialize:
   ```bash
   firebase init hosting
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

## Firestore Data Structure

### Collections

- `users/{userId}` - User profiles
- `businesses/{businessId}` - Business listings
- `reviews/{reviewId}` - User reviews
- `otp_codes/{phone}` - Temporary OTP codes (TTL: 5 min)

### User Document

```js
{
  uid: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  city: string,
  joined: string (ISO),
  avatar: string | null,
  bio: string,
  provider: 'email' | 'google' | 'apple',
  emailVerified: boolean,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
```

### Business Document

```js
{
  id: string,
  name: string,
  category: string,
  city: string,
  area: string,
  rating: number,
  reviews: number,
  phone: string,
  verified: boolean,
  image: string,
  images: string[],
  desc: string,
  hours: {
    monday: string,
    tuesday: string,
    // ...
  },
  ownerId: string | null,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
```

## Troubleshooting

**Error: "Firebase not initialized"**
- Check that `firebase-config.js` has valid credentials
- Ensure you're serving files via HTTP (not file://)

**Error: "Permission denied"**
- Check Firestore security rules
- Verify user is authenticated

**Error: "Network error"**
- Check internet connection
- Verify Firebase project is active
