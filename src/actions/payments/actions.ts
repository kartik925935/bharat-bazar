'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { processPaymentSchema, ProcessPaymentInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function processPayment(data: ProcessPaymentInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = processPaymentSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  // Placeholder for external payment gateway integration (e.g. Stripe, Razorpay)
  // const paymentResult = await stripe.charges.create(...)
  
  const supabase = await createClient()

  const { data: payment, error } = await supabase
    .from('payments')
    .insert([{
      order_id: result.data.orderId,
      user_id: user.id,
      amount: result.data.amount,
      status: 'completed', // or 'pending' depending on gateway sync
      payment_method_id: result.data.paymentMethodId
    }])
    .select()
    .single()

  if (error) return { error: error.message }

  // Update order status to processing upon successful payment
  await supabase
    .from('orders')
    .update({ status: 'processing' })
    .eq('id', result.data.orderId)

  revalidatePath('/orders')
  return { success: true, data: payment }
}

export async function getPaymentStatus(orderId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .single()

  if (error) return { error: error.message }

  return { success: true, data }
}
