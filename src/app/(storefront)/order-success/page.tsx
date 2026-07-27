import Link from 'next/link';
import { CheckCircle2, ArrowRight, Package } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-black/5 shadow-sm text-center max-w-md mx-4">
        <div className="w-16 h-16 rounded-full bg-green-100 text-[#1A9E4E] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} />
        </div>

        <h1 className="text-2xl font-bold text-[#1C1B14] mb-2">Order Confirmed!</h1>
        <p className="text-xs text-[#8C8B80] mb-6">
          Thank you for supporting Indian artisans. Order ID: <strong className="text-[#1C1B14]">ORD-2024-009876</strong>
        </p>

        <div className="p-4 rounded-2xl bg-gray-50 text-xs text-left mb-6 space-y-1">
          <div>📦 <strong>Estimated Delivery</strong>: Within 3-5 business days</div>
          <div>🚚 <strong>Shipping Partner</strong>: Blue Dart Express</div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/orders"
            className="w-full h-11 rounded-xl bg-[#1C1B14] text-white text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Package size={15} /> Track Your Order
          </Link>
          <Link
            href="/products"
            className="w-full h-11 rounded-xl border border-black/10 text-xs font-semibold text-[#555449] flex items-center justify-center gap-1 hover:bg-gray-50"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
