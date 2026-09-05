import { z } from 'zod'

export const sellerProfileSchema = z.object({
  sellerType: z.enum(['ngo', 'village_producer', 'artisan', 'shop_owner', 'shg_group', 'professional']),
  legalName: z.string().min(2, 'Legal name is required'),
  displayName: z.string().min(2, 'Display name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  village: z.string().optional(),
  district: z.string().optional(),
  state: z.string().min(2, 'State is required'),
  description: z.string().optional(),
  
  // KYC Documents
  aadhaarNumber: z.string().length(12, 'Aadhaar must be 12 digits'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  gstNumber: z.string().optional(), // GST is optional unless turnover > 40L, checked in backend
  annualTurnover: z.number().optional(), // Used for GST validation
  
  // Bank Account
  accountHolderName: z.string().min(2, 'Account holder name is required'),
  accountNumber: z.string().min(9, 'Valid account number is required'),
  ifscCode: z.string().min(11, 'Valid IFSC code is required'),
  bankName: z.string().min(2, 'Bank name is required'),
}).refine(data => {
  // SR-004: GST is optional unless seller turnover exceeds ₹40L / year
  if (data.annualTurnover && data.annualTurnover > 4000000 && !data.gstNumber) {
    return false;
  }
  return true;
}, {
  message: "GST is mandatory for turnover exceeding ₹40L",
  path: ["gstNumber"]
});

export type SellerProfileInput = z.infer<typeof sellerProfileSchema>
