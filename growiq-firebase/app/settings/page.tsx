'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useTheme } from 'next-themes'
import {
  Settings,
  Link2,
  Link2Off,
  Target,
  Globe,
  Sun,
  Moon,
  User,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'goals',        label: 'Goals',         icon: Target },
  { id: 'language',     label: 'Language',       icon: Globe },
  { id: 'theme',        label: 'Appearance',     icon: Sun },
  { id: 'account',      label: 'Account',        icon: User },
]

const INTEGRATIONS = [
  {
    id: 'google',
    name: 'Google Ads',
    description: 'Connect your Google Ads account to import campaign data and apply optimizations.',
    logo: '🔵',
    connected: true,
    account: 'sarah@mybiz.com',
    lastSync: '4 minutes ago',
  },
  {
    id: 'meta',
    name: 'Meta Ads',
    description: 'Connect your Facebook / Instagram Ads account to import campaign data.',
    logo: '🟣',
    connected: true,
    account: 'sarahbrown_biz',
    lastSync: '6 hours ago (error)',
    hasError: true,
  },
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    description: 'Import website and conversion data to enhance attribution and reporting.',
    logo: '🟠',
    connected: true,
    account: 'GA4-229-845102',
    lastSync: '22 minutes ago',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Sync your Shopify orders and revenue data for accurate ROAS calculations.',
    logo: '🟢',
    connected: true,
    account: 'mybiz.myshopify.com',
    lastSync: '8 minutes ago',
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    description: 'Connect TikTok Ads Manager to track video ad performance.',
    logo: '⚫',
    connected: false,
  },
]

const GOALS = [
  { value: 'roas',    label: 'Improve ROAS', description: 'Maximize return on every dollar spent.' },
  { value: 'sales',   label: 'Increase Sales', description: 'Drive more orders and revenue.' },
  { value: 'cpa',     label: 'Reduce CPA', description: 'Lower the cost to acquire each customer.' },
  { value: 'budget',  label: 'Stay Within Budget', description: 'Never exceed your monthly ad budget.' },
  { value: 'acquire', label: 'Acquire New Customers', description: 'Grow your customer base.' },
]

