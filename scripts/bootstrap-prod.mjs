#!/usr/bin/env node
/**
 * One-shot production bootstrap.
 *
 * What it does:
 *   1. Creates `admins/{ADMIN_UID}` so the user can use admin.html
 *   2. Creates `users/{ADMIN_UID}` if missing (basic profile)
 *   3. Seeds 8 sample businesses (ownerId = ADMIN_UID)
 *   4. Creates 3 active sponsorships — one per visible slot
 *      (spotlight, menu, chair) so the homepage shows live data
 *
 * Auth: uses `gcloud auth print-access-token` (the user's OAuth identity)
 * via the Firestore REST API. Bypasses client SDK rules.
 *
 * Usage:
 *   node scripts/bootstrap-prod.mjs
 *
 * One-shot. Re-running is safe — uses upsert semantics.
 */

import { execSync } from 'node:child_process';

const PROJECT_ID = 'the-diaspora-app';
const ADMIN_UID = process.env.ADMIN_UID || 'VC5setgGyLbNcU5UX2G7O9idvvd2';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'uncledez8@gmail.com';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Founder';

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const token = execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim();
console.log(`✓ OAuth token acquired (${token.length} chars)`);

/* ─── Firestore value encoding helpers ─── */
function val(v){
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (Number.isInteger(v)) return { integerValue: String(v) };
  if (typeof v === 'number') return { doubleValue: v };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(val) } };
  if (typeof v === 'object') return { mapValue: { fields: fields(v) } };
  throw new Error('Unsupported value: ' + typeof v);
}
function fields(o){
  const f = {};
  for (const [k, v] of Object.entries(o)) f[k] = val(v);
  return f;
}

async function patch(path, doc){
  const url = `${FIRESTORE_BASE}/${path}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: fields(doc) })
  });
  if (!res.ok){
    const err = await res.text();
    throw new Error(`PATCH ${path} → ${res.status}: ${err}`);
  }
  return res.json();
}

async function exists(path){
  const url = `${FIRESTORE_BASE}/${path}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  return res.ok;
}

/* ─── 1. Admin doc ─── */
async function bootstrapAdmin(){
  console.log(`\n[1/4] Creating admins/${ADMIN_UID}…`);
  await patch(`admins/${ADMIN_UID}`, {
    email: ADMIN_EMAIL,
    name: ADMIN_NAME,
    grantedAt: new Date()
  });
  console.log('  ✓ admin role granted');
}

/* ─── 2. User profile (idempotent) ─── */
async function ensureUser(){
  console.log(`\n[2/4] Ensuring users/${ADMIN_UID} exists…`);
  if (await exists(`users/${ADMIN_UID}`)){
    console.log('  → already present, skipping');
    return;
  }
  await patch(`users/${ADMIN_UID}`, {
    email: ADMIN_EMAIL,
    firstName: ADMIN_NAME,
    lastName: '',
    city: 'Dubai',
    bio: 'Diaspora App founder',
    joinedAt: new Date()
  });
  console.log('  ✓ user profile created');
}

/* ─── 3. Seed businesses ─── */
const BUSINESSES = [
  { id:'b1', name:"Mama Titi Kitchen", category:'Restaurants', city:'Dubai', area:'Deira', rating:4.9, reviews:214, phone:'+971501234567', verified:true,
    image:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1600&auto=format&fit=crop',
    description:'Authentic Nigerian cuisine in the heart of Deira. Jollof rice, egusi soup, suya grills.' },
  { id:'b2', name:"Kwame's Barbershop", category:'Barbers', city:'Dubai', area:'Al Karama', rating:4.8, reviews:189, phone:'+971502345678', verified:true,
    image:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1600&auto=format&fit=crop',
    description:'Premium fades and line-ups by West African master barbers.' },
  { id:'b3', name:'Zara African Hair', category:'Hair Stylists', city:'Dubai', area:'Bur Dubai', rating:4.7, reviews:156, phone:'+971503456789', verified:false,
    image:'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1600&auto=format&fit=crop',
    description:'Braiding, weaves, locs, and natural hair care specialists.' },
  { id:'b4', name:'Kofi Lens Photography', category:'Photographers', city:'Dubai', area:'Downtown', rating:5.0, reviews:88, phone:'+971504567890', verified:true,
    image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop',
    description:'Wedding, event, and portrait photography. Ghanaian storytelling through your lens.' },
  { id:'b5', name:'Adunola Fashion House', category:'Tailors & Fashion', city:'Dubai', area:'JLT', rating:4.6, reviews:72, phone:'+971505678901', verified:true,
    image:'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop',
    description:'Bespoke Ankara and African prints. Wedding attire and everyday fashion.' },
  { id:'b6', name:'Grace Beauty Studio', category:'Beauty & Makeup', city:'Dubai', area:'Jumeirah', rating:4.8, reviews:131, phone:'+971506789012', verified:true,
    image:'https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=1600&auto=format&fit=crop',
    description:'Bridal makeup, glam looks, and skincare for melanin-rich skin.' },
  { id:'b7', name:'Nairobi Bites', category:'Restaurants', city:'London', area:'Peckham', rating:4.5, reviews:203, phone:'+447911234567', verified:true,
    image:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1600&auto=format&fit=crop',
    description:'Kenyan nyama choma, ugali, and sukuma wiki in the heart of South London.' },
  { id:'b8', name:'AfroTech Jobs — Dubai', category:'Jobs', city:'Dubai', area:'DIFC', rating:4.3, reviews:44, phone:'+971507890123', verified:true,
    image:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop',
    description:'Tech and finance roles at diaspora-friendly companies across the UAE.' }
];

