'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle, AlertTriangle, Globe, Bell, Smartphone, Mail, Lock, Trash2, ChevronRight } from "lucide-react";
import { CustomerAccountLayout } from "./CustomerDashboard";

export function ChangePasswordPage() {
  const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const match = form.newPw === form.confirm && form.confirm.length > 0;

  return (
    <CustomerAccountLayout title="Change Password">
      <div className="max-w-lg">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Change Password</h2>

        {saved && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-sm text-[#1A9E4E] font-medium">
            <CheckCircle size={16} /> Password updated successfully!
          </motion.div>
        )}

        <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Current Password</label>
            <div className="relative">
              <input type={showCurrent ? "text" : "password"} value={form.current} onChange={e => set("current", e.target.value)}
                placeholder="Enter current password" className="w-full h-11 px-4 pr-11 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
              <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0AFA5]">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Link href="/forgot-password" className="text-xs mt-1 block" style={{ color: "#FF7A00" }}>Forgot your password?</Link>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">New Password</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} value={form.newPw} onChange={e => set("newPw", e.target.value)}
                placeholder="At least 8 characters" className="w-full h-11 px-4 pr-11 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
              <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0AFA5]">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.newPw.length > 0 && (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex gap-1 flex-1">
                  {[0,1,2].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${form.newPw.length >= (i+1)*3 ? "bg-[#FF7A00]" : "bg-[#F5F4F0]"}`} />)}
                </div>
                <span className="text-xs text-[#8C8B80]">{form.newPw.length < 4 ? "Weak" : form.newPw.length < 8 ? "Fair" : "Strong"}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Confirm New Password</label>
            <input type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)}
              placeholder="Repeat new password"
              className={`w-full h-11 px-4 rounded-xl border-2 outline-none text-sm ${form.confirm.length > 0 ? (match ? "border-[#1A9E4E]" : "border-red-400") : "border-[#D4D3CB] focus:border-[#FF7A00]"}`} />
            {form.confirm.length > 0 && !match && <p className="text-xs text-red-500 mt-1">Passwords don't match</p>}
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setSaved(true)}
          className="mt-5 px-8 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          Update Password
        </motion.button>
      </div>
    </CustomerAccountLayout>
  );
}

export function ChangeEmailPage() {
  const [step, setStep] = useState<"form" | "otp" | "done">("form");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <CustomerAccountLayout title="Change Email">
      <div className="max-w-lg">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Change Email Address</h2>

        <div className="bg-white rounded-2xl border border-black/5 p-6">
          <div className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-xl mb-5">
            <Mail size={16} className="text-[#8C8B80]" />
            <div>
              <div className="text-xs text-[#8C8B80]">Current email</div>
              <div className="text-sm font-medium text-[#1C1B14]">priya.sharma@gmail.com</div>
            </div>
          </div>

          {step === "form" && (
            <>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">New Email Address</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="new@example.com"
                  className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => newEmail && setStep("otp")}
                className="w-full h-11 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                Send Verification Code
              </motion.button>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="text-sm text-[#555449] mb-4">Enter the 6-digit code sent to <strong>{newEmail}</strong></div>
              <div className="mb-5">
                <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000"
                  className="w-full h-14 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-center text-2xl font-mono tracking-widest" />
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => otp.length === 6 && setStep("done")}
                className="w-full h-11 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                Verify & Update
              </motion.button>
              <button onClick={() => {}} className="w-full text-center text-xs text-[#8C8B80] mt-3 hover:text-[#FF7A00]">Resend code</button>
            </>
          )}

          {step === "done" && (
            <div className="text-center py-4">
              <CheckCircle size={40} className="text-[#1A9E4E] mx-auto mb-3" />
              <div className="font-bold text-[#1C1B14] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email Updated!</div>
              <div className="text-sm text-[#8C8B80]">Your new email is now <strong>{newEmail}</strong></div>
            </div>
          )}
        </div>
      </div>
    </CustomerAccountLayout>
  );
}

export function ChangePhonePage() {
  const [step, setStep] = useState<"form" | "otp" | "done">("form");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <CustomerAccountLayout title="Change Phone">
      <div className="max-w-lg">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Change Phone Number</h2>

        <div className="bg-white rounded-2xl border border-black/5 p-6">
          <div className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-xl mb-5">
            <Smartphone size={16} className="text-[#8C8B80]" />
            <div>
              <div className="text-xs text-[#8C8B80]">Current phone</div>
              <div className="text-sm font-medium text-[#1C1B14]">+91 98765 43210</div>
            </div>
          </div>

          {step === "form" && (
            <>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">New Phone Number</label>
                <div className="flex gap-2">
                  <div className="h-11 px-3 rounded-xl border-2 border-[#D4D3CB] flex items-center text-sm text-[#555449] shrink-0">🇮🇳 +91</div>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210"
                    className="flex-1 h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => phone && setStep("otp")}
                className="w-full h-11 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                Send OTP
              </motion.button>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="text-sm text-[#555449] mb-4">Enter the OTP sent to <strong>+91 {phone}</strong></div>
              <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000"
                className="w-full h-14 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-center text-2xl font-mono tracking-widest mb-4" />
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => otp.length === 6 && setStep("done")}
                className="w-full h-11 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                Verify & Update
              </motion.button>
            </>
          )}

          {step === "done" && (
            <div className="text-center py-4">
              <CheckCircle size={40} className="text-[#1A9E4E] mx-auto mb-3" />
              <div className="font-bold text-[#1C1B14] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Phone Updated!</div>
              <div className="text-sm text-[#8C8B80]">Your new phone number has been saved</div>
            </div>
          )}
        </div>
      </div>
    </CustomerAccountLayout>
  );
}

export function DeleteAccountPage() {
  const [step, setStep] = useState<"confirm" | "reason" | "done">("confirm");
  const [reason, setReason] = useState("");
  const [typed, setTyped] = useState("");
  const router = useRouter();

  const reasons = [
    "I no longer shop online",
    "I'm not satisfied with the products",
    "I have privacy concerns",
    "I have too many accounts",
    "Other",
  ];

  return (
    <CustomerAccountLayout title="Delete Account">
      <div className="max-w-lg">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Delete Account</h2>

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>This action is permanent</div>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    <li>All your order history will be deleted</li>
                    <li>Your wishlist and saved addresses will be removed</li>
                    <li>Any pending refunds will still be processed</li>
                    <li>You cannot undo this action</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <div className="text-sm text-[#555449] mb-4">Before you go, consider:</div>
              <div className="space-y-2">
                <Link href="/preferences" className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAFAF8] transition-all">
                  <span className="text-sm text-[#1C1B14]">Update notification settings</span>
                  <ChevronRight size={16} className="text-[#B0AFA5]" />
                </Link>
                <Link href="/support/new" className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAFAF8] transition-all">
                  <span className="text-sm text-[#1C1B14]">Contact support for help</span>
                  <ChevronRight size={16} className="text-[#B0AFA5]" />
                </Link>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep("reason")}
              className="w-full h-12 rounded-xl border-2 border-red-400 text-red-600 font-semibold text-sm hover:bg-red-50 transition-all">
              I want to delete my account
            </motion.button>
          </div>
        )}

        {step === "reason" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <div className="font-semibold text-[#1C1B14] mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Why are you leaving?</div>
              <div className="space-y-2 mb-5">
                {reasons.map(r => (
                  <button key={r} onClick={() => setReason(r)}
                    className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${reason === r ? "border-[#FF7A00] bg-[#FFF8F0] text-[#1C1B14]" : "border-[#D4D3CB] text-[#555449]"}`}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Type "DELETE" to confirm</label>
                <input value={typed} onChange={e => setTyped(e.target.value)} placeholder="DELETE"
                  className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-red-400 outline-none text-sm font-mono tracking-widest" />
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => typed === "DELETE" && reason && setStep("done")}
                className="w-full h-11 rounded-xl font-semibold text-sm transition-all"
                style={{ background: typed === "DELETE" && reason ? "#DC2626" : "#F5F4F0", color: typed === "DELETE" && reason ? "white" : "#B0AFA5" }}>
                Permanently Delete Account
              </motion.button>
            </div>
            <button onClick={() => setStep("confirm")} className="w-full text-sm text-[#8C8B80] hover:text-[#1C1B14] transition-colors">Cancel</button>
          </div>
        )}

        {step === "done" && (
          <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
            <div className="text-4xl mb-4">👋</div>
            <h3 className="font-bold text-xl text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Account Deleted</h3>
            <p className="text-sm text-[#8C8B80] mb-6">Your account and data have been permanently deleted. We're sorry to see you go.</p>
            <Link href="/" className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
              Back to Homepage
            </Link>
          </div>
        )}
      </div>
    </CustomerAccountLayout>
  );
}

