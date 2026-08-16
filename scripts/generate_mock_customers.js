const fs = require('fs');

const firstNames = ['Amit', 'Rahul', 'Priya', 'Neha', 'Sneha', 'Ravi', 'Vikram', 'Pooja', 'Anita', 'Sunil', 'Kavita', 'Suresh', 'Ramesh', 'Gita', 'Sita', 'Rajesh', 'Anil', 'Nitin', 'Manoj', 'Deepa', 'Sandeep', 'Naveen', 'Rakesh', 'Vijay', 'Vikas', 'Ashish', 'Manish', 'Saurabh', 'Nisha', 'Meera'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Rao', 'Das', 'Joshi', 'Chopra', 'Yadav', 'Pandey', 'Mishra', 'Tiwari', 'Nair', 'Pillai', 'Iyer', 'Bhat', 'Chatterjee', 'Bose', 'Sengupta', 'Chauhan', 'Rajput', 'Jain', 'Shah', 'Mehta', 'Desai', 'Naidu'];
const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara'];
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Gujarat', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Maharashtra', 'Rajasthan', 'Uttar Pradesh', 'Uttar Pradesh', 'Maharashtra', 'Madhya Pradesh', 'Maharashtra', 'Madhya Pradesh', 'Andhra Pradesh', 'Maharashtra', 'Bihar', 'Gujarat'];
const tiers = ['bronze', 'silver', 'gold', 'platinum'];
const statuses = ['active', 'blocked', 'pending', 'suspended'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randDate(start, end) { return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString(); }

const customers = [];
for(let i=1; i<=40; i++) {
  const f = rand(firstNames);
  const l = rand(lastNames);
  const cityIdx = randInt(0, cities.length - 1);
  const tier = rand(tiers);
  const totalOrders = tier === 'platinum' ? randInt(50, 150) : tier === 'gold' ? randInt(20, 50) : tier === 'silver' ? randInt(5, 20) : randInt(0, 5);
  customers.push({
    id: 'cust-' + String(i).padStart(3, '0'),
    name: f + ' ' + l,
    email: f.toLowerCase() + '.' + l.toLowerCase() + '@example.com',
    phone: '9' + String(randInt(100000000, 999999999)),
    status: Math.random() > 0.8 ? rand(statuses) : 'active',
    tier,
    totalOrders,
    totalSpent: totalOrders * randInt(500, 5000),
    joinedAt: randDate(new Date(2022, 0, 1), new Date(2023, 11, 31)),
    lastActive: randDate(new Date(2024, 0, 1), new Date()),
    city: cities[cityIdx],
    state: states[cityIdx],
    isVerified: Math.random() > 0.2,
    riskScore: randInt(0, 100),
    returnRate: randInt(0, 20),
    fraudFlags: Math.random() > 0.9 ? ['Suspicious IP'] : [],
    avgOrderValue: randInt(500, 5000),
    loginHistory: [],
    wishlistCount: randInt(0, 50),
    cartAbandonCount: randInt(0, 10)
  });
}

fs.writeFileSync('src/lib/mock/sa-customers.mock.ts', `import type { SACustomerExtended } from '@/types/super-admin.types'\n\nexport const MOCK_SA_CUSTOMERS: SACustomerExtended[] = ${JSON.stringify(customers, null, 2)};\n`);
