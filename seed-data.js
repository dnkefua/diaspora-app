/**
 * Diaspora App — Seed Data Script
 * Run this once to populate Firestore with initial business data
 *
 * Usage: Include in a temporary HTML page and open it, or run via Firebase Console
 */

import { db, collection, doc, setDoc } from './firebase-config.js';

const BUSINESSES = [
  { id:'b1', name:'Mama Titi Kitchen', category:'Restaurants', city:'Dubai', area:'Deira',
    rating:4.9, reviews:214, phone:'+971501234567', verified:true,
    image:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800',
    desc:'Authentic Nigerian cuisine in the heart of Deira. Jollof rice, egusi soup, suya grills.' },
  { id:'b2', name:'Kwame\'s Barbershop', category:'Barbers', city:'Dubai', area:'Al Karama',
    rating:4.8, reviews:189, phone:'+971502345678', verified:true,
    image:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800',
    desc:'Premium fades and line-ups by West African master barbers.' },
  { id:'b3', name:'Zara African Hair', category:'Hair Stylists', city:'Dubai', area:'Bur Dubai',
    rating:4.7, reviews:156, phone:'+971503456789', verified:false,
    image:'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800',
    desc:'Braiding, weaves, locs, and natural hair care specialists.' },
  { id:'b4', name:'Kofi Lens Photography', category:'Photographers', city:'Dubai', area:'Downtown',
    rating:5.0, reviews:88, phone:'+971504567890', verified:true,
    image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
    desc:'Wedding, event, and portrait photography. Ghanaian storytelling through your lens.' },
  { id:'b5', name:'Adunola Fashion House', category:'Tailors & Fashion', city:'Dubai', area:'JLT',
    rating:4.6, reviews:72, phone:'+971505678901', verified:true,
    image:'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800',
    desc:'Bespoke Ankara and African prints. Wedding attire and everyday fashion.' },
  { id:'b6', name:'Grace Beauty Studio', category:'Beauty & Makeup', city:'Dubai', area:'Jumeirah',
    rating:4.8, reviews:131, phone:'+971506789012', verified:true,
    image:'https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=800',
    desc:'Bridal makeup, glam looks, and skincare for melanin-rich skin.' },
  { id:'b7', name:'Nairobi Bites', category:'Restaurants', city:'London', area:'Peckham',
    rating:4.5, reviews:203, phone:'+447911234567', verified:true,
    image:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800',
    desc:'Kenyan nyama choma, ugali, and sukuma wiki in the heart of South London.' },
  { id:'b8', name:'AfroTech Jobs — Dubai', category:'Jobs', city:'Dubai', area:'DIFC',
    rating:4.3, reviews:44, phone:'+971507890123', verified:true,
    image:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800',
    desc:'Tech and finance roles at diaspora-friendly companies across the UAE.' },
];

async function seedDatabase() {
  try {
    const businessesRef = collection(db, 'businesses');

    for (const biz of BUSINESSES) {
      await setDoc(doc(businessesRef, biz.id), {
        ...biz,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId: null,
        images: [biz.image],
        hours: {
          monday: '10:00 AM - 9:00 PM',
          tuesday: '10:00 AM - 9:00 PM',
          wednesday: '10:00 AM - 9:00 PM',
          thursday: '10:00 AM - 9:00 PM',
          friday: '10:00 AM - 9:00 PM',
          saturday: '10:00 AM - 9:00 PM',
          sunday: 'Closed'
        }
      });
      console.log(`✓ Seeded: ${biz.name}`);
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
}

// Run seed
seedDatabase();
