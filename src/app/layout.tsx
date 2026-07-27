import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Bharat Bazaar — Authentic Handcrafted Indian Products',
  description: 'Shop directly from artisans, village producers, and NGOs across India. Handloom sarees, pottery, organic spices, Madhubani art, silver filigree.',
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
