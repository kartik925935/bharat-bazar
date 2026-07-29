import { Navbar } from '@/components/layout/navbar/navbar';
import { Footer } from '@/components/layout/footer/footer';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="customer">
      <Navbar />
      <main className="min-h-screen pb-16 lg:pb-0">{children}</main>
      <Footer />
    </ProtectedRoute>
  );
}
