'use client';

import { useState, useEffect } from 'react';
import { SA_THEME } from '@/styles/super-admin-theme';
import {
  DollarSign, TrendingUp, ShoppingBag, Store,
  Users, Clock, RefreshCw, CheckCircle,
  ShoppingCart, Star, Shield, Package,
  ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { SA_MOCK_DATA } from '@/lib/mock/super-admin';
import { cn } from '@/lib/utils';

// --- MOCK DATA FOR CHARTS ---
const revenueData = [
  { name: 'Jan', revenue: 4000, gmv: 24000 },
  { name: 'Feb', revenue: 3000, gmv: 13980 },
  { name: 'Mar', revenue: 2000, gmv: 9800 },
  { name: 'Apr', revenue: 2780, gmv: 39080 },
  { name: 'May', revenue: 1890, gmv: 48000 },
  { name: 'Jun', revenue: 2390, gmv: 38000 },
  { name: 'Jul', revenue: 3490, gmv: 43000 },
];

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Fashion', value: 300 },
  { name: 'Home', value: 300 },
  { name: 'Beauty', value: 200 },
];

const COLORS = SA_THEME.charts.colors;

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pendingActions = [
    { panel: 'sellers', label: 'Sellers Awaiting KYC Approval', urgency: 'high', count: SA_MOCK_DATA.kyc.filter((k: any) => k.status === 'pending').length },
    { panel: 'products', label: 'Products Pending Review', urgency: 'normal', count: SA_MOCK_DATA.products.filter((p: any) => p.status === 'pending_approval').length },
    { panel: 'refunds', label: 'Refunds to Process', urgency: 'critical', count: 3 },
    { panel: 'admins', label: 'Admin Access Requests', urgency: 'normal', count: 2 },
    { panel: 'complaints', label: 'High-Priority Complaints', urgency: 'critical', count: SA_MOCK_DATA.complaints.filter((c: any) => c.priority === 'high' && c.status === 'open').length },
  ].sort((a, b) => {
    const uMap: Record<string, number> = { critical: 3, high: 2, normal: 1, low: 0 };
    return uMap[b.urgency] - uMap[a.urgency];
  });

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      
      {/* 1. CRITICAL ALERTS */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <span className="text-xl">🚨</span>
          <div>
            <h4 className="text-red-500 font-medium text-sm">Critical Actions Required</h4>
            <p className="text-red-400/80 text-xs mt-0.5">3 refunds are overdue (&gt;5 days). Immediate processing required.</p>
          </div>
        </div>
        <button className="shrink-0 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
          Process Now
        </button>
      </div>

      {/* 2. KEY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Platform GMV', value: '₹14.2M', trend: '+12%', isUp: true, icon: DollarSign, color: '#F5C842' },
          { label: 'Net Revenue', value: '₹1.1M', trend: '+15%', isUp: true, icon: TrendingUp, color: '#8B5CF6' },
          { label: 'Total Orders', value: '84,392', trend: '+5%', isUp: true, icon: ShoppingBag, color: '#3B82F6' },
          { label: 'Active Sellers', value: '1,204', trend: '+2%', isUp: true, icon: Store, color: '#10B981' },
          { label: 'Total Customers', value: '142K', trend: '+8%', isUp: true, icon: Users, color: '#14B8A6' },
          { label: 'Pending Actions', value: '14', trend: '-2', isUp: false, icon: Clock, color: '#F59E0B' },
          { label: 'Pending Refunds', value: '₹45K', trend: '+12K', isUp: false, icon: RefreshCw, color: '#F97316' },
          { label: 'Delivery Success', value: '98.2%', trend: '+0.4%', isUp: true, icon: CheckCircle, color: '#22C55E' },
        ].map((metric, i) => (
          <div key={i} className="p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg" style={{ backgroundColor: SA_THEME.bg.card, borderColor: SA_THEME.border.primary }}>
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-opacity-10" style={{ backgroundColor: `${metric.color}20`, color: metric.color }}>
                <metric.icon className="w-4 h-4" />
              </div>
              <span className={cn("text-xs font-medium", metric.isUp ? "text-green-500" : "text-red-500")}>
                {metric.trend}
              </span>
            </div>
            <p className="text-xs font-bold tracking-wider uppercase mb-1" style={{ color: SA_THEME.text.muted }}>{metric.label}</p>
            <p className="text-2xl font-bold font-mono" style={{ color: SA_THEME.text.primary }}>{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. PENDING ACTIONS */}
        <div className="lg:col-span-1 rounded-2xl border p-5 flex flex-col" style={{ backgroundColor: SA_THEME.bg.card, borderColor: SA_THEME.border.primary }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: SA_THEME.text.secondary }}>Priority Queue</h3>
          <div className="flex-1 space-y-3">
            {pendingActions.map((action, i) => {
              const urgencyColors = {
                critical: 'border-red-500/30 bg-red-500/5',
                high: 'border-amber-500/30 bg-amber-500/5',
                normal: 'border-blue-500/30 bg-blue-500/5',
                low: 'border-gray-500/30 bg-gray-500/5',
              };
              const badgeColors = {
                critical: 'bg-red-500 text-white',
                high: 'bg-amber-500 text-white',
                normal: 'bg-blue-500 text-white',
                low: 'bg-gray-500 text-white',
              };
              
              if (action.count === 0) return null;
              
              return (
                <div key={i} className={cn("flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer hover:bg-white/5", urgencyColors[action.urgency as keyof typeof urgencyColors])}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold", badgeColors[action.urgency as keyof typeof badgeColors])}>
                      {action.count}
                    </div>
                    <span className="text-sm font-medium" style={{ color: SA_THEME.text.primary }}>{action.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#5A5A80]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. CHARTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border p-5" style={{ backgroundColor: SA_THEME.bg.card, borderColor: SA_THEME.border.primary }}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: SA_THEME.text.secondary }}>Revenue & GMV Trend</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={SA_THEME.gold[500]} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={SA_THEME.gold[500]} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={SA_THEME.charts.grid} vertical={false} />
                  <XAxis dataKey="name" stroke={SA_THEME.charts.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={SA_THEME.charts.axis} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: SA_THEME.charts.tooltip.bg, borderColor: SA_THEME.charts.tooltip.border, borderRadius: '12px' }}
                    itemStyle={{ color: SA_THEME.text.primary, fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="gmv" stroke={SA_THEME.gold[500]} fillOpacity={1} fill="url(#colorGmv)" strokeWidth={2} />
                  <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* 5. ACTIVITY FEED & TOP PERFORMERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border p-5" style={{ backgroundColor: SA_THEME.bg.card, borderColor: SA_THEME.border.primary }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: SA_THEME.text.secondary }}>Live Activity</h3>
          <div className="space-y-4">
            {[
              { icon: ShoppingCart, color: '#3B82F6', title: 'New Order Placed', desc: 'Order #ORD-10294 by Rahul K.', time: '2 mins ago' },
              { icon: Store, color: '#8B5CF6', title: 'Seller Registered', desc: 'Crafts of India submitted KYC', time: '15 mins ago' },
              { icon: RefreshCw, color: '#14B8A6', title: 'Refund Processed', desc: '₹2,499 refunded to wallet', time: '1 hour ago' },
              { icon: Star, color: '#F5C842', title: 'Review Flagged', desc: 'System flagged review on Product #492', time: '3 hours ago' },
              { icon: Shield, color: '#9090B8', title: 'Admin Login', desc: 'support_agent_1 logged in', time: '4 hours ago' },
            ].map((event, i) => (
              <div key={i} className="flex gap-4 p-2 rounded-xl transition-colors hover:bg-white/5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${event.color}15`, color: event.color }}>
                  <event.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: SA_THEME.text.primary }}>{event.title}</p>
                  <p className="text-xs truncate" style={{ color: SA_THEME.text.secondary }}>{event.desc}</p>
                </div>
                <div className="text-[10px] whitespace-nowrap pt-1" style={{ color: SA_THEME.text.muted }}>
                  {event.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-5" style={{ backgroundColor: SA_THEME.bg.card, borderColor: SA_THEME.border.primary }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: SA_THEME.text.secondary }}>Top Performing Sellers</h3>
          <div className="space-y-3">
            {[
              { name: 'Heritage Crafts', sales: '₹4.2L', orders: 154, img: 'https://i.pravatar.cc/150?u=1' },
              { name: 'Jaipur Textiles', sales: '₹3.8L', orders: 201, img: 'https://i.pravatar.cc/150?u=2' },
              { name: 'Kashmir Looms', sales: '₹3.1L', orders: 89, img: 'https://i.pravatar.cc/150?u=3' },
              { name: 'Organic India', sales: '₹2.9L', orders: 450, img: 'https://i.pravatar.cc/150?u=4' },
              { name: 'Brass Artworks', sales: '₹2.4L', orders: 112, img: 'https://i.pravatar.cc/150?u=5' },
            ].map((seller, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border bg-white/5 border-transparent hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-5 font-bold text-center" style={{ color: i < 3 ? SA_THEME.gold[500] : SA_THEME.text.muted }}>#{i+1}</span>
                  <img src={seller.img} alt={seller.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-[#F0F0FF]">{seller.name}</p>
                    <p className="text-xs text-[#9090B8]">{seller.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-[#F0F0FF]">{seller.sales}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
