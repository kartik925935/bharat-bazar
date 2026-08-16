const fs = require('fs');

const firstNames = ['Amit', 'Rahul', 'Priya', 'Neha', 'Sneha', 'Ravi', 'Vikram', 'Pooja', 'Anita', 'Sunil', 'Kavita', 'Suresh', 'Ramesh', 'Gita', 'Sita', 'Rajesh', 'Anil', 'Nitin', 'Manoj', 'Deepa', 'Sandeep', 'Naveen', 'Rakesh', 'Vijay', 'Vikas', 'Ashish', 'Manish', 'Saurabh', 'Nisha', 'Meera'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Rao', 'Das', 'Joshi', 'Chopra', 'Yadav', 'Pandey', 'Mishra', 'Tiwari', 'Nair', 'Pillai', 'Iyer', 'Bhat', 'Chatterjee', 'Bose', 'Sengupta', 'Chauhan', 'Rajput', 'Jain', 'Shah', 'Mehta', 'Desai', 'Naidu'];
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Gujarat', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Maharashtra', 'Rajasthan', 'Uttar Pradesh', 'Uttar Pradesh', 'Maharashtra', 'Madhya Pradesh', 'Maharashtra', 'Madhya Pradesh', 'Andhra Pradesh', 'Maharashtra', 'Bihar', 'Gujarat'];
const sellerTypes = ['ngo', 'village_producer', 'artisan', 'shop_owner', 'shg_group', 'professional'];
const tiers = ['bronze', 'silver', 'gold', 'platinum'];
const statuses = ['active', 'pending', 'suspended', 'rejected', 'under_review'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randDate(start, end) { return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString(); }

const sellers = [];
for(let i=1; i<=35; i++) {
  const f = rand(firstNames);
  const l = rand(lastNames);
  const tier = rand(tiers);
  const status = Math.random() > 0.8 ? rand(statuses) : 'active';
  const kycStatus = status === 'active' ? 'verified' : (status === 'pending' || status === 'under_review' ? 'pending' : 'rejected');
  
  sellers.push({
    id: 'sell-' + String(i).padStart(3, '0'),
    sellerId: 'SEL' + randInt(10000, 99999),
    legalName: f + ' ' + l + ' Enterprises',
    displayName: f + ' ' + l,
    username: f.toLowerCase() + '-' + l.toLowerCase(),
    email: f.toLowerCase() + '.' + l.toLowerCase() + '@sellerexample.com',
    phone: '9' + String(randInt(100000000, 999999999)),
    shopName: f + "'s Crafts",
    sellerType: rand(sellerTypes),
    status,
    tier,
    totalProducts: randInt(1, 100),
    totalSales: randInt(0, 1000000),
    totalOrders: randInt(0, 500),
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    joinedAt: randDate(new Date(2022, 0, 1), new Date()),
    lastActive: randDate(new Date(2024, 0, 1), new Date()),
    state: rand(states),
    kycStatus,
    panVerified: kycStatus === 'verified',
    gstVerified: kycStatus === 'verified' && Math.random() > 0.5,
    bankVerified: kycStatus === 'verified',
    commissionRate: randInt(5, 15),
    onboardingSteps: [
      { step: 'account_created', completedAt: new Date(2022, 0, 1).toISOString() }
    ],
    performanceHistory: [],
    warningsIssued: randInt(0, 3),
    warningRecords: [],
    documentsExpiringSoon: Math.random() > 0.8 ? ['GST Certificate'] : []
  });
}

fs.writeFileSync('src/lib/mock/sa-sellers.mock.ts', `import type { SASellerExtended } from '@/types/super-admin.types'\n\nexport const MOCK_SA_SELLERS: SASellerExtended[] = ${JSON.stringify(sellers, null, 2)};\n`);
