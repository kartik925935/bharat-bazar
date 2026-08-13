'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Updates a seller's KYC and overall status in the database.
 * Accessible only via server environment (protected by admin privileges).
 */
export async function updateSellerKycStatus(
  sellerId: string,
  kycStatus: 'approved' | 'rejected' | 'pending' | 'under_review' | 'changes_required',
  status: 'active' | 'pending' | 'suspended' | 'rejected'
) {
  try {
    const adminSupabase = createAdminClient();

    // 1. Update the seller's KYC status and overall status
    const { data: updatedSeller, error: updateError } = await adminSupabase
      .from('sellers')
      .update({
        kyc_status: kycStatus,
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', sellerId)
      .select('id, legal_name, user_id')
      .single();

    if (updateError) {
      console.error('[updateSellerKycStatus] Database update failed:', updateError.message);
      return { success: false, error: updateError.message };
    }

    // 2. Also update user_metadata in Supabase auth to keep role/status synced
    if (updatedSeller?.user_id) {
      const { error: authError } = await adminSupabase.auth.admin.updateUserById(
        updatedSeller.user_id,
        {
          user_metadata: {
            kyc_status: kycStatus,
            status: status
          }
        }
      );
      if (authError) {
        console.error('[updateSellerKycStatus] Auth user metadata update failed:', authError.message);
      }
    }

    revalidatePath('/super-admin/kyc');
    revalidatePath('/super-admin/sellers');
    return { success: true, seller: updatedSeller };
  } catch (err: any) {
    console.error('[updateSellerKycStatus] Unexpected error:', err);
    return { success: false, error: err.message || 'Verification update failed' };
  }
}

/**
 * Fetches all sellers currently in 'pending' or 'under_review' KYC status.
 */
export async function getPendingKycSellers() {
  try {
    const adminSupabase = createAdminClient();

    const { data: sellers, error } = await adminSupabase
      .from('sellers')
      .select(`
        id,
        seller_id,
        legal_name,
        display_name,
        kyc_status,
        created_at,
        village,
        district,
        state,
        user_id,
        bank_accounts (
          bank_name,
          account_number,
          ifsc_code,
          account_holder_name
        ),
        seller_documents (
          document_type,
          document_number,
          file_url,
          verified
        )
      `)
      .in('kyc_status', ['pending', 'under_review']);

    if (error) {
      console.error('[getPendingKycSellers] Database query failed:', error.message);
      return { success: false, error: error.message };
    }

    // Map database structures to the expected UI representation
    const mapped = (sellers || []).map((s) => {
      const panDoc = s.seller_documents?.find((d: any) => d.document_type === 'pan');
      const aadhaarDoc = s.seller_documents?.find((d: any) => d.document_type === 'aadhaar');
      const gstDoc = s.seller_documents?.find((d: any) => d.document_type === 'gst');
      
      const bank = s.bank_accounts?.[0] || s.bank_accounts;

      // Calculate wait days
      const waitDays = Math.max(0, Math.floor((Date.now() - new Date(s.created_at).getTime()) / (1000 * 60 * 60 * 24)));

      return {
        id: s.id,
        sellerId: s.seller_id,
        sellerName: s.legal_name || s.display_name,
        shop: s.display_name || 'My Shop',
        submittedDate: new Date(s.created_at).toLocaleDateString(),
        documentType: panDoc && aadhaarDoc ? 'Aadhaar + PAN' : panDoc ? 'PAN Only' : 'Aadhaar Only',
        status: s.kyc_status,
        waitDays: waitDays || 1,
        panNumber: panDoc?.document_number || 'Not provided',
        gstNumber: gstDoc?.document_number || null,
        bankAccount: bank ? `${bank.bank_name} (${bank.account_number})` : 'Not provided',
      };
    });

    return { success: true, data: mapped };
  } catch (err: any) {
    console.error('[getPendingKycSellers] Unexpected error:', err);
    return { success: false, error: err.message || 'Failed to fetch pending KYC queue' };
  }
}
