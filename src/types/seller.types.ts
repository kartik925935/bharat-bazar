import { SellerTier, SellerType } from './product.types';

export type KycStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'changes_required'
  | 'suspended';

export interface Seller {
  id: string;
  sellerId: string; // SEL-IND-XXXXXX
  username: string;
  displayName: string;
  legalName: string;
  type: SellerType;
  tier: SellerTier;
  kycStatus: KycStatus;
  rating: number;
  totalSales: number;
  totalProducts: number;
  location: string;
  state: string;
  joinedAt: string;
  avatar: string;
  banner?: string;
  tagline?: string;
  quote?: string;
  commissionRate: number;
  isVerified: boolean;
  badges: string[];
}
