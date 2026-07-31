'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSellerStore } from '@/lib/store/seller-store';
import { toast } from 'sonner';

export default function SellerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useSellerStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (res.success) {
      toast.success('Welcome back!');
      router.push('/seller-dashboard');
    } else {
      toast.error(res.error || 'Login failed');
    }
  };

  const fillDemo = () => {
    setEmail('seller@test.com');
    setPassword('Seller@123');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left panel (Image/Brand) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#1A0A00] to-[#2D1000] p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #FF7A00 0%, transparent 70%)' }} />
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-16 text-white/80 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Storefront
          </Link>
          
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white font-black text-xl mb-6 shadow-xl shadow-orange-500/20">
            BB
          </div>
          <h1 className="text-4xl font-black mb-4 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Your craft deserves<br/>the world's attention.
          </h1>
          <p className="text-lg text-white/70 max-w-md">Join Bharat Bazaar's seller community and take your traditional handcrafted products to millions of customers across India.</p>
        </div>

        <div className="relative z-10 space-y-4 text-sm text-white/80">
          <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">✓</span> Zero commission for 30 days</div>
          <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">✓</span> Weekly bank settlements</div>
          <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">✓</span> Dedicated artisan support</div>
        </div>
      </div>

      {/* Right panel (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white font-black text-lg">BB</div>
            <span className="font-black text-xl text-[#1A1A1A]">Bharat Bazaar</span>
          </div>

          <h2 className="text-3xl font-black text-[#1A1A1A] mb-2">Welcome Back, Artisan! 🙏</h2>
          <p className="text-sm text-[#9B8F84] mb-8">Sign in to manage your shop</p>

          {/* Demo creds */}
          <div className="bg-[#FFF7ED] border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#FF7A00] mb-1">🧪 Demo Seller Account</p>
                <p className="text-xs text-[#4A4540]">Email: seller@test.com</p>
                <p className="text-xs text-[#4A4540]">Pass: Seller@123</p>
              </div>
              <button onClick={fillDemo} className="px-3 py-1.5 bg-white border border-orange-200 text-[#FF7A00] text-xs font-bold rounded-lg hover:bg-orange-50">Fill</button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B8AF]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full h-12 pl-10 pr-4 bg-white border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B8AF]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-4 bg-white border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00] transition-colors"
                />
              </div>
              <div className="text-right mt-1.5">
                <a href="#" className="text-xs text-[#FF7A00] font-medium hover:underline">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? 'Signing in...' : <>Sign In to Seller Portal <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#9B8F84]">
            New seller? <Link href="/seller-register" className="font-bold text-[#FF7A00] hover:underline">Register your shop →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
