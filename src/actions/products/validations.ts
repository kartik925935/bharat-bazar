import { z } from 'zod'

export const productSchema = z.object({
  shopId: z.string().uuid('Valid shop ID is required'),
  name: z.string().min(2, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url()).optional(),
})

export type ProductInput = z.infer<typeof productSchema>
