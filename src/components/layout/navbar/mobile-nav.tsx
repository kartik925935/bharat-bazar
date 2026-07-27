'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart-store';

const mobileItems = [
  { icon: '🏠', label: 'Home', href: '/' },
  { icon: '🗂️', label: 'Categories', href: '/products' },
  { icon: '🛒', label: 'Cart', href: '/cart', isCart: true },
  { icon: '📦', label: 'Orders', href: '/orders' },
  { icon: '👤', label: 'Profile', href: '/dashboard' },
];

export function MobileNavClient() {
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.totalItems());

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/8 px-2 py-1">
      <div className="flex justify-around">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                isActive ? 'text-[#FF7A00]' : 'text-[#8C8B80]'
              }`}
            >
              <div className="relative text-xl leading-none">
                {item.icon}
                {item.isCart && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[9px] font-bold text-white flex items-center justify-center bg-[#FF7A00]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
