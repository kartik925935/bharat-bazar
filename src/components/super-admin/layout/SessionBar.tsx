'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Clock, LogOut, RefreshCw } from 'lucide-react';
import { SA_THEME } from '@/styles/super-admin-theme';
import { useSAAuthStore } from '@/lib/store/sa-auth-store';
import { cn } from '@/lib/utils';
import { useRouter, useParams } from 'next/navigation';

export function SessionBar() {
  const { user, logout } = useSAAuthStore();
  const router = useRouter();
  const params = useParams();
  const saToken = params.saToken as string;
  
  // Fake countdown for demo
  const [timeLeft, setTimeLeft] = useState(107 * 60); // 1hr 47min in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isExpiringSoon = timeLeft < 15 * 60; // less than 15 mins
  const bgGradient = isExpiringSoon 
    ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' 
    : SA_THEME.gold.gradient;

  const handleEndSession = () => {
    logout();
    router.replace(`/${saToken}/secure-access`);
  };

  const handleExtend = () => {
    // In real app, re-verify TOTP. For now, add 1hr.
    setTimeLeft(prev => prev + 3600);
  };

  if (!user) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[32px] z-50 flex items-center justify-between px-4 text-xs font-medium"
      style={{ background: bgGradient, color: '#050508' }}
    >
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Secure Session</span>
        </span>
        <span className="hidden md:inline border-l border-black/20 pl-4">
          {user.email}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className={cn("flex items-center gap-1 tabular-nums font-mono", isExpiringSoon && "animate-pulse")}>
          <Clock className="w-3.5 h-3.5" />
          Expires: {formatTime(timeLeft)}
        </span>
        
        <div className="flex items-center gap-3 border-l border-black/20 pl-4">
          <button 
            onClick={handleExtend}
            className="flex items-center gap-1 hover:bg-black/10 px-2 rounded transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Extend</span>
          </button>
          
          <button 
            onClick={handleEndSession}
            className="flex items-center gap-1 hover:bg-black/10 px-2 rounded transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">End Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
