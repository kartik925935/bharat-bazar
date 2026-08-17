'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../product-card';
import { getFeaturedProducts } from '@/actions/products/storefront-queries';
import { Product } from '@/types';
import { SkeletonCard } from '@/components/ui/skeletons';

const tabs = ['All', 'New Arrivals', 'Best Sellers', 'Offers', 'Under ₹500'];

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await getFeaturedProducts(12);
      if (res.data) {
        setProducts(res.data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeTab === 'Under ₹500'
    ? products.filter((p) => p.price < 500)
    : activeTab === 'New Arrivals'
    ? products.filter((p) => p.isNew)
    : activeTab === 'Offers'
    ? products.filter((p) => p.discount > 30)
    : products;

  return (
    <section className="py-20 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#1C1B14] mb-2">Handpicked for You</h2>
            <p className="text-[#8C8B80]">Curated selection from India&apos;s finest artisans</p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold flex items-center gap-1 text-[#FF7A00] hover:gap-2 transition-all"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white shadow-sm'
                  : 'bg-white text-[#555449] hover:bg-[#FFF8F0]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            // Array of 4 skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} variant="product" />
            ))
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
