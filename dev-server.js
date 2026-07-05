const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load .env for local development. In production (Firebase App Hosting) env vars
// are injected from apphosting.yaml / Secret Manager, so .env is absent and this
// is a harmless no-op.
try { if (typeof process.loadEnvFile === 'function') process.loadEnvFile(); } catch (_) { /* no .env file present */ }

const PORT = process.env.PORT || 3000;
const ROOT = process.cwd();
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'the-diaspora-app';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
// Accept either the conventional name or the .env name used in this project.
const OPENAI_API_KEY = process.env['OPENAI_API_KEY'] || process.env['API_KEY_OPENAI'] || '';

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
  if (!OPENAI_API_KEY) return sendJson(res, 503, { error: 'AI is not configured on this server' });

  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const claims = await verifyFirebaseIdToken(token);
    const profile = await getUserProfile(claims.user_id || claims.sub);
    if (!hasAiAccess(profile)) return sendJson(res, 403, { error: 'AI Studio requires an active subscription' });
    if (!process.env.OPENAI_API_KEY) return sendJson(res, 503, { error: 'AI is not configured on this server' });

    const body = await readJson(req);
    const prompt = buildAiPrompt(body.action, body.context);
    const aiResp = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
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

// ───────────────────────── Menu extraction API ─────────────────────────
// Turns an uploaded menu / price-list document (PDF, photo, or text) into
// structured orderable items {name, description, price, currency}. The seller
// reviews/edits them in the dashboard before they become the page's tappable
// "Menu & Services". Premium-gated, same as the AI Studio. The file is fetched
// server-side from the business's own Firebase Storage URL (host-allowlisted —
// no arbitrary fetch / SSRF) and read by a multimodal model.
const OPENAI_VISION_MODEL = process.env.OPENAI_VISION_MODEL || OPENAI_MODEL;
const MENU_FETCH_MAX = 12 * 1024 * 1024;
const MENU_TEXT_TYPES = new Set(['text/plain', 'text/csv']);

function isAllowedStorageHost(host) {
  return /(^|\.)firebasestorage\.googleapis\.com$/.test(host)
    || /(^|\.)storage\.googleapis\.com$/.test(host)
    || /(^|\.)firebasestorage\.app$/.test(host);
}

async function fetchBinary(url, maxBytes) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const resp = await fetch(url, { signal: ctrl.signal, redirect: 'follow' });
    if (!resp.ok) throw Object.assign(new Error('Could not read the uploaded file (HTTP ' + resp.status + ')'), { status: 502 });
    const declared = Number(resp.headers.get('content-length') || 0);
    if (declared && declared > maxBytes) throw Object.assign(new Error('File is too large to read'), { status: 413 });
    const buf = Buffer.from(await resp.arrayBuffer());
    if (buf.length > maxBytes) throw Object.assign(new Error('File is too large to read'), { status: 413 });
    return buf;
  } finally {
    clearTimeout(timer);
  }
}

