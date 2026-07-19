import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Building2, Bell, Shield, Palette, Save } from 'lucide-react'
import { useAuthStore } from '../../store'
import { useLanguage } from '../../../i18n/LanguageContext'

export function SettingsPage() {
  const { user } = useAuthStore()
  const { tp } = useLanguage()
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'notifications' | 'security' | 'appearance'>('profile')
  const [saved, setSaved] = useState(false)

  const tabs = [
    { key: 'profile' as const, icon: User, label: tp.settings.profile },
    { key: 'company' as const, icon: Building2, label: tp.settings.company },
    { key: 'notifications' as const, icon: Bell, label: tp.settings.notificationsPrefs },
    { key: 'security' as const, icon: Shield, label: tp.settings.security },
    { key: 'appearance' as const, icon: Palette, label: tp.settings.appearance },
  ]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white">{tp.settings.title}</h1>
        <p className="mt-1 text-sm text-white/50">{tp.settings.subtitle}</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2 lg:col-span-1">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-orange-500/10 text-orange-400'
                      : 'text-white/50 hover:bg-white/5 hover:text-white/70'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <h3 className="font-display text-lg font-bold text-white">{tp.settings.profile}</h3>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 font-display text-2xl font-bold text-orange-400">
                  {user?.name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">{user?.name}</p>
                  <p className="text-xs text-white/40">{user?.email}</p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField label={tp.settings.fullName} defaultValue={user?.name || ''} />
                <InputField label={tp.settings.email} defaultValue={user?.email || ''} />
                <InputField label={tp.settings.phone} defaultValue="(214) 555-0100" />
                <InputField label={tp.settings.role} defaultValue={user?.role || ''} disabled />
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-5">
              <h3 className="font-display text-lg font-bold text-white">{tp.settings.company}</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField label={tp.settings.companyName} defaultValue="REKORBIA" />
                <InputField label={tp.settings.mcNumber} defaultValue="MC-123456" />
                <InputField label={tp.settings.dotNumber} defaultValue="DOT-789012" />
                <InputField label={tp.settings.address} defaultValue="Dallas, TX" />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h3 className="font-display text-lg font-bold text-white">{tp.settings.notificationsPrefs}</h3>
              <div className="space-y-4">
                {[tp.settings.newLoadEmails, tp.settings.carrierUpdates, tp.settings.invoiceReminders, tp.settings.insuranceAlerts, tp.settings.aiSuggestions, tp.settings.weeklySummary].map((item) => (
                  <label key={item} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                    <span className="text-sm text-white/70">{item}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/20 bg-white/5 accent-orange-500" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <h3 className="font-display text-lg font-bold text-white">{tp.settings.security}</h3>
              <div className="space-y-4">
                <InputField label={tp.settings.currentPassword} type="password" defaultValue="" placeholder={tp.settings.enterCurrent} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField label={tp.settings.newPassword} type="password" defaultValue="" placeholder={tp.settings.enterNew} />
                  <InputField label={tp.settings.confirmPassword} type="password" defaultValue="" placeholder={tp.settings.confirmNew} />
                </div>
                <label className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <div>
                    <p className="text-sm text-white/70">{tp.settings.twoFactor}</p>
                    <p className="text-xs text-white/40">{tp.settings.twoFactorDesc}</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 accent-orange-500" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <h3 className="font-display text-lg font-bold text-white">{tp.settings.appearance}</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <span className="text-sm text-white/70">{tp.settings.compactSidebar}</span>
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 accent-orange-500" />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <span className="text-sm text-white/70">{tp.settings.showAISuggestions}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-white/20 bg-white/5 accent-orange-500" />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <span className="text-sm text-white/70">{tp.settings.soundNotifications}</span>
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 accent-orange-500" />
                </label>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
            <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25">
              <Save className="h-4 w-4" />
              {saved ? tp.settings.saved : tp.settings.saveChanges}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function InputField({ label, type = 'text', defaultValue, placeholder, disabled }: {
  label: string; type?: string; defaultValue: string; placeholder?: string; disabled?: boolean
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/60">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white/80 outline-none transition-colors placeholder:text-white/25 focus:border-orange-500/50 disabled:opacity-50"
      />
    </div>
  )
}
