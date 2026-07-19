import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useSidebarStore } from '../store'

export function AppLayout() {
  const { isAuthenticated } = useAuthStore()
  const { collapsed } = useSidebarStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-navy-950">
      <Sidebar />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
