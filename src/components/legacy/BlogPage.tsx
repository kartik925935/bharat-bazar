'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, User, Tag, ArrowRight, ArrowLeft, Search, Share2, Bookmark, Heart } from "lucide-react";

const BLOG_POSTS = [
  {
    id: "1",
    slug: "story-of-bandhani",
    title: "The Story of Bandhani: 5000 Years of Tie-Dye Art",
    excerpt: "From the banks of the Indus to the markets of Jaipur — how Bandhani weaving survived millennia and continues to empower women artisans today.",
    content: `Bandhani, one of India's oldest textile arts, traces its origins to the Indus Valley Civilization. The word itself comes from the Sanskrit "Bandha," meaning to bind, tie, or knot.\n\nFor over 5000 years, artisans in Rajasthan and Gujarat have practiced this intricate tie-dye technique, creating mesmerizing patterns of dots, waves, and geometric designs on silk and cotton fabric.\n\n## The Process\n\nThe creation of a single Bandhani piece begins weeks before any dye touches the cloth. Skilled artisans — often women working from home — use their fingernails to pinch tiny portions of fabric and tie them with thread. A single saree can have over 100,000 such knots, each placed by hand with incredible precision.\n\nThe tied fabric is then dipped in successive dye baths, with each knot protecting the fabric beneath from absorbing color. When the threads are finally removed, the result is breathtaking — a constellation of tiny circles that form elaborate patterns.\n\n## A Living Tradition\n\nToday, thousands of artisan families in Jaipur, Jodhpur, Bhuj, and Ahmedabad continue this tradition. Bharat Bazaar has partnered with over 200 Bandhani artisans, ensuring they receive fair wages and direct market access.\n\n"Before joining Bharat Bazaar, I sold my sarees to middlemen for ₹500. Now I sell them directly for ₹1,500-2,000," says Meena Devi, a master Bandhani artisan from Jaipur's Kishan Pole Bazaar.`,
    category: "Craft Stories",
    author: "Priya Sharma",
    authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop",
    date: "Dec 15, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop",
    tags: ["Textiles", "Rajasthan", "Artisans", "Tradition"],
    featured: true,
  },
  {
    id: "2",
    slug: "pottery-jaipur-blue",
    title: "Jaipur Blue Pottery: A Persian Art That Became India's Own",
    excerpt: "How a 14th-century Persian import became one of Jaipur's most iconic crafts, and why it's now on the UNESCO heritage watchlist.",
    content: `Blue Pottery is one of those paradoxes that India loves — a craft with Persian and Afghan roots that has become so quintessentially Rajasthani that no trip to Jaipur is complete without bringing a piece home.\n\nThe craft arrived in India during the Mughal era, introduced by Mughal rulers who had seen it in Central Asia. Over centuries, Jaipur craftsmen absorbed and transformed the technique, creating something entirely new.\n\n## What Makes It Special\n\nUnlike most pottery, Jaipur Blue Pottery is not made from clay. Instead, it uses a special dough of quartz stone powder, powdered glass, Multani Mitti (Fuller's earth), borax, gum, and water. This makes each piece semi-transparent with a distinctive milky base.\n\nThe iconic blue color comes from cobalt oxide. But artisans also use other metal oxides to create turquoise, green, yellow, and white designs — all on that signature white base.`,
    category: "Craft Stories",
    author: "Rajan Mehta",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    date: "Dec 10, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1573408301185-9519f94816f3?w=800&auto=format&fit=crop",
    tags: ["Pottery", "Jaipur", "Heritage", "Craft"],
    featured: true,
  },
  {
    id: "3",
    slug: "seller-success-meena",
    title: "From ₹500 to ₹50,000 a Month: Meena's Journey",
    excerpt: "How one woman artisan from Rajasthan transformed her family's fortunes by selling on Bharat Bazaar — and what she learned along the way.",
    content: `Meena Devi never thought she would one day be running a business. For most of her life, she crafted Bandhani sarees in the traditional way her mother taught her, selling them to local traders for a fraction of their worth.\n\n"I would spend three weeks making one saree — sleeping late, waking early — and sell it for ₹500. The trader would sell it for ₹2,000 in the city. I knew the math was unfair, but I didn't know how to change it," she says.\n\nThat changed in 2023, when Bharat Bazaar's field team visited her village near Bagru, outside Jaipur. After a week of training on photography, pricing, and catalog creation, Meena listed her first products.`,
    category: "Seller Stories",
    author: "Anita Devi",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop",
    date: "Dec 5, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop",
    tags: ["Success Story", "Empowerment", "Rajasthan"],
    featured: false,
  },
  {
    id: "4",
    slug: "kashmir-saffron-harvest",
    title: "Kashmir Saffron: The World's Most Expensive Spice, Explained",
    excerpt: "Why one gram of Kashmiri saffron costs more than gold, how to spot fakes, and why buying directly from growers matters.",
    content: `Kashmir saffron — the crimson threads known locally as "Mongra" — is arguably the world's finest saffron. Grown only in the Pampore region near Srinagar, it commands prices of ₹2-3 lakh per kilogram, making it gram-for-gram more expensive than gold.\n\nBut what makes it so special? And why does it matter where you buy it?`,
    category: "Food & Spices",
    author: "Suresh Kumar",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
    date: "Nov 28, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1663325265966-0d17de3e85c5?w=800&auto=format&fit=crop",
    tags: ["Food", "Kashmir", "Spices", "Organic"],
    featured: false,
  },
  {
    id: "5",
    slug: "guide-buying-handloom",
    title: "The Complete Guide to Buying Authentic Handloom",
    excerpt: "How to tell powerloom from handloom, what GI tags mean, and why that extra ₹500 matters more than you think.",
    content: `Buying handloom in India can feel overwhelming. The market is flooded with powerloom imitations that look similar but cost a fraction — and not always in a good way. Here's your complete guide to making informed choices.`,
    category: "Buyer's Guide",
    author: "Priya Sharma",
    authorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop",
    date: "Nov 20, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop",
    tags: ["Guide", "Handloom", "Tips", "Shopping"],
    featured: false,
  },
  {
    id: "6",
    slug: "diwali-decor-ideas",
    title: "10 Artisan Decor Ideas for a Sustainable Diwali",
    excerpt: "Ditch the plastic, embrace the handmade — 10 beautiful decoration ideas that support Indian artisans and look stunning.",
    content: `Diwali, the festival of lights, is also increasingly a festival of thoughtful, intentional living. More and more families are choosing handmade, sustainable decorations — from hand-painted diyas to woven lanterns.`,
    category: "Lifestyle",
    author: "Anita Devi",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop",
    date: "Nov 10, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&auto=format&fit=crop",
    tags: ["Diwali", "Decor", "Sustainable", "Festival"],
    featured: false,
  },
];

