import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store'
import { useLanguage } from '../../../i18n/LanguageContext'
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const { tp } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    await new Promise((r) => setTimeout(r, 800))

    if (email && password) {
      login(email, password)
      navigate('/app')
    } else {
      setError(tp.auth.login.error)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-navy-950">
      <div className="hidden w-1/2 items-center justify-center lg:flex">
        <div className="relative w-full max-w-lg px-8">
          <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-orange-500/10 blur-[100px]" />
          <img src="/assets/logos/conicono-sobrenegro.svg" alt="REKORBIA" className="mb-8 h-12 w-auto" />
          <h2 className="font-display text-4xl font-bold leading-tight text-white">
            {tp.auth.login.tagline.split('Freight Brokers')[0]}
            <span className="gradient-text">Freight Brokers</span>
          </h2>
          <p className="mt-4 text-lg text-white/50">
            {tp.auth.login.description}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <img src="/assets/logos/principal-sobrenegro.svg" alt="REKORBIA" className="mb-6 h-8 w-auto" />
          </div>

          <h1 className="font-display text-3xl font-bold text-white">{tp.auth.login.welcomeBack}</h1>
          <p className="mt-2 text-sm text-white/50">{tp.auth.login.subtitle}</p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/60">{tp.auth.login.email}</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tp.auth.login.emailPlaceholder}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pr-4 pl-10 text-sm text-white/80 outline-none transition-colors placeholder:text-white/25 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">{tp.auth.login.password}</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tp.auth.login.passwordPlaceholder}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pr-12 pl-10 text-sm text-white/80 outline-none transition-colors placeholder:text-white/25 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-white/50">
                <input type="checkbox" className="rounded border-white/10 bg-white/5" />
                {tp.auth.login.rememberMe}
              </label>
              <a href="#" className="text-sm text-orange-400 hover:text-orange-300">
                {tp.auth.login.forgotPassword}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {tp.auth.login.signIn}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/40">
            {tp.auth.login.noAccount}{' '}
            <Link to="/signup" className="text-orange-400 hover:text-orange-300">
              {tp.auth.login.getStarted}
            </Link>
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <img src="/assets/logos/reducida-sobrenegro.svg" alt="REKORBIA" className="h-5 opacity-40" />
            <span className="text-xs text-white/20">BrokerOS AI</span>
          </div>
        </div>
      </div>
    </div>
  )
}
