import { z } from 'zod'

export const returnSchema = z.object({
  orderItemId: z.string().uuid('Valid order item ID is required'),
  reason: z.string().min(5, 'Reason for return is required'),
  evidencePhotoUrl: z.string().url('A valid photo URL of the product is required for return evidence'),
})

export type ReturnInput = z.infer<typeof returnSchema>
