import { z } from 'zod'

export const reviewSchema = z.object({
  productId: z.string().uuid('Valid product ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().optional(),
})

export type ReviewInput = z.infer<typeof reviewSchema>
