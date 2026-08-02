import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SEED_SELLERS = [
  {
    legalName: 'Ravi Kumar',
    displayName: 'Ravi Kumar',
    email: 'seller@test.com',
    phone: '9876543210',
    avatar: 'https://i.pravatar.cc/100?img=12',
    sellerType: 'artisan',
    shopName: 'Ravi Kumar Crafts',
    shopDescription: 'Traditional handcrafted items from the heart of Rajasthan.',
    shopLogo: null,
    shopBanner: null,
    shopCategory: 'Paintings & Art',
    subCategories: ['Miniature Paintings', 'Phad Paintings'],
    village: 'Bhilwara',
    district: 'Bhilwara',
    state: 'Rajasthan',
    pincode: '311001',
    fullAddress: '42, Kala Colony, Near Shiv Temple, Bhilwara, Rajasthan 311001',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: 'XXXX-XXXX-3456',
    gstNumber: null,
    bankAccountName: 'Ravi Kumar',
    bankName: 'State Bank of India',
    bankAccountNumber: 'XXXX-XXXX-7890',
    ifscCode: 'SBIN0001234',
    accountType: 'savings',
    status: 'approved',
    kycStatus: 'verified',
    tier: 'gold',
    tierScore: 87,
    password: 'Seller@123'
  }
];

async function seed() {
  console.log('Starting seed...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing Supabase credentials in .env.local');
    return;
  }

  if (!supabaseUrl || !anonKey) {
    console.error('Missing Supabase credentials in .env.local');
    return;
  }

  for (const seller of SEED_SELLERS) {
    console.log(`Seeding seller: ${seller.email}...`);
    try {
      // In a real scenario we could populate bank accounts and documents separately as expected by the Edge Function
      const { bankAccountName, bankName, bankAccountNumber, ifscCode, accountType, panNumber, aadhaarNumber, ...sellerProfile } = seller;
      
      const payload = {
        seller: sellerProfile,
        documents: [
          { document_type: 'PAN', document_number: panNumber, file_url: null },
          { document_type: 'AADHAAR', document_number: aadhaarNumber, file_url: null }
        ],
        bank_accounts: [
          {
            account_number: bankAccountNumber,
            ifsc_code: ifscCode,
            bank_name: bankName,
            account_holder: bankAccountName,
            account_type: accountType
          }
        ]
      };

      const res = await fetch(`${supabaseUrl}/functions/v1/register_seller`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.text();
        console.error(`Failed to seed ${seller.email}:`, err);
      } else {
        const data = await res.json();
        console.log(`Successfully seeded ${seller.email}, ID: ${data.sellerId}`);
      }
    } catch (e) {
      console.error(`Exception while seeding ${seller.email}:`, e);
    }
  }
  
  console.log('Seed complete.');
}

seed();
