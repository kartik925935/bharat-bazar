import { Navbar } from '@/components/layout/navbar/navbar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { CustomerSidebar, MobileBottomTabs } from '@/components/customer/sidebar';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="customer">
      {/* Fixed navbar */}
      <Navbar />

      {/* Main content area below navbar */}
      <div className="pt-[72px] min-h-screen bg-[#FAFAF8]">
        <div className="flex max-w-[1400px] mx-auto">
          {/* Desktop sidebar — sticky */}
          <aside className="hidden lg:flex flex-col w-[280px] shrink-0 sticky top-[72px] h-[calc(100vh-72px)] bg-white border-r border-[#E8E4DE] overflow-hidden">
            <CustomerSidebar />
          </aside>

          {/* Page content */}
          <main className="flex-1 min-w-0 pb-24 lg:pb-10">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <MobileBottomTabs />
    </ProtectedRoute>
  );
}
