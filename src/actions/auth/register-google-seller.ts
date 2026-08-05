'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { encryptField } from '@/lib/utils/encryption.server';

export interface GoogleSellerRegisterInput {
  userId: string;
  fullName: string;
  phone: string;
  sellerType: string;
  shopName: string;
  shopDescription: string;
  shopCategory: string;
  pincode: string;
  district: string;
  state: string;
  fullAddress: string;
  panNumber: string;
  aadhaarNumber: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  village?: string;
  gstNumber?: string | null;
}

export async function registerGoogleSeller(input: GoogleSellerRegisterInput): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const adminSupabase = createAdminClient();

    // 1. Assign Role in user_roles
    const { data: sellerRole } = await adminSupabase
      .from('roles')
      .select('id')
      .eq('name', 'seller')
      .maybeSingle();

    if (sellerRole) {
      // Delete existing customer role if any
      const { data: customerRole } = await adminSupabase
        .from('roles')
        .select('id')
        .eq('name', 'customer')
        .maybeSingle();

      if (customerRole) {
        await adminSupabase
          .from('user_roles')
          .delete()
          .eq('user_id', input.userId)
          .eq('role_id', customerRole.id);
      }

      await adminSupabase.from('user_roles').insert({
        user_id: input.userId,
        role_id: sellerRole.id,
      });
    }

    // 2. Encrypt sensitive fields
    const encryptedAadhar = input.aadhaarNumber
      ? await encryptField(input.aadhaarNumber)
      : undefined;
    const encryptedPan = input.panNumber
      ? await encryptField(input.panNumber)
      : undefined;
    const encryptedAccountNumber = input.bankAccountNumber
      ? await encryptField(input.bankAccountNumber)
      : undefined;

    // 3. Provision Seller Profile
    const sellerUuid = crypto.randomUUID();
    const { count, error: countErr } = await adminSupabase
      .from('sellers')
      .select('*', { count: 'exact', head: true });

    const sellerCount = countErr ? 1 : (count || 0) + 1;
    const sellerId = `SEL-IND-${String(sellerCount).padStart(6, '0')}`;

    const baseUsername = input.fullName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'seller';
    let username = `${baseUsername}_${Math.floor(Math.random() * 1000)}`;

    for (let i = 0; i < 5; i++) {
      const { data: usernameCheck } = await adminSupabase
        .from('sellers')
        .select('id')
        .eq('username', username)
        .maybeSingle();
      if (!usernameCheck) break;
      username = `${baseUsername}_${Math.floor(Math.random() * 1000)}`;
    }

    const { error: sellerInsertErr } = await adminSupabase
      .from('sellers')
      .insert({
        id: sellerUuid,
        user_id: input.userId,
        seller_id: sellerId,
        seller_type: input.sellerType,
        legal_name: input.fullName,
        display_name: input.fullName,
        username,
        village: input.village || '',
        district: input.district,
        state: input.state,
        description: input.shopDescription,
        kyc_status: 'approved',
        current_tier: 'bronze'
      });

    if (sellerInsertErr) {
      console.error('[registerGoogleSeller] Seller insertion failed:', sellerInsertErr.message);
      return { success: false, error: sellerInsertErr.message };
    }

    // Create Shop
    const shopSlug = `${input.shopName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(Math.random() * 1000)}`;
    await adminSupabase.from('shops').insert({
      id: crypto.randomUUID(),
      seller_id: sellerUuid,
      shop_name: input.shopName,
      shop_slug: shopSlug,
      shop_story: input.shopDescription,
      business_location: input.village || input.district,
    });

    // Create Bank Account
    await adminSupabase.from('bank_accounts').insert({
      id: crypto.randomUUID(),
      seller_id: sellerUuid,
      account_holder_name: input.bankAccountName,
      account_number: encryptedAccountNumber ?? '000000000000',
      ifsc_code: input.ifscCode,
      bank_name: input.bankName,
    });

    // Create Seller Performance
    await adminSupabase.from('seller_performance').insert({
      id: crypto.randomUUID(),
      seller_id: sellerUuid,
      total_sales: 0,
      avg_rating: 0,
      return_rate: 0,
      cancellation_rate: 0,
      on_time_dispatch_rate: 0,
      performance_score: 0,
    });

    // Create Aadhaar Document
    if (encryptedAadhar) {
      await adminSupabase.from('seller_documents').insert({
        id: crypto.randomUUID(),
        seller_id: sellerUuid,
        document_type: 'aadhaar',
        document_number: encryptedAadhar,
        verified: false,
      });
    }

    // Create PAN Document
    if (encryptedPan) {
      await adminSupabase.from('seller_documents').insert({
        id: crypto.randomUUID(),
        seller_id: sellerUuid,
        document_type: 'pan',
        document_number: encryptedPan,
        verified: false,
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error('[registerGoogleSeller] Unexpected error:', err);
    return { success: false, error: err.message || 'Google seller registration failed unexpectedly.' };
  }
}
