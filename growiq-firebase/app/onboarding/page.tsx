'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Zap,
  ArrowRight,
  Check,
  Sun,
  Moon,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Step data ──────────────────────────────────────────────── */
const STEPS = [
  'Welcome',
  'Your Goal',
  'Connect Platforms',
  'Preferences',
  'Ready!',
]

const GOALS = [
  { value: 'roas',    emoji: '📈', label: 'Improve ROAS', desc: 'Get more revenue from every dollar you spend.' },
  { value: 'sales',   emoji: '💰', label: 'Increase Sales', desc: 'Grow total orders and revenue.' },
  { value: 'cpa',     emoji: '🎯', label: 'Reduce CPA', desc: 'Lower the cost to acquire each customer.' },
  { value: 'budget',  emoji: '🏦', label: 'Stay Within Budget', desc: 'Never exceed your ad budget.' },
  { value: 'acquire', emoji: '🌱', label: 'Acquire New Customers', desc: 'Expand your customer base.' },
]

const PLATFORMS = [
  { id: 'google', logo: '🔵', name: 'Google Ads', desc: 'Search, Shopping & Display campaigns' },
  { id: 'meta',   logo: '🟣', name: 'Meta Ads',   desc: 'Facebook & Instagram campaigns' },
  { id: 'ga4',    logo: '🟠', name: 'GA4',         desc: 'Website analytics & conversions' },
  { id: 'shopify',logo: '🟢', name: 'Shopify',     desc: 'Orders & revenue data' },
]

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Portuguese']

/* ── Progress indicator ─────────────────────────────────────── */
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'rounded-full transition-all duration-300',
            i === current
              ? 'h-2 w-6 bg-primary'
              : i < current
                ? 'h-2 w-2 bg-primary/40'
                : 'h-2 w-2 bg-border'
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [step, setStep] = useState(0)
  const { user } = useAuth()
  const [name, setName] = useState('')

  useEffect(() => {
    if (user?.displayName && !name) setName(user.displayName)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  const [business, setBusiness] = useState('')
  const [goal, setGoal] = useState('')
  const [platforms, setPlatforms] = useState<string[]>([])
  const [lang, setLang] = useState('English')

  const totalSteps = STEPS.length

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const togglePlatform = (id: string) =>
    setPlatforms((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])

  const canNext = () => {
    if (step === 0) return name.trim().length > 0
    if (step === 1) return goal !== ''
    if (step === 2) return platforms.length > 0
    return true
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span className="font-serif text-2xl font-bold text-foreground tracking-tight">GrowIQ</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-lg overflow-hidden">

        {/* Top progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          />
        </div>

        <div className="p-8 space-y-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between">
            <StepDots current={step} total={totalSteps} />
            <span className="text-xs text-muted-foreground">
              Step {step + 1} of {totalSteps}
            </span>
          </div>

          {/* ── Step 0: Welcome ── */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground text-balance">
                  Welcome to GrowIQ
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  Set up takes less than 2 minutes. We&apos;ll personalize your dashboard based on your answers.
                </p>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Your name</label>
                  <Input
                    id="name"
                    placeholder="Sarah Brown"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && canNext() && next()}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="business" className="text-sm font-medium text-foreground">
                    Business name <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input
                    id="business"
                    placeholder="My Business LLC"
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                    className="h-10"
                    onKeyDown={(e) => e.key === 'Enter' && canNext() && next()}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Goal ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {name
                    ? `What's your main goal, ${name.split(' ')[0]}?`
                    : "What\u2019s your main goal?"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  We&apos;ll prioritize the insights and recommendations that matter most for this goal.
                </p>
              </div>
              <div className="space-y-2" role="radiogroup" aria-label="Business goal">
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    role="radio"
                    aria-checked={goal === g.value}
                    onClick={() => setGoal(g.value)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all',
                      goal === g.value
                        ? 'border-primary bg-accent shadow-sm'
                        : 'border-border bg-background hover:border-primary/40 hover:bg-muted/30'
                    )}
                  >
                    <span className="text-xl shrink-0 leading-none">{g.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{g.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{g.desc}</p>
                    </div>
                    {goal === g.value && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Connect ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Connect your ad platforms</h2>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  Select every platform you advertise on. You can always connect more later in Settings.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3" role="group" aria-label="Ad platforms">
                {PLATFORMS.map((p) => {
                  const selected = platforms.includes(p.id)
                  return (
                    <button
                      key={p.id}
                      aria-pressed={selected}
                      onClick={() => togglePlatform(p.id)}
                      className={cn(
                        'rounded-xl border p-4 flex flex-col items-start gap-2 transition-all text-left',
                        selected
                          ? 'border-primary bg-accent shadow-sm'
                          : 'border-border bg-background hover:border-primary/40 hover:bg-muted/30'
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="text-xl leading-none">{p.logo}</span>
                        {selected && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{p.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Step 3: Preferences ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Almost there!</h2>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  Set your preferred language and appearance.
                </p>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm text-left transition-all',
                        lang === l
                          ? 'border-primary bg-accent font-semibold text-foreground'
                          : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Appearance</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'light',  label: 'Light',  Icon: Sun },
                    { value: 'dark',   label: 'Dark',   Icon: Moon },
                    { value: 'system', label: 'System', Icon: Zap },
                  ].map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={cn(
                        'rounded-lg border p-3 flex flex-col items-center gap-1.5 transition-all',
                        theme === value
                          ? 'border-primary bg-accent'
                          : 'border-border bg-background hover:border-primary/40'
                      )}
                      aria-pressed={theme === value}
                    >
                      <Icon className={cn('h-[18px] w-[18px]', theme === value ? 'text-primary' : 'text-muted-foreground')} />
                      <span className={cn('text-xs font-medium', theme === value ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Ready ── */}
          {step === 4 && (
            <div className="space-y-5 text-center py-4">
              <div className="h-16 w-16 rounded-2xl bg-green/10 flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-green" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {name ? `You're all set, ${name.split(' ')[0]}!` : "You're all set!"}
                </h2>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-sm mx-auto">
                {"Your personalized dashboard is ready. We've analyzed your connected platforms and have "}
                {goal ? GOALS.find((g) => g.value === goal)?.label.toLowerCase() : 'performance'}
                {" recommendations waiting for you."}
              </p>
              </div>
              <div className="flex flex-col gap-2 pt-2 text-sm text-muted-foreground">
                {[
                  { label: 'Goal', value: GOALS.find((g) => g.value === goal)?.label },
                  { label: 'Platforms', value: platforms.map((id) => PLATFORMS.find((p) => p.id === id)?.name).join(', ') },
                  { label: 'Language', value: lang },
                ].filter((r) => r.value).map((r) => (
                  <div key={r.label} className="flex justify-between px-4 py-2 bg-muted/50 rounded-lg">
                    <span className="font-medium text-foreground">{r.label}</span>
                    <span>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-3 pt-2">
            {step > 0 && (
              <Button
                variant="ghost" size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={prev}
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
            )}
            <div className="flex-1" />
            {step < totalSteps - 1 ? (
              <Button
                className="gap-2"
                onClick={next}
                disabled={!canNext()}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="gap-2 px-6"
                onClick={() => router.push('/')}
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Already have an account?{' '}
        <button className="text-primary hover:underline" onClick={() => router.push('/')}>
          Sign in
        </button>
      </p>
    </div>
  )
}
