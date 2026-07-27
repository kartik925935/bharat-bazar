import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { mockCategories } from '@/lib/mock/categories';

export function CategoriesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1C1B14] mb-3">Shop by Category</h2>
          <p className="text-[#8C8B80]">From handwoven textiles to organic foods — find your craft</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center text-center p-2 block"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="text-xs font-semibold text-[#1C1B14] group-hover:text-[#FF7A00] transition-colors leading-tight mb-0.5">
                {cat.name}
              </div>
              <div className="text-[10px] text-[#B0AFA5]">{cat.count.toLocaleString()} products</div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#FF7A00] text-[#FF7A00] font-semibold hover:bg-[#FFF8F0] transition-all text-sm"
          >
            View All Categories <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
