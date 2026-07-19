import { useLanguage } from '../../../i18n/LanguageContext'
import { useToast } from '../../components/Toast'
import { Check, ArrowRight, Crown, Zap, Building2, Sparkles, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const planIcons = {
  Starter: Zap,
  Pro: Crown,
  Business: Building2,
} as const

const planIconColors = {
  Starter: 'text-white/40',
  Pro: 'text-orange-400',
  Business: 'text-blue-400',
} as const

const planAccents: Record<string, string> = {
  Starter: 'border-white/[0.06] bg-white/[0.02]',
  Pro: 'border-orange-500/30 bg-orange-500/[0.04]',
  Business: 'border-blue-500/20 bg-blue-500/[0.03]',
}

export function PricingPage() {
  const { tp } = useLanguage()
  const { success } = useToast()
  const currentPlan = 'Starter'

  const plans = [
    {
      name: tp.pricingPage.starter,
      key: 'Starter' as const,
      price: '49',
      description: tp.pricingPage.starterDesc,
      features: tp.pricingPage.starterFeatures,
    },
    {
      name: tp.pricingPage.pro,
      key: 'Pro' as const,
      price: '149',
      description: tp.pricingPage.proDesc,
      features: tp.pricingPage.proFeatures,
      popular: true,
    },
    {
      name: tp.pricingPage.business,
      key: 'Business' as const,
      price: '299',
      description: tp.pricingPage.businessDesc,
      features: tp.pricingPage.businessFeatures,
    },
  ]

  const handleUpgrade = (planName: string) => {
    success(`${tp.pricingPage.changePlan}: ${planName}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{tp.pricingPage.title}</h1>
        <p className="mt-1 text-sm text-white/40">{tp.pricingPage.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = planIcons[plan.key]
          const isCurrent = plan.key === currentPlan
          const isUpgrade = plans.findIndex((p) => p.key === plan.key) > plans.findIndex((p) => p.key === currentPlan)

          return (
            <div
              key={plan.key}
              className={`relative rounded-2xl border p-6 transition-all hover:shadow-lg ${
                plan.popular
                  ? 'border-orange-500/40 bg-gradient-to-b from-orange-500/[0.08] to-transparent shadow-orange-500/5'
                  : planAccents[plan.key]
              } ${isCurrent ? 'ring-2 ring-orange-500/30' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles className="h-3 w-3" />
                    {tp.pricingPage.mostPopular}
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="absolute top-4 right-4">
                  <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-400">
                    {tp.pricingPage.currentPlan}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] ${planIconColors[plan.key]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-white/40">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-white/40">$</span>
                  <span className="font-display text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-sm text-white/40">{tp.pricingPage.perMonth}</span>
                </div>
              </div>

              <ul className="mb-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-white/60">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium text-white/30"
                >
                  {tp.pricingPage.yourPlan}
                </button>
              ) : isUpgrade ? (
                <button
                  onClick={() => handleUpgrade(plan.name)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25"
                >
                  {tp.pricingPage.changePlan}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.name)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium text-white/60 transition-all hover:bg-white/5 hover:text-white"
                >
                  {tp.pricingPage.changePlan}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="font-display text-lg font-bold text-white">{tp.pricingPage.futureRevenue}</h3>
        <p className="mt-2 text-sm text-white/40">{tp.pricingPage.futureRevenueDesc}</p>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div>
          <p className="text-sm font-medium text-white/60">{tp.pricingPage.questions}</p>
          <p className="mt-1 text-xs text-white/30">{tp.pricingPage.contactUs}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-white/5 hover:text-white"
        >
          {tp.pricingPage.contactUs}
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
