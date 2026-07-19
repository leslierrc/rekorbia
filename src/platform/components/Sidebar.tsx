import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Truck,
  Users,
  Building2,
  FileText,
  Receipt,
  MapPin,
  Bell,
  Settings,
  ChevronLeft,
  LogOut,
  X,
  Globe,
  BarChart3,
  CreditCard,
} from 'lucide-react'
import { useSidebarStore, useAuthStore } from '../store'
import { clsx } from 'clsx'
import { useLanguage } from '../../i18n/LanguageContext'

const roleLabels: Record<string, Record<string, string>> = {
  admin: { es: 'Administrador', en: 'Admin' },
}

export function Sidebar() {
  const { collapsed, mobileOpen, toggleCollapsed, closeMobile } = useSidebarStore()
  const { user, logout } = useAuthStore()
  const { tp, language, setLanguage } = useLanguage()

  const navItems = [
    { to: '/app', icon: LayoutDashboard, label: tp.sidebar.dashboard, end: true },
    { to: '/app/ai', icon: MessageSquare, label: tp.sidebar.ai },
    { to: '/app/loads', icon: Truck, label: tp.sidebar.loads },
    { to: '/app/crm', icon: Users, label: tp.sidebar.crm },
    { to: '/app/carriers', icon: Building2, label: tp.sidebar.carriers },
    { to: '/app/documents', icon: FileText, label: tp.sidebar.documents },
    { to: '/app/invoicing', icon: Receipt, label: tp.sidebar.invoicing },
    { to: '/app/tracking', icon: MapPin, label: tp.sidebar.tracking },
    { to: '/app/analytics', icon: BarChart3, label: tp.sidebar.analytics },
    { to: '/app/notifications', icon: Bell, label: tp.sidebar.notifications },
    { to: '/app/pricing', icon: CreditCard, label: tp.sidebar.pricing },
    { to: '/app/settings', icon: Settings, label: tp.sidebar.settings },
  ]

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-white/[0.06] bg-navy-950 transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className={clsx(
          'flex h-16 items-center border-b border-white/[0.06] px-4',
          collapsed ? 'justify-center' : 'gap-3'
        )}>
          {!collapsed && (
            <img
              src="/assets/logos/principal-sobrenegro.svg"
              alt="REKORBIA"
              className="h-7 w-auto object-contain"
            />
          )}
          {collapsed && (
            <img
              src="/assets/logos/reducida-sobrenegro.svg"
              alt="REKORBIA"
              className="h-7 w-7 object-contain"
            />
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="ml-auto hidden rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70 lg:block"
          >
            <ChevronLeft className={clsx('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
          <button
            type="button"
            onClick={closeMobile}
            className="ml-auto rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeMobile}
                className={({ isActive }) => clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  collapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-orange-500/10 text-orange-400'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          {!collapsed && (
            <button
              type="button"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'es' ? 'English' : 'Español'}</span>
            </button>
          )}
          {collapsed && (
            <button
              type="button"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="mb-2 flex w-full items-center justify-center rounded-lg p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
              title={language === 'es' ? 'English' : 'Español'}
            >
              <Globe className="h-4 w-4" />
            </button>
          )}
          <div className={clsx(
            'flex items-center gap-3 rounded-lg px-3 py-2',
            collapsed && 'justify-center px-2'
          )}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-400">
              {user?.name?.[0] || 'U'}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/80">{user?.name}</p>
                <p className="truncate text-xs text-white/40">{user?.role ? (roleLabels[user.role]?.[language] || user.role) : ''}</p>
              </div>
            )}
            {!collapsed && (
              <button
                type="button"
                onClick={logout}
                className="shrink-0 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-orange-400"
                title={tp.sidebar.logout}
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
