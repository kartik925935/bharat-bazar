'use client';

import { Navbar } from '@/components/layout/navbar/navbar';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}
