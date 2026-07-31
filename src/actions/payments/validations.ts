import { z } from 'zod'

export const processPaymentSchema = z.object({
  orderId: z.string().uuid('Valid order ID is required'),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
  amount: z.number().positive('Amount must be positive'),
})

export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>
