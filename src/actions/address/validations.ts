import { z } from 'zod'

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian mobile number required'),
  addressLine1: z.string().min(5, 'Street address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Valid 6-digit PIN code required'),
  isDefault: z.boolean().optional().default(false),
  label: z.string().optional().default('Home')
})

export type AddressInput = z.input<typeof addressSchema>

