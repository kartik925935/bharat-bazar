import { z } from 'zod'

export const cartItemSchema = z.object({
  productId: z.string().uuid('Valid product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
})

export type CartItemInput = z.infer<typeof cartItemSchema>
