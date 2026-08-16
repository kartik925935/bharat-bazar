'use client';
import Link from 'next/link';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";

// ============================================================
// FAQ Page
// ============================================================
const FAQ_DATA = [
  {
    category: "Orders & Delivery",
    icon: "📦",
    items: [
      { q: "How long does delivery take?", a: "Standard delivery takes 5-7 business days for most locations. Express delivery (2-3 days) is available at checkout for ₹99. Remote areas may take up to 10 days. You'll get a tracking link via SMS as soon as your order is shipped." },
      { q: "How do I track my order?", a: "Go to My Orders → click on your order → you'll see a live tracking timeline. You'll also receive SMS/email updates at every step. You can also use our Track Order page with just your order ID." },
      { q: "Can I change or cancel my order?", a: "You can cancel your order within 1 hour of placing it. After that, if the seller has accepted the order, cancellation may not be possible. To cancel, go to My Orders → Order Details → Cancel Order. Refunds are processed within 3-5 business days." },
      { q: "My order shows delivered but I didn't receive it — what do I do?", a: "Please check with neighbors or your building's security first. If still not found, contact us within 48 hours of the marked delivery time via the Contact page or live chat. We'll investigate and resolve it within 2-3 business days." },
    ],
  },
  {
    category: "Returns & Refunds",
    icon: "↩️",
    items: [
      { q: "What is your return policy?", a: "We offer a 10-day return policy on most products. Exceptions include perishables (spices, organic foods), personalized/customized items, and intimate apparel. The item must be unused, unwashed, and in its original packaging with all tags intact." },
      { q: "How long does a refund take?", a: "Once we receive and verify the returned item, refunds are processed within 3-5 business days. The amount will be credited to your original payment method. UPI/card refunds appear faster than bank transfer refunds." },
      { q: "Who pays for return shipping?", a: "If the return is due to a defective or incorrect item, we cover the pickup cost. If you're returning due to a change of mind, a return shipping fee of ₹49 will be deducted from your refund. We offer free doorstep pickup for all returns." },
      { q: "Can I exchange a product instead of returning?", a: "Yes! Exchanges are available for size or color variants of the same product, subject to availability. Go to My Orders → Request Exchange. If the variant is unavailable, you'll receive a full refund." },
    ],
  },
  {
    category: "Payments",
    icon: "💳",
    items: [
      { q: "What payment methods do you accept?", a: "We accept UPI (Google Pay, PhonePe, Paytm, BHIM), all major credit/debit cards (Visa, Mastercard, RuPay, Amex), Net Banking for 50+ banks, wallets (Paytm, Freecharge), and EMI options for orders above ₹3,000." },
      { q: "Is my payment information secure?", a: "Absolutely. All payments are processed via Razorpay, which is PCI DSS Level 1 compliant — the highest level of payment security. We never store your card details on our servers. All transactions use 256-bit SSL encryption." },
      { q: "My payment failed but money was deducted — what happens?", a: "This sometimes happens due to bank delays. The amount is typically auto-reversed to your account within 5-7 business days. If it doesn't, please contact us with your order ID and payment screenshot and we'll resolve it within 2 business days." },
    ],
  },
  {
    category: "Sellers & Products",
    icon: "🏪",
    items: [
      { q: "How do I know products are authentic?", a: "Every seller on Bharat Bazaar is manually verified by our team before listing products. We check their craft credentials, GI tag certificates where applicable, and conduct quality audits. Look for the 'Verified Artisan' badge on product pages." },
      { q: "Can I communicate with the seller directly?", a: "Yes! You can message a seller through the product page or order page. Sellers typically respond within 2-4 hours. For custom orders or bulk purchases, messaging the seller directly is recommended." },
      { q: "How do I become a seller?", a: "Visit our Sell on Bharat Bazaar page and complete the 5-step registration. You'll need: your Aadhaar card, bank account details, and a few product photos. Our team reviews applications within 24-48 hours. It's completely free to join!" },
    ],
  },
  {
    category: "Account & Profile",
    icon: "👤",
    items: [
      { q: "How do I reset my password?", a: "Go to the Login page → Forgot Password → enter your email. You'll receive a password reset link within 2 minutes. If you don't see the email, check your spam folder. The link expires after 24 hours." },
      { q: "Can I have multiple accounts?", a: "We recommend having one account per email address. However, you can have separate buyer and seller accounts. Note: creating multiple accounts to misuse coupons or offers violates our Terms of Service." },
    ],
  },
];

