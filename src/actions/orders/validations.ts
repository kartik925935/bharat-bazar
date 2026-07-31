import { z } from 'zod'

export const createOrderSchema = z.object({
  shippingAddressId: z.string().uuid('Valid address ID is required'),
  // Cart items will be pulled from the database, or passed securely
})

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid('Valid order ID is required'),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
