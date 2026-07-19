import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store'
import { useLanguage } from '../../../i18n/LanguageContext'
import { ArrowRight, Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react'

export function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const { tp } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    login(form.email, form.password)
    navigate('/app')
    setLoading(false)
  }

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  return (
    <div className="flex min-h-screen bg-navy-950">
      <div className="hidden w-1/2 items-center justify-center lg:flex">
        <div className="relative w-full max-w-lg px-8">
          <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-orange-500/10 blur-[100px]" />
          <img src="/assets/logos/conicono-sobrenegro.svg" alt="REKORBIA" className="mb-8 h-12 w-auto" />
          <h2 className="font-display text-4xl font-bold leading-tight text-white">
            {tp.auth.signup.startSmarter}
            <span className="gradient-text">{tp.auth.signup.smarter}</span>
          </h2>
          <p className="mt-4 text-lg text-white/50">
            {tp.auth.signup.description}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <img src="/assets/logos/principal-sobrenegro.svg" alt="REKORBIA" className="mb-6 h-8 w-auto" />
          </div>

          <h1 className="font-display text-3xl font-bold text-white">{tp.auth.signup.title}</h1>
          <p className="mt-2 text-sm text-white/50">{tp.auth.signup.subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/60">{tp.auth.signup.fullName}</label>
              <div className="relative">
                <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder={tp.auth.signup.namePlaceholder}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pr-4 pl-10 text-sm text-white/80 outline-none transition-colors placeholder:text-white/25 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">{tp.auth.signup.email}</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder={tp.auth.signup.emailPlaceholder}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pr-4 pl-10 text-sm text-white/80 outline-none transition-colors placeholder:text-white/25 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">{tp.auth.signup.company}</label>
              <div className="relative">
                <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                  placeholder={tp.auth.signup.companyPlaceholder}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pr-4 pl-10 text-sm text-white/80 outline-none transition-colors placeholder:text-white/25 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/60">{tp.auth.signup.password}</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder={tp.auth.signup.passwordPlaceholder}
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

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {tp.auth.signup.createAccount}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/40">
            {tp.auth.signup.hasAccount}{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300">
              {tp.auth.signup.signIn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
