import { randomInt, randomFloat, pick, randomDateWithin, INDIAN_CITIES } from './seed'
import type { SACustomer, CustomerTier } from '@/types/super-admin.types'

const FIRST_NAMES = ['Aarav', 'Aditi', 'Aditya', 'Akash', 'Amita', 'Anjali', 'Aryan', 'Avni', 'Dhruv', 'Divya', 'Gaurav', 'Ishaan', 'Kavya', 'Krishna', 'Mansi', 'Nidhi', 'Nikhil', 'Pallavi', 'Parth', 'Pooja', 'Rahul', 'Rohit', 'Sakshi', 'Sanjay', 'Shreya', 'Siddharth', 'Simran', 'Sneha', 'Tanvi', 'Varun', 'Vikas', 'Yogita', 'Zara', 'Ananya', 'Bhavesh']
const LAST_NAMES = ['Agarwal', 'Bansal', 'Bhatia', 'Chauhan', 'Chopra', 'Desai', 'Dubey', 'Ghosh', 'Gupta', 'Jain', 'Kapoor', 'Khanna', 'Kumar', 'Malhotra', 'Mehra', 'Mishra', 'Modi', 'Pandey', 'Patel', 'Rao', 'Saxena', 'Shah', 'Sharma', 'Singh', 'Sinha', 'Tiwari', 'Trivedi', 'Verma', 'Yadav']
const TIERS: CustomerTier[] = ['bronze', 'silver', 'gold', 'platinum']

export function generateCustomers(count = 40): SACustomer[] {
  return Array.from({ length: count }, (_, i) => {
    const first = pick(FIRST_NAMES)
    const last = pick(LAST_NAMES)
    const location = pick(INDIAN_CITIES)
    const tier: CustomerTier = i < 4 ? 'platinum' : i < 12 ? 'gold' : i < 24 ? 'silver' : 'bronze'
    const totalOrders = tier === 'platinum' ? randomInt(40, 120) : tier === 'gold' ? randomInt(15, 40) : tier === 'silver' ? randomInt(5, 15) : randomInt(1, 5)
    const totalSpent = totalOrders * randomInt(800, 4500)
    const isBlocked = i >= 38

    return {
      id: `cust-${String(i + 1).padStart(3, '0')}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@gmail.com`,
      phone: `${pick(['9', '8', '7', '6'])}${String(randomInt(100000000, 999999999))}`,
      status: isBlocked ? 'blocked' : 'active',
      tier,
      totalOrders,
      totalSpent,
      joinedAt: randomDateWithin(60, 800),
      lastActive: randomDateWithin(0, 30),
      city: location.city,
      state: location.state,
      isVerified: true,
    } satisfies SACustomer
  })
}
