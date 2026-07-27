'use client';

// Alias: /seller-register redirects to /seller-registration
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerRegisterAlias() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/seller-registration');
  }, [router]);
  return null;
}
