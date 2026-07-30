import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { mockSellers } from '@/lib/mock/sellers';

export function SellerStories() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1A9E4E] to-[#0D7A3B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">Every Purchase Tells a Story</h2>
          <p className="text-white/70 text-lg">Meet the hands behind the craft</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {mockSellers.map((seller) => (
            <div
              key={seller.id}
              className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden bg-white/20 flex items-center justify-center text-2xl">
                  {seller.type === 'ngo' ? '🏛️' : seller.type === 'village_producer' ? '🌾' : '🎨'}
                </div>
                <div>
                  <div className="font-semibold text-white">{seller.displayName}</div>
                  <div className="text-white/60 text-sm">📍 {seller.location}, {seller.state}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-white">
                    {seller.type}
                  </span>
                </div>
              </div>
              <blockquote className="text-white/80 italic text-sm leading-relaxed mb-4">
                &quot;{seller.quote}&quot;
              </blockquote>
              <Link
                href={`/seller/${seller.username}`}
                className="text-sm font-semibold text-white hover:text-yellow-300 transition-colors flex items-center gap-1 group"
              >
                Visit Shop <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/seller-registration"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-2xl font-semibold text-sm text-[#1A9E4E] hover:scale-105 transition-all shadow-lg"
          >
            Start Selling on Bharat Bazaar <ArrowRight size={16} />
          </Link>
          <p className="text-white/50 text-sm mt-3">Join 50,000+ sellers empowering India</p>
        </div>
      </div>
    </section>
  );
}
