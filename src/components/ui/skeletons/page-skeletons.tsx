'use client';

import { 
  SkeletonBox, SkeletonText, SkeletonAvatar, SkeletonBadge, 
  SkeletonButton, SkeletonImage, SkeletonStat, SkeletonTableRow, SkeletonCard, SkeletonChart 
} from './index';

export function HomepageSkeleton() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <div className="h-[450px] md:h-[550px] w-full bg-[#E5E4DE]/60 animate-pulse relative flex flex-col justify-end p-8 md:p-16">
        <div className="space-y-4 max-w-lg">
          <SkeletonBox className="h-12 w-3/4 bg-white/20" />
          <SkeletonBox className="h-6 w-1/2 bg-white/20" />
          <div className="flex gap-4 pt-4">
            <SkeletonButton className="bg-white/20 border-0" />
            <SkeletonButton className="bg-white/20 border-0" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Trust Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-[#E5E4DE]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonAvatar size="sm" />
              <div className="space-y-1.5 flex-1">
                <SkeletonBox className="h-4 w-20" />
                <SkeletonBox className="h-3 w-28" />
              </div>
            </div>
          ))}
        </div>

        {/* Category Grid */}
        <div className="space-y-6">
          <SkeletonBox className="h-8 w-48 mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} variant="category" />
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <SkeletonBox className="h-8 w-64" />
              <SkeletonBox className="h-4 w-96" />
            </div>
            <SkeletonBox className="h-5 w-20" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonCard key={i} variant="product" />
            ))}
          </div>
        </div>

        {/* Artisan Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} variant="seller" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductsListingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <SkeletonBox className="h-4 w-48" /> {/* Breadcrumb */}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Filter Sidebar */}
        <aside className="w-full lg:w-64 space-y-6 shrink-0 hidden lg:block">
          <div className="p-5 bg-white rounded-2xl border border-[#E5E4DE] space-y-6">
            <SkeletonBox className="h-6 w-20" />
            <div className="space-y-3">
              <SkeletonBox className="h-4 w-28" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <SkeletonBox className="w-4 h-4 rounded" />
                  <SkeletonBox className="h-4 w-32" />
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-4 border-t border-[#E5E4DE]">
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-10 w-full" />
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-[#E5E4DE]">
            <SkeletonBox className="h-5 w-40" />
            <SkeletonBox className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <SkeletonCard key={i} variant="product" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SkeletonBox className="h-4 w-60" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Image Gallery */}
        <div className="space-y-4">
          <SkeletonImage aspectRatio="portrait" className="w-full rounded-3xl" />
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonBox key={i} className="w-16 h-16 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="space-y-6">
          <SkeletonBadge width="w-24" />
          <SkeletonBox className="h-10 w-full" />
          <SkeletonBox className="h-10 w-2/3" />
          
          <div className="flex items-center gap-4">
            <SkeletonAvatar size="sm" />
            <SkeletonBox className="h-4 w-32" />
            <SkeletonBadge width="w-16" />
          </div>

          <div className="space-y-2 pt-4 border-y border-[#E5E4DE] py-4">
            <div className="flex items-baseline gap-2">
              <SkeletonBox className="h-8 w-24" />
              <SkeletonBox className="h-4 w-16" />
              <SkeletonBadge width="w-12" />
            </div>
            <SkeletonBox className="h-4 w-48" />
          </div>

          <div className="flex gap-4">
            <SkeletonBox className="h-12 w-32" />
            <SkeletonButton className="flex-1 h-12" />
          </div>
          
          <SkeletonBox className="h-28 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SkeletonBox className="h-8 w-40" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-[#E5E4DE] flex gap-4">
              <SkeletonBox className="w-24 h-24 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonBox className="h-5 w-48" />
                <SkeletonBox className="h-4 w-28" />
                <SkeletonBox className="h-4 w-16" />
                <div className="flex items-center justify-between pt-2">
                  <SkeletonBox className="h-8 w-24" />
                  <SkeletonBox className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] h-fit space-y-4">
          <SkeletonBox className="h-6 w-36" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <SkeletonBox className="h-4 w-24" />
                <SkeletonBox className="h-4 w-16" />
              </div>
            ))}
          </div>
          <SkeletonBox className="h-10 w-full" />
          <SkeletonButton className="w-full h-12" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Steps bar */}
      <div className="flex justify-around items-center max-w-xl mx-auto mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <SkeletonAvatar size="sm" />
            <SkeletonBox className="h-3 w-16 mt-2" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] space-y-4">
            <SkeletonBox className="h-6 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SkeletonBox className="h-24 rounded-xl" />
              <SkeletonBox className="h-24 rounded-xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] space-y-4">
            <SkeletonBox className="h-6 w-32" />
            <SkeletonBox className="h-16 w-full" />
            <SkeletonBox className="h-16 w-full" />
          </div>
        </div>
        <div className="space-y-4">
          <CartSkeleton />
        </div>
      </div>
    </div>
  );
}

export function CustomerDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <SkeletonAvatar size="lg" />
        <div className="space-y-1.5">
          <SkeletonBox className="h-6 w-48" />
          <SkeletonBox className="h-4 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonStat key={i} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] space-y-4 shadow-sm">
        <SkeletonBox className="h-6 w-32" />
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} variant="order" />
        ))}
      </div>
    </div>
  );
}

export function CustomerOrdersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 pb-2 overflow-x-auto">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBadge key={i} width="w-24" className="h-8 shrink-0" />
        ))}
      </div>
      <SkeletonBox className="h-12 w-full rounded-xl" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} variant="order" />
        ))}
      </div>
    </div>
  );
}

export function WishlistSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SkeletonBox className="h-8 w-48" />
        <SkeletonBox className="h-5 w-24" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} variant="product" />
        ))}
      </div>
    </div>
  );
}

export function SellerDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBox className="h-8 w-48" />
          <SkeletonBox className="h-4 w-64" />
        </div>
        <SkeletonBox className="h-10 w-36" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonStat key={i} />
        ))}
      </div>

      <SkeletonChart height="h-72" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-4">
          <SkeletonBox className="h-6 w-32" />
          {[1, 2, 3, 4].map((i) => (
            <SkeletonTableRow key={i} columns={4} />
          ))}
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-4">
          <SkeletonBox className="h-6 w-32" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3">
              <SkeletonBox className="w-12 h-12 rounded-lg" />
              <div className="space-y-2 flex-1">
                <SkeletonBox className="h-4 w-32" />
                <SkeletonBox className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonStat key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonChart height="h-80" />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-4">
          <SkeletonBox className="h-6 w-32" />
          <SkeletonChart height="h-64" className="border-0 shadow-none p-0" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#E5E4DE] shadow-sm space-y-4">
        <SkeletonBox className="h-6 w-48" />
        {[1, 2, 3, 4].map((i) => (
          <SkeletonTableRow key={i} columns={5} />
        ))}
      </div>
    </div>
  );
}