export function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", ...FAQ_DATA.map(c => c.category)];
  const filtered = FAQ_DATA.filter(cat => activeCategory === "All" || cat.category === activeCategory).map(cat => ({
    ...cat,
    items: cat.items.filter(item => !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-0">
      {/* Hero */}
      <section className="py-16 bg-white border-b border-black/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-5xl mb-4">💬</div>
            <h1 className="text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 900 }}>Frequently Asked Questions</h1>
            <p className="text-[#8C8B80] mb-8">Find quick answers to common questions about shopping on Bharat Bazaar</p>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
              <input type="text" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full h-12 pl-11 pr-5 rounded-2xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-black/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "text-white" : "bg-[#F5F4F0] text-[#555449] hover:bg-[#FFF8F0]"}`}
                style={activeCategory === cat ? { background: "linear-gradient(135deg, #FF7A00, #FF4500)" } : {}}>
                {cat !== "All" && FAQ_DATA.find(c => c.category === cat)?.icon} {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-10 max-w-3xl mx-auto px-4 sm:px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16"><div className="text-5xl mb-4">🤔</div><p className="text-[#8C8B80]">No results found. Try a different search.</p></div>
        ) : filtered.map(cat => (
          <div key={cat.category} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{cat.icon}</span>
              <h3 className="font-bold text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{cat.category}</h3>
            </div>
            <div className="space-y-2">
              {cat.items.map((item, i) => {
                const key = `${cat.category}-${i}`;
                const isOpen = openItem === key;
                return (
                  <div key={i} className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                    <button onClick={() => setOpenItem(isOpen ? null : key)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[#FAFAF8] transition-colors">
                      <span className="font-semibold text-[#1C1B14] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.q}</span>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="shrink-0">
                        <ChevronDown size={18} className="text-[#8C8B80]" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-5 pb-5 text-sm text-[#555449] leading-relaxed border-t border-[#F5F4F0] pt-4">{item.a}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still need help? */}
        <div className="mt-10 bg-white rounded-3xl border border-black/5 p-8 text-center">
          <div className="text-4xl mb-3">🙋</div>
          <h3 className="font-bold text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Still have questions?</h3>
          <p className="text-sm text-[#8C8B80] mb-5">Our support team is available 9AM – 9PM IST, 7 days a week</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/contact" className="px-6 py-3 rounded-2xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>Contact Support</a>
            <button className="px-6 py-3 rounded-2xl text-sm font-semibold border border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00] transition-all">💬 Live Chat</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// Privacy Policy Page
// ============================================================
export function PrivacyPolicyPage() {
  const sections = [
    { title: "Information We Collect", content: "We collect information you provide directly (name, email, phone, address), information from your use of our services (browsing history, purchase history, device information), and information from third parties (social login providers, payment processors)." },
    { title: "How We Use Your Information", content: "We use your information to process orders and payments, communicate about your orders, personalize your shopping experience, send promotional communications (with your consent), improve our platform, and comply with legal obligations." },
    { title: "Information Sharing", content: "We share your information with sellers (to fulfill orders), delivery partners (to ship packages), payment processors (Razorpay), and analytics providers. We never sell your personal information to third parties." },
    { title: "Data Security", content: "We use industry-standard security measures including SSL encryption, secure servers, and regular security audits. However, no online system is 100% secure. We encourage you to use strong passwords and keep your account credentials private." },
    { title: "Cookies", content: "We use cookies to remember your preferences, keep you logged in, and analyze site traffic. You can control cookie settings through your browser. Disabling cookies may affect some features of our platform." },
    { title: "Your Rights", content: "You have the right to access, correct, or delete your personal data. You can opt out of marketing communications at any time. To exercise these rights, contact us at privacy@bharatbazaar.com." },
    { title: "Children's Privacy", content: "Our platform is not intended for children under 13. We do not knowingly collect information from children under 13. If we discover such data has been collected, we will delete it immediately." },
    { title: "Changes to This Policy", content: "We may update this policy periodically. We'll notify you of significant changes via email or a prominent notice on our platform. The date at the top of this page indicates when it was last updated." },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "2rem", fontWeight: 900 }}>Privacy Policy</h1>
          <p className="text-sm text-[#8C8B80]">Last updated: December 1, 2024</p>
        </div>
        <div className="bg-[#FFF8F0] border border-[#FFD4A8] rounded-2xl p-5 mb-8">
          <p className="text-sm text-[#555449] leading-relaxed">Your privacy is important to us at Bharat Bazaar. This policy explains what personal data we collect, why we collect it, and how we use and protect it.</p>
        </div>
        <div className="space-y-6">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl border border-black/5 p-6">
              <h3 className="font-bold text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{i + 1}. {section.title}</h3>
              <p className="text-sm text-[#555449] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-[#8C8B80]">Questions? Contact us at <span style={{ color: "#FF7A00" }}>privacy@bharatbazaar.com</span></p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Terms of Service Page
// ============================================================
export function TermsPage() {
  const sections = [
    { title: "Acceptance of Terms", content: "By accessing or using Bharat Bazaar, you agree to these Terms. If you do not agree, please do not use our platform. These Terms apply to all users including buyers, sellers, and visitors." },
    { title: "User Accounts", content: "You must be 18+ to create an account. You are responsible for maintaining your account security and all activities under your account. Provide accurate, current information and update it as needed." },
    { title: "Buying on Bharat Bazaar", content: "When you purchase from Bharat Bazaar, you enter a contract with the individual seller, not with Bharat Bazaar. We act as a marketplace facilitator. Prices are set by sellers. We reserve the right to cancel orders that appear fraudulent." },
    { title: "Selling on Bharat Bazaar", content: "Sellers must comply with all applicable laws including tax regulations (GST where applicable). Products must be as described. Counterfeit, prohibited, or misrepresented products will result in immediate account termination." },
    { title: "Intellectual Property", content: "All content on Bharat Bazaar (logos, design, text) is our intellectual property. Sellers retain ownership of their product photos and descriptions but grant us a license to use them on our platform." },
    { title: "Prohibited Activities", content: "You may not: misuse coupons or referral programs, create fake reviews, impersonate others, attempt to access unauthorized systems, use our platform for illegal activities, or engage in price manipulation." },
    { title: "Limitation of Liability", content: "Bharat Bazaar is not liable for direct or indirect damages arising from your use of the platform beyond the amount you paid for the specific order in question. We provide the platform 'as is' without warranties." },
    { title: "Governing Law", content: "These Terms are governed by Indian law. Disputes are subject to the exclusive jurisdiction of courts in Bangalore, Karnataka, India." },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "2rem", fontWeight: 900 }}>Terms of Service</h1>
          <p className="text-sm text-[#8C8B80]">Last updated: December 1, 2024</p>
        </div>
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl border border-black/5 p-6">
              <h3 className="font-bold text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{i + 1}. {section.title}</h3>
              <p className="text-sm text-[#555449] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Shipping Policy Page
// ============================================================
export function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "2rem", fontWeight: 900 }}>Shipping Policy 🚚</h1>
        <p className="text-sm text-[#8C8B80] mb-8">Last updated: December 1, 2024</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: "🆓", title: "Free Shipping", desc: "On all orders above ₹500" },
            { icon: "⚡", title: "Express Delivery", desc: "2-3 days for ₹99 extra" },
            { icon: "🇮🇳", title: "Pan India", desc: "We ship to all 28 states" },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl border border-black/5 p-5 text-center">
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="font-semibold text-[#1C1B14] text-sm mb-1">{item.title}</div>
              <div className="text-xs text-[#8C8B80]">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {[
            { title: "Delivery Timelines", content: "Standard: 5-7 business days · Express: 2-3 days (₹99) · Remote areas: up to 10 days. Orders placed before 12 PM are processed same day." },
            { title: "Shipping Charges", content: "Free on orders ₹500+. Orders below ₹500: ₹40 flat fee. Express delivery: ₹99 regardless of order value. Multiple items from the same seller ship together." },
            { title: "Tracking", content: "You'll receive a tracking SMS as soon as your order ships. Track via My Orders page or directly on the courier's website using the AWB number provided." },
            { title: "Damaged in Transit", content: "If your package arrives damaged, please photograph it before opening. Contact us within 48 hours with photos. We'll arrange a replacement or refund at no cost to you." },
            { title: "Undelivered Orders", content: "If delivery fails 3 times, the package is returned to the seller. You'll be refunded the product cost minus ₹50 return shipping fee. To reschedule, contact us within 24 hours of the first attempt." },
            { title: "International Shipping", content: "Currently, we ship only within India. International shipping is coming soon. Stay tuned!" },
          ].map((section, i) => (
            <div key={i} className="bg-white rounded-2xl border border-black/5 p-6">
              <h3 className="font-bold text-[#1C1B14] mb-2 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{section.title}</h3>
              <p className="text-sm text-[#555449] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Returns & Refund Policy
// ============================================================
export function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">↩️</div>
          <h1 className="text-3xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Returns & Refund Policy</h1>
          <p className="text-[#8C8B80] text-sm">Last updated: December 1, 2024</p>
        </div>
        <div className="space-y-4">
          {[
            { title: "Return Window", content: "Most items can be returned within 10 days of delivery. Some categories — food products, customized/personalized items, digital goods, and hygiene products — are non-returnable. Each product page shows whether it's eligible for return." },
            { title: "Return Conditions", content: "Items must be returned in original condition: unused, unwashed, with original tags and packaging. For defective or wrong items, we accept returns regardless of whether the packaging is intact." },
            { title: "How to Initiate a Return", content: "Go to My Orders → Select the order → Click 'Return Item' → Select reason → Schedule pickup. A courier will arrive at your address within 2-3 business days. You don't need to visit any courier office." },
            { title: "Refund Timeline", content: "Once we receive the item and it passes quality check, refunds are processed within 5-7 business days. The amount is credited to your original payment method (UPI/card/wallet). COD refunds go to your bank account or Bharat Bazaar wallet." },
            { title: "Replacement Policy", content: "For defective or wrong items, you can choose a replacement instead of a refund. Replacement is shipped from the seller within 2-3 days of the return being received and approved." },
            { title: "Seller Return Policies", content: "Some sellers on Bharat Bazaar may have additional return policies which are shown on their product pages. These policies are in addition to (not instead of) the Bharat Bazaar baseline return policy." },
            { title: "Non-Returnable Items", content: "The following cannot be returned: perishable goods (food, fresh flowers), undergarments, swimwear, custom-made/personalized items, digital downloads, and items explicitly marked 'Non-Returnable' on the product page." },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-black/5 p-6">
              <h3 className="font-bold text-[#1C1B14] mb-2 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.title}</h3>
              <p className="text-sm text-[#555449] leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Cookie Policy
// ============================================================
export function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🍪</div>
          <h1 className="text-3xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cookie Policy</h1>
          <p className="text-[#8C8B80] text-sm">Last updated: December 1, 2024</p>
        </div>
        <div className="space-y-4">
          {[
            { title: "What Are Cookies?", content: "Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, keep you logged in, and understand how you use our platform to improve your experience." },
            { title: "Essential Cookies", content: "These are required for the website to function. They include login session cookies, shopping cart data, and security tokens. You cannot opt out of essential cookies while using our services." },
            { title: "Analytics Cookies", content: "We use analytics cookies (such as Google Analytics) to understand which pages are visited, how long users stay, and what actions they take. This helps us improve our platform. This data is anonymized." },
            { title: "Marketing Cookies", content: "These cookies help us show you relevant advertisements on third-party platforms. We use them to understand the effectiveness of our marketing campaigns. You can opt out via our Cookie Preferences." },
            { title: "Preference Cookies", content: "These remember your settings like language, region, and display preferences so you don't have to re-configure them on every visit." },
            { title: "Managing Cookies", content: "You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that blocking essential cookies may affect the functionality of our website." },
            { title: "Third-Party Cookies", content: "We use services from Google, Meta, and Razorpay which may set their own cookies. These are governed by their respective privacy policies. We encourage you to read those policies." },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-black/5 p-6">
              <h3 className="font-bold text-[#1C1B14] mb-2 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.title}</h3>
              <p className="text-sm text-[#555449] leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Sitemap
// ============================================================
export function SitemapPage() {
  const sections = [
    { title: "🛍️ Shopping", links: [{ label: "All Products", href: "/products" }, { label: "Categories", href: "/products" }, { label: "Flash Sale", href: "/flash-sale" }, { label: "All Offers", href: "/offers" }, { label: "Search", href: "/search" }] },
    { title: "👤 My Account", links: [{ label: "Dashboard", href: "/dashboard" }, { label: "My Orders", href: "/orders" }, { label: "My Wishlist", href: "/wishlist" }, { label: "My Reviews", href: "/my-reviews" }, { label: "My Coupons", href: "/coupons" }, { label: "Addresses", href: "/addresses" }, { label: "Returns", href: "/returns" }, { label: "Refunds", href: "/refunds" }] },
    { title: "⚙️ Account Settings", links: [{ label: "Profile Settings", href: "/profile" }, { label: "Change Password", href: "/change-password" }, { label: "Preferences", href: "/preferences" }, { label: "Notification Settings", href: "/notification-preferences" }, { label: "Account Security", href: "/security" }] },
    { title: "🤝 Help & Support", links: [{ label: "Help Center", href: "/help" }, { label: "Contact Us", href: "/contact" }, { label: "My Support Tickets", href: "/support" }, { label: "Track Order", href: "/track" }, { label: "FAQ", href: "/faq" }] },
    { title: "📋 Policies", links: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms & Conditions", href: "/terms" }, { label: "Shipping Policy", href: "/shipping-policy" }, { label: "Returns Policy", href: "/returns-policy" }, { label: "Cookie Policy", href: "/cookie-policy" }] },
    { title: "🏪 Sellers", links: [{ label: "Become a Seller", href: "/seller-register" }, { label: "Seller Dashboard", href: "/seller-dashboard" }, { label: "Blog & Stories", href: "/blog" }, { label: "About Bharat Bazaar", href: "/about" }] },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sitemap</h1>
          <p className="text-[#8C8B80]">Find every page on Bharat Bazaar</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map(sec => (
            <div key={sec.title} className="bg-white rounded-2xl border border-black/5 p-5">
              <div className="font-bold text-sm text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{sec.title}</div>
              <ul className="space-y-1.5">
                {sec.links.map(l => (
                  <li key={l.href}>
                    <a href={l.href} className="text-sm text-[#555449] hover:text-[#FF7A00] transition-colors flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#D4D3CB] shrink-0" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
