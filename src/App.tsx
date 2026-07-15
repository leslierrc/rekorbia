import { Navbar, Hero } from './components/Navbar'
import { ProblemSection } from './components/ProblemSection'
import { SolutionSection } from './components/SolutionSection'
import { FeaturesSection } from './components/FeaturesSection'
import { StatsSection, ComparisonSection } from './components/StatsSection'
import { CTASection, Footer } from './components/CTASection'

export default function App() {
  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <Hero />
      <ProblemSection />
      <StatsSection />
      <SolutionSection />
      <ComparisonSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
