import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Info, CheckCircle2, AlertCircle, Settings } from 'lucide-react'
import { mockNotifications } from '../../data/mock'
import { useLanguage } from '../../../i18n/LanguageContext'

const typeConfig = {
  alert: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/15' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  success: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/15' },
  warning: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const { tp } = useLanguage()

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  const unread = notifications.filter((n) => !n.read)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{tp.notifications.title}</h1>
          <p className="mt-1 text-sm text-white/50">
            {unread.length > 0 ? tp.notifications.unread(unread.length) : tp.notifications.allCaughtUp}
          </p>
        </div>
        <div className="flex gap-2">
          {unread.length > 0 && (
            <button type="button" onClick={markAllRead} className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/[0.08]">
              {tp.notifications.markAllRead}
            </button>
          )}
          <button type="button" className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-2 text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white/60">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <div className="space-y-2">
        {notifications.map((notif, i) => {
          const config = typeConfig[notif.type]
          const Icon = config.icon
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.03 }}
              onClick={() => markRead(notif.id)}
              className={`flex items-start gap-4 rounded-xl border p-4 transition-all cursor-pointer ${
                notif.read
                  ? 'border-white/[0.04] bg-white/[0.01] opacity-60'
                  : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]'
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white/80">{notif.title}</p>
                  {!notif.read && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                </div>
                <p className="mt-1 text-xs text-white/40">{notif.description}</p>
              </div>
              <span className="shrink-0 text-[11px] text-white/30">{notif.time}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
