import { Navbar } from '@/components/layout/navbar/navbar';
import { Footer } from '@/components/layout/footer/footer';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16 lg:pb-0">{children}</main>
      <Footer />
    </>
  );
}
