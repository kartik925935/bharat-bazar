'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const popularTags = ['Saree', 'Pottery', 'Organic', 'Jewellery', 'Bamboo'];

export function SearchBarClient() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            key="search-input"
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
                if (e.key === 'Enter') handleSearchSubmit();
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
            key="search-btn"
            onClick={() => setSearchOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#555449] hover:text-[#FF7A00] hover:bg-[#FFF8F0] transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
