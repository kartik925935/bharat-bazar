'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Calendar, MapPin, Shield,
  Camera, Edit3, Check, X, ChevronDown, Save,
  Lock, Download, Trash2, AlertTriangle, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';
import { CATEGORIES } from '@/lib/mock/customer';

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${on ? 'bg-[#FF7A00]' : 'bg-[#E8E4DE]'}`}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mx-0.5 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function SectionCard({ title, children, editMode, onEdit, onSave, onCancel, saving = false }: {
  title: string; children: React.ReactNode;
  editMode: boolean; onEdit: () => void; onSave: () => void; onCancel: () => void;
  saving?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DE] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EDE8]">
        <h3 className="text-sm font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
        {!editMode ? (
          <button onClick={onEdit} className="flex items-center gap-1.5 text-xs font-bold text-[#FF7A00] hover:underline cursor-pointer">
            <Edit3 size={12} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={onCancel} className="flex items-center gap-1 text-xs font-medium text-[#8C7B6E] hover:text-[#4A3728] cursor-pointer">
              <X size={12} /> Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold cursor-pointer disabled:opacity-60"
            >
              {saving ? '...' : <><Save size={12} /> Save</>}
            </button>
          </div>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, value, editMode, type = 'text', onChange, readOnly, badge, error, placeholder }: {
  label: string; value: string; editMode: boolean; type?: string;
  onChange?: (v: string) => void; readOnly?: boolean; badge?: React.ReactNode;
  error?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-bold text-[#8C7B6E] uppercase tracking-wider mb-1.5 block">{label}</label>
      {editMode && !readOnly ? (
        <>
          <input
            type={type}
            value={value}
            onChange={e => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={`w-full h-11 px-4 rounded-xl border text-sm text-[#1A0A00] outline-none bg-[#FAFAF8] transition-colors ${
              error ? 'border-red-500 focus:border-red-500' : 'border-[#E8E4DE] focus:border-[#FF7A00]'
            }`}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </>
      ) : (
        <div className="flex items-center gap-2 h-11 px-4 rounded-xl bg-[#F5F4F0] text-sm text-[#1A0A00]">
          <span className="flex-1">{value || <span className="text-[#B5A99A]">Not set</span>}</span>
          {badge}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();

  const [personalEdit, setPersonalEdit] = useState(false);
  const [prefEdit, setPrefEdit]         = useState(false);
  const [saving, setSaving]             = useState(false);

  const [name, setName]   = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob]     = useState(user?.dob || '');
  const [gender, setGender] = useState(user?.gender || 'female');

  const [cats, setCats]   = useState<string[]>(['Paintings & Art', 'Jewelry']);
  const [emailNotif, setEmailNotif]   = useState({ orders: true, offers: true, blog: false, price: true });
  const [notifDirty, setNotifDirty] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDelete, setShowDelete]       = useState(false);
  const [fieldErrors, setFieldErrors]     = useState<Record<string, string>>({});

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  let completion = 40;
  if (user.name)   completion += 15;
  if (user.email)  completion += 15;
  if (user.phone)  completion += 15;
  if (user.dob || dob) completion += 15;
  completion = Math.min(100, completion);

  const handleSavePersonal = async () => {
    const errors: Record<string, string> = {};

    // Full Name: at least 2 characters, letters and spaces only
    const trimmedName = name.trim();
    if (!trimmedName) {
      errors.name = 'Full name is required';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
      errors.name = 'Name can only contain letters and spaces';
    }

    // Mobile Number: valid 10-digit Indian number starting with 6-9
    const digitsOnly = phone.replace(/[\s\-+()]/g, '');
    const cleanPhone = digitsOnly.startsWith('91') && digitsOnly.length === 12
      ? digitsOnly.slice(2)
      : digitsOnly;
    if (!cleanPhone) {
      errors.phone = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.phone = 'Enter a valid 10-digit Indian mobile number (starting with 6-9)';
    }

    // Date of Birth: cannot be in the future
    if (dob) {
      const dobDate = new Date(dob);
      if (dobDate > new Date()) {
        errors.dob = 'Date of birth cannot be in the future';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    await updateProfile({ name: trimmedName, phone: cleanPhone, dob: dob || undefined, gender: gender || undefined });
    setSaving(false);
    setPersonalEdit(false);
    toast.success('Profile updated! 🙏');
  };

  const toggleCat = (cat: string) => {
    if (cats.includes(cat)) {
      if (cats.length > 1) setCats(cats.filter(c => c !== cat));
    } else if (cats.length < 5) {
      setCats([...cats, cat]);
    } else {
      toast.warning('You can select up to 5 categories');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>My Profile</h1>
        <p className="text-sm text-[#8C7B6E] mt-0.5">Manage your personal information</p>
      </div>

      {/* Profile Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-[#E8E4DE] p-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white text-2xl font-black shadow-[0_8px_24px_rgba(255,122,0,0.3)]">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : initials}
            </div>
            <button
              onClick={() => toast.info('Photo upload coming soon')}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1A0A00] flex items-center justify-center text-white cursor-pointer hover:bg-[#FF7A00] transition-colors shadow-lg"
            >
              <Camera size={14} />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-black text-[#1A0A00]">{user.name}</h2>
            <p className="text-sm text-[#8C7B6E]">{user.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="text-xs font-bold bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full border border-amber-200">
                🥇 Gold Member
              </span>
              <span className="text-xs text-[#8C7B6E]">Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</span>
            </div>

            {/* Completion bar */}
            <div className="mt-4 max-w-xs mx-auto sm:mx-0">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#8C7B6E]">Profile {completion}% complete</span>
                {completion < 100 && <span className="text-[#FF7A00] font-semibold">Add DOB to finish</span>}
              </div>
              <div className="h-2 bg-[#F0EDE8] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completion}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500]"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Personal Information */}
      <SectionCard
        title="Personal Information"
        editMode={personalEdit}
        onEdit={() => setPersonalEdit(true)}
        onSave={handleSavePersonal}
        onCancel={() => { setPersonalEdit(false); setName(user.name); setPhone(user.phone||''); setDob(user.dob||''); setGender(user.gender||'female'); setFieldErrors({}); }}
        saving={saving}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" value={name} editMode={personalEdit} onChange={setName} error={fieldErrors.name} placeholder="e.g. Priya Sharma" />
          <Field
            label="Email Address"
            value={user.email}
            editMode={personalEdit}
            readOnly
            badge={<span className="text-[10px] font-bold text-[#16A34A] bg-[#F0FDF4] px-1.5 py-0.5 rounded-full">✓ Verified</span>}
          />
          <Field label="Mobile Number" value={phone} editMode={personalEdit} type="tel" onChange={setPhone}
            error={fieldErrors.phone} placeholder="e.g. 9876543210"
            badge={phone && !fieldErrors.phone ? <span className="text-[10px] font-bold text-[#16A34A] bg-[#F0FDF4] px-1.5 py-0.5 rounded-full">✓</span> : undefined}
          />
          <div>
            <label className="text-[11px] font-bold text-[#8C7B6E] uppercase tracking-wider mb-1.5 block">Date of Birth</label>
            {personalEdit ? (
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-[#E8E4DE] text-sm text-[#1A0A00] outline-none focus:border-[#FF7A00] bg-[#FAFAF8]"
              />
            ) : (
              <div className="h-11 px-4 rounded-xl bg-[#F5F4F0] flex items-center text-sm text-[#B5A99A]">
                {dob || 'Not set — add for better experience'}
              </div>
            )}
          </div>
          {personalEdit && (
            <div>
              <label className="text-[11px] font-bold text-[#8C7B6E] uppercase tracking-wider mb-1.5 block">Gender</label>
              <div className="flex gap-2">
                {['Female', 'Male', 'Other'].map(g => (
                  <button
                    key={g}
                    onClick={() => setGender(g.toLowerCase())}
                    className={`flex-1 h-10 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      gender === g.toLowerCase()
                        ? 'border-[#FF7A00] bg-[#FFF3E8] text-[#FF7A00]'
                        : 'border-[#E8E4DE] text-[#4A3728]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Shopping Preferences */}
      <SectionCard
        title="Shopping Preferences"
        editMode={prefEdit}
        onEdit={() => setPrefEdit(true)}
        onSave={() => { setPrefEdit(false); toast.success('Preferences saved!'); }}
        onCancel={() => setPrefEdit(false)}
      >
        <div>
          <p className="text-xs font-bold text-[#8C7B6E] mb-2">Favourite Categories (up to 5)</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => prefEdit && toggleCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  cats.includes(cat)
                    ? 'bg-[#FF7A00] text-white'
                    : prefEdit
                      ? 'bg-white border border-[#E8E4DE] text-[#4A3728] hover:border-[#FF7A00]/40'
                      : 'bg-[#F5F4F0] text-[#8C7B6E]'
                }`}
              >
                {cats.includes(cat) && '✓ '}{cat}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-[#E8E4DE] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EDE8]">
          <h3 className="text-sm font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>Notification Preferences</h3>
          {notifDirty && (
            <button
              onClick={() => { setNotifDirty(false); toast.success('Notification preferences saved!'); }}
              className="text-xs font-bold text-[#FF7A00] hover:underline cursor-pointer"
            >
              Save
            </button>
          )}
        </div>
        <div className="p-5 space-y-3">
          {[
            { key: 'orders', label: 'Order updates', sub: 'Track your orders' },
            { key: 'offers', label: 'Promotional offers', sub: 'Sales & discounts' },
            { key: 'price',  label: 'Price drop alerts', sub: 'Wishlist price drops' },
            { key: 'blog',   label: 'Craft stories', sub: 'Artisan community' },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1A0A00]">{label}</p>
                <p className="text-xs text-[#8C7B6E]">{sub}</p>
              </div>
              <Toggle
                on={emailNotif[key as keyof typeof emailNotif]}
                onChange={(v) => { setEmailNotif(prev => ({ ...prev, [key]: v })); setNotifDirty(true); }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-[#FCA5A5] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#FEE2E2]">
          <h3 className="text-sm font-black text-[#DC2626]">Account Actions</h3>
        </div>
        <div className="p-5 space-y-3">
          <button
            onClick={() => toast.info('Change password flow coming soon')}
            className="flex items-center gap-2 text-sm font-semibold text-[#4A3728] hover:text-[#FF7A00] cursor-pointer transition-colors"
          >
            <Lock size={15} className="text-[#8C7B6E]" /> Change Password
          </button>
          <button
            onClick={() => toast.info('Your data export is being prepared')}
            className="flex items-center gap-2 text-sm font-semibold text-[#4A3728] hover:text-[#FF7A00] cursor-pointer transition-colors"
          >
            <Download size={15} className="text-[#8C7B6E]" /> Download My Data
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 text-sm font-semibold text-[#DC2626] hover:underline cursor-pointer"
          >
            <Trash2 size={15} /> Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowDelete(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mb-4">
                <AlertTriangle size={22} className="text-[#DC2626]" />
              </div>
              <h3 className="text-lg font-black text-[#1A0A00] mb-1">Delete Account?</h3>
              <p className="text-sm text-[#8C7B6E] mb-4">This is permanent and cannot be undone. Type DELETE to confirm.</p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE"
                className="w-full h-11 px-4 rounded-xl border border-[#E8E4DE] text-sm outline-none focus:border-[#DC2626] mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowDelete(false)} className="flex-1 h-11 rounded-xl border border-[#E8E4DE] text-sm font-semibold text-[#4A3728] cursor-pointer">
                  Cancel
                </button>
                <button
                  disabled={deleteConfirm !== 'DELETE'}
                  onClick={() => toast.error('Account deletion coming soon')}
                  className="flex-1 h-11 rounded-xl bg-[#DC2626] text-white text-sm font-bold cursor-pointer disabled:opacity-40"
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