const LANGUAGES = ['English', 'Spanish (Español)', 'French (Français)', 'German (Deutsch)', 'Portuguese (Português)']

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [section, setSection] = useState('integrations')
  const [goal, setGoal]       = useState('roas')
  const [lang, setLang]       = useState('English')
  const [connecting, setConnecting] = useState<string[]>([])
  const [disconnecting, setDisconnecting] = useState<string[]>([])

  const [profile, setProfile] = useState({
    name: 'Sarah Brown',
    email: 'sarah@mybiz.com',
    business: 'My Business LLC',
  })
  const [saved, setSaved] = useState(false)

  const fakeConnect = (id: string) => {
    setConnecting((c) => [...c, id])
    setTimeout(() => setConnecting((c) => c.filter((x) => x !== id)), 1800)
  }

  const saveProfile = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppShell>
      <div className="p-5 md:p-8 max-w-5xl mx-auto space-y-7">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="h-5 w-5 text-brand" />
            <h1 className="text-2xl font-serif font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your integrations, goals, preferences, and account details.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar nav */}
          <nav className="md:w-44 shrink-0" aria-label="Settings sections">
            <ul className="flex md:flex-col gap-1" role="list">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    onClick={() => setSection(id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all text-left',
                      section === id
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    )}
                    aria-current={section === id ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline md:inline">{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Integrations */}
            {section === 'integrations' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Ad Platform Integrations</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Connect your advertising platforms to import data automatically.</p>
                </div>
                <div className="space-y-3">
                  {INTEGRATIONS.map((integ) => (
                    <div
                      key={integ.id}
                      className={cn(
                        'rounded-xl border p-4 flex items-center gap-4 transition-shadow hover:shadow-sm',
                        integ.hasError ? 'border-rose/30 bg-rose/5' : 'border-border bg-card'
                      )}
                    >
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
                        {integ.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">{integ.name}</span>
                          {integ.connected ? (
                            integ.hasError ? (
                              <Badge variant="outline" className="text-[10px] font-semibold bg-rose/10 text-rose border-rose/20">
                                <AlertCircle className="h-2.5 w-2.5 mr-1" />Error
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] font-semibold bg-green/10 text-green border-green/20">
                                <CheckCircle2 className="h-2.5 w-2.5 mr-1" />Connected
                              </Badge>
                            )
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{integ.description}</p>
                        {integ.connected && (
                          <div className="flex gap-3 mt-1 flex-wrap">
                            <span className="text-[11px] text-muted-foreground">Account: {integ.account}</span>
                            <span className="text-[11px] text-muted-foreground">Last sync: {integ.lastSync}</span>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0">
                        {integ.connected ? (
                          integ.hasError ? (
                            <Button
                              size="sm" variant="outline"
                              className="h-7 text-xs gap-1.5"
                              onClick={() => fakeConnect(integ.id)}
                              disabled={connecting.includes(integ.id)}
                            >
                              <RefreshCw className={cn('h-3 w-3', connecting.includes(integ.id) && 'animate-spin')} />
                              Reconnect
                            </Button>
                          ) : (
                            <Button
                              size="sm" variant="ghost"
                              className="h-7 text-xs text-muted-foreground gap-1"
                              onClick={() => setDisconnecting((d) => d.includes(integ.id) ? d.filter((x) => x !== integ.id) : [...d, integ.id])}
                            >
                              <Link2Off className="h-3 w-3" />Disconnect
                            </Button>
                          )
                        ) : (
                          <Button
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => fakeConnect(integ.id)}
                            disabled={connecting.includes(integ.id)}
                          >
                            <Link2 className="h-3 w-3" />
                            {connecting.includes(integ.id) ? 'Connecting…' : 'Connect'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Goals */}
            {section === 'goals' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Primary Business Goal</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Your goal shapes which metrics and recommendations are highlighted throughout the platform.
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
                        'w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-all',
                        goal === g.value
                          ? 'border-primary bg-accent'
                          : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
                      )}
                    >
                      <div className={cn('h-4 w-4 rounded-full border-2 shrink-0 transition-all', goal === g.value ? 'border-primary bg-primary' : 'border-muted-foreground/40')} />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{g.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{g.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <Button className="w-full sm:w-auto">Save Goal</Button>
              </div>
            )}

            {/* Language */}
            {section === 'language' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Interface Language</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Choose the language for all labels, dates, number formats, and help text.
                  </p>
                </div>
                <div className="space-y-2" role="radiogroup">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      role="radio"
                      aria-checked={lang === l}
                      onClick={() => setLang(l)}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-all',
                        lang === l
                          ? 'border-primary bg-accent'
                          : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
                      )}
                    >
                      <div className={cn('h-4 w-4 rounded-full border-2 shrink-0', lang === l ? 'border-primary bg-primary' : 'border-muted-foreground/40')} />
                      <span className="text-sm font-medium text-foreground">{l}</span>
                    </button>
                  ))}
                </div>
                <Button className="w-full sm:w-auto">Save Language</Button>
              </div>
            )}

            {/* Appearance */}
            {section === 'theme' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Appearance</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Choose how GrowIQ looks to you.</p>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: Sun, desc: 'Clean, bright interface.' },
                    { value: 'dark',  label: 'Dark',  icon: Moon, desc: 'Easier on the eyes at night.' },
                    { value: 'system', label: 'System', icon: Settings, desc: 'Follows your device setting.' },
                  ].map(({ value, label, icon: Icon, desc }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={cn(
                        'rounded-xl border p-4 flex flex-col items-center gap-2 text-center transition-all',
                        theme === value
                          ? 'border-primary bg-accent'
                          : 'border-border bg-card hover:border-primary/40'
                      )}
                      aria-pressed={theme === value}
                    >
                      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', theme === value ? 'bg-primary/10' : 'bg-muted')}>
                        <Icon className={cn('h-5 w-5', theme === value ? 'text-primary' : 'text-muted-foreground')} />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{label}</span>
                      <span className="text-xs text-muted-foreground">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Account */}
            {section === 'account' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Account Details</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Update your personal information and business details.</p>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">SB</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{profile.name}</p>
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
                  </div>
                </div>

                <div className="space-y-3 max-w-sm">
                  {[
                    { label: 'Full Name', key: 'name' as const },
                    { label: 'Email Address', key: 'email' as const },
                    { label: 'Business Name', key: 'business' as const },
                  ].map(({ label, key }) => (
                    <div key={key} className="space-y-1.5">
                      <label htmlFor={key} className="text-sm font-medium text-foreground">{label}</label>
                      <Input
                        id={key}
                        value={profile[key]}
                        onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                        className="h-9"
                      />
                    </div>
                  ))}
                </div>

                <Button onClick={saveProfile} className="w-full sm:w-auto">
                  {saved ? (
                    <><CheckCircle2 className="h-4 w-4 mr-2" />Saved!</>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
