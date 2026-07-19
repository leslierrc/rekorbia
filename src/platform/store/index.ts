import { create } from 'zustand'
import type { User } from '../data/mock'
import { currentUser } from '../data/mock'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, _password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (_email: string, _password: string) => {
    set({ user: currentUser, isAuthenticated: true })
    return true
  },
  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
}))

interface SidebarState {
  collapsed: boolean
  mobileOpen: boolean
  toggleCollapsed: () => void
  toggleMobile: () => void
  closeMobile: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  mobileOpen: false,
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
  toggleMobile: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
  closeMobile: () => set({ mobileOpen: false }),
}))
