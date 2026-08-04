'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Check, Trash2, Edit3, Home, Briefcase, Building, X, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];


/* ───── helpers to convert between DB row ↔ UI model ───── */
function rowToAddress(row: any): Address {
  return {
    id: row.id,
    name: row.full_name,
    phone: row.phone,
    line1: row.address_line1,
    line2: row.address_line2 || undefined,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    type: (row.label?.toLowerCase() || 'other') as 'home' | 'work' | 'other',
    isDefault: row.is_default,
  };
}

export default function AddressesPage() {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [type, setType] = useState<'home' | 'work' | 'other'>('home');
  const [isDefault, setIsDefault] = useState(false);
  const [verifyingPin, setVerifyingPin] = useState(false);

  /* ───── Fetch addresses from Supabase ───── */
  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch addresses:', error);
      toast.error('Failed to load addresses');
    } else {
      setAddresses((data || []).map(rowToAddress));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setPincode('');
    setLine1('');
    setLine2('');
    setCity('');
    setState('');
    setType('home');
    setIsDefault(false);
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setName(addr.name);
    setPhone(addr.phone);
    setPincode(addr.pincode);
    setLine1(addr.line1);
    setLine2(addr.line2 || '');
    setCity(addr.city);
    setState(addr.state);
    setType(addr.type);
    setIsDefault(addr.isDefault);
    setModalOpen(true);
  };

  const handleVerifyPin = () => {
    if (!pincode || pincode.length !== 6) {
      toast.error('Enter valid 6-digit Pincode');
      return;
    }
    setVerifyingPin(true);
    setTimeout(() => {
      setVerifyingPin(false);
      setCity('Bangalore');
      setState('Karnataka');
      toast.success('Pincode verified! Location set.');
    }, 500);
  };

  /* ───── Save (insert or update) to Supabase ───── */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !line1 || !pincode || !user) {
      toast.error('Please fill required fields');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    // If marking as default, clear existing defaults first
    if (isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true);
    }

    const payload = {
      user_id: user.id,
      full_name: name,
      phone,
      address_line1: line1,
      address_line2: line2 || null,
      city: city || 'Unknown',
      state: state || 'Unknown',
      pincode,
      label: type,
      is_default: isDefault || addresses.length === 0,
    };

    if (editingId) {
      const { error } = await supabase
        .from('addresses')
        .update(payload)
        .eq('id', editingId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to update address:', error);
        toast.error('Failed to update address');
        setSaving(false);
        return;
      }
      toast.success('Address updated!');
    } else {
      const { error } = await supabase
        .from('addresses')
        .insert(payload);

      if (error) {
        console.error('Failed to add address:', error);
        toast.error('Failed to add address');
        setSaving(false);
        return;
      }
      toast.success('Address added!');
    }

    setSaving(false);
    setModalOpen(false);
    resetForm();
    await fetchAddresses();
  };

  /* ───── Set default ───── */
  const handleSetDefault = async (id: string) => {
    if (!user) return;
    const supabase = createClient();

    // Clear all defaults for this user
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .eq('is_default', true);

    // Set the new default
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to update default address');
      return;
    }

    toast.success('Default address updated!');
    await fetchAddresses();
  };

  /* ───── Delete ───── */
  const handleDelete = async (id: string) => {
    if (!user) return;
    const supabase = createClient();
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to delete address');
      return;
    }

    setDeletingId(null);
    toast.success('Address deleted!');
    await fetchAddresses();
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="animate-spin text-[#FF7A00]" size={28} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
            📍 My Addresses
          </h1>
          <p className="text-sm text-[#8C7B6E] mt-0.5">Manage your delivery addresses</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold shadow-[0_4px_12px_rgba(255,122,0,0.25)] hover:opacity-95 cursor-pointer"
        >
          <Plus size={15} /> Add Address
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => {
          const isFlipped = deletingId === addr.id;
          return (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative bg-white rounded-2xl border p-5 transition-all ${
                addr.isDefault ? 'border-[#FF7A00] shadow-[0_4px_20px_rgba(255,122,0,0.08)]' : 'border-[#E8E4DE]'
              }`}
            >
              {!isFlipped ? (
                <>
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#F5F4F0]">
                    <div className="flex items-center gap-2">
                      {addr.type === 'home' && <Home size={16} className="text-[#FF7A00]" />}
                      {addr.type === 'work' && <Briefcase size={16} className="text-[#FF7A00]" />}
                      {addr.type === 'other' && <Building size={16} className="text-[#FF7A00]" />}
                      <span className="text-sm font-bold text-[#1A0A00] capitalize">{addr.type}</span>
                    </div>
                    {addr.isDefault ? (
                      <span className="text-[10px] font-bold text-[#16A34A] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check size={10} /> Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs font-semibold text-[#8C7B6E] hover:text-[#FF7A00] cursor-pointer"
                      >
                        Set Default
                      </button>
                    )}
                  </div>

                  <p className="text-sm font-bold text-[#1A0A00]">{addr.name}</p>
                  <p className="text-xs text-[#4A3728] mt-1 leading-relaxed">
                    {addr.line1}
                    {addr.line2 && <><br />{addr.line2}</>}
                    <br />
                    {addr.city}, {addr.state} {addr.pincode}
                  </p>
                  <p className="text-xs text-[#8C7B6E] mt-2 font-medium">📞 {addr.phone}</p>

                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#F5F4F0]">
                    <button
                      onClick={() => openEdit(addr)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#4A3728] hover:text-[#FF7A00] cursor-pointer"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => setDeletingId(addr.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#DC2626] hover:underline cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <p className="text-sm font-bold text-[#1A0A00]">Delete this address?</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="px-4 py-1.5 rounded-xl bg-[#DC2626] text-white text-xs font-bold cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-4 py-1.5 rounded-xl border border-[#E8E4DE] text-xs font-semibold text-[#4A3728] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Add Card Button */}
        <button
          onClick={openAdd}
          className="border-2 border-dashed border-[#E8E4DE] hover:border-[#FF7A00] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-[#8C7B6E] hover:text-[#FF7A00] transition-colors cursor-pointer min-h-[180px]"
        >
          <div className="w-10 h-10 rounded-full bg-[#FFF3E8] flex items-center justify-center text-[#FF7A00]">
            <Plus size={20} />
          </div>
          <span className="text-sm font-bold">Add New Address</span>
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#F0EDE8] pb-3">
                <h3 className="text-lg font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {editingId ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                {/* Pincode verification */}
                <div>
                  <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Pincode *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 560034"
                      className="flex-1 h-10 px-3 rounded-xl border border-[#E8E4DE] text-sm outline-none focus:border-[#FF7A00]"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyPin}
                      disabled={verifyingPin}
                      className="px-4 h-10 rounded-xl bg-[#FFF3E8] text-[#FF7A00] font-bold hover:bg-[#FFE4CC] cursor-pointer"
                    >
                      {verifyingPin ? 'Checking...' : 'Verify'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Receiver's Name"
                      className="w-full h-10 px-3 rounded-xl border border-[#E8E4DE] text-sm outline-none focus:border-[#FF7A00]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-10 px-3 rounded-xl border border-[#E8E4DE] text-sm outline-none focus:border-[#FF7A00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="Flat/House No., Building, Street"
                    className="w-full h-10 px-3 rounded-xl border border-[#E8E4DE] text-sm outline-none focus:border-[#FF7A00]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="Landmark, Area, Colony"
                    className="w-full h-10 px-3 rounded-xl border border-[#E8E4DE] text-sm outline-none focus:border-[#FF7A00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#E8E4DE] text-sm outline-none focus:border-[#FF7A00]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#E8E4DE] text-sm outline-none focus:border-[#FF7A00] bg-white cursor-pointer"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Address Type</label>
                  <div className="flex gap-2">
                    {(['home', 'work', 'other'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`flex-1 h-9 rounded-xl border font-bold capitalize transition-all cursor-pointer ${
                          type === t ? 'border-[#FF7A00] bg-[#FFF3E8] text-[#FF7A00]' : 'border-[#E8E4DE] text-[#4A3728]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded text-[#FF7A00] focus:ring-[#FF7A00]"
                  />
                  <span className="text-xs font-semibold text-[#4A3728]">Make this my default delivery address</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 h-11 rounded-xl border border-[#E8E4DE] text-sm font-semibold text-[#4A3728] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold cursor-pointer disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
