# Deploy to Firebase Hosting

## Quick Deploy (Recommended)

Run these commands in your terminal:

```bash
# 1. Login to Firebase
firebase login

# 2. Deploy to production
firebase deploy --only hosting

# Or deploy to a preview channel
firebase hosting:channel:deploy preview
```

## Manual Alternative (No Firebase CLI)

If you prefer not to install the Firebase CLI, you can deploy via GitHub Actions:

1. Push this repository to GitHub
2. In Firebase Console, go to Hosting → Set up GitHub integration
3. Connect your GitHub repository
4. Configure automatic deployments on push to `main` branch

## What Gets Deployed

All HTML, CSS, JS files in this directory:
- `index.html` - Landing page
- `feed.html` - Business feed (Firestore-enabled)
- `business.html` - Business details page
- `otp.html` - OTP verification (Firebase-enabled)
- `signup-firebase.html` - Signup with Firebase Auth
- `login-firebase.html` - Login with Firebase Auth
- `seller-dashboard.html` - Seller dashboard
- `profile.html` - User profile
- `firebase-config.js` - Firebase configuration
- All assets (images, CSS)

## Post-Deploy Checklist

1. **Test the live URL**: `https://the-diaspora-app.web.app`
2. **Verify Firebase Auth**: Sign up a test user
3. **Check Firestore integration**: Browse the feed
4. **Update Firestore security rules** (see FIREBASE_SETUP.md)
5. **Configure custom domain** (optional) in Firebase Console → Hosting

## Rollback

If something goes wrong:
```bash
firebase hosting:rollback
```

Or use the Firebase Console → Hosting → Release history → Rollback
