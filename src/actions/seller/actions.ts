'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { sellerProfileSchema, SellerProfileInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function createSellerProfile(data: SellerProfileInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = sellerProfileSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  const { data: seller, error } = await supabase
    .from('sellers')
    .insert([{ ...result.data, user_id: user.id }])
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/seller')
  return { success: true, data: seller }
}

export async function getSellerProfile() {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) return { error: error.message }

  return { success: true, data }
}
