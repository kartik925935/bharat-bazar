const fs = require('fs')

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randDate(start, end) { return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString() }
function rand(arr) { return arr[randInt(0, arr.length - 1)] }

const STATUSES = ['pending_approval', 'approved', 'rejected', 'flagged']
const FLAG_REASONS = ['spam', 'offensive_language', 'competitor_mention', 'fake_review_suspected', 'irrelevant_content']

const reviews = [
  {
    id: 'rev_001',
    productId: 'prod_001',
    productName: 'Hand-Carved Brass Diya Set of 6',
    productImage: 'https://placehold.co/100x100/1A1A2E/FF7A00?text=Diya',
    customerId: 'cust_005',
    customerName: 'Priya Nair',
    customerTier: 'gold',
    sellerId: 'sel_003',
    sellerName: 'Moradabad Metalcraft',
    rating: 5,
    title: 'Absolutely stunning craftsmanship',
    body: 'These diyas are beyond beautiful. The brass work is intricate and the finishing is perfect. Lit them for Diwali and the glow was magical. Highly recommend to anyone who appreciates authentic Indian craft.',
    images: ['https://placehold.co/400x400/1A1A2E/FF7A00?text=Review+Image+1'],
    verifiedPurchase: true,
    status: 'pending_approval',
    flaggedBy: null,
    helpfulVotes: 0,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    sentimentScore: 0.92,
    sentimentLabel: 'very_positive',
    reviewVelocityFlag: false,
    sameDeviceFlag: false,
    purchaseToReviewDays: 3,
  },
  {
    id: 'rev_002',
    productId: 'prod_007',
    productName: 'Banarasi Silk Saree - Royal Blue',
    productImage: 'https://placehold.co/100x100/1A1A2E/FF7A00?text=Saree',
    customerId: 'cust_010',
    customerName: 'Vikas Malhotra',
    customerTier: 'bronze',
    sellerId: 'sel_001',
    sellerName: 'Varanasi Silk House',
    rating: 1,
    title: 'Worst purchase ever - FAKE product',
    body: 'This is NOT Banarasi silk. It is cheap synthetic fabric. The seller is a fraud. DO NOT BUY. Check out competitor site for real Banarasi silk at half the price.',
    images: [],
    verifiedPurchase: true,
    status: 'flagged',
    flagReason: 'competitor_mention',
    flaggedBy: 'system',
    helpfulVotes: 2,
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    sentimentScore: -0.95,
    sentimentLabel: 'very_negative',
    reviewVelocityFlag: true,
    sameDeviceFlag: true,
    purchaseToReviewDays: 1,
  },
]

for(let i=3; i<=30; i++) {
  const isFlagged = Math.random() < 0.2
  const status = isFlagged ? 'flagged' : rand(STATUSES)
  const rating = randInt(1, 5)
  const sentimentScore = (rating - 3) / 2
  const sentimentLabel = rating === 5 ? 'very_positive' : rating === 4 ? 'positive' : rating === 3 ? 'neutral' : rating === 2 ? 'negative' : 'very_negative'
  
  reviews.push({
    id: `rev_${i.toString().padStart(3, '0')}`,
    productId: `prod_${randInt(1, 40).toString().padStart(3, '0')}`,
    productName: 'Mock Product ' + i,
    productImage: 'https://placehold.co/100x100/1A1A2E/FF7A00?text=Product',
    customerId: `cust_${randInt(1, 35).toString().padStart(3, '0')}`,
    customerName: 'Customer ' + i,
    customerTier: rand(['bronze', 'silver', 'gold', 'platinum']),
    sellerId: `sel_${randInt(1, 30).toString().padStart(3, '0')}`,
    sellerName: 'Seller ' + i,
    rating,
    title: 'Review Title ' + i,
    body: 'This is a mock review body describing the product. It has some text. The quality was ' + sentimentLabel,
    images: Math.random() > 0.7 ? ['https://placehold.co/400x400/1A1A2E/FF7A00?text=Image'] : [],
    verifiedPurchase: Math.random() > 0.1,
    status,
    flagReason: status === 'flagged' ? rand(FLAG_REASONS) : undefined,
    flaggedBy: status === 'flagged' ? rand(['system', 'seller', 'customer']) : null,
    sellerReplyText: Math.random() > 0.8 ? 'Thank you for your feedback!' : undefined,
    helpfulVotes: randInt(0, 50),
    createdAt: randDate(new Date(Date.now() - 30 * 86400000), new Date()),
    updatedAt: new Date().toISOString(),
    sentimentScore,
    sentimentLabel,
    reviewVelocityFlag: Math.random() < 0.1,
    sameDeviceFlag: Math.random() < 0.1,
    purchaseToReviewDays: randInt(0, 45)
  })
}

const fileContent = `import type { SAReview } from '@/types/super-admin.types'

export const MOCK_REVIEWS: SAReview[] = ${JSON.stringify(reviews, null, 2)}
`

fs.writeFileSync('src/lib/mock/sa-reviews.mock.ts', fileContent)
