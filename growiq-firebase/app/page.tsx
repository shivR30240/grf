'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { KpiCard } from '@/components/kpi-card'
import { DashboardChart } from '@/components/dashboard-chart'
import { ConfirmModal } from '@/components/confirm-modal'
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/page-transition'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const GOALS = [
  { value: 'roas',     label: 'Improve ROAS' },
  { value: 'sales',    label: 'Increase Sales' },
  { value: 'cpa',      label: 'Reduce CPA' },
  { value: 'budget',   label: 'Stay Within Budget' },
  { value: 'acquire',  label: 'Acquire New Customers' },
]

const ALERTS = [
  {
    id: 1,
    severity: 'critical',
    icon: AlertCircle,
    title: 'ROAS dropped by 15% in Google Shopping',
    plain: 'Your ads spent the same amount but generated fewer sales — likely due to increased competition over the weekend.',
    time: '2 hours ago',
  },
  {
    id: 2,
    severity: 'warning',
    icon: AlertTriangle,
    title: 'Spend spike detected in Meta Ads',
    plain: 'Meta automatically increased your daily budget by 22% yesterday. Your monthly budget may be exceeded at this rate.',
    time: '5 hours ago',
  },
  {
    id: 3,
    severity: 'info',
    icon: Info,
    title: 'New conversion window data available',
    plain: '7-day click attribution data for April has been refreshed. Your attribution report is now more accurate.',
    time: '1 day ago',
  },
]

const RECOMMENDATIONS = [
  {
    id: 1,
    action: 'Increase budget for "Spring Sale — Retargeting" by 15%',
    why: 'This campaign is converting at 3.2x the average rate but is limited by budget — you\'re missing roughly 40 daily conversions.',
    impact: '+$820 / month estimated revenue',
    confidence: 'High',
    payload: { campaignId: 'spring-retarget', budgetDelta: 0.15 },
  },
  {
    id: 2,
    action: 'Pause "Brand Awareness — Broad Match" keywords',
    why: 'These 8 keywords have spent $340 in 30 days with zero conversions. Pausing them redirects budget to what\'s working.',
    impact: 'Save $340 / month, reallocate to top performers',
    confidence: 'High',
    payload: { keywordGroup: 'brand-broad' },
  },
  {
    id: 3,
    action: 'Switch Google Shopping to Target ROAS bidding',
    why: 'Your manual CPC bids are underperforming against automated bidding for product-based campaigns at your conversion volume.',
    impact: '+8–12% ROAS improvement',
    confidence: 'Medium',
    payload: { campaign: 'google-shopping', strategy: 'target-roas' },
  },
]

const severityStyles = {
  critical: { badge: 'bg-rose/10 text-rose border-rose/20', dot: 'bg-rose' },
  warning:  { badge: 'bg-amber/10 text-amber border-amber/20', dot: 'bg-amber' },
  info:     { badge: 'bg-brand/10 text-brand border-brand/20', dot: 'bg-brand' },
}

