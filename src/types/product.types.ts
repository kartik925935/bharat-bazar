export type SellerTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type SellerType =
  | 'artisan'
  | 'ngo'
  | 'village_producer'
  | 'shg'
  | 'shop_owner'
  | 'professional';

export interface ProductSeller {
  id: string;
  name: string;
  username: string;
  tier: SellerTier;
  type: SellerType;
  location: string;
  avatar: string;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  subcategory?: string;
  seller: ProductSeller;
  isNew: boolean;
  inStock: boolean;
  freeDelivery: boolean;
  tags: string[];
  description?: string;
  specifications?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  color: string;
  image?: string;
}
