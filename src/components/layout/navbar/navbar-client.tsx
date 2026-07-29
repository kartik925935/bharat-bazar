'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown, User as UserIcon, LogOut, Shield, Store } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { siteConfig } from '@/config/site';
import { toast } from 'sonner';
import { SearchModal } from '@/components/search/search-modal';
import { NotificationBell } from '@/components/notifications/notification-bell';

const navLinks = siteConfig.navLinks;
const categories = siteConfig.categories;

export function NavbarClient() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const cartCount = useCartStore((state) => state.totalItems());
  const wishlistCount = useWishlistStore((state) => state.totalWishlistItems());
  
  const { user, isAuthenticated, signOut } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCartCount = mounted ? cartCount : 0;
  const displayWishlistCount = mounted ? wishlistCount : 0;
  const displayUser = mounted ? user : null;
  const displayIsAuthenticated = mounted ? isAuthenticated : false;

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
    setUserDropdownOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully. Come back soon! 🙏');
    router.replace('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Search overlay backdrop */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-[#E5E4DE]'
            : 'bg-white/90 backdrop-blur-lg border-b border-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm bg-gradient-to-br from-[#FF7A00] to-[#FF4500]">
                {siteConfig.logoText}
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
                  {siteConfig.name}
                </div>
                <div className="text-[9px] leading-none mt-0.5" style={{ color: '#8C8B80' }}>
                  {siteConfig.tagline}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.label === 'Categories' ? (
                    <div
                      onMouseEnter={() => setCategoriesOpen(true)}
                      onMouseLeave={() => setCategoriesOpen(false)}
                      className="py-2"
                    >
                      <button
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-[#FFF8F0] hover:text-[#FF7A00] ${
                          pathname.startsWith('/products') ? 'text-[#FF7A00]' : 'text-[#555449]'
                        }`}
                      >
                        Categories <ChevronDown size={14} className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Mega Menu Category Dropdown */}
                      <AnimatePresence>
                        {categoriesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 15 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-1/2 -translate-x-1/2 top-full w-[600px] bg-white rounded-3xl border border-[#E5E4DE] shadow-2xl p-6 grid grid-cols-3 gap-6 z-50"
                          >
                            {/* Column 1: Primary Categories */}
                            <div className="space-y-1.5 border-r border-[#E5E4DE] pr-4">
                              <h4 className="text-[10px] font-bold text-[#8C8B80] uppercase tracking-wider mb-2">Artisan Directory</h4>
                              {categories.slice(0, 5).map((cat) => (
                                <Link
                                  key={cat.label}
                                  href={cat.href}
                                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FFF8F0] text-xs font-semibold text-[#1A1A1A] hover:text-[#FF7A00] transition-colors"
                                >
                                  <span>{cat.icon}</span>
                                  <span>{cat.label}</span>
                                </Link>
                              ))}
                            </div>

                            {/* Column 2: Highlights */}
                            <div className="space-y-1.5 border-r border-[#E5E4DE] pr-4">
                              <h4 className="text-[10px] font-bold text-[#8C8B80] uppercase tracking-wider mb-2">Regional Specialty</h4>
                              {[
                                { name: 'Banarasi Sarees', link: '/products?category=handloom-textiles' },
                                { name: 'Blue Pottery Items', link: '/products?category=pottery-ceramics' },
                                { name: 'Organic Hill Spices', link: '/products?category=organic-food' },
                                { name: 'Paintings & Artworks', link: '/products?category=paintings-art' },
                                { name: 'Silver Filigree Sets', link: '/products?category=jewelry' }
                              ].map((sub) => (
                                <Link
                                  key={sub.name}
                                  href={sub.link}
                                  className="block px-3 py-1.5 text-xs text-[#555449] hover:text-[#FF7A00] hover:bg-[#FFF8F0] rounded-lg transition-colors font-medium"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>

                            {/* Column 3: Featured Banner */}
                            <div className="flex flex-col justify-between">
                              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-[#FF7A00] to-[#FF4500] relative p-4 flex flex-col justify-end text-white border border-black/5">
                                <div className="absolute inset-0 bg-black/20" />
                                <span className="absolute top-3 right-3 text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase backdrop-blur-sm">New</span>
                                <h5 className="font-black text-sm relative z-10 leading-snug">Madhubani Tree of Life Painting</h5>
                                <p className="text-[9px] text-white/80 relative z-10">Authentic Mithila Artwork</p>
                              </div>
                              <Link
                                href="/products"
                                className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1 mt-3"
                              >
                                View All Products &rarr;
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-[#FFF8F0] hover:text-[#FF7A00] ${
                        pathname === link.href ? 'text-[#FF7A00]' : 'text-[#555449]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Icon / Expandable search bar */}
              <div className="relative">
                <AnimatePresence>
                  {searchOpen ? (
                    <motion.form
                      onSubmit={handleSearchSubmit}
                      key="search-form"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 280, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center z-50"
                    >
                      <input
                        ref={searchRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search sarees, pottery..."
                        className="w-full h-11 pl-4 pr-10 rounded-xl border border-[#FF7A00] outline-none text-sm bg-white shadow-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        className="absolute right-3 text-[#8C8B80] hover:text-[#FF7A00]"
                      >
                        <X size={16} />
                      </button>
                    </motion.form>
                  ) : (
                    <motion.button
                      key="search-icon-btn"
                      onClick={() => setSearchOpen(true)}
                      className="w-10 h-10 flex items-center justify-center rounded-full text-[#555449] hover:text-[#FF7A00] hover:bg-[#FFF8F0] transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Search size={20} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#555449] hover:text-[#FF7A00] hover:bg-[#FFF8F0] transition-all hidden sm:flex"
              >
                <Heart size={20} />
                {displayWishlistCount > 0 && (
                  <motion.span
                    key={`wishlist-${displayWishlistCount}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center bg-[#FF7A00]"
                  >
                    {displayWishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Cart Link with Bounce Animation */}
              <Link
                href="/cart"
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#555449] hover:text-[#FF7A00] hover:bg-[#FFF8F0] transition-all"
              >
                <ShoppingCart size={20} />
                {displayCartCount > 0 && (
                  <motion.span
                    key={`cart-${displayCartCount}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center bg-[#FF7A00]"
                  >
                    {displayCartCount}
                  </motion.span>
                )}
              </Link>

              {/* Notifications */}
              <div className="hidden md:block">
                <NotificationBell />
              </div>
              <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

              {/* Dynamic User Profile Menu / Signin triggers */}
              {displayIsAuthenticated && displayUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:shadow-md cursor-pointer transition-all"
                  >
                    {displayUser.name.slice(0, 1).toUpperCase()}
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E5E4DE] shadow-xl p-3 space-y-1.5 z-50 text-[#1C1B14]"
                      >
                        {/* Header info */}
                        <div className="px-3 py-2 border-b border-[#E5E4DE]/50">
                          <div className="font-bold text-sm truncate">{displayUser.name}</div>
                          <div className="text-[10px] text-[#8C8B80] truncate">{displayUser.email}</div>
                          <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold text-emerald-700 bg-emerald-50 mt-1 uppercase">
                            {displayUser.role}
                          </span>
                        </div>

                        {/* Customer links */}
                        {displayUser.role === 'customer' && (
                          <>
                            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-[#FFF8F0] hover:text-[#FF7A00] rounded-xl transition-colors">
                              <UserIcon size={14} /> My Dashboard
                            </Link>
                            <Link href="/orders" className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-[#FFF8F0] hover:text-[#FF7A00] rounded-xl transition-colors">
                              <ShoppingCart size={14} /> My Orders
                            </Link>
                            <Link href="/wishlist" className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-[#FFF8F0] hover:text-[#FF7A00] rounded-xl transition-colors">
                              <Heart size={14} /> Wishlist
                            </Link>
                          </>
                        )}

                        {/* Seller links */}
                        {displayUser.role === 'seller' && (
                          <>
                            <Link href="/seller-dashboard" className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-[#FFF8F0] hover:text-[#FF7A00] rounded-xl transition-colors">
                              <Store size={14} /> Seller Dashboard
                            </Link>
                            <Link href="/seller-shop" className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-[#FFF8F0] hover:text-[#FF7A00] rounded-xl transition-colors">
                              <UserIcon size={14} /> Shop Profile
                            </Link>
                          </>
                        )}

                        {/* Admin links */}
                        {displayUser.role === 'admin' && (
                          <Link href="/admin-dashboard" className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-[#FFF8F0] hover:text-[#FF7A00] rounded-xl transition-colors">
                            <Shield size={14} /> Admin Panel
                          </Link>
                        )}

                        {/* Sign out */}
                        <div className="border-t border-[#E5E4DE]/50 pt-1.5">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl w-full text-left transition-colors cursor-pointer"
                          >
                            <LogOut size={14} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="h-9 px-4 flex items-center text-xs font-semibold rounded-lg hover:text-[#FF7A00] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="h-9 px-4 flex items-center text-xs font-semibold rounded-lg text-white"
                    style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile hamburger menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-[#555449] hover:bg-[#FFF8F0] transition-all cursor-pointer"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide Drawer (Framer Motion) */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t border-[#E5E4DE] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                {/* User Info Header for mobile */}
                {displayIsAuthenticated && displayUser && (
                  <div className="bg-[#FFF8F0] p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-r from-[#FF7A00] to-[#FF4500]">
                      {displayUser.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#1A1A1A]">{displayUser.name}</div>
                      <div className="text-[10px] text-[#8C8B80]">{displayUser.email}</div>
                    </div>
                  </div>
                )}

                {/* Nav Links */}
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        pathname === link.href ? 'bg-[#FFF8F0] text-[#FF7A00]' : 'text-[#1C1B14] hover:bg-[#FAFAF8]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Actions & login */}
                <div className="pt-2 border-t border-[#E5E4DE]/50 flex gap-2">
                  {displayIsAuthenticated ? (
                    <button
                      onClick={handleSignOut}
                      className="flex-1 h-10 flex items-center justify-center text-xs font-bold rounded-xl border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex-1 h-10 flex items-center justify-center text-xs font-bold rounded-xl border border-[#FF7A00] text-[#FF7A00]"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="flex-1 h-10 flex items-center justify-center text-xs font-bold rounded-xl text-white text-center"
                        style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E4DE] px-2 py-1 safe-area-inset-bottom">
        <div className="flex justify-around">
          {[
            { icon: '🏠', label: 'Home', href: '/' },
            { icon: '🗂️', label: 'Browse', href: '/products' },
            { icon: '🛒', label: 'Cart', href: '/cart', badge: displayCartCount },
            { icon: '📦', label: 'Orders', href: displayIsAuthenticated ? (displayUser?.role === 'seller' ? '/seller-dashboard' : '/orders') : '/login' },
            { icon: '👤', label: 'Account', href: displayIsAuthenticated ? (displayUser?.role === 'seller' ? '/seller-dashboard' : '/dashboard') : '/login' },
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
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold text-white flex items-center justify-center bg-[#FF7A00]"
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold tracking-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
export default NavbarClient;
