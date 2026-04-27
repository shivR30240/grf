'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Wifi,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PLATFORMS = [
  {
    id: 'google',
    name: 'Google Ads',
    icon: '🔵',
    status: 'healthy',
    lastSync: '4 minutes ago',
    freshness: '99.8%',
    issues: 0,
  },
  {
    id: 'meta',
    name: 'Meta Ads',
    icon: '🟣',
    status: 'error',
    lastSync: '6 hours ago',
    freshness: '61%',
    issues: 2,
  },
  {
    id: 'analytics',
    name: 'Google Analytics 4',
    icon: '🟠',
    status: 'warning',
    lastSync: '22 minutes ago',
    freshness: '94%',
    issues: 1,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: '🟢',
    status: 'healthy',
    lastSync: '8 minutes ago',
    freshness: '100%',
    issues: 0,
  },
]

const ISSUES = [
  {
    id: 1,
    platform: 'Meta Ads',
    severity: 'critical',
    type: 'API Failure',
    title: 'Meta Ads API authentication failed',
    body: 'The connection to Meta\'s API expired. This is usually caused by a password change or security update on your Facebook account.',
    steps: [
      'Go to Settings → Integrations',
      'Click "Reconnect" next to Meta Ads',
      'Log in to your Facebook account and grant permissions',
      'Data will resume syncing automatically within 5 minutes',
    ],
  },
  {
    id: 2,
    platform: 'Meta Ads',
    severity: 'warning',
    type: 'Missing Data',
    title: 'Meta Ads missing 6 hours of impression data',
    body: 'Due to the API failure, impression data for 6 campaigns is unavailable for the time period 08:00–14:00 today. Performance metrics may appear lower than actual.',
    steps: [
      'Reconnect Meta Ads API (see issue above)',
      'Data for the gap period cannot be recovered retroactively',
      'Your performance charts may show a dip — this is a data gap, not a real drop',
    ],
  },
  {
    id: 3,
    platform: 'Google Analytics 4',
    severity: 'warning',
    type: 'Tracking Error',
    title: '14 conversions unmatched between Google Ads and GA4',
    body: 'Google Ads recorded 14 purchases that do not appear in GA4. This typically means your checkout confirmation page tag fires inconsistently — often due to a JavaScript error on some browsers.',
    steps: [
      'Use Google Tag Assistant to test your purchase tag on the checkout confirmation page',
      'Check for JavaScript errors in your browser console on checkout completion',
      'Verify the GA4 purchase event fires with the correct transaction ID',
      'Contact your developer if the issue persists',
    ],
  },
]

const statusConfig = {
  healthy: { dot: 'bg-green', label: 'Healthy',    text: 'text-green',  bg: 'bg-green/10  border-green/20' },
  warning: { dot: 'bg-amber', label: 'Warning',    text: 'text-amber',  bg: 'bg-amber/10  border-amber/20' },
  error:   { dot: 'bg-rose',  label: 'Error',      text: 'text-rose',   bg: 'bg-rose/10   border-rose/20'  },
}

const severityConfig = {
  critical: { icon: XCircle,       color: 'text-rose',  bg: 'bg-rose/10  border-rose/20' },
  warning:  { icon: AlertTriangle, color: 'text-amber', bg: 'bg-amber/10 border-amber/20' },
}

export default function DataQualityPage() {
  const [expanded, setExpanded] = useState<number[]>([])
  const [syncing, setSyncing]   = useState<string[]>([])

  const toggleExpand = (id: number) =>
    setExpanded((e) => e.includes(id) ? e.filter((x) => x !== id) : [...e, id])

  const triggerSync = (id: string) => {
    setSyncing((s) => [...s, id])
    setTimeout(() => setSyncing((s) => s.filter((x) => x !== id)), 2000)
  }

  const totalIssues   = ISSUES.length
  const criticalCount = ISSUES.filter((i) => i.severity === 'critical').length
  const healthyCount  = PLATFORMS.filter((p) => p.status === 'healthy').length

  return (
    <AppShell>
      <div className="p-5 md:p-8 max-w-5xl mx-auto space-y-7">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-brand" />
            <h1 className="text-2xl font-serif font-bold text-foreground">Data Quality</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor the health of your data connections and resolve issues that could affect your analytics.
          </p>
        </div>

        {/* Health Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Platforms Connected', value: `${healthyCount}/${PLATFORMS.length}`, color: healthyCount === PLATFORMS.length ? 'text-green' : 'text-amber' },
            { label: 'Open Issues',          value: totalIssues, color: totalIssues === 0 ? 'text-green' : 'text-rose' },
            { label: 'Critical',             value: criticalCount, color: criticalCount === 0 ? 'text-green' : 'text-rose' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
              <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Platform Status */}
        <section aria-labelledby="platform-status">
          <h2 id="platform-status" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Data Sources
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {PLATFORMS.map((p) => {
              const cfg = statusConfig[p.status as keyof typeof statusConfig]
              const isSyncing = syncing.includes(p.id)
              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
                >
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{p.name}</span>
                      <span className={cn('h-2 w-2 rounded-full shrink-0', cfg.dot)} aria-hidden="true" />
                      <Badge variant="outline" className={cn('text-[10px] font-semibold', cfg.bg, cfg.text)}>
                        {cfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {p.lastSync}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Wifi className="h-3 w-3" />
                        {p.freshness} fresh
                      </div>
                      {p.issues > 0 && (
                        <span className="text-xs font-semibold text-rose">{p.issues} issue{p.issues > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={() => triggerSync(p.id)}
                    aria-label={`Sync ${p.name}`}
                  >
                    <RefreshCw className={cn('h-4 w-4 transition-transform', isSyncing && 'animate-spin')} />
                  </Button>
                </div>
              )
            })}
          </div>
        </section>

        {/* Issues */}
        <section aria-labelledby="issues-heading">
          <h2 id="issues-heading" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Detected Issues ({ISSUES.length})
          </h2>
          {ISSUES.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <CheckCircle2 className="h-9 w-9 text-green/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">All data sources are healthy</p>
              <p className="text-xs text-muted-foreground mt-1">No issues detected. Your analytics data is accurate and up to date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ISSUES.map((issue) => {
                const cfg = severityConfig[issue.severity as keyof typeof severityConfig]
                const Icon = cfg.icon
                const isExpanded = expanded.includes(issue.id)

                return (
                  <div key={issue.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-sm transition-shadow">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', cfg.bg)}>
                          <Icon className={cn('h-4 w-4', cfg.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant="outline" className={cn('text-[10px] font-semibold', cfg.bg, cfg.color)}>
                              {issue.severity === 'critical' ? 'Critical' : 'Warning'}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] text-muted-foreground border-border">
                              {issue.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{issue.platform}</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground leading-snug">{issue.title}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed mt-1">{issue.body}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                          onClick={() => toggleExpand(issue.id)}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? (
                            <><ChevronUp className="h-3 w-3" />Hide fix steps</>
                          ) : (
                            <><ChevronDown className="h-3 w-3" />How to fix this</>
                          )}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border bg-muted/30 px-5 py-4">
                        <p className="text-xs font-semibold text-foreground mb-2.5">Step-by-step fix:</p>
                        <ol className="space-y-2">
                          {issue.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span className="text-sm text-muted-foreground leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}
