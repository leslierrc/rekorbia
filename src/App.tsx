import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider } from './i18n/LanguageContext'
import { Navbar, Hero } from './components/Navbar'
import { ProblemSection } from './components/ProblemSection'
import { SolutionSection } from './components/SolutionSection'
import { FeaturesSection } from './components/FeaturesSection'
import { StatsSection, ComparisonSection } from './components/StatsSection'
import { CTASection, Footer } from './components/CTASection'
import { PricingSection } from './components/PricingSection'
import { AppLayout } from './platform/components/AppLayout'
import { ToastProvider } from './platform/components/Toast'
import { LoginPage } from './platform/pages/auth/LoginPage'
import { SignupPage } from './platform/pages/auth/SignupPage'
import { DashboardPage } from './platform/pages/dashboard/DashboardPage'
import { AIAssistantPage } from './platform/pages/dashboard/AIAssistantPage'
import { AnalyticsPage } from './platform/pages/dashboard/AnalyticsPage'
import { LoadsListPage } from './platform/pages/loads/LoadsListPage'
import { LoadDetailPage } from './platform/pages/loads/LoadDetailPage'
import { CreateLoadPage } from './platform/pages/loads/CreateLoadPage'
import { CRMPage } from './platform/pages/crm/CRMPage'
import { CustomerDetailPage } from './platform/pages/crm/CustomerDetailPage'
import { CarriersPage } from './platform/pages/carriers/CarriersPage'
import { InvoicingPage } from './platform/pages/invoicing/InvoicingPage'
import { DocumentsPage } from './platform/pages/documents/DocumentsPage'
import { TrackingPage } from './platform/pages/tracking/TrackingPage'
import { NotificationsPage } from './platform/pages/notifications/NotificationsPage'
import { SettingsPage } from './platform/pages/settings/SettingsPage'
import { PricingPage } from './platform/pages/pricing/PricingPage'

const queryClient = new QueryClient()

function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <Hero />
      <ProblemSection />
      <StatsSection />
      <SolutionSection />
      <ComparisonSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route path="/app" element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="ai" element={<AIAssistantPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="loads" element={<LoadsListPage />} />
                <Route path="loads/new" element={<CreateLoadPage />} />
                <Route path="loads/:id" element={<LoadDetailPage />} />
                <Route path="crm" element={<CRMPage />} />
                <Route path="crm/:id" element={<CustomerDetailPage />} />
                <Route path="carriers" element={<CarriersPage />} />
                <Route path="carriers/:id" element={<CarriersPage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="invoicing" element={<InvoicingPage />} />
                <Route path="invoicing/:id" element={<InvoicingPage />} />
                <Route path="tracking" element={<TrackingPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}
