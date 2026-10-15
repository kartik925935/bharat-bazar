'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireRole } from '../auth/session'
import { addressSchema, AddressInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function getAddresses() {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()

  const { data, error } = await adminSupabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { success: true, data: data || [] }
}

export async function createAddress(data: AddressInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = addressSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Invalid input', details: result.error.flatten().fieldErrors }
  }

  const adminSupabase = createAdminClient()

  // If this address is set as default, reset previous defaults
  if (result.data.isDefault) {
    await adminSupabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }

  const { data: address, error } = await adminSupabase
    .from('addresses')
    .insert([{
      user_id: user.id,
      full_name: result.data.fullName,
      phone: result.data.phone,
      address_line1: result.data.addressLine1,
      address_line2: result.data.addressLine2 || null,
      city: result.data.city,
      state: result.data.state,
      pincode: result.data.pincode,
      is_default: !!result.data.isDefault,
      label: result.data.label || 'Home'
    }])
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/checkout')
  return { success: true, data: address }
}

export async function deleteAddress(addressId: string) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()

  const { error } = await adminSupabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/checkout')
  return { success: true }
}
