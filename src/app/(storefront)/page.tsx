import { HeroSection } from '@/components/storefront/home/hero-section';
import { StatsSection } from '@/components/storefront/home/stats-counter';
import { CategoriesGrid } from '@/components/storefront/home/categories-grid';
import { FeaturedProducts } from '@/components/storefront/home/featured-products';
import { FlashSaleSection } from '@/components/storefront/home/flash-sale-section';
import { SellerStories } from '@/components/storefront/home/seller-stories';
import { TrustBadges } from '@/components/storefront/home/trust-badges';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategoriesGrid />
      <FeaturedProducts />
      <FlashSaleSection />
      <SellerStories />
      <TrustBadges />
    </>
  );
}
