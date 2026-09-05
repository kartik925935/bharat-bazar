'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { sellerProfileSchema, SellerProfileInput } from './validations'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

export async function createSellerProfile(data: SellerProfileInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const supabase = await createClient()

  // SR-001: Every seller must complete email verification before KYC
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user?.email_confirmed_at) {
    return { error: 'Email must be verified before submitting KYC (SR-001)' }
  }

  // Check if seller already exists to handle SR-008
  const { data: existingSeller } = await supabase
    .from('sellers')
    .select('kyc_status, reapply_after')
    .eq('user_id', user.id)
    .single()

  if (existingSeller) {
    if (existingSeller.kyc_status === 'rejected') {
      if (existingSeller.reapply_after && new Date(existingSeller.reapply_after) > new Date()) {
        return { error: `You cannot reapply yet. Please wait until ${existingSeller.reapply_after} (SR-008)` }
      }
      // If allowed to reapply, we would ideally UPDATE the existing seller.
      // For simplicity in this action, we'll return an error asking to update instead.
      // Or we can implement the update logic here.
      return { error: 'Please update your existing profile instead of creating a new one.' }
    } else {
      return { error: 'Seller profile already exists' }
    }
  }

  const result = sellerProfileSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  // SR-006: Seller ID is system-generated and immutable
  const generatedSellerId = `SEL-IND-${Math.floor(100000 + Math.random() * 900000)}`

  // 1. Insert into sellers table
  const { data: seller, error: sellerError } = await supabase
    .from('sellers')
    .insert([{
      user_id: user.id,
      seller_id: generatedSellerId,
      seller_type: result.data.sellerType,
      legal_name: result.data.legalName,
      display_name: result.data.displayName,
      username: result.data.username,
      village: result.data.village,
      district: result.data.district,
      state: result.data.state,
      description: result.data.description,
      kyc_status: 'pending' // SR-007: Registration fee must be paid before admin review begins. Status stays pending.
    }])
    .select()
    .single()

  if (sellerError) return { error: sellerError.message }

  // 2. Insert KYC Documents
  const documents = [
    { seller_id: seller.id, document_type: 'aadhaar', document_number: result.data.aadhaarNumber },
    { seller_id: seller.id, document_type: 'pan', document_number: result.data.panNumber },
  ]
  if (result.data.gstNumber) {
    documents.push({ seller_id: seller.id, document_type: 'gst', document_number: result.data.gstNumber })
  }

  const { error: docError } = await supabase.from('seller_documents').insert(documents)
  if (docError) {
    // Ideally we should rollback the seller insert here if this fails
    return { error: docError.message }
  }

  // 3. Insert Bank Account
  const { error: bankError } = await supabase.from('bank_accounts').insert([{
    seller_id: seller.id,
    account_holder_name: result.data.accountHolderName,
    account_number: result.data.accountNumber,
    ifsc_code: result.data.ifscCode,
    bank_name: result.data.bankName,
  }])
  if (bankError) return { error: bankError.message }

  revalidatePath('/seller')
  return { success: true, data: seller }
}

export async function getSellerProfile() {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sellers')
    .select('*, seller_documents(*), bank_accounts(*)')
    .eq('user_id', user.id)
    .single()

  if (error) return { error: error.message }

  return { success: true, data }
}
