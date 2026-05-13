# Google Play Internal Testing Checklist

Use this checklist to launch the first Android test release for The Diaspora App.

## App Identity

- App name: `The Diaspora App`
- Android package name: `com.ndnanalytics.thediaspora`
- Initial app version: `1.0.0`
- Initial Android version code: `1`
- Privacy policy URL: `https://www.thediaspora.app/privacy.html`
- App Hosting URL: `https://www.thediaspora.app`

## Local Build Prep

From `diaspora-mobile`:

```powershell
npm.cmd run lint
npx.cmd eas-cli login
npx.cmd eas-cli build --platform android --profile production
```

The production profile creates an Android App Bundle (`.aab`) for Google Play.

## Play Console Internal Test

1. Create the app in Google Play Console.
2. Choose app type `App`.
3. Choose free or paid before publishing; this can affect later release options.
4. Add the default language, app name, category, contact email, and privacy policy URL.
5. Go to `Test and release` > `Testing` > `Internal testing`.
6. Create a tester email list.
7. Create a new internal release.
8. Upload the `.aab` from the EAS build.
9. Add release notes.
10. Save and publish the internal test.
11. Share the tester opt-in link with testers.

## EAS Submit Later

After the first app is created in Play Console and API access is connected, this repo can submit directly to the internal track:

```powershell
npx.cmd eas-cli submit --platform android --profile production
```

The `production` submit profile is configured for the Play `internal` track.

## Remaining Before Public Launch

- Confirm `https://www.thediaspora.app/privacy.html` is live.
- Complete Play Console data safety.
- Complete target audience/content rating.
- Add screenshots, app icon, feature graphic, and store description.
- Run a tester smoke test: open app, navigate tabs, sign in/sign up, load Firebase data, and confirm no crashes.
