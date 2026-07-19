import { Menu, Search, Bell } from 'lucide-react'
import { useSidebarStore, useAuthStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

export function TopBar() {
  const { toggleMobile } = useSidebarStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { tp } = useLanguage()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return tp.topbar.greeting.morning
    if (h < 18) return tp.topbar.greeting.afternoon
    return tp.topbar.greeting.evening
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/[0.06] bg-navy-950/80 px-4 backdrop-blur-xl lg:px-6">
        <button
          type="button"
          onClick={toggleMobile}
          className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white/80 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-1 items-center gap-3">
          <h1 className="hidden text-sm font-medium text-white/60 md:block">
            {greeting()}, <span className="text-white/90">{user?.name}</span>
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/40 transition-colors hover:border-white/10 hover:text-white/60"
        >
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">{tp.topbar.search}</span>
          <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/30 md:inline">⌘K</kbd>
        </button>

        <button
          type="button"
          onClick={() => navigate('/app/notifications')}
          className="relative rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500" />
        </button>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-[20vh] backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-navy-900 p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-white/40" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tp.topbar.searchPlaceholder}
                className="flex-1 bg-transparent text-sm text-white/80 outline-none placeholder:text-white/30"
              />
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/30">ESC</kbd>
            </div>
            {searchQuery && (
              <div className="mt-3 border-t border-white/[0.06] pt-3">
                <p className="px-2 text-xs text-white/30">{tp.topbar.searchResultsFor} &quot;{searchQuery}&quot;</p>
                <div className="mt-2 space-y-1">
                  <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white/80" onClick={() => { setSearchOpen(false); navigate('/app/loads') }}>
                    <span className="text-xs text-white/20">{tp.sidebar.loads}</span>
                    <span>Load #1587 — Dallas → Atlanta</span>
                  </button>
                  <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white/80" onClick={() => { setSearchOpen(false); navigate('/app/carriers') }}>
                    <span className="text-xs text-white/20">{tp.sidebar.carriers}</span>
                    <span>Lone Star Trucking</span>
                  </button>
                </div>
              </div>
            )}
            {!searchQuery && (
              <div className="mt-3 border-t border-white/[0.06] pt-3">
                <p className="px-2 text-xs text-white/30">{tp.topbar.quickActions}</p>
                <div className="mt-2 space-y-1">
                  <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white/80" onClick={() => { setSearchOpen(false); navigate('/app/loads/new') }}>
                    <span className="text-orange-400">+</span> {tp.topbar.createLoad}
                  </button>
                  <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white/80" onClick={() => { setSearchOpen(false); navigate('/app/ai') }}>
                    <span className="text-orange-400">⚡</span> {tp.topbar.openAI}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
