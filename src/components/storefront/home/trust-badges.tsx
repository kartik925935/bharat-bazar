export function TrustBadges() {
  const features = [
    { icon: '🛡️', title: 'Verified Sellers', desc: 'Every seller KYC verified with Aadhaar & PAN' },
    { icon: '💳', title: 'Secure Payments', desc: 'Razorpay secured with bank-grade encryption' },
    { icon: '↩️', title: 'Easy Returns', desc: '7-day hassle-free return policy on all products' },
    { icon: '🚚', title: 'Pan-India Delivery', desc: 'Delivering to every pincode across India' },
  ];

  return (
    <section className="py-16 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 bg-white rounded-2xl border border-black/5 hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="font-semibold text-[#1C1B14] mb-2">{feature.title}</h4>
              <p className="text-sm text-[#8C8B80] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