// Extract the first complete JSON value via balanced-bracket scan (string-aware),
// so trailing prose after the JSON doesn't break parsing.
function extractFirstJson(t) {
  const startIdx = t.search(/[\[{]/);
  if (startIdx < 0) return '';
  const open = t[startIdx];
  const close = open === '{' ? '}' : ']';
  let depth = 0, inStr = false, esc = false;
  for (let i = startIdx; i < t.length; i++) {
    const ch = t[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === open) depth++;
    else if (ch === close) { depth--; if (depth === 0) return t.slice(startIdx, i + 1); }
  }
  return '';
}

function parseMenuJson(text) {
  if (!text) return null;
  const t = String(text).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  try { return JSON.parse(t); } catch (_) { /* fall through to balanced scan */ }
  const slice = extractFirstJson(t);
  if (slice) { try { return JSON.parse(slice); } catch (_) { /* give up */ } }
  return null;
}

function cleanCurrency(v, fallback) {
  const c = String(v || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
  return c || fallback;
}

function sanitizeMenuItems(parsed, fallbackCurrency) {
  const arr = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.items) ? parsed.items : []);
  const topCcy = (parsed && !Array.isArray(parsed)) ? cleanCurrency(parsed.currency, '') : '';
  const out = [];
  for (const raw of arr) {
    if (!raw || typeof raw !== 'object') continue;
    const name = String(raw.name || raw.title || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    if (!name) continue;
    let price = raw.price;
    if (typeof price === 'string') { const m = price.replace(/[, ]/g, '').match(/-?\d+(?:\.\d+)?/); price = m ? Number(m[0]) : null; }
    if (typeof price !== 'number' || !isFinite(price) || price < 0 || price > 1e7) price = null;
    const description = raw.description ? String(raw.description).replace(/\s+/g, ' ').trim().slice(0, 280) : null;
    out.push({ name, description, price, currency: cleanCurrency(raw.currency, topCcy || fallbackCurrency) });
    if (out.length >= 80) break;
  }
  return out;
}

async function handleExtractMenu(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
  if (!OPENAI_API_KEY) return sendJson(res, 503, { error: 'AI is not configured on this server' });
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const claims = await verifyFirebaseIdToken(token);
    const profile = await getUserProfile(claims.user_id || claims.sub);
    if (!hasAiAccess(profile)) return sendJson(res, 403, { error: 'Menu import is a subscriber feature. Upgrade to unlock it.' });

    const body = await readJson(req);
    const fileUrl = String(body.fileUrl || '');
    const fileType = String(body.fileType || '').toLowerCase();
    const fileName = String(body.fileName || 'menu').slice(0, 120);
    const fallbackCurrency = cleanCurrency(body.currency, 'AED');

    let host = '';
    try { host = new URL(fileUrl).host; } catch (_) { return sendJson(res, 400, { error: 'Invalid file URL' }); }
    if (!isAllowedStorageHost(host)) return sendJson(res, 400, { error: 'File must be one you uploaded to your business' });

    const isImage = fileType.startsWith('image/') || /\.(png|jpe?g|webp|gif|heic)(?:$|\?)/i.test(fileUrl);
    const isPdf = fileType === 'application/pdf' || /\.pdf(?:$|\?)/i.test(fileUrl);
    const isText = MENU_TEXT_TYPES.has(fileType) || /\.(txt|csv)(?:$|\?)/i.test(fileUrl);
    if (!isImage && !isPdf && !isText) {
      return sendJson(res, 422, { error: 'For best results upload your menu as a PDF or a clear photo (JPG/PNG).' });
    }

    const ask = 'Extract every distinct orderable item (dish, drink, service, package, or product) from this '
      + (isText ? 'menu text' : 'menu document') + '.\n'
      + 'Return JSON shaped exactly: {"currency":"<ISO code or symbol shown, else ' + fallbackCurrency + '>","items":'
      + '[{"name":"...","description":"short or null","price":<number or null>,"currency":"<ISO, else ' + fallbackCurrency + '>"}]}.\n'
      + 'Rules: name is required and concise. description optional, under 200 characters. price is a plain number with no currency symbol or thousands separators; use null when no price is shown. Never invent items or prices. Keep the original order. Ignore page headers/footers, opening hours, phone numbers and addresses.';

    let content;
    if (isText) {
      const buf = await fetchBinary(fileUrl, 512 * 1024);
      content = [{ type: 'input_text', text: ask + '\n\nMENU TEXT:\n' + buf.toString('utf8').slice(0, 200000) }];
    } else if (isImage) {
      content = [{ type: 'input_text', text: ask }, { type: 'input_image', image_url: fileUrl }];
    } else {
      const buf = await fetchBinary(fileUrl, MENU_FETCH_MAX);
      content = [
        { type: 'input_text', text: ask },
        { type: 'input_file', filename: /\.pdf$/i.test(fileName) ? fileName : 'menu.pdf', file_data: 'data:application/pdf;base64,' + buf.toString('base64') }
      ];
    }

    const aiResp = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: OPENAI_VISION_MODEL,
        instructions: 'You read restaurant menus, salon price lists and service lists, and extract every orderable item accurately. Respond with strict JSON only.',
        input: [{ role: 'user', content }],
        max_output_tokens: 3000,
        text: { format: { type: 'json_object' } }
      })
    });
    const data = await aiResp.json();
    if (!aiResp.ok) return sendJson(res, aiResp.status, { error: data.error?.message || 'Extraction failed' });

    const parsed = parseMenuJson(extractOpenAiText(data));
    const items = sanitizeMenuItems(parsed, fallbackCurrency);
    if (!items.length) return sendJson(res, 422, { error: 'No menu items could be read. Try a clearer photo or a text-based PDF.' });
    const currency = (parsed && !Array.isArray(parsed)) ? cleanCurrency(parsed.currency, fallbackCurrency) : fallbackCurrency;
    return sendJson(res, 200, { items, currency, count: items.length });
  } catch (error) {
    return sendJson(res, error.status || 500, { error: error.message || 'Extraction failed' });
  }
}

