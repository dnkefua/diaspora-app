#!/usr/bin/env node
/**
 * IndexNow ping — submits one or more URLs to Bing/Yandex for fast indexing.
 *
 * https://www.indexnow.org/documentation
 *
 * Usage:
 *   node scripts/indexnow-ping.mjs                                # pings the homepage
 *   node scripts/indexnow-ping.mjs https://www.thediaspora.app/blog.html
 *   node scripts/indexnow-ping.mjs --all                          # pings everything in sitemap.xml
 *
 * The IndexNow key file is at /<key>.txt at the site root and contains
 * exactly the same key string. Both must match for the submission to be
 * accepted by participating search engines (Bing, Yandex, Naver, Seznam,
 * Yep — Google does not currently participate but doesn't penalize it).
 */

import { readFileSync } from 'node:fs';

const KEY = '8835ed10cd3b9f1c3f14d2e3f81cf99b';
const HOST = 'www.thediaspora.app';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

async function ping(urls){
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls
  };
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  });
  console.log(`Status: ${res.status} ${res.statusText}`);
  if (res.status >= 400){
    console.error(await res.text());
    process.exit(1);
  }
  console.log(`Submitted ${urls.length} URL${urls.length === 1 ? '' : 's'} to IndexNow.`);
}

function urlsFromSitemap(){
  const xml = readFileSync(new URL('../sitemap.xml', import.meta.url), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}

const args = process.argv.slice(2);
let urls;
if (args.includes('--all')){
  urls = urlsFromSitemap();
} else if (args.length){
  urls = args.filter(a => /^https?:\/\//.test(a));
} else {
  urls = [`https://${HOST}/`];
}

if (!urls.length){ console.error('No URLs to submit'); process.exit(1); }
console.log(`Pinging ${urls.length} URL${urls.length === 1 ? '' : 's'}…`);
await ping(urls);