const CATEGORIES = ["All", "Craft Stories", "Seller Stories", "Food & Spices", "Buyer's Guide", "Lifestyle"];

// Blog Listing Page
export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = BLOG_POSTS.filter(post => {
    const matchCat = activeCategory === "All" || post.category === activeCategory;
    const matchSearch = !searchQuery || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = BLOG_POSTS.filter(p => p.featured).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-0">
      {/* Hero */}
      <section className="py-16 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: "#FFF8F0", color: "#FF7A00" }}>📖 STORIES & INSIGHTS</span>
            <h1 className="text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900 }}>
              The Bharat Bazaar Journal
            </h1>
            <p className="text-[#8C8B80] text-lg max-w-xl mx-auto">Craft stories, seller journeys, buying guides, and the living traditions of India's artisan communities.</p>
          </motion.div>

          {/* Search */}
          <div className="max-w-lg mx-auto relative mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-5 rounded-2xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm bg-white"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "text-white" : "bg-white border border-black/10 text-[#555449] hover:border-[#FF7A00]"}`}
                style={activeCategory === cat ? { background: "linear-gradient(135deg, #FF7A00, #FF4500)" } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {activeCategory === "All" && !searchQuery && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-bold text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Featured Stories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={`/blog/${post.slug}`} className="block group">
                  <div className="relative rounded-3xl overflow-hidden aspect-[16/9] mb-4">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2" style={{ background: "#FF7A00" }}>{post.category}</span>
                      <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{post.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#8C8B80]">
                    <img src={post.authorAvatar} alt={post.author} className="w-6 h-6 rounded-full object-cover" />
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                    <span>·</span>
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!searchQuery && activeCategory === "All" && <h2 className="font-bold text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>All Articles</h2>}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-[#8C8B80]">No articles found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={`/blog/${post.slug}`} className="block bg-white rounded-2xl overflow-hidden border border-black/5 hover:shadow-lg transition-all hover:-translate-y-1 group">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#FFF8F0", color: "#FF7A00" }}>{post.category}</span>
                      <span className="text-xs text-[#B0AFA5] flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                    </div>
                    <h3 className="font-bold text-[#1C1B14] mb-2 line-clamp-2 group-hover:text-[#FF7A00] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{post.title}</h3>
                    <p className="text-sm text-[#8C8B80] line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-[#B0AFA5]">
                      <img src={post.authorAvatar} alt={post.author} className="w-5 h-5 rounded-full object-cover" />
                      <span>{post.author}</span>
                      <span>·</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Blog Detail Page
export function BlogDetailPage() {
  const { slug } = useParams();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];
  const related = BLOG_POSTS.filter(p => p.id !== post.id && p.category === post.category).slice(0, 3);

  const paragraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-0">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[300px] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3" style={{ background: "#FF7A00" }}>{post.category}</span>
              <h1 className="text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 800, lineHeight: 1.2 }}>{post.title}</h1>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                <span className="font-medium">{post.author}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <Clock size={14} />
                <span>{post.readTime}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10">
          {/* Article Content */}
          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {/* Back */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#8C8B80] hover:text-[#FF7A00] mb-8 transition-colors">
              <ArrowLeft size={15} /> Back to Journal
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-[#D4D3CB] text-[#555449]">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>

            {/* Body */}
            <div className="prose max-w-none">
              {paragraphs.map((para, i) => {
                if (para.startsWith("## ")) {
                  return <h2 key={i} className="text-[#1C1B14] mt-8 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.35rem", fontWeight: 700 }}>{para.replace("## ", "")}</h2>;
                }
                return <p key={i} className="text-[#555449] leading-relaxed mb-5 text-base">{para}</p>;
              })}
            </div>

            {/* Author Box */}
            <div className="mt-12 p-6 bg-white rounded-2xl border border-black/5 flex gap-4 items-start">
              <img src={post.authorAvatar} alt={post.author} className="w-14 h-14 rounded-full object-cover shrink-0" />
              <div>
                <div className="font-semibold text-[#1C1B14] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{post.author}</div>
                <div className="text-xs text-[#FF7A00] font-medium mb-2">Content Lead, Bharat Bazaar</div>
                <p className="text-sm text-[#8C8B80]">Writes about India's craft traditions, artisan communities, and the stories behind the things we buy.</p>
              </div>
            </div>

            {/* Like/Share */}
            <div className="mt-8 flex items-center gap-4">
              <button onClick={() => setLiked(l => !l)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${liked ? "border-red-200 bg-red-50 text-red-500" : "border-[#D4D3CB] text-[#555449] hover:border-red-200"}`}>
                <Heart size={15} fill={liked ? "currentColor" : "none"} />
                {liked ? "Liked!" : "Like"}
              </button>
              <button onClick={() => setBookmarked(b => !b)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${bookmarked ? "border-[#FF7A00] bg-[#FFF8F0] text-[#FF7A00]" : "border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00]"}`}>
                <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
                {bookmarked ? "Saved" : "Save"}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00] transition-all">
                <Share2 size={15} /> Share
              </button>
            </div>
          </motion.article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl border border-black/5 p-5">
                <h4 className="font-semibold text-[#1C1B14] mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>More Articles</h4>
                <div className="space-y-4">
                  {BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 4).map(p => (
                    <Link key={p.id} href={`/blog/${p.slug}`} className="block group">
                      <div className="text-xs font-bold mb-1" style={{ color: "#FF7A00" }}>{p.category}</div>
                      <div className="text-sm text-[#1C1B14] font-medium leading-snug group-hover:text-[#FF7A00] transition-colors line-clamp-2">{p.title}</div>
                      <div className="text-xs text-[#B0AFA5] mt-1">{p.readTime}</div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
                <div className="text-2xl mb-2">🛍️</div>
                <div className="font-semibold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Shop the Story</div>
                <p className="text-xs text-white/80 mb-3">Find authentic {post.tags[0]} products on Bharat Bazaar</p>
                <Link href="/products" className="block w-full text-center py-2 bg-white rounded-xl text-xs font-semibold transition-all hover:scale-105" style={{ color: "#FF7A00" }}>
                  Browse Products →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="font-bold text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(p => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="block bg-white rounded-2xl overflow-hidden border border-black/5 hover:shadow-md transition-all group">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-bold mb-2" style={{ color: "#FF7A00" }}>{p.category}</div>
                    <div className="text-sm font-semibold text-[#1C1B14] line-clamp-2 group-hover:text-[#FF7A00] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
