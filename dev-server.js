const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ROOT = process.cwd();
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'the-diaspora-app';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.rss': 'application/rss+xml; charset=utf-8',
  '.atom': 'application/atom+xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf'
};

function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(body));
}

function readJson(req, limit = 32 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > limit) {
        reject(Object.assign(new Error('Request body too large'), { status: 413 }));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (_) {
        reject(Object.assign(new Error('Invalid JSON'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

function b64urlToBuffer(value) {
  const b64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return Buffer.from(b64, 'base64');
}

function parseJwt(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw Object.assign(new Error('Invalid token'), { status: 401 });
  return {
    header: JSON.parse(b64urlToBuffer(parts[0]).toString('utf8')),
    payload: JSON.parse(b64urlToBuffer(parts[1]).toString('utf8')),
    signingInput: `${parts[0]}.${parts[1]}`,
    signature: b64urlToBuffer(parts[2])
  };
}

let firebaseCertCache = { expiresAt: 0, certs: null };
async function getFirebaseCerts() {
  if (firebaseCertCache.certs && firebaseCertCache.expiresAt > Date.now()) return firebaseCertCache.certs;
  const resp = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
  if (!resp.ok) throw new Error('Could not fetch Firebase auth certificates');
  const cacheControl = resp.headers.get('cache-control') || '';
  const maxAge = Number((cacheControl.match(/max-age=(\d+)/) || [])[1] || 3600);
  const certs = await resp.json();
  firebaseCertCache = { certs, expiresAt: Date.now() + maxAge * 1000 };
  return certs;
}

async function verifyFirebaseIdToken(token) {
  const jwt = parseJwt(token);
  const certs = await getFirebaseCerts();
  const cert = certs[jwt.header.kid];
  if (!cert) throw Object.assign(new Error('Unknown token certificate'), { status: 401 });
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(jwt.signingInput);
  verifier.end();
  if (!verifier.verify(cert, jwt.signature)) {
    throw Object.assign(new Error('Invalid token signature'), { status: 401 });
  }
  const now = Math.floor(Date.now() / 1000);
  const expectedIssuer = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;
  if (jwt.payload.aud !== FIREBASE_PROJECT_ID || jwt.payload.iss !== expectedIssuer || jwt.payload.exp <= now) {
    throw Object.assign(new Error('Invalid token claims'), { status: 401 });
  }
  return jwt.payload;
}

async function getGoogleAccessToken() {
  if (process.env.GOOGLE_OAUTH_ACCESS_TOKEN) return process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  const resp = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
    headers: { 'Metadata-Flavor': 'Google' }
  });
  if (!resp.ok) throw new Error('Google runtime credentials are not available');
  const data = await resp.json();
  return data.access_token;
}

function firestoreValueToJson(value) {
  if (!value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('timestampValue' in value) return value.timestampValue;
  if ('mapValue' in value) {
    const out = {};
    for (const [k, v] of Object.entries(value.mapValue.fields || {})) out[k] = firestoreValueToJson(v);
    return out;
  }
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(firestoreValueToJson);
  return null;
}

async function getUserProfile(uid) {
  const token = await getGoogleAccessToken();
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${encodeURIComponent(uid)}`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (resp.status === 404) return {};
  if (!resp.ok) throw new Error('Could not load subscription profile');
  const doc = await resp.json();
  const profile = {};
  for (const [k, v] of Object.entries(doc.fields || {})) profile[k] = firestoreValueToJson(v);
  return profile;
}

function hasAiAccess(profile) {
  const sub = profile?.subscription || {};
  const status = String(profile?.subscriptionStatus || sub.status || '').toLowerCase();
  const plan = String(profile?.plan || sub.plan || '').toLowerCase();
  return ['active', 'trialing', 'paid'].includes(status) || ['premium', 'pro', 'business', 'founder'].includes(plan);
}

function buildAiPrompt(action, context) {
  const c = context || {};
  const common = [
    `Business name: ${c.name || 'Unnamed business'}`,
    `Category: ${c.category || 'Business'}`,
    `City/area: ${[c.area, c.city].filter(Boolean).join(', ') || 'Not provided'}`,
    `Main offer: ${c.offer || c.description || 'Not provided'}`,
    `Ideal customer: ${c.audience || 'Diaspora customers'}`,
    `Tone: ${c.tone || 'Premium and warm'}`
  ].join('\n');
  if (action === 'services') {
    return `${common}\n\nCreate 4 menu/service items. For each, include name, one-sentence description, and suggested pricing style. Keep it practical for a marketplace business page.`;
  }
  if (action === 'shots') {
    return `${common}\n\nCreate a concise photo and short-video shot list for this business page. Focus on visuals that build trust and make customers want to book.`;
  }
  return `${common}\n\nWrite a polished business page package: headline, short description under 120 words, three trust bullets, and a short call-to-action.`;
}

function extractOpenAiText(data) {
  if (data.output_text) return data.output_text;
  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.text) chunks.push(content.text);
    }
  }
  return chunks.join('\n').trim();
}

async function handleAiListing(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
  if (!process.env.OPENAI_API_KEY) return sendJson(res, 503, { error: 'AI is not configured on this server' });

  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const claims = await verifyFirebaseIdToken(token);
    const profile = await getUserProfile(claims.user_id || claims.sub);
    if (!hasAiAccess(profile)) return sendJson(res, 403, { error: 'AI Studio requires an active subscription' });

    const body = await readJson(req);
    const prompt = buildAiPrompt(body.action, body.context);
    const aiResp = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        instructions: 'You are the listing assistant for The Diaspora App. Write concise, premium, culturally aware copy for diaspora-owned businesses. Avoid unverifiable claims.',
        input: prompt,
        max_output_tokens: 650
      })
    });
    const data = await aiResp.json();
    if (!aiResp.ok) return sendJson(res, aiResp.status, { error: data.error?.message || 'OpenAI request failed' });
    return sendJson(res, 200, { text: extractOpenAiText(data), model: OPENAI_MODEL });
  } catch (error) {
    return sendJson(res, error.status || 500, { error: error.message || 'AI request failed' });
  }
}

function serveFile(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mime[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) return send404(res);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const safeUrl = decodeURI(req.url.split('?')[0]);
    if (safeUrl === '/api/ai-listing') {
      return await handleAiListing(req, res);
    }

    let filePath = path.join(ROOT, safeUrl);

    // If path is directory, serve index.html inside it
    if (safeUrl === '/' || safeUrl.endsWith('/')) {
      filePath = path.join(ROOT, safeUrl, 'index.html');
    }

    // If no extension, try adding .html
    if (!path.extname(filePath)) {
      const withHtml = filePath + '.html';
      if (fs.existsSync(withHtml)) filePath = withHtml;
    }

    if (!fs.existsSync(filePath)) {
      return send404(res);
    }

    serveFile(req, res, filePath);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGINT', () => process.exit());
