# Google Play Internal Testing Checklist

Use this checklist to launch the first Android test release for The Diaspora App.

## App Identity

- App name: `The Diaspora App`
- Android package name: `com.ndnanalyticsinc.thediaspora`
- Release version: `1.0.5`
- Android version code: `12`
- Privacy policy URL: `https://www.thediaspora.app/privacy.html`
- App Hosting URL: `https://www.thediaspora.app`

## Local Build Prep

From `diaspora-android`:

```powershell
npm.cmd run sync
Set-Location android
.\gradlew.bat bundleRelease
```

The signed Android App Bundle is created at `android/app/build/outputs/bundle/release/app-release.aab`.

## Play Console Internal Test

1. Create the app in Google Play Console.
2. Choose app type `App`.
3. Choose free or paid before publishing; this can affect later release options.
4. Add the default language, app name, category, contact email, and privacy policy URL.
5. Go to `Test and release` > `Testing` > `Internal testing`.
6. Create a tester email list.
7. Create a new internal release.
8. Upload `builds/the-diaspora-app-1.0.5-vc12-ndnanalyticsinc-google-signin-fix.aab`.
9. Add release notes.
10. Save and publish the internal test.
11. Share the tester opt-in link with testers.

## Google Sign-In Certificate Check

The Firebase Android app for `com.ndnanalyticsinc.thediaspora` must retain both SHA-1 certificates:

- Upload certificate: `7E:1D:C1:DF:D6:0E:7C:10:FC:C8:2B:0B:0D:C3:AB:FE:B6:87:EC:6E`
- Google Play App Signing certificate: `8A:B0:2A:30:EE:7B:84:8A:B1:83:E6:AF:3F:97:2E:80:B2:61:02:E3`

## Remaining Before Public Launch

- Confirm `https://www.thediaspora.app/privacy.html` is live.
- Complete Play Console data safety.
- Complete target audience/content rating.
- Add screenshots, app icon, feature graphic, and store description.
- Run a tester smoke test: open app, navigate tabs, sign in/sign up, load Firebase data, and confirm no crashes.
