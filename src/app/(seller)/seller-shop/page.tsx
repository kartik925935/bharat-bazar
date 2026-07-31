'use client';

import { useSellerStore } from '@/lib/store/seller-store';
import { Store, Share2, MapPin, Package, Star } from 'lucide-react';
import Link from 'next/link';

export default function SellerShopPage() {
  const { seller, products, reviews } = useSellerStore();

  if (!seller) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Banner & Profile */}
      <div className="bg-white rounded-3xl border border-[#F0EDE8] overflow-hidden relative">
        <div className="h-48 bg-gradient-to-br from-[#1A0A00] to-[#3D1800] relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #FF7A00 0%, transparent 60%)' }} />
        </div>
        
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-6 relative -top-12">
            <div className="w-24 h-24 rounded-2xl bg-white p-1.5 border border-[#F0EDE8] shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-[#FFF7ED] rounded-xl flex items-center justify-center text-[#FF7A00] text-3xl font-black">
                {seller.shopName.charAt(0)}
              </div>
            </div>
            <div className="flex-1 pt-14 sm:pt-14 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#1A1A1A]">{seller.shopName}</h1>
                <p className="text-sm text-[#9B8F84] mb-2 flex items-center gap-1"><MapPin size={14}/> {seller.district}, {seller.state}</p>
                <div className="flex items-center gap-4 text-sm font-bold text-[#4A4540]">
                  <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-yellow-400"/> {seller.rating.toFixed(1)} ({seller.totalReviews} reviews)</span>
                  <span className="flex items-center gap-1"><Package size={16} className="text-[#C4B8AF]"/> {products.length} Products</span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-2 border border-[#F0EDE8] text-[#4A4540] text-sm font-bold rounded-xl hover:bg-[#FAFAF8] flex items-center justify-center gap-2">
                  <Share2 size={16} /> Share Shop
                </button>
                <Link href="/seller-settings" className="flex-1 sm:flex-none px-4 py-2 bg-[#1A1A1A] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2">
                  <Store size={16} /> Edit Storefront
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wide mb-2">About the Maker</h2>
            <p className="text-sm text-[#4A4540] max-w-3xl leading-relaxed">{seller.shopDescription}</p>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <h2 className="text-xl font-black text-[#1A1A1A] mb-4">Shop Preview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-[#F0EDE8] overflow-hidden hover:shadow-md transition-all">
              <img src={p.images[0]?.url || 'https://via.placeholder.com/300'} alt={p.name} className="w-full h-40 object-cover" />
              <div className="p-3">
                <h3 className="text-sm font-bold text-[#1A1A1A] truncate mb-1">{p.name}</h3>
                <p className="text-base font-black text-[#FF7A00]">₹{p.sellingPrice}</p>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-[#F0EDE8] rounded-2xl">
              <p className="text-sm text-[#9B8F84] mb-2">No products added yet.</p>
              <Link href="/seller-products/add" className="text-sm font-bold text-[#FF7A00]">Add your first product →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
