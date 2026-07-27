'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function NewsletterBarClient() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing to Bharat Bazaar newsletter!');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="flex-1 md:w-72 h-12 px-4 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder:text-white/60 outline-none focus:bg-white/30 transition-all"
      />
      <button
        type="submit"
        className="h-12 px-6 bg-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 text-[#FF7A00]"
      >
        Subscribe
      </button>
    </form>
  );
}
