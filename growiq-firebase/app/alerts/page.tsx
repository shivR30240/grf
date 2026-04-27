'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Bell,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const ALL_ALERTS = [
  {
    id: 1, severity: 'critical', type: 'anomaly',
    title: 'ROAS dropped by 15% in Google Shopping',
    body: 'Your Return on Ad Spend fell from 5.7× to 4.8× over the past 48 hours. This is likely due to increased competition bidding on the same keywords during a sale period.',
    time: '2 hours ago',
    action: { label: 'View Campaign', href: '/campaigns' },
    resolved: false,
  },
  {
    id: 2, severity: 'warning', type: 'anomaly',
    title: 'Spend spike detected in Meta Ads',
    body: 'Meta automatically increased your daily budget by 22% yesterday ($87 extra). At this rate, you\'ll exceed your monthly cap by $340. We recommend reviewing your budget controls.',
    time: '5 hours ago',
    action: { label: 'View Recommendation', href: '/recommendations' },
    resolved: false,
  },
  {
    id: 3, severity: 'warning', type: 'data_quality',
    title: 'Google Ads conversion tracking gap',
    body: '14 conversions were recorded in Google Ads but not matched in your analytics. This may indicate a tagging issue on your checkout confirmation page.',
    time: '1 day ago',
    action: { label: 'Check Data Quality', href: '/data-quality' },
    resolved: false,
  },
  {
    id: 4, severity: 'info', type: 'update',
    title: 'New attribution data available',
    body: '7-day click attribution data for April has been refreshed. Your attribution reports now include 14 additional conversions that were previously untracked.',
    time: '1 day ago',
    action: { label: 'View Attribution', href: '/attribution' },
    resolved: true,
  },
  {
    id: 5, severity: 'info', type: 'anomaly',
    title: '"Local Search Ads" conversion rate improved 18%',
    body: 'Your recent copy change appears to be working. Conversion rate for this campaign increased from 3.1% to 3.7% over the past 7 days — well above statistical significance.',
    time: '2 days ago',
    action: null,
    resolved: true,
  },
  {
    id: 6, severity: 'critical', type: 'data_quality',
    title: 'Meta Ads API connection error',
    body: 'Data from Meta Ads has not synced in 6 hours due to an API authentication failure. Your Meta campaigns may show stale data. Please reconnect in Settings.',
    time: '6 hours ago',
    action: { label: 'Fix in Settings', href: '/settings' },
    resolved: false,
  },
]

const SEV_STYLES: Record<string, { badge: string; icon: string; dot: string; label: string }> = {
  critical: { badge: 'bg-rose/10 text-rose border-rose/20', icon: 'text-rose', dot: 'bg-rose', label: 'Critical' },
  warning:  { badge: 'bg-amber/10 text-amber border-amber/20', icon: 'text-amber', dot: 'bg-amber', label: 'Warning' },
  info:     { badge: 'bg-brand/10 text-brand border-brand/20', icon: 'text-brand', dot: 'bg-brand', label: 'Info' },
}

const SEV_ICONS: Record<string, typeof AlertCircle> = {
  critical: AlertCircle,
  warning:  AlertTriangle,
  info:     Info,
}

const TYPE_LABELS: Record<string, string> = {
  anomaly: 'Anomaly',
  data_quality: 'Data Quality',
  update: 'Update',
}

export default function AlertsPage() {
  const [severity, setSeverity] = useState('all')
  const [type, setType]         = useState('all')
  const [dismissed, setDismissed] = useState<number[]>([])

  const filtered = ALL_ALERTS.filter((a) =>
    !dismissed.includes(a.id) &&
    (severity === 'all' || a.severity === severity) &&
    (type === 'all' || a.type === type)
  )

  const unresolved = filtered.filter((a) => !a.resolved)
  const resolved   = filtered.filter((a) => a.resolved)

  const dismiss = (id: number) => setDismissed((p) => [...p, id])
  const dismissAll = () => setDismissed(ALL_ALERTS.map((a) => a.id))

  return (
    <AppShell>
      <div className="p-5 md:p-8 max-w-4xl mx-auto space-y-7">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="h-5 w-5 text-brand" />
              <h1 className="text-2xl font-serif font-bold text-foreground">Alerts</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Your centralized feed for anomalies, data issues, and important updates.
            </p>
          </div>
          {unresolved.length > 0 && (
            <Button variant="outline" size="sm" className="text-xs self-start" onClick={dismissAll}>
              Mark all as read
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Critical', count: ALL_ALERTS.filter((a) => a.severity === 'critical' && !dismissed.includes(a.id) && !a.resolved).length, color: 'text-rose' },
            { label: 'Warnings', count: ALL_ALERTS.filter((a) => a.severity === 'warning' && !dismissed.includes(a.id) && !a.resolved).length,  color: 'text-amber' },
            { label: 'Info',     count: ALL_ALERTS.filter((a) => a.severity === 'info'     && !dismissed.includes(a.id)).length,  color: 'text-brand' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
              <p className={cn('text-2xl font-bold', s.color)}>{s.count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-36 h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-36 h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="anomaly">Anomaly</SelectItem>
              <SelectItem value="data_quality">Data Quality</SelectItem>
              <SelectItem value="update">Update</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Alerts */}
        {unresolved.length > 0 && (
          <section aria-labelledby="active-alerts">
            <h2 id="active-alerts" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Active ({unresolved.length})
            </h2>
            <div className="space-y-2">
              {unresolved.map((alert) => {
                const styles = SEV_STYLES[alert.severity]
                const Icon   = SEV_ICONS[alert.severity]
                return (
                  <div
                    key={alert.id}
                    className="rounded-xl border border-border bg-card p-4 flex gap-3 hover:shadow-sm transition-shadow"
                  >
                    <div className={cn('mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0', styles.badge)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-2 justify-between">
                        <p className="text-sm font-semibold text-foreground leading-snug">{alert.title}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className={cn('text-[10px] font-semibold', styles.badge)}>
                            {styles.label}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] text-muted-foreground border-border">
                            {TYPE_LABELS[alert.type]}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{alert.body}</p>
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-muted-foreground/60" />
                          <span className="text-[11px] text-muted-foreground/70">{alert.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {alert.action && (
                            <Button asChild variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                              <Link href={alert.action.href}>
                                {alert.action.label}
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost" size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground/50 hover:text-muted-foreground"
                            onClick={() => dismiss(alert.id)}
                            aria-label="Dismiss alert"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Resolved Alerts */}
        {resolved.length > 0 && (
          <section aria-labelledby="resolved-alerts">
            <h2 id="resolved-alerts" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Resolved / Info ({resolved.length})
            </h2>
            <div className="space-y-2 opacity-70">
              {resolved.map((alert) => {
                const styles = SEV_STYLES[alert.severity]
                const Icon   = SEV_ICONS[alert.severity]
                return (
                  <div key={alert.id} className="rounded-xl border border-border bg-muted/30 p-4 flex gap-3">
                    <div className={cn('mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 opacity-60', styles.badge)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-2 justify-between">
                        <p className="text-sm font-medium text-foreground leading-snug">{alert.title}</p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green" />
                          <span className="text-xs text-muted-foreground">Resolved</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{alert.body}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="h-3 w-3 text-muted-foreground/60" />
                        <span className="text-[11px] text-muted-foreground/70">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-green/50 mx-auto mb-3" />
            <p className="text-base font-semibold text-foreground">All clear!</p>
            <p className="text-sm text-muted-foreground mt-1">No alerts match your current filters.</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
