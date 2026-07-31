import { z } from 'zod'

export const returnSchema = z.object({
  orderItemId: z.string().uuid('Valid order item ID is required'),
  reason: z.string().min(5, 'Reason for return is required'),
})

export type ReturnInput = z.infer<typeof returnSchema>
