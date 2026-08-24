/**
 * Deterministic PRNG (mulberry32) — fixed master seed.
 * ALL mock data generation must use this to ensure reproducible, consistent numbers
 * every reload. NEVER use Math.random() directly in seed files.
 */

let _seed = 20250124

function mulberry32(s: number) {
  return function () {
    s |= 0; s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const _rng = mulberry32(_seed)

export const rng = _rng
export const randomInt = (min: number, max: number) => Math.floor(_rng() * (max - min + 1)) + min
export const randomFloat = (min: number, max: number) => +((_rng() * (max - min) + min).toFixed(2))
export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(_rng() * arr.length)]
export const pickN = <T,>(arr: readonly T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => _rng() - 0.5)
  return shuffled.slice(0, n)
}

/** Generate a date string offset by `daysAgo` from now */
export const daysAgo = (days: number, hoursOffset = 0): string => {
  const d = new Date(Date.now() - days * 86400000 - hoursOffset * 3600000)
  return d.toISOString()
}

/** Generate a random date within a range of days ago */
export const randomDateWithin = (minDaysAgo: number, maxDaysAgo: number): string => {
  return daysAgo(randomInt(minDaysAgo, maxDaysAgo), randomInt(0, 23))
}

export const INDIAN_CITIES = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Varanasi', state: 'Uttar Pradesh' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
]

export const PRODUCT_CATEGORIES = [
  'Handloom & Textiles',
  'Pottery & Ceramics',
  'Woodwork & Carving',
  'Jewellery & Accessories',
  'Paintings & Art',
  'Bamboo & Cane',
  'Leather & Jute',
  'Natural & Organic',
]
