import { z } from 'zod'

export const sellerProfileSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  taxId: z.string().optional(),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
})

export type SellerProfileInput = z.infer<typeof sellerProfileSchema>