async function seedBusinesses(){
  console.log(`\n[3/4] Seeding ${BUSINESSES.length} businesses…`);
  let created = 0, skipped = 0;
  for (const b of BUSINESSES){
    if (await exists(`businesses/${b.id}`)){
      console.log(`  → ${b.id} (${b.name}) exists, skipping`);
      skipped++;
      continue;
    }
    await patch(`businesses/${b.id}`, {
      ...b,
      ownerId: ADMIN_UID,
      images: [b.image],
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    created++;
    console.log(`  ✓ ${b.id} ${b.name}`);
  }
  console.log(`  → created ${created}, skipped ${skipped}`);
}

/* ─── 4. Sample sponsorships (one per visible slot) ─── */
const NOW = new Date();
const ONE_YEAR = new Date(NOW.getFullYear() + 1, NOW.getMonth(), NOW.getDate());

const SPONSORSHIPS = [
  {
    id: 'demo-spotlight',
    slot: 'spotlight',
    status: 'active',
    title: "Tonight's table belongs to Mama Titi.",
    tagline: 'Featured This Week · Dubai',
    description: 'Premium jollof bowls, suya platters, and weekend catering across Deira and Downtown Dubai.',
    badge: 'Featured',
    location: 'Deira · Dubai',
    rating: 4.9,
    city: 'Dubai',
    imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=2400&auto=format&fit=crop',
    ctaPrimary: { text: 'View Business', href: 'business.html?id=b1' },
    businessId: 'b1',
    amountUsd: 890
  },
  {
    id: 'demo-menu-1',
    slot: 'menu',
    status: 'active',
    title: 'Mama Titi Kitchen',
    tagline: 'Nigerian · Family Trays',
    description: 'Weekend family trays, smoky suya grills, and WhatsApp ordering across the Deira community.',
    badge: 'Sponsored',
    location: 'Deira · Dubai',
    rating: 4.9,
    city: 'Dubai',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1600&auto=format&fit=crop',
    ctaPrimary: { text: 'Order Now', href: 'business.html?id=b1' },
    businessId: 'b1',
    amountUsd: 340
  },
  {
    id: 'demo-chair-1',
    slot: 'chair',
    status: 'active',
    title: 'Zara African Hair',
    tagline: 'Hair Stylist · Braids',
    description: 'Braiding, weaves, locs, and natural hair care specialists in Bur Dubai.',
    badge: 'Sponsored',
    location: 'Bur Dubai',
    rating: 4.7,
    city: 'Dubai',
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1600&auto=format&fit=crop',
    ctaPrimary: { text: 'Book', href: 'business.html?id=b3' },
    businessId: 'b3',
    amountUsd: 340
  }
];

async function seedSponsorships(){
  console.log(`\n[4/4] Seeding ${SPONSORSHIPS.length} sponsorships…`);
  let created = 0, skipped = 0;
  for (const s of SPONSORSHIPS){
    if (await exists(`sponsorships/${s.id}`)){
      console.log(`  → ${s.id} exists, skipping`);
      skipped++;
      continue;
    }
    await patch(`sponsorships/${s.id}`, {
      ...s,
      startsAt: NOW,
      endsAt: ONE_YEAR,
      createdAt: NOW,
      updatedAt: NOW,
      createdBy: ADMIN_UID,
      updatedBy: ADMIN_UID
    });
    created++;
    console.log(`  ✓ ${s.id} (${s.slot})`);
  }
  console.log(`  → created ${created}, skipped ${skipped}`);
}

/* ─── Run ─── */
(async () => {
  try {
    await bootstrapAdmin();
    await ensureUser();
    await seedBusinesses();
    await seedSponsorships();
    console.log('\n✅ Bootstrap complete!');
    console.log(`\nNext: visit https://www.thediaspora.app/admin.html and sign in as ${ADMIN_EMAIL}`);
  } catch (err) {
    console.error('\n❌ Bootstrap failed:', err.message);
    process.exit(1);
  }
})();
