import { create } from 'zustand'
import type { User, Load, Notification, AIInboxItem, WorkflowEvent, Invoice, DocRecord } from '../data/mock'
import {
  currentUser,
  mockLoads,
  mockNotifications,
  mockAIInbox,
  mockWorkflowEvents,
  mockInvoices,
  mockDocuments,
} from '../data/mock'

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

// ── Domain stores ──────────────────────────────────────────────
// These back the operational data (loads, notifications, AI inbox, workflow
// timeline, invoices). They're seeded from data/mock.ts but mutations live
// here in Zustand so every page shares the same live state instead of each
// page reading its own frozen copy of the mock arrays.

function genId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

interface LoadsState {
  loads: Load[]
  nextLoadNumber: () => number
  addLoad: (draft: Omit<Load, 'id' | 'loadNumber' | 'createdAt'>) => Load
  updateLoad: (id: string, patch: Partial<Load>) => void
  getLoad: (id: string) => Load | undefined
}

export const useLoadsStore = create<LoadsState>((set, get) => ({
  loads: mockLoads,
  nextLoadNumber: () => Math.max(1587, ...get().loads.map((l) => l.loadNumber)) + 1,
  addLoad: (draft) => {
    const load: Load = {
      ...draft,
      id: genId('load'),
      loadNumber: get().nextLoadNumber(),
      createdAt: new Date().toISOString(),
    }
    set((s) => ({ loads: [load, ...s.loads] }))
    return load
  },
  updateLoad: (id, patch) => {
    set((s) => ({ loads: s.loads.map((l) => (l.id === id ? { ...l, ...patch } : l)) }))
  },
  getLoad: (id) => get().loads.find((l) => l.id === id),
}))

interface NotificationsState {
  notifications: Notification[]
  addNotification: (n: Omit<Notification, 'id' | 'time' | 'read'> & { read?: boolean }) => void
  markRead: (id: string) => void
  markAllRead: () => void
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: mockNotifications,
  addNotification: (n) => {
    set((s) => ({
      notifications: [
        { id: genId('notif'), time: 'Just now', read: false, ...n },
        ...s.notifications,
      ],
    }))
  },
  markRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
}))

interface InboxState {
  items: AIInboxItem[]
  updateItem: (id: string, patch: Partial<AIInboxItem>) => void
}

export const useInboxStore = create<InboxState>((set) => ({
  items: mockAIInbox,
  updateItem: (id, patch) => set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
}))

interface WorkflowState {
  events: WorkflowEvent[]
  addEvent: (e: Omit<WorkflowEvent, 'id' | 'timestamp'> & { timestamp?: string }) => void
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  events: mockWorkflowEvents,
  addEvent: (e) => {
    set((s) => ({
      events: [...s.events, { id: genId('evt'), timestamp: new Date().toISOString(), ...e }],
    }))
  },
}))

interface InvoicesState {
  invoices: Invoice[]
  addInvoice: (draft: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice
  updateInvoice: (id: string, patch: Partial<Invoice>) => void
}

export const useInvoicesStore = create<InvoicesState>((set, get) => ({
  invoices: mockInvoices,
  addInvoice: (draft) => {
    const seq = get().invoices.length + 89
    const invoice: Invoice = {
      ...draft,
      id: genId('inv'),
      invoiceNumber: `INV-2026-${String(seq).padStart(4, '0')}`,
    }
    set((s) => ({ invoices: [invoice, ...s.invoices] }))
    return invoice
  },
  updateInvoice: (id, patch) => set((s) => ({ invoices: s.invoices.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
}))

interface DocumentsState {
  docs: DocRecord[]
  addDoc: (draft: Omit<DocRecord, 'id' | 'createdAt'>) => DocRecord
  removeDoc: (id: string) => void
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
  docs: mockDocuments,
  addDoc: (draft) => {
    const doc: DocRecord = { ...draft, id: genId('doc'), createdAt: new Date().toISOString().slice(0, 10) }
    set((s) => ({ docs: [doc, ...s.docs] }))
    return doc
  },
  removeDoc: (id) => set((s) => ({ docs: s.docs.filter((d) => d.id !== id) })),
}))
