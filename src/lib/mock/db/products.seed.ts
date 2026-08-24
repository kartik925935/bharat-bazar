import { randomInt, randomFloat, pick, randomDateWithin, PRODUCT_CATEGORIES } from './seed'
import type { SAProduct, ProductStatus } from '@/types/super-admin.types'
import type { SASeller } from '@/types/super-admin.types'

const PRODUCT_NAMES: Record<string, string[]> = {
  'Handloom & Textiles': ['Banarasi Silk Saree', 'Kantha Stitch Dupatta', 'Ikat Block Print Kurta', 'Phulkari Shawl', 'Jamdani Tablecloth', 'Madhubani Print Fabric', 'Khadi Cotton Shirt'],
  'Pottery & Ceramics': ['Blue Pottery Vase', 'Terracotta Pot Set', 'Black Clay Kulhad', 'Warli Painted Bowl', 'Bidriware Plate', 'Khurja Pottery Jar', 'Agra Marble Inlay Box'],
  'Woodwork & Carving': ['Sandalwood Elephant', 'Rosewood Photo Frame', 'Sheesham Dining Chair', 'Brass Inlay Box', 'Carved Peacock Panel', 'Teak Jewellery Box', 'Kerala Mural Plank'],
  'Jewellery & Accessories': ['Meenakari Bangles', 'Dokra Necklace', 'Silver Oxidized Earrings', 'Lac Bangles Set', 'Filigree Pendant', 'Tribal Necklace', 'Kundan Ring'],
  'Paintings & Art': ['Madhubani Painting', 'Pichwai Canvas', 'Warli Tribal Art', 'Gond Painting', 'Miniature Rajput Art', 'Kalamkari Panel', 'Tanjore Gold Painting'],
  'Bamboo & Cane': ['Bamboo Lamp Shade', 'Cane Chair', 'Bamboo Storage Basket', 'Cane Lamp', 'Bamboo Wind Chime', 'Bamboo Coaster Set', 'Tribal Bamboo Flute'],
  'Leather & Jute': ['Jute Tote Bag', 'Leather Mojari Shoes', 'Jute Planter', 'Embroidered Leather Wallet', 'Jute Floor Mat', 'Kolhapuri Chappal', 'Hemp Sling Bag'],
  'Natural & Organic': ['Organic Turmeric Powder', 'Pure Shea Butter', 'Neem Wood Comb', 'Cold Press Coconut Oil', 'Herbal Face Pack', 'Wild Honey Jar', 'Handmade Soap Set'],
}

const STATUSES: ProductStatus[] = ['published', 'published', 'published', 'pending_review', 'draft', 'rejected', 'suspended']

export function generateProducts(sellers: SASeller[], count = 50): SAProduct[] {
  return Array.from({ length: count }, (_, i) => {
    const category = pick(PRODUCT_CATEGORIES)
    const seller = pick(sellers.filter(s => s.status === 'active'))
    const names = PRODUCT_NAMES[category] ?? ['Handcrafted Item']
    const name = pick(names)
    const mrp = randomInt(500, 8000)
    const price = Math.round(mrp * (1 - randomInt(5, 25) / 100))
    const createdAt = randomDateWithin(15, 500)
    const totalSales = randomInt(5, 300)

    return {
      id: `prod-${String(i + 1).padStart(3, '0')}`,
      name: `${name} ${i + 1}`,
      sellerId: seller.id,
      sellerName: seller.shopName,
      category,
      price,
      mrp,
      stock: randomInt(0, 150),
      status: pick(STATUSES),
      images: [`/images/products/prod-${(i % 12) + 1}.jpg`],
      rating: randomFloat(2.8, 5.0),
      totalReviews: randomInt(0, 80),
      totalSales,
      createdAt,
      updatedAt: randomDateWithin(0, 30),
    } satisfies SAProduct
  })
}
