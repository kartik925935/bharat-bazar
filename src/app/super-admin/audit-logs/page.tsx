'use client';

import { useState } from 'react';
import { Search, Download, ShieldAlert } from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '@/lib/mock/super-admin';
import { toast } from 'sonner';

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_AUDIT_LOGS.filter(l => 
    l.actor.toLowerCase().includes(search.toLowerCase()) || 
    l.action.toLowerCase().includes(search.toLowerCase()) || 
    l.resource.toLowerCase().includes(search.toLowerCase()) ||
    l.resourceId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            📜 System Audit Logs
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Immutable record of all administrative actions</p>
        </div>
        <button onClick={() => toast.success('Exporting logs to CSV')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#F0F0F8] text-xs font-bold hover:bg-[#1C1C28] cursor-pointer shadow-lg">
          <Download size={14} /> Export Logs
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search actor, action, or resource..."
          className="w-full h-11 pl-10 pr-4 bg-[#111118] border border-[#1E1E2E] rounded-xl text-sm text-[#F0F0F8] outline-none focus:border-[#FF7A00]/50 placeholder-[#5C5C78]" />
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#9898B0]">
            <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-4">Timestamp</th>
                <th className="px-5 py-4">Actor</th>
                <th className="px-5 py-4">Action</th>
                <th className="px-5 py-4">Resource</th>
                <th className="px-5 py-4">IP Address</th>
                <th className="px-5 py-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E2E]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#1C1C28]">
                  <td className="px-5 py-4 font-mono text-[#5C5C78]">{log.timestamp}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#F0F0F8]">{log.actor}</p>
                    <p className="text-[9px] text-[#5C5C78] uppercase">{(log as any).role?.replace('_', ' ')}</p>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-[#FF7A00]">{log.action}</td>
                  <td className="px-5 py-4">
                    <p className="text-[#F0F0F8]">{log.resource}</p>
                    <p className="text-[10px] text-[#5C5C78] font-mono">{log.resourceId}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-[#9898B0]">{log.ipAddress}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      log.severity === 'critical' ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20' : 
                      log.severity === 'warning' ? 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20' : 
                      'text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20'
                    }`}>{log.severity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-[#5C5C78] text-sm">No audit logs found.</div>}
        </div>
      </div>
    </div>
  );
}
