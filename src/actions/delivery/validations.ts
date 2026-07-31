import { z } from 'zod'

export const assignDeliverySchema = z.object({
  orderId: z.string().uuid('Valid order ID is required'),
  deliveryPartnerId: z.string().uuid('Valid delivery partner ID is required'),
})

export const updateDeliveryStatusSchema = z.object({
  deliveryId: z.string().uuid('Valid delivery ID is required'),
  status: z.enum(['assigned', 'picked_up', 'in_transit', 'delivered', 'failed']),
  trackingUrl: z.string().url().optional(),
})

export type AssignDeliveryInput = z.infer<typeof assignDeliverySchema>
export type UpdateDeliveryStatusInput = z.infer<typeof updateDeliveryStatusSchema>
