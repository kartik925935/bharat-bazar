import { z } from 'zod'

export const shopSchema = z.object({
  name: z.string().min(2, 'Shop name is required'),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  sellerId: z.string().uuid('Valid seller ID is required'),
})

export type ShopInput = z.infer<typeof shopSchema>

export const updateShopSchema = z.object({
  shopName: z.string().min(2, 'Shop name is required').max(100, 'Name too long'),
  shopStory: z.string().max(500, 'Description too long').optional(),
})

export type UpdateShopInput = z.infer<typeof updateShopSchema>
