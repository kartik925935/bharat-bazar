import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
})

const DEFAULT_CATEGORIES = [
  { name: 'Handloom & Textiles', slug: 'handloom-textiles', description: 'Traditional sarees, shawls, fabrics and hand-spun garments from Indian weavers' },
  { name: 'Pottery & Ceramics', slug: 'pottery-ceramics', description: 'Clay pottery, terracotta pots, blue pottery and traditional ceramic ware' },
  { name: 'Woodwork & Carving', slug: 'woodwork-carving', description: 'Intricate wood carvings, sandalwood figures, sheesham and teak artifacts' },
  { name: 'Jewellery & Accessories', slug: 'jewellery-accessories', description: 'Tribal jewellery, meenakari bangles, silver oxidized jewelry and lac ornaments' },
  { name: 'Paintings & Art', slug: 'paintings-art', description: 'Madhubani, Warli, Gond, Tanjore, and Pichwai folk art by rural masters' },
  { name: 'Bamboo & Cane', slug: 'bamboo-cane', description: 'Sustainable bamboo lamps, cane baskets, furniture, and eco-friendly handicrafts' },
  { name: 'Leather & Jute', slug: 'leather-jute', description: 'Handcrafted Kolhapuri chappals, mojari shoes, jute bags and eco planters' },
  { name: 'Natural & Organic', slug: 'natural-organic', description: 'Herbal products, natural honey, cold pressed oils, and authentic spices' },
]

const DEFAULT_ROLES = [
  { name: 'customer', level: 1 },
  { name: 'delivery_partner', level: 2 },
  { name: 'seller', level: 3 },
  { name: 'admin', level: 4 },
  { name: 'super_admin', level: 5 },
]

async function seedDatabase() {
  console.log('🌱 Starting Bharat Bazaar database seeding...')

  try {
    // 1. Seed Roles
    console.log('📦 Seeding roles...')
    for (const role of DEFAULT_ROLES) {
      const { error } = await supabase
        .from('roles')
        .upsert(role, { onConflict: 'name' })
      if (error) console.warn(`   Role ${role.name}:`, error.message)
      else console.log(`   ✓ Role: ${role.name}`)
    }

    // 2. Seed Categories
    console.log('📦 Seeding categories...')
    for (const cat of DEFAULT_CATEGORIES) {
      const { error } = await supabase
        .from('categories')
        .upsert(cat, { onConflict: 'slug' })
      if (error) console.warn(`   Category ${cat.name}:`, error.message)
      else console.log(`   ✓ Category: ${cat.name}`)
    }

    console.log('🎉 Seeding completed successfully!')
  } catch (err: any) {
    console.error('❌ Seeding failed with error:', err.message)
    process.exit(1)
  }
}

seedDatabase()