export default function DashboardPage() {
  const [goal, setGoal] = useState('roas')
  const [modal, setModal] = useState<{ open: boolean; rec?: (typeof RECOMMENDATIONS)[0] }>({ open: false })
  const [applied, setApplied] = useState<number[]>([])

  const goalLabel = GOALS.find((g) => g.value === goal)?.label ?? ''

  return (
    <AppShell>
      <div className="p-5 md:p-8 max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground text-balance">
                Good morning, Sarah
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Here&apos;s how your marketing is performing today.
              </p>
            </div>

            {/* Goal Selector */}
            <div className="flex items-center gap-2.5">
              <span className="text-sm text-muted-foreground whitespace-nowrap">My goal:</span>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger className="w-52 h-9 text-sm font-medium border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOALS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </FadeIn>

        {/* Summary Insight Banner */}
        <FadeIn delay={0.1}>
          <div className="rounded-xl border border-brand/20 bg-brand/5 px-5 py-4 flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Goal: <span className="text-brand">{goalLabel}</span>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                Your ROAS improved 8% this week — driven by the Spring Sale campaign. Two budget issues
                need attention to keep the momentum going.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* KPI Cards */}
        <section aria-labelledby="kpi-heading">
          <h2 id="kpi-heading" className="sr-only">Key Performance Indicators</h2>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4" delay={0.15}>
            <StaggerItem>
              <KpiCard label="Revenue" value="$48,220" change={12} color="green"
                definition="Total sales revenue generated from your ads during the selected period." />
            </StaggerItem>
            <StaggerItem>
              <KpiCard label="ROAS" value="4.8×" change={8} color="brand"
                definition="Return on Ad Spend — for every $1 you spend on ads, you earn $4.80 back in revenue." />
            </StaggerItem>
            <StaggerItem>
              <KpiCard label="Ad Spend" value="$10,046" change={3} color="amber"
                definition="Total money spent across all your advertising platforms in this period." />
            </StaggerItem>
            <StaggerItem>
              <KpiCard label="Conversions" value="612" change={15} color="teal"
                definition="Number of customers who completed a purchase or a desired action after clicking your ad." />
            </StaggerItem>
            <StaggerItem>
              <KpiCard label="CPA" value="$16.41" change={-6} color="rose"
                definition="Cost Per Acquisition — how much you pay in ads for each new customer. Lower is better." />
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* Performance Chart */}
        <FadeIn delay={0.3}>
          <DashboardChart />
        </FadeIn>

        {/* Attention Panel: Alerts + Recommendations */}
        <FadeIn delay={0.4}>
          <section aria-labelledby="attention-heading">
            <div className="flex items-center gap-2.5 mb-4">
              <Sparkles className="h-5 w-5 text-brand" />
              <h2 id="attention-heading" className="text-base font-semibold text-foreground">
                What Needs Attention Now?
              </h2>
            </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Alerts Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Active Alerts
              </h3>
              <div className="space-y-2">
                {ALERTS.map((alert) => {
                  const styles = severityStyles[alert.severity as keyof typeof severityStyles]
                  const Icon = alert.icon
                  return (
                    <motion.div
                      key={alert.id}
                      className="rounded-xl border border-border bg-card p-4 flex gap-3 hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.01, y: -2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <div className={cn('mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0', styles.badge)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">{alert.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{alert.plain}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground/60" />
                          <span className="text-[11px] text-muted-foreground/70">{alert.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Recommendations Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                AI Recommendations
              </h3>
              <div className="space-y-2">
                {RECOMMENDATIONS.map((rec) => (
                  <motion.div
                    key={rec.id}
                    className={cn(
                      'rounded-xl border bg-card p-4 flex flex-col gap-2.5 hover:shadow-md transition-all',
                      applied.includes(rec.id)
                        ? 'border-green/30 bg-green/5'
                        : 'border-border'
                    )}
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {applied.includes(rec.id) ? (
                      <div className="flex items-center gap-2 text-green text-sm font-semibold">
                        <CheckCircle2 className="h-4 w-4" />
                        Applied successfully
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground leading-snug flex-1">
                            {rec.action}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              'shrink-0 text-[10px] font-semibold',
                              rec.confidence === 'High'
                                ? 'border-green/30 text-green bg-green/5'
                                : 'border-amber/30 text-amber bg-amber/5'
                            )}
                          >
                            {rec.confidence} confidence
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{rec.why}</p>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <span className="text-xs font-semibold text-brand">{rec.impact}</span>
                          <Button
                            size="sm"
                            className="h-7 text-xs gap-1.5"
                            onClick={() => setModal({ open: true, rec })}
                          >
                            Apply Now
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        </FadeIn>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={modal.open}
        onOpenChange={(open) => setModal({ open })}
        title="Confirm Recommendation"
        description={
          modal.rec
            ? `You are about to: ${modal.rec.action}. Estimated impact: ${modal.rec.impact}. This change will be applied to your ad platform immediately.`
            : ''
        }
        onConfirm={() => {
          if (modal.rec) setApplied((prev) => [...prev, modal.rec!.id])
        }}
      />
    </AppShell>
  )
}
