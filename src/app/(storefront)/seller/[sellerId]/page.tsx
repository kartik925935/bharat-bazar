
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getStorefrontProductsBySeller } from '@/actions/products/storefront-queries';
import { Product } from '@/types';

/**
 * Seller public storefront page
 * Displays all published products from a specific seller
 */
export default function SellerStorefront() {
  const params = useParams();
  const sellerId = params.sellerId as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      if (!sellerId) return;
      setLoading(true);
      setError(null);
      const result = await getStorefrontProductsBySeller(sellerId, { limit: 50 });
      if (result.error) {
        setError(result.error);
        setProducts([]);
      } else {
        setProducts(result.data);
      }
      setLoading(false);
    };
    fetchSellerProducts();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A00]"></div>
            <p className="text-sm text-[#8C8B80] mt-4">Loading seller products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E4DE] p-8">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">No Products Found</h2>
            <p className="text-sm text-[#8C8B80] mb-6">
              {error ? error : 'This seller currently has no published products.'}
            </p>
            <a href="/products" className="inline-block px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#FF4500]">
              Browse All Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-8">Seller Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-[#E5E4DE] overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
              <div className="p-3">
                <h3 className="font-bold text-sm text-[#1A1A1A] truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-black text-[#FF7A00]">₹{product.price.toLocaleString()}</span>
                  {product.mrp > product.price && (
                    <span className="text-xs text-[#8C8B80] line-through">₹{product.mrp.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}
