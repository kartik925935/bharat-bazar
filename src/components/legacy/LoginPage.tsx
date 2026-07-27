'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, User, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service and Privacy Policy",
  }),
  subscribeOffers: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: LoginValues) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF8]">
      {/* Left Brand Panel */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-[55%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "rgba(255,255,255,0.3)", transform: "translate(40%, -40%)" }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-10" style={{ background: "rgba(255,255,255,0.3)", transform: "translate(-30%, 30%)" }} />

        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-sm">BB</div>
            <span className="font-black text-2xl text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Bharat Bazaar</span>
          </div>
        </div>

        {/* Hero Image Grid */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4 w-64">
              {[
                "https://images.unsplash.com/photo-1569909115134-a0426936c879?w=300&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1536266305399-b367feb671f9?w=300&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1663325265966-0d17de3e85c5?w=300&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1620619767323-b95a89183081?w=300&auto=format&fit=crop",
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="aspect-square rounded-2xl overflow-hidden shadow-xl"
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom content */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome back to India's artisan marketplace
          </h2>
          <div className="space-y-3">
            {[
              "Shop from 50,000+ verified sellers",
              "Authentic Indian crafts, guaranteed",
              "Every purchase empowers a family",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="text-xs">✓</span>
                </div>
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Form Panel */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex-1 flex flex-col items-center justify-center p-8 bg-white min-h-screen"
      >
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>BB</div>
          <span className="font-black text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#FF7A00" }}>Bharat Bazaar</span>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.75rem", fontWeight: 700 }}>Welcome back</h2>
          <p className="text-[#8C8B80] mb-8">Sign in to your Bharat Bazaar account</p>

          {/* Google Auth */}
          <button className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl border-2 border-[#D4D3CB] font-semibold text-[#1C1B14] hover:border-[#FF7A00] hover:shadow-md transition-all mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#EBEBE4]" />
            <span className="text-sm text-[#B0AFA5] font-medium">OR</span>
            <div className="flex-1 h-px bg-[#EBEBE4]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full h-12 pl-10 pr-4 rounded-2xl border-2 outline-none text-sm transition-colors ${errors.email ? "border-red-400 focus:border-red-500" : "border-[#D4D3CB] focus:border-[#FF7A00]"}`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500 mt-1">{errors.email.message}</motion.p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-[#1C1B14]">Password</label>
                <Link href="/forgot-password" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "#FF7A00" }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full h-12 pl-10 pr-12 rounded-2xl border-2 outline-none text-sm transition-colors ${errors.password ? "border-red-400 focus:border-red-500" : "border-[#D4D3CB] focus:border-[#FF7A00]"}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B0AFA5] hover:text-[#555449] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500 mt-1">{errors.password.message}</motion.p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}
            >
              {loading ? "Signing in..." : "Sign in to account"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-[#8C8B80]">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: "#FF7A00" }}>
              Sign up free
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-[#F5F4F0] text-center">
            <p className="text-xs text-[#8C8B80] mb-2">Are you a seller or artisan?</p>
            <Link href="/seller-login" className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline" style={{ color: "#FF7A00" }}>
              Access Seller Portal <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,
      subscribeOffers: true,
    },
  });

  const onRegisterSubmit = async (data: RegisterValues) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/verify-email");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF8]">
      {/* Left Brand Panel */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-[55%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}
      >
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-sm">BB</div>
          <span className="font-black text-2xl text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Bharat Bazaar</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white max-w-md">
            <div className="text-6xl mb-6">🎁</div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Join India's Largest Craft Marketplace</h2>
            <p className="text-white/80 text-sm leading-relaxed">Create your account in 30 seconds and get 15% off your first order with coupon code WELCOME15</p>
          </div>
        </div>
      </motion.div>

      {/* Right Form Panel */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex-1 flex flex-col items-center justify-center p-8 bg-white min-h-screen"
      >
        <div className="w-full max-w-md">
          <h2 className="text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.75rem", fontWeight: 700 }}>Create an account</h2>
          <p className="text-[#8C8B80] mb-6">Join thousands of craft enthusiasts</p>

          <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
                <input type="text" {...register("name")} className="w-full h-12 pl-10 pr-4 rounded-2xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="Priya Sharma" />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
                <input type="email" {...register("email")} className="w-full h-12 pl-10 pr-4 rounded-2xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
                <input type="tel" {...register("phone")} className="w-full h-12 pl-10 pr-4 rounded-2xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="+91 98765 43210" />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
                <input type={showPassword ? "text" : "password"} {...register("password")} className="w-full h-12 pl-10 pr-12 rounded-2xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="At least 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
                <input type="password" {...register("confirmPassword")} className="w-full h-12 pl-10 pr-4 rounded-2xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="Repeat your password" />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" {...register("agreedToTerms")} className="mt-1 rounded" />
                <span className="text-xs text-[#8C8B80]">I agree to the Terms of Service and Privacy Policy</span>
              </label>
              {errors.agreedToTerms && <p className="text-xs text-red-500">{errors.agreedToTerms.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition-all disabled:opacity-50 mt-4"
              style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-[#8C8B80]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: "#FF7A00" }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function SellerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/seller-dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1C1B14] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white font-black text-base" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
            BB
          </div>
          <h1 className="text-2xl font-bold text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Seller Portal Sign In</h1>
          <p className="text-xs text-[#8C8B80] mt-1">Manage your artisan store & orders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1B14] mb-1">Seller Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="meena@handicrafts.com" className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1C1B14] mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
          </div>

          <button type="submit" disabled={loading} className="w-full h-11 rounded-xl text-white font-bold text-sm shadow-md" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
            {loading ? "Logging in..." : "Enter Seller Dashboard"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#F5F4F0] text-center text-xs text-[#8C8B80]">
          Not a registered seller yet?{" "}
          <Link href="/seller-register" className="font-semibold text-[#FF7A00] hover:underline">Apply for Seller Account</Link>
        </div>
      </motion.div>
    </div>
  );
}
