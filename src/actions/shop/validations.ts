import { z } from 'zod'

export const shopSchema = z.object({
  name: z.string().min(2, 'Shop name is required'),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  sellerId: z.string().uuid('Valid seller ID is required'),
})

export type ShopInput = z.infer<typeof shopSchema>