// ───────────────────────── News aggregation API ─────────────────────────
// Server-side RSS/Atom aggregator. Fetches feeds directly (no CORS, no third-
// party proxy), parses + merges + dedupes, and caches in memory. URLs are built
// server-side from a fixed template + validated params (no open proxy / SSRF).
const NEWS_TTL_MS = 5 * 60 * 1000;
const newsCache = new Map(); // cacheKey -> { at, payload }
const GN_EDITIONS = {
  en: { hl: 'en-US', gl: 'US', ceid: 'US:en' },
  fr: { hl: 'fr', gl: 'FR', ceid: 'FR:fr' },
  ar: { hl: 'ar', gl: 'EG', ceid: 'EG:ar' },
  pt: { hl: 'pt-PT', gl: 'PT', ceid: 'PT:pt-150' }
};
const NEWS_CATEGORIES = {
  all: '', business: 'business OR economy', tech: 'technology',
  sport: 'sport OR football', entertainment: 'entertainment OR music OR celebrity',
  health: 'health', diaspora: 'diaspora OR migration OR abroad'
};
const PANAFRICA_FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/world/africa/rss.xml', label: 'BBC Africa' },
  { url: 'https://theconversation.com/africa/articles.atom', label: 'The Conversation Africa' },
  { url: 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf', label: 'AllAfrica' }
];

async function fetchText(url, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'TheDiasporaApp-News/1.0 (+https://www.thediaspora.app)',
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'
      }
    });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return await resp.text();
  } finally {
    clearTimeout(timer);
  }
}

