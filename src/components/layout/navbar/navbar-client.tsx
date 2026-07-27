'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, Bell, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/products' },
  { label: 'Sellers', href: '/sellers' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

const categories = [
  { label: 'Handloom & Textiles', icon: '🧵', href: '/products?category=textiles' },
  { label: 'Pottery & Ceramics', icon: '🏺', href: '/products?category=pottery' },
  { label: 'Organic Food', icon: '🌿', href: '/products?category=food' },
  { label: 'Paintings & Art', icon: '🎨', href: '/products?category=art' },
  { label: 'Jewelry', icon: '💍', href: '/products?category=jewelry' },
  { label: 'Home Décor', icon: '🪑', href: '/products?category=decor' },
];

export function NavbarClient() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const cartCount = useCartStore((state) => state.totalItems());
  const wishlistCount = useWishlistStore((state) => state.totalWishlistItems());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-black/5'
            : 'bg-white/90 backdrop-blur-lg'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
                  style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
                >
                  BB
                </div>
              </div>
              <div>
                <div
                  className="font-black text-lg leading-none"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    background: 'linear-gradient(135deg, #FF7A00, #FF4500)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Bharat Bazaar
                </div>
                <div className="text-[9px] leading-none mt-0.5" style={{ color: '#8C8B80' }}>
                  From Village Hands to Your Home
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.label === 'Categories' ? (
                    <button
                      onMouseEnter={() => setCategoriesOpen(true)}
                      onMouseLeave={() => setCategoriesOpen(false)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        pathname === link.href ? 'text-[#FF7A00]' : 'text-[#555449] hover:text-[#FF7A00]'
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${categoriesOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 block ${
                        pathname === link.href ? 'text-[#FF7A00]' : 'text-[#555449] hover:text-[#FF7A00]'
                      }`}
                    >
                      {link.label}
                      {pathname === link.href && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                          style={{ background: '#FF7A00' }}
                        />
                      )}
                    </Link>
                  )}

                  {/* Categories Dropdown */}
                  {link.label === 'Categories' && (
                    <AnimatePresence>
                      {categoriesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-black/5 p-2 z-50"
                          onMouseEnter={() => setCategoriesOpen(true)}
                          onMouseLeave={() => setCategoriesOpen(false)}
                        >
                          {categories.map((cat) => (
                            <Link
                              key={cat.label}
                              href={cat.href}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFF8F0] transition-colors text-sm text-[#1C1B14]"
                            >
                              <span className="text-lg">{cat.icon}</span>
                              {cat.label}
                            </Link>
                          ))}
                          <div className="border-t border-black/5 mt-1 pt-1">
                            <Link
                              href="/products"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#FFF8F0] transition-colors text-sm font-semibold"
                              style={{ color: '#FF7A00' }}
                            >
                              View All Categories →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <AnimatePresence>
                {searchOpen ? (
                  <motion.div
                    key="search-open"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden"
                  >
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search sarees, pottery..."
                      className="w-full h-10 pl-4 pr-10 rounded-full border-2 border-[#FF7A00]/30 focus:border-[#FF7A00] outline-none text-sm bg-[#FFF8F0] transition-colors"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                        }
                        if (e.key === 'Escape') setSearchOpen(false);
                      }}
                    />
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8B80] hover:text-[#FF7A00] transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="search-icon"
                    onClick={() => setSearchOpen(true)}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-[#555449] hover:text-[#FF7A00] hover:bg-[#FFF8F0] transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search size={20} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#555449] hover:text-[#FF7A00] hover:bg-[#FFF8F0] transition-all hidden sm:flex"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ background: '#FF7A00' }}
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#555449] hover:text-[#FF7A00] hover:bg-[#FFF8F0] transition-all"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ background: '#FF7A00' }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Notifications */}
              <Link
                href="/notifications"
                className="relative w-10 h-10 items-center justify-center rounded-full text-[#555449] hover:text-[#FF7A00] hover:bg-[#FFF8F0] transition-all hidden md:flex"
              >
                <Bell size={20} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
              </Link>

              {/* Login */}
              <Link
                href="/login"
                className="hidden sm:flex h-9 px-4 items-center text-sm font-semibold rounded-lg border-2 border-[#FF7A00] text-[#FF7A00] hover:bg-[#FFF8F0] transition-all"
              >
                Login
              </Link>

              {/* Sell CTA */}
              <Link
                href="/seller-register"
                className="hidden md:flex h-9 px-4 items-center text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
              >
                Sell on BB
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-[#555449] hover:bg-[#FFF8F0] transition-all"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-white border-t border-black/5 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        pathname === link.href
                          ? 'bg-[#FFF8F0] text-[#FF7A00]'
                          : 'text-[#1C1B14] hover:bg-[#FAFAF8]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2 border-t border-black/5 flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1 h-10 flex items-center justify-center text-sm font-semibold rounded-xl border-2 border-[#FF7A00] text-[#FF7A00]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/seller-register"
                    className="flex-1 h-10 flex items-center justify-center text-sm font-semibold rounded-xl text-white"
                    style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
                  >
                    Start Selling
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/8 px-2 py-1 safe-area-inset-bottom">
        <div className="flex justify-around">
          {[
            { icon: '🏠', label: 'Home', href: '/' },
            { icon: '🗂️', label: 'Categories', href: '/products' },
            { icon: '🛒', label: 'Cart', href: '/cart', badge: cartCount },
            { icon: '📦', label: 'Orders', href: '/orders' },
            { icon: '👤', label: 'Profile', href: '/dashboard' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                pathname === item.href ? 'text-[#FF7A00]' : 'text-[#8C8B80]'
              }`}
            >
              <div className="relative text-xl leading-none">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                    style={{ background: '#FF7A00' }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
