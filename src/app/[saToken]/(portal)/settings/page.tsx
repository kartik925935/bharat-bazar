'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Power, AlertTriangle, ShieldCheck, Mail, Save
} from 'lucide-react'
import { usePhase11Store } from '@/lib/store/phase11-store'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const {
    settings,
    isSavingSettings,
    updatePlatformSettings,
    toggleMaintenanceMode,
    toggleFeatureFlag,
    updateNotificationSettings,
    updateLegalVersion
  } = usePhase11Store()

  // Business Rules State
  const [bizRules, setBizRules] = useState({
    commissionRateDefault: settings.commissionRateDefault,
    returnWindowDays: settings.returnWindowDays,
    settlementCycleDays: settings.settlementCycleDays,
    minSettlementAmount: settings.minSettlementAmount,
    sellerRegistrationFee: settings.sellerRegistrationFee,
    maxProductsPerSeller: settings.maxProductsPerSeller,
    minProductImages: settings.minProductImages,
    productCompletenessThreshold: settings.productCompletenessThreshold,
    orderAcceptanceSlaHours: settings.orderAcceptanceSlaHours,
    dispatchSlaHours: settings.dispatchSlaHours,
    maxCodOrderValue: settings.maxCodOrderValue,
    sellerAutoSuspendAfterDays: settings.sellerAutoSuspendAfterDays,
  })

  // Maintenance State
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false)
  const [maintenanceMsg, setMaintenanceMsg] = useState(settings.maintenanceMessage)
  const [maintenanceEnd, setMaintenanceEnd] = useState('')
  const [maintenanceAgreed, setMaintenanceAgreed] = useState(false)

  // Legal Version State
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null)
  const [newVersion, setNewVersion] = useState('')

  const handleSaveBizRules = async () => {
    // Basic conversion to numbers
    const payload = Object.fromEntries(
      Object.entries(bizRules).map(([k, v]) => [k, Number(v)])
    )
    await updatePlatformSettings(payload as any)
  }

  const handleToggleMaintenance = async () => {
    if (settings.maintenanceMode) {
      await toggleMaintenanceMode({ enabled: false, message: '' })
    } else {
      setShowMaintenanceConfirm(true)
    }
  }

  const confirmMaintenance = async () => {
    if (!maintenanceAgreed) return
    await toggleMaintenanceMode({
      enabled: true,
      message: maintenanceMsg,
      scheduledEnd: maintenanceEnd || undefined
    })
    setShowMaintenanceConfirm(false)
    setMaintenanceAgreed(false)
  }

  const handleUpdateLegal = async () => {
    if (!newVersion.trim()) return
    await updateLegalVersion(legalModal === 'terms' ? 'termsVersion' : 'privacyPolicyVersion', newVersion)
    setLegalModal(null)
    setNewVersion('')
  }

  return (
    <div className="flex flex-col h-full bg-[#09090B] overflow-y-auto p-4 md:p-6 gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#A0A0B8]" />
          Platform Settings
        </h1>
        <p className="text-sm text-[#6B6B80] mt-1">Configure global marketplace rules and features.</p>
      </div>

      {/* Section 1: Maintenance Mode */}
      <div className={cn(
        "rounded-2xl p-6 border transition-all duration-500",
        settings.maintenanceMode ? "bg-[#EF4444]/5 border-[#EF4444]/30 shadow-[0_0_30px_-5px_rgba(239,68,68,0.15)]" : "bg-[#0A0A12] border-[#1E1E2E]"
      )}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold text-white">Maintenance Mode</h2>
              {settings.maintenanceMode ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EF4444] text-white animate-pulse">
                  <Power className="w-3.5 h-3.5" /> MAINTENANCE ACTIVE
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#22C55E]/15 text-[#22C55E]">
                  <ShieldCheck className="w-3.5 h-3.5" /> LIVE
                </span>
              )}
            </div>
            <p className="text-sm text-[#8B8B9E]">
              {settings.maintenanceMode
                ? `Active message: "${settings.maintenanceMessage}"`
                : "Take the platform offline for customer and seller access during updates."}
            </p>
          </div>
          <button
            onClick={handleToggleMaintenance}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-sm transition-all shrink-0",
              settings.maintenanceMode
                ? "bg-[#22C55E] hover:bg-[#16A34A] text-white"
                : "bg-[#EF4444] hover:bg-[#DC2626] text-white"
            )}
          >
            {settings.maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
          </button>
        </div>
      </div>

      {/* Section 2: Business Rules */}
      <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Business Rules</h2>
            <p className="text-sm text-[#6B6B80]">Core operational parameters.</p>
          </div>
          <button
            onClick={handleSaveBizRules}
            disabled={isSavingSettings}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF7A00] hover:bg-[#FF9A40] disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSavingSettings ? 'Saving...' : 'Save Rules'}
          </button>
        </div>

        {Number(bizRules.commissionRateDefault) !== settings.commissionRateDefault && (
          <div className="flex items-start gap-3 p-3 mb-6 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#F59E0B]">Commission Rate Change</p>
              <p className="text-xs text-[#F59E0B]/80 mt-0.5">
                Changing the default commission rate will affect all new orders. Existing pending settlements will not be recalculated. This action will be logged in Audit Logs.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries({
            commissionRateDefault: { label: 'Commission Rate (%)', desc: "Platform's default cut" },
            returnWindowDays: { label: 'Return Window (days)', desc: "Days after delivery for return" },
            settlementCycleDays: { label: 'Settlement Cycle (days)', desc: "Days after delivery before payout" },
            minSettlementAmount: { label: 'Min Settlement Amount (₹)', desc: "Minimum payout threshold" },
            sellerRegistrationFee: { label: 'Seller Reg. Fee (₹)', desc: "One-time onboarding fee" },
            maxProductsPerSeller: { label: 'Max Products per Seller', desc: "Hard cap on listings" },
            minProductImages: { label: 'Min Product Images', desc: "Images required for submission" },
            productCompletenessThreshold: { label: 'Completeness Threshold (%)', desc: "Score required to submit" },
            orderAcceptanceSlaHours: { label: 'Order Acceptance SLA (hrs)', desc: "Hours to accept order" },
            dispatchSlaHours: { label: 'Dispatch SLA (hrs)', desc: "Hours to dispatch order" },
            maxCodOrderValue: { label: 'Max COD Order Value (₹)', desc: "Max eligible for COD" },
            sellerAutoSuspendAfterDays: { label: 'Seller Auto-Suspend (days)', desc: "Days of inactivity to suspend" },
          }).map(([key, meta]) => (
            <div key={key} className="space-y-1.5">
              <label className="text-sm font-semibold text-[#A0A0B8]">{meta.label}</label>
              <input
                type="number"
                value={(bizRules as any)[key]}
                onChange={e => setBizRules(p => ({ ...p, [key]: e.target.value }))}
                className="w-full h-11 px-3 bg-[#111118] border border-[#2A2A3E] rounded-xl text-white focus:outline-none focus:border-[#FF7A00] transition-colors"
              />
              <p className="text-[10px] text-[#6B6B80]">{meta.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Feature Flags */}
      <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-1">Feature Flags</h2>
        <p className="text-sm text-[#6B6B80] mb-6">Enable or disable platform capabilities instantly.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries({
            googleOAuthEnabled: { label: 'Google OAuth Login', desc: 'Allow customers to sign in with Google' },
            codEnabled: { label: 'Cash on Delivery', desc: 'Enable COD payment option at checkout' },
            guestCheckoutEnabled: { label: 'Guest Checkout', desc: 'Allow purchases without account creation' },
            reviewsEnabled: { label: 'Reviews & Ratings', desc: 'Enable product review submission' },
            wishlistEnabled: { label: 'Wishlist', desc: 'Enable customer wishlist feature' },
            sellerStoriesEnabled: { label: 'Seller Stories', desc: 'Show artisan story sections on seller pages' },
            flashSaleEnabled: { label: 'Flash Sales', desc: 'Enable time-limited flash sale campaigns' },
            referralProgramEnabled: { label: 'Referral Program', desc: 'Enable customer referral reward system' },
            bulkImportEnabled: { label: 'Bulk Import', desc: 'Allow sellers to bulk-import products via CSV' },
          }).map(([key, meta]) => {
            const isEnabled = (settings.features as any)[key]
            return (
              <div key={key} className="flex items-start justify-between p-4 bg-[#111118] border border-[#2A2A3E] rounded-xl">
                <div className="pr-4">
                  <p className="text-sm font-bold text-white mb-0.5">{meta.label}</p>
                  <p className="text-[10px] text-[#6B6B80]">{meta.desc}</p>
                </div>
                <button
                  onClick={() => {
                    const criticalFlags = ['googleOAuthEnabled', 'codEnabled', 'reviewsEnabled']
                    if (isEnabled && criticalFlags.includes(key)) {
                      if (!confirm(`Disabling ${meta.label} will immediately affect all active users. Are you sure?`)) return
                    }
                    toggleFeatureFlag({ feature: key as any, enabled: !isEnabled })
                  }}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    isEnabled ? "bg-[#FF7A00]" : "bg-[#2A2A3E]"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      isEnabled ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 4: Notifications & Legal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        {/* Notifications */}
        <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-5 h-5 text-[#A0A0B8]" />
            <h2 className="text-lg font-bold text-white">System Notifications</h2>
          </div>
          <p className="text-sm text-[#6B6B80] mb-6">Automated platform emails & SMS.</p>

          <div className="space-y-4">
            {Object.entries({
              sendEmailOnOrderConfirm: 'Send email on order confirmation',
              sendEmailOnShipment: 'Send email on shipment',
              sendEmailOnDelivery: 'Send email on delivery',
              sendSmsOnDelivery: 'Send SMS on delivery (Requires SMS gateway)',
              sendSellerPayoutEmail: 'Send seller payout notification email',
            }).map(([key, label]) => {
              const isEnabled = (settings.notifications as any)[key]
              const isDisabled = key === 'sendSmsOnDelivery'
              return (
                <label key={key} className={cn("flex items-center gap-3", isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer")}>
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    disabled={isDisabled}
                    onChange={(e) => updateNotificationSettings({ [key]: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2A2A3E] bg-[#111118] text-[#FF7A00] focus:ring-[#FF7A00] focus:ring-offset-[#09090B]"
                  />
                  <span className="text-sm text-[#E0E0E0]">{label}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Legal */}
        <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-1">Legal Documents</h2>
          <p className="text-sm text-[#6B6B80] mb-6">Update platform terms and privacy versions.</p>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#111118] border border-[#2A2A3E] rounded-xl">
              <div>
                <p className="text-sm font-bold text-[#A0A0B8]">Terms of Service</p>
                <p className="text-xl font-mono text-white mt-1">{settings.termsVersion}</p>
              </div>
              <button
                onClick={() => setLegalModal('terms')}
                className="px-4 py-2 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-lg text-xs font-bold transition-colors"
              >
                Update Version
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#111118] border border-[#2A2A3E] rounded-xl">
              <div>
                <p className="text-sm font-bold text-[#A0A0B8]">Privacy Policy</p>
                <p className="text-xl font-mono text-white mt-1">{settings.privacyPolicyVersion}</p>
              </div>
              <button
                onClick={() => setLegalModal('privacy')}
                className="px-4 py-2 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-lg text-xs font-bold transition-colors"
              >
                Update Version
              </button>
            </div>
            <p className="text-xs text-[#6B6B80] text-center">
              Last updated by {settings.lastUpdatedBy} on {new Date(settings.lastUpdatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Confirmation Modal */}
      <AnimatePresence>
        {showMaintenanceConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#09090B]/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#111118] border border-[#2A2A3E] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="bg-[#EF4444]/10 p-5 border-b border-[#EF4444]/20 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
                <h2 className="text-lg font-bold text-white">Enable Maintenance Mode?</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#A0A0B8]">Maintenance Message (Public)</label>
                  <textarea
                    value={maintenanceMsg}
                    onChange={e => setMaintenanceMsg(e.target.value)}
                    className="w-full h-24 p-3 bg-[#0A0A12] border border-[#2A2A3E] rounded-xl text-white focus:outline-none focus:border-[#FF7A00] transition-colors resize-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#A0A0B8]">Scheduled End Time (Optional)</label>
                  <input
                    type="datetime-local"
                    value={maintenanceEnd}
                    onChange={e => setMaintenanceEnd(e.target.value)}
                    className="w-full h-11 px-3 bg-[#0A0A12] border border-[#2A2A3E] rounded-xl text-white focus:outline-none focus:border-[#FF7A00] transition-colors"
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer mt-4 p-3 bg-[#1A1A2E] rounded-xl border border-[#2A2A3E]">
                  <input
                    type="checkbox"
                    checked={maintenanceAgreed}
                    onChange={e => setMaintenanceAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#2A2A3E] bg-[#0A0A12] text-[#EF4444] focus:ring-[#EF4444] focus:ring-offset-[#111118]"
                  />
                  <span className="text-sm text-[#E0E0E0] leading-tight">
                    I understand this will immediately prevent all customer and seller access to the storefront and seller portals.
                  </span>
                </label>
              </div>
              <div className="p-5 border-t border-[#2A2A3E] flex justify-end gap-3 bg-[#0A0A12]">
                <button
                  onClick={() => { setShowMaintenanceConfirm(false); setMaintenanceAgreed(false) }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#A0A0B8] hover:text-white hover:bg-[#1E1E2E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMaintenance}
                  disabled={!maintenanceAgreed}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                >
                  Enable Maintenance Mode
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal Update Modal */}
      <AnimatePresence>
        {legalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#09090B]/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#111118] border border-[#2A2A3E] rounded-2xl w-full max-w-sm p-6 shadow-2xl"
            >
              <h2 className="text-lg font-bold text-white mb-4">
                Update {legalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'} Version
              </h2>
              <input
                type="text"
                placeholder="e.g. v2.4"
                value={newVersion}
                onChange={e => setNewVersion(e.target.value)}
                autoFocus
                className="w-full h-11 px-3 mb-6 bg-[#0A0A12] border border-[#2A2A3E] rounded-xl text-white font-mono focus:outline-none focus:border-[#FF7A00] transition-colors"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setLegalModal(null); setNewVersion('') }}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-[#A0A0B8] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateLegal}
                  disabled={!newVersion.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-[#FF7A00] hover:bg-[#FF9A40] disabled:opacity-50 text-white transition-colors"
                >
                  Update
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}