const NEWS_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
  hellip: '…', mdash: '—', ndash: '–'
};
function decodeEntities(s) {
  return String(s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => { try { return String.fromCodePoint(parseInt(h, 16)); } catch (_) { return ''; } })
    .replace(/&#(\d+);/g, (_, d) => { try { return String.fromCodePoint(parseInt(d, 10)); } catch (_) { return ''; } })
    .replace(/&([a-zA-Z]+);/g, (m, n) => (NEWS_ENTITIES[n] != null ? NEWS_ENTITIES[n] : m));
}
function cleanText(s) {
  return decodeEntities(String(s || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}
function tagText(block, name) {
  const n = name.replace(':', '\\:');
  const m = block.match(new RegExp('<' + n + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + n + '>', 'i'));
  return m ? m[1] : '';
}
function firstText(block, names) {
  for (const n of names) { const v = cleanText(tagText(block, n)); if (v) return v; }
  return '';
}
function entryLink(block) {
  for (const l of block.matchAll(/<link\b([^>]*?)\/?>/gi)) {
    const attrs = l[1];
    const href = (attrs.match(/href="([^"]+)"/i) || [])[1];
    if (!href) continue;
    const rel = (attrs.match(/rel="([^"]+)"/i) || [])[1];
    if (!rel || rel === 'alternate') return cleanText(href);
  }
  const t = cleanText(tagText(block, 'link'));
  return /^https?:/i.test(t) ? t : '';
}
function attrUrl(block, tag) {
  const m = block.match(new RegExp('<' + tag.replace(':', '\\:') + '\\b[^>]*\\burl="([^"]+)"', 'i'));
  return m ? cleanText(m[1]) : '';
}
function feedVideoId(block, link) {
  let v = cleanText(tagText(block, 'yt:videoId'));
  if (!v) { const id = cleanText(tagText(block, 'id')); const m = id.match(/video:([\w-]{6,})/); if (m) v = m[1]; }
  if (!v && link) { const m = link.match(/[?&]v=([\w-]{6,})/); if (m) v = m[1]; }
  return v;
}
function parseFeed(xml, label) {
  const head = xml.slice(0, 4000).replace(/<(item|entry)[\s\S]*$/i, '');
  const feedTitle = firstText(head, ['title']) || label || '';
  let blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || [];
  return blocks.slice(0, 25).map(b => {
    const link = entryLink(b);
    const video = feedVideoId(b, link);
    let image = attrUrl(b, 'media:thumbnail') || attrUrl(b, 'media:content') || attrUrl(b, 'enclosure');
    if (!image && video) image = 'https://i.ytimg.com/vi/' + video + '/hqdefault.jpg';
    const source = firstText(b, ['source', 'dc:creator', 'dc:publisher']) || feedTitle || label;
    return {
      title: cleanText(tagText(b, 'title')),
      link,
      date: Date.parse(firstText(b, ['pubDate', 'published', 'updated', 'dc:date'])) || 0,
      source, image, video
    };
  }).filter(it => it.title && it.link);
}
function mergeFeeds(arrays) {
  const map = new Map();
  for (const arr of arrays) for (const it of arr) {
    const k = (it.title || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80);
    if (!k) continue;
    const ex = map.get(k);
    if (!ex || (it.date || 0) > (ex.date || 0)) map.set(k, it);
  }
  return [...map.values()].sort((a, b) => (b.date || 0) - (a.date || 0));
}
async function fetchFeedSafe(url, label) {
  try { return parseFeed(await fetchText(url), label); } catch (_) { return []; }
}
function gnUrl(q, lang, catId) {
  const e = GN_EDITIONS[lang] || GN_EDITIONS.en;
  const cat = NEWS_CATEGORIES[catId] || '';
  const terms = q + (cat ? ' ' + cat : '') + ' when:14d';
  return `https://news.google.com/rss/search?q=${encodeURIComponent(terms)}&hl=${e.hl}&gl=${e.gl}&ceid=${e.ceid}`;
}
const newsFold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/gi, ' ').toLowerCase().trim();

async function handleNews(req, res) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
  const u = new URL(req.url, 'http://localhost');
  const p = u.searchParams;
  const type = p.get('type') || 'country';
  const cacheKey = u.search;
  const hit = newsCache.get(cacheKey);
  if (hit && Date.now() - hit.at < NEWS_TTL_MS) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=120, s-maxage=300' });
    return res.end(hit.payload);
  }
  try {
    let items = [];
    if (type === 'videos') {
      const channels = (p.get('channels') || '').split(',').map(s => s.trim())
        .filter(s => /^UC[A-Za-z0-9_-]{20,}$/.test(s)).slice(0, 6);
      const arrays = await Promise.all(channels.map(id => fetchFeedSafe('https://www.youtube.com/feeds/videos.xml?channel_id=' + id, '')));
      items = mergeFeeds(arrays).filter(it => it.video).slice(0, 10);
    } else if (type === 'voices') {
      const arrays = await Promise.all(PANAFRICA_FEEDS.map(f => fetchFeedSafe(f.url, f.label)));
      let merged = mergeFeeds(arrays);
      const country = newsFold(p.get('country'));
      if (country) {
        const local = merged.filter(it => newsFold(it.title + ' ' + (it.source || '')).includes(country));
        if (local.length >= 4) merged = local;
      }
      items = merged.slice(0, 18);
    } else {
      const q = (p.get('q') || '').slice(0, 120);
      if (!q) return sendJson(res, 400, { error: 'Missing q' });
      const lang = GN_EDITIONS[p.get('lang')] ? p.get('lang') : 'en';
      const catId = NEWS_CATEGORIES[p.get('cat')] != null ? p.get('cat') : 'all';
      const aa = (p.get('aa') || '').replace(/[^a-z]/gi, '').toLowerCase();
      const specs = [fetchFeedSafe(gnUrl(q, lang, catId), 'Google News')];
      if (catId === 'all' && aa) specs.push(fetchFeedSafe('https://allafrica.com/tools/headlines/rdf/' + aa + '/headlines.rdf', 'AllAfrica'));
      items = mergeFeeds(await Promise.all(specs)).slice(0, 30);
    }
    const sources = new Set(items.map(i => i.source).filter(Boolean)).size;
    const payload = JSON.stringify({ items, sources, cachedAt: Date.now() });
    newsCache.set(cacheKey, { at: Date.now(), payload });
    if (newsCache.size > 200) newsCache.delete(newsCache.keys().next().value);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=120, s-maxage=300' });
    res.end(payload);
  } catch (error) {
    sendJson(res, 502, { error: 'Upstream feed error', items: [], sources: 0 });
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
    if (safeUrl === '/api/extract-menu') {
      return await handleExtractMenu(req, res);
    }
    if (safeUrl === '/api/news') {
      return await handleNews(req, res);
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
