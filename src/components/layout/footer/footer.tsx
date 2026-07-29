import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { NewsletterBarClient } from './newsletter-bar';
import { siteConfig } from '@/config/site';

const footerLinks = siteConfig.footerLinks;
const paymentMethods = siteConfig.paymentMethods;

export function Footer() {
  return (
    <footer className="bg-[#1C1B14] text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF4500] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Get Curated Artisan Finds in Your Inbox
              </h3>
              <p className="text-white/80 mt-1">Join 2,34,000 craft lovers. No spam, ever.</p>
            </div>
            <NewsletterBarClient />
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm bg-gradient-to-br from-[#FF7A00] to-[#FF4500]">
                {siteConfig.logoText}
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] bg-clip-text text-transparent">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              {siteConfig.description}
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Mail size={14} className="shrink-0" /> {siteConfig.contact.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Phone size={14} className="shrink-0" /> {siteConfig.contact.phone} (Toll Free)
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <MapPin size={14} className="shrink-0" /> {siteConfig.contact.address}
              </div>
            </div>
          </div>

          {/* Nav Categories */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white/40 text-sm text-center md:text-left">
            <div>© {new Date().getFullYear()} {siteConfig.name}. Made with ❤️ in India 🇮🇳</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-white/30 text-xs mr-1">Payments secured by</span>
            {paymentMethods.map((method) => (
              <div key={method} className="px-2.5 py-1 rounded-md text-xs font-bold bg-white/10 text-white/70">
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
