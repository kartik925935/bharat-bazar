'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { returnSchema, ReturnInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function createReturnRequest(data: ReturnInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = returnSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  const { data: returnRequest, error } = await supabase
    .from('returns')
    .insert([{
      order_item_id: result.data.orderItemId,
      user_id: user.id,
      reason: result.data.reason,
      status: 'pending'
    }])
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/returns')
  revalidatePath('/orders')
  return { success: true, data: returnRequest }
}

export async function getReturnRequests() {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const supabase = await createClient()

  const query = supabase.from('returns').select('*, order_items(*)')
  
  if (user.role === 'seller') {
    // Requires RLS or joining to see if order_item belongs to seller's products
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) return { error: error.message }

  return { success: true, data }
}
