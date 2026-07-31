'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { assignDeliverySchema, AssignDeliveryInput, updateDeliveryStatusSchema, UpdateDeliveryStatusInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function assignDelivery(data: AssignDeliveryInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = assignDeliverySchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  const { data: delivery, error } = await supabase
    .from('deliveries')
    .insert([{
      order_id: result.data.orderId,
      delivery_partner_id: result.data.deliveryPartnerId,
      status: 'assigned'
    }])
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/admin/deliveries')
  return { success: true, data: delivery }
}

export async function updateDeliveryStatus(data: UpdateDeliveryStatusInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'delivery partner'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = updateDeliveryStatusSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  const { error } = await supabase
    .from('deliveries')
    .update({ 
      status: result.data.status,
      tracking_url: result.data.trackingUrl
    })
    .eq('id', result.data.deliveryId)

  if (error) return { error: error.message }

  revalidatePath('/delivery')
  return { success: true }
}
