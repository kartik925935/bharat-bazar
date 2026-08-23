import type { SADeliveryPartner } from '@/types/super-admin.types'

export const MOCK_SA_DELIVERY: SADeliveryPartner[] = [
  { id: 'dp-001', name: 'Raju Kumar', email: 'raju.k@delivery.in', phone: '9876543211', status: 'on_delivery', totalDeliveries: 2840, successRate: 98.2, activeOrders: 3, rating: 4.8, city: 'Mumbai', state: 'Maharashtra', joinedAt: '2022-08-01T00:00:00Z', vehicleType: 'bike' },
  { id: 'dp-002', name: 'Shiva Prasad', email: 'shiva.p@delivery.in', phone: '9234567891', status: 'active', totalDeliveries: 1920, successRate: 96.5, activeOrders: 0, rating: 4.6, city: 'Bengaluru', state: 'Karnataka', joinedAt: '2023-01-15T00:00:00Z', vehicleType: 'scooter' },
  { id: 'dp-003', name: 'Ramesh Yadav', email: 'ramesh.y@delivery.in', phone: '8765432100', status: 'active', totalDeliveries: 3410, successRate: 99.1, activeOrders: 0, rating: 4.9, city: 'Delhi', state: 'Delhi', joinedAt: '2022-05-20T00:00:00Z', vehicleType: 'bike' },
  { id: 'dp-004', name: 'Suresh Pillai', email: 'suresh.p@delivery.in', phone: '9345678902', status: 'suspended', totalDeliveries: 420, successRate: 72.8, activeOrders: 0, rating: 2.9, city: 'Chennai', state: 'Tamil Nadu', joinedAt: '2023-09-10T00:00:00Z', vehicleType: 'cycle' },
  { id: 'dp-005', name: 'Vikram Singh', email: 'vikram.s@delivery.in', phone: '9567891234', status: 'on_delivery', totalDeliveries: 1680, successRate: 97.6, activeOrders: 2, rating: 4.7, city: 'Jaipur', state: 'Rajasthan', joinedAt: '2023-03-01T00:00:00Z', vehicleType: 'bike' },
  { id: 'dp-006', name: 'Anand Mishra', email: 'anand.m@delivery.in', phone: '9087654320', status: 'active', totalDeliveries: 890, successRate: 95.2, activeOrders: 0, rating: 4.5, city: 'Lucknow', state: 'Uttar Pradesh', joinedAt: '2023-06-15T00:00:00Z', vehicleType: 'scooter' },
  { id: 'dp-007', name: 'Kavitha Raj', email: 'kavitha.r@delivery.in', phone: '9876012340', status: 'inactive', totalDeliveries: 280, successRate: 94.6, activeOrders: 0, rating: 4.4, city: 'Hyderabad', state: 'Telangana', joinedAt: '2023-11-01T00:00:00Z', vehicleType: 'scooter' },
  { id: 'dp-008', name: 'Pankaj Sharma', email: 'pankaj.s@delivery.in', phone: '9812345670', status: 'on_delivery', totalDeliveries: 4120, successRate: 99.4, activeOrders: 5, rating: 4.95, city: 'Mumbai', state: 'Maharashtra', joinedAt: '2021-12-01T00:00:00Z', vehicleType: 'van' },
]
