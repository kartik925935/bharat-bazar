import { z } from 'zod'

export const inventorySchema = z.object({
  productId: z.string().uuid('Valid product ID is required'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  sku: z.string().optional(),
})

export type InventoryInput = z.infer<typeof inventorySchema>
