import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAFAF8] text-[#1C1B14]">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
