import { Product } from './product.types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  savedForLater?: boolean;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}
