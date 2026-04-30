# Deploy

This project ships via **Firebase App Hosting** (not classic Firebase Hosting).
The Firebase GitHub App watches `master`; every push to that branch triggers
a Cloud Build → rollout in `europe-west4` for the `diaspora-app` backend.

## Daily flow

```bash
git push origin master
# → Firebase App Hosting picks it up automatically
# → Build status appears as a check on the commit (see github.com/dnkefua/diaspora-app)
```

The check named **"App Hosting - Rollout (the-diaspora-app/europe-west4/diaspora-app)"**
must turn green for the deploy to be live. If it's red, click through to the
Firebase Console for build logs.

## Runtime configuration

`apphosting.yaml` controls runtime resources and env vars:

- 1 vCPU, 512 MiB, max 5 instances, 80 concurrency, 60s timeout
- `NODE_ENV=production`, `PORT=8080`
- Static-first site served by `node dev-server.js` (auto-detected via `npm start`)

To change resources, edit `apphosting.yaml`, commit, push.

## Custom domain (`thediaspora.app`)

App Hosting handles SSL automatically once DNS is in place. The whole flow takes
~15-60 minutes after DNS propagates.

### 1. Add the domain in Firebase Console

1. Open [Firebase Console → App Hosting → diaspora-app](https://console.firebase.google.com/project/the-diaspora-app/apphosting/backends/diaspora-app/locations/europe-west4/overview)
2. Settings tab → **Custom domains** → **Add custom domain**
3. Add both records, one at a time:
   - `thediaspora.app` (apex)
   - `www.thediaspora.app` (www)
4. Firebase will display the DNS records you need to add at your registrar.

### 2. Add DNS records at your registrar

Typical records App Hosting will request:

```
# Apex (thediaspora.app)  →  A records pointing at Google's load balancer
A      thediaspora.app           <ip provided by Firebase>
A      thediaspora.app           <ip provided by Firebase>

# www subdomain                  →  CNAME to the App Hosting hostname
CNAME  www.thediaspora.app       <backend>.web.app
```

The exact IPs and CNAME target are shown in the Firebase Console — copy them
verbatim. You may also be asked for a TXT record for ownership verification:

```
TXT    _firebaseapp.thediaspora.app     <verification token>
```

### 3. Wait for propagation + cert provisioning

- DNS propagation: minutes to a few hours
- Managed SSL certificate: provisioned automatically once DNS resolves; usually 15-30 min
- Status will move from "Needs setup" → "Pending" → "Connected" in the Console

### 4. Decide on canonical host

The site is configured with `https://www.thediaspora.app/` as canonical (see
`<link rel="canonical">` in `index.html`, `og:url`, `sitemap.xml`, schema.org).
You should redirect the apex to `www`:

- In Firebase Console → App Hosting → Custom domains, set `thediaspora.app`
  to **redirect** to `www.thediaspora.app`. Or
- Configure a 301 redirect at your registrar.

Either approach is fine; the Console option is simpler.

### 5. Verify

```bash
# DNS
dig +short thediaspora.app
dig +short www.thediaspora.app

# HTTPS
curl -I https://www.thediaspora.app/
curl -I https://thediaspora.app/    # should return 301 → www

# Cert
echo | openssl s_client -servername www.thediaspora.app -connect www.thediaspora.app:443 2>/dev/null | openssl x509 -noout -dates
```

### 6. Post-domain housekeeping

- [ ] Update `OAuth redirect URIs` in Firebase Auth settings to include
      `https://www.thediaspora.app/__/auth/handler` (Google sign-in etc.)
- [ ] Add the new domain to **Authorized domains** in Firebase Auth → Settings
- [ ] Submit `https://www.thediaspora.app/sitemap.xml` to Google Search Console
- [ ] Update `robots.txt` if it points anywhere absolute (it shouldn't)
- [ ] Verify share previews: paste a few URLs into Slack / WhatsApp / Twitter
      to confirm OG tags resolve correctly

## Database / auth setup (one-time)

These are independent of code deploys but must be done before launch:

1. **Enable Email/Password auth** in Firebase Console → Authentication → Sign-in method
2. **Create the Firestore database** in `europe-west` (same region as App Hosting)
3. **Deploy security rules**:
   ```bash
   firebase deploy --only firestore:rules,storage
   ```
4. **Bootstrap the first admin** — in Firebase Console → Firestore →
   create a collection `admins` → add a document with the doc ID set to
   your Auth user's UID, with fields `{ email, name, grantedAt: <timestamp> }`.
   The new admin can then visit `/admin.html` to manage moderation.
5. **Seed initial businesses** (optional):
   ```bash
   node seed-data.js
   ```

## Rollback

```bash
# Via Firebase CLI (if installed)
firebase hosting:rollback

# Via Console
# Firebase Console → App Hosting → diaspora-app → Rollouts → previous → "Roll back"
```

## Polish before launch

### Generate proper PWA icons

Currently `manifest.webmanifest` references the source logo at every size and
lets the browser downscale. The source is 1254×1254 so that works, but for
maximum visual fidelity (especially on Android adaptive icons and iOS sharper
home-screen tiles) generate purpose-built sizes:

1. Drop `Media resources/TheDiaspora app logo 3D.png` into
   [realfavicongenerator.net](https://realfavicongenerator.net/) or
   [maskable.app](https://maskable.app/) for the maskable variant.
2. Replace the three `icons` entries in `manifest.webmanifest` with the
   generated paths (typically `icon-192.png`, `icon-512.png`,
   `icon-maskable-512.png`).
3. Also drop a single `apple-touch-icon-180.png` and update the
   `<link rel="apple-touch-icon">` in every page's `<head>` (currently
   only `index.html` is wired up — see grep `apple-touch-icon`).
4. Optional: generate iOS splash images (one per device class) and add
   `<link rel="apple-touch-startup-image" media="…">` tags to `index.html`.

### Lighthouse pass

Once the live custom domain is up:

```bash
npx lighthouse https://www.thediaspora.app/ \
  --output=html \
  --output-path=./lighthouse.html \
  --chrome-flags="--headless"
```

Targets: ≥90 on Performance, Accessibility, Best Practices, SEO.
The redesigned landing already preloads the hero image as an LCP candidate
and uses `decoding="async"` on every below-fold image; the main remaining
wins are typically (a) self-host fonts to drop the third-party connection,
(b) compress / convert ad-tile imagery to AVIF, (c) add a service worker
for offline + repeat-visit speed.

## Troubleshooting

**Rollout is red but I can't tell why.** Click the check on the GitHub
commit page → "Details" → opens the build log in Cloud Build / Firebase
Console.

**Site loads but the logo 404s.** Verify `Media resources/` is being served
by the `dev-server.js` process (it's not excluded from the App Hosting
container — only from classic `firebase.json` hosting, which is unused).

**Auth doesn't redirect after sign-in.** Add the production domain to
Firebase Auth → Settings → Authorized domains.
