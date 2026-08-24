import { randomInt, randomFloat, pick, randomDateWithin, INDIAN_CITIES } from './seed'
import type { SADeliveryPartner, DeliveryPartnerStatus } from '@/types/super-admin.types'

const NAMES = [
  'Raju Kumar', 'Suresh Yadav', 'Manoj Tiwari', 'Deepak Singh', 'Anil Gupta',
  'Rakesh Sharma', 'Vijay Patel', 'Sanjay Verma', 'Ramesh Rao', 'Rohit Chauhan',
  'Aakash Mehta', 'Nitin Mishra', 'Gaurav Dubey', 'Pankaj Joshi', 'Satish Nair',
  'Ajay Pandey', 'Dinesh Chaudhary', 'Harish Bose', 'Kamal Das', 'Lalit Saxena',
  'Mukesh Trivedi', 'Naresh Kapoor', 'Om Bansal', 'Pramod Ghosh', 'Qamrul Ansari',
]
const VEHICLES = ['bike', 'scooter', 'cycle', 'van'] as const
const STATUSES: DeliveryPartnerStatus[] = ['active', 'active', 'active', 'on_delivery', 'on_delivery', 'inactive', 'suspended']

export function generateDeliveryPartners(count = 25): SADeliveryPartner[] {
  return Array.from({ length: count }, (_, i) => {
    const name = i < NAMES.length ? NAMES[i] : `Partner ${i + 1}`
    const location = pick(INDIAN_CITIES)
    const totalDeliveries = randomInt(50, 1200)
    const status: DeliveryPartnerStatus = i < 18 ? pick(['active', 'on_delivery']) as DeliveryPartnerStatus : pick(['inactive', 'suspended']) as DeliveryPartnerStatus

    return {
      id: `dp-${String(i + 1).padStart(3, '0')}`,
      name,
      email: `${name.split(' ')[0].toLowerCase()}.${name.split(' ')[1]?.toLowerCase() ?? 'partner'}${i + 1}@delivery.in`,
      phone: `${pick(['9', '8', '7'])}${String(randomInt(100000000, 999999999))}`,
      status,
      totalDeliveries,
      successRate: randomFloat(82, 99.5),
      activeOrders: status === 'on_delivery' ? randomInt(1, 4) : 0,
      rating: randomFloat(3.5, 5.0),
      city: location.city,
      state: location.state,
      joinedAt: randomDateWithin(60, 600),
      vehicleType: pick(VEHICLES),
    } satisfies SADeliveryPartner
  })
}
