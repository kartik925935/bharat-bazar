const fs = require('fs');

const productNames = [
  'Handwoven Kanjeevaram Silk Saree', 'Terracotta Warli Art Vase', 'Brass Nataraja Statue',
  'Organic Turmeric Powder', 'Kashmiri Pashmina Shawl', 'Madhubani Handpainted Dupatta',
  'Rosewood Carved Elephant', 'Silver Filigree Earrings', 'Block Print Cotton Bedsheet',
  'Cold Pressed Coconut Oil', 'Ayurvedic Herbal Soap Set', 'Bamboo Woven Storage Basket',
  'Jute Macrame Wall Hanging', 'Spices Gift Box (Assorted)', 'Pure Kashmiri Saffron',
  'Chanderi Silk Kurta Set', 'Gond Art Canvas Painting', 'Blue Pottery Serving Bowl',
  'Dhokra Art Tribal Figurines', 'Handcrafted Leather Juttis', 'Kalamkari Block Print Fabric',
  'Sandalwood Incense Sticks', 'Muga Silk Saree', 'Bidriware Silver Inlay Box',
  'Copper Water Dispenser', 'Meenakari Kundan Necklace', 'Khadi Cotton Kurta',
  'Phulkari Embroidered Dupatta', 'Applique Work Cushion Cover', 'Handspun Linen Saree',
  'Tribal Beaded Jewelry Set', 'Ajrakh Print Dress Material', 'Wooden Lacquer Toys',
  'Pichwai Cow Painting', 'Aari Work Designer Blouse', 'Natural Indigo Dyed Scarf',
  'Sujani Embroidery Wall Piece', 'Pattachitra Scroll Painting', 'Bell Metal Cymbals',
  'Himalayan Pink Salt Lamp'
];

const categories = ['Clothing & Apparel', 'Home Decor', 'Jewelry', 'Food & Spices', 'Art & Collectibles', 'Beauty & Wellness', 'Footwear'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randDate(start, end) { return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString(); }

const statuses = ['pending_review', 'published', 'rejected', 'draft', 'suspended'];

const products = [];
for(let i=1; i<=45; i++) {
  const name = rand(productNames);
  const category = rand(categories);
  const mrp = randInt(500, 15000);
  const price = Math.floor(mrp * (1 - (randInt(5, 50) / 100)));
  const status = Math.random() > 0.6 ? rand(statuses) : 'published';
  const completeness = randInt(40, 100);
  
  products.push({
    id: 'prod-' + String(i).padStart(4, '0'),
    name,
    sellerId: 'sell-' + String(randInt(1, 35)).padStart(3, '0'),
    sellerName: 'Mock Seller ' + i, // In a real app we'd join with sellers
    category,
    price,
    mrp,
    stock: randInt(0, 200),
    status,
    images: [
      'https://placehold.co/400x400/1A1A2E/FF7A00?text=Product+Image+1',
      'https://placehold.co/400x400/2A2A3E/FF9500?text=Product+Image+2',
      'https://placehold.co/400x400/3A3A50/FFB000?text=Product+Image+3'
    ],
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    totalReviews: randInt(0, 500),
    totalSales: randInt(0, 2000),
    createdAt: randDate(new Date(2023, 0, 1), new Date()),
    updatedAt: randDate(new Date(2024, 0, 1), new Date()),
    shortDescription: 'A quick summary of what makes this product special.',
    description: 'Authentic handcrafted product directly from the artisans. Made with traditional techniques and high-quality local materials.',
    productBadges: Math.random() > 0.5 ? ['Handmade', 'Eco-Friendly'] : ['Organic', 'GI Tagged'],
    gstSlab: rand(['0%', '5%', '12%', '18%', '28%']),
    processingTime: randInt(1, 7) + ' days',
    specifications: {
      'Material': 'Traditional Material',
      'Origin': 'India',
      'Care': 'Handle with care'
    },
    discount: Math.round(((mrp - price) / mrp) * 100),
    sku: 'SKU-' + randInt(10000, 99999),
    weight: randInt(100, 5000) + 'g',
    completenessScore: completeness,
    qualityFlags: completeness < 60 ? ['Missing high-res images', 'Short description'] : [],
    priceAnomalyFlag: price < mrp * 0.2, // flag if discount > 80%
    categoryAvgPrice: Math.floor(mrp * 0.8),
    viewCount: randInt(100, 10000),
    conversionRate: Number((Math.random() * 5).toFixed(1)),
    lastEditedAt: randDate(new Date(2024, 0, 1), new Date()),
    editHistory: []
  });
}

fs.writeFileSync('src/lib/mock/sa-products.mock.ts', `import type { SAProductDetail } from '@/types/super-admin.types'\n\nexport const MOCK_SA_PRODUCTS: SAProductDetail[] = ${JSON.stringify(products, null, 2)};\n`);
