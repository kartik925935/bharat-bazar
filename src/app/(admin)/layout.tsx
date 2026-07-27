import Link from 'next/link';
import { LayoutDashboard, Users, ShoppingBag, Package, CreditCard, ShieldCheck } from 'lucide-react';

const adminLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin-dashboard' },
  { label: 'Sellers Queue', icon: ShoppingBag, href: '/admin-sellers' },
  { label: 'Product Moderation', icon: Package, href: '/admin-products' },
  { label: 'KYC Verification', icon: ShieldCheck, href: '/admin-kyc' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#FAFAF8]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1C1B14] text-white hidden md:flex flex-col p-4 shrink-0">
        <Link href="/" className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] text-white font-black text-xs flex items-center justify-center">
            BB
          </div>
          <span className="font-black text-base bg-gradient-to-r from-[#FF7A00] to-[#FF4500] bg-clip-text text-transparent">
            Admin Governance
          </span>
        </Link>

        <nav className="space-y-1 flex-1">
          {adminLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