export function PreferencesPage() {
  const [prefs, setPrefs] = useState({
    language: "en",
    region: "IN",
    currency: "INR",
    theme: "light",
  });
  const [saved, setSaved] = useState(false);
  const set = (k: string, v: string) => setPrefs(p => ({ ...p, [k]: v }));

  return (
    <CustomerAccountLayout title="Preferences">
      <div className="max-w-lg">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Account Preferences</h2>

        {saved && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-sm text-[#1A9E4E] font-medium">
            <CheckCircle size={16} /> Preferences saved!
          </motion.div>
        )}

        <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <Globe size={18} style={{ color: "#FF7A00" }} />
            <span className="font-semibold text-[#1C1B14] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Language & Region</span>
          </div>

          {[
            { key: "language", label: "Language", options: [{ value: "en", label: "English" }, { value: "hi", label: "हिन्दी" }, { value: "ta", label: "தமிழ்" }, { value: "te", label: "తెలుగు" }, { value: "mr", label: "मराठी" }] },
            { key: "region", label: "Region", options: [{ value: "IN", label: "India" }] },
            { key: "currency", label: "Currency", options: [{ value: "INR", label: "₹ Indian Rupee (INR)" }] },
          ].map(({ key, label, options }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">{label}</label>
              <select value={prefs[key as keyof typeof prefs]} onChange={e => set(key, e.target.value)}
                className="w-full h-11 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm bg-white">
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}

          <div className="border-t border-[#F5F4F0] pt-5">
            <div className="text-xs font-semibold text-[#1C1B14] mb-3">Theme</div>
            <div className="flex gap-3">
              {[{ value: "light", label: "☀️ Light" }, { value: "dark", label: "🌙 Dark" }, { value: "system", label: "💻 System" }].map(t => (
                <button key={t.value} onClick={() => set("theme", t.value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${prefs.theme === t.value ? "border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0]" : "border-[#D4D3CB] text-[#555449]"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setSaved(true)}
          className="mt-5 px-8 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          Save Preferences
        </motion.button>
      </div>
    </CustomerAccountLayout>
  );
}

export function NotificationPreferencesPage() {
  const [prefs, setPrefs] = useState({
    orders: true, payments: true, shipping: true, returns: true,
    offers: true, reviews: false, newsletter: false, sms: true, whatsapp: true,
  });
  const [saved, setSaved] = useState(false);
  const toggle = (k: string) => setPrefs(p => ({ ...p, [k]: !p[k as keyof typeof p] }));

  const sections = [
    {
      title: "Activity Notifications",
      items: [
        { key: "orders", label: "Order updates", desc: "New orders, confirmations, and status changes" },
        { key: "payments", label: "Payment notifications", desc: "Payment confirmations and refunds" },
        { key: "shipping", label: "Shipping & delivery", desc: "Dispatch and delivery updates" },
        { key: "returns", label: "Returns & refunds", desc: "Return request status and refund updates" },
      ],
    },
    {
      title: "Marketing & Offers",
      items: [
        { key: "offers", label: "Deals & offers", desc: "Sales, discounts, and personalized deals" },
        { key: "reviews", label: "Review reminders", desc: "Reminders to review purchased products" },
        { key: "newsletter", label: "Newsletter", desc: "Weekly curated artisan stories and products" },
      ],
    },
    {
      title: "Communication Channels",
      items: [
        { key: "sms", label: "SMS notifications", desc: "Receive updates via SMS" },
        { key: "whatsapp", label: "WhatsApp notifications", desc: "Receive updates on WhatsApp" },
      ],
    },
  ];

  return (
    <CustomerAccountLayout title="Notification Preferences">
      <div className="max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notification Preferences</h2>
          <Bell size={20} style={{ color: "#FF7A00" }} />
        </div>

        {saved && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-sm text-[#1A9E4E] font-medium">
            <CheckCircle size={16} /> Preferences saved!
          </motion.div>
        )}

        <div className="space-y-4">
          {sections.map(sec => (
            <div key={sec.title} className="bg-white rounded-2xl border border-black/5 p-5">
              <div className="font-semibold text-[#1C1B14] text-sm mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{sec.title}</div>
              <div className="space-y-4">
                {sec.items.map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-[#1C1B14]">{label}</div>
                      <div className="text-xs text-[#8C8B80]">{desc}</div>
                    </div>
                    <button onClick={() => toggle(key)}
                      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${prefs[key as keyof typeof prefs] ? "bg-[#1A9E4E]" : "bg-[#D4D3CB]"}`}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${prefs[key as keyof typeof prefs] ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setSaved(true)}
          className="mt-5 px-8 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          Save Preferences
        </motion.button>
      </div>
    </CustomerAccountLayout>
  );
}
