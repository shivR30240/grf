'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { ConfirmModal } from '@/components/confirm-modal'
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
  ArrowRight,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  DollarSign,
  Target,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const RECS = [
  {
    id: 1,
    category: 'Budget',
    icon: DollarSign,
    action: 'Increase budget for "Spring Sale — Retargeting" by 15%',
    why: 'This campaign has a ROAS of 6.2×, far above your 4× target. It\'s currently budget-limited, meaning it stops showing ads before the end of the day — costing you approximately 40 conversions daily.',
    impact: '+$820 estimated monthly revenue',
    confidence: 'High',
    effort: 'Instant',
  },
  {
    id: 2,
    category: 'Keywords',
    icon: Target,
    action: 'Pause 8 low-converting "Brand Awareness — Broad Match" keywords',
    why: 'These keywords spent $340 over 30 days with zero conversions. They attract clicks that don\'t lead to sales. Pausing them frees up budget to reinvest in campaigns that do convert.',
    impact: 'Save $340/month, reallocate to top performers',
    confidence: 'High',
    effort: 'Instant',
  },
  {
    id: 3,
    category: 'Bidding',
    icon: Zap,
    action: 'Switch Google Shopping to Target ROAS bidding',
    why: 'Your campaign now has 200+ monthly conversions, which is the threshold where Smart Bidding outperforms manual CPC. Google\'s algorithm will dynamically adjust bids to hit your ROAS goal.',
    impact: '+8–12% ROAS improvement',
    confidence: 'Medium',
    effort: 'Low',
  },
  {
    id: 4,
    category: 'Audience',
    icon: Target,
    action: 'Add Customer Match audience to "Local Search Ads"',
    why: 'Targeting your existing customers for upsells on Local Search typically drives 20–30% higher conversion rates at lower CPA. You have 1,200 email contacts that qualify.',
    impact: '+25% conversion rate on targeted segment',
    confidence: 'Medium',
    effort: 'Low',
  },
  {
    id: 5,
    category: 'Budget',
    icon: DollarSign,
    action: 'Reduce daily budget on "Competitor Conquest" by 40%',
    why: 'This campaign\'s ROAS of 1.8× is well below your breakeven of 2.5×. Competitors in this keyword space have increased bids, making it unprofitable at current levels.',
    impact: 'Save $264/month while near-matching current revenue',
    confidence: 'High',
    effort: 'Instant',
  },
]

const CATEGORIES = ['All', 'Budget', 'Keywords', 'Bidding', 'Audience']
const CONFIDENCE_COLORS: Record<string, string> = {
  High:   'bg-green/10 text-green border-green/20',
  Medium: 'bg-amber/10 text-amber border-amber/20',
  Low:    'bg-muted text-muted-foreground border-border',
}
const CATEGORY_COLORS: Record<string, string> = {
  Budget:   'bg-brand/10 text-brand',
  Keywords: 'bg-teal/10 text-teal',
  Bidding:  'bg-amber/10 text-amber',
  Audience: 'bg-rose/10 text-rose',
}

export default function RecommendationsPage() {
  const [category, setCategory] = useState('All')
  const [filter, setFilter]     = useState('all')
  const [expanded, setExpanded] = useState<number[]>([])
  const [applied, setApplied]   = useState<number[]>([])
  const [dismissed, setDismissed] = useState<number[]>([])
  const [modal, setModal]       = useState<{ open: boolean; rec?: (typeof RECS)[0] }>({ open: false })

  const visible = RECS.filter((r) =>
    !dismissed.includes(r.id) &&
    (category === 'All' || r.category === category) &&
    (filter === 'all' || (filter === 'applied' ? applied.includes(r.id) : !applied.includes(r.id)))
  )

  const toggleExpand = (id: number) =>
    setExpanded((e) => e.includes(id) ? e.filter((x) => x !== id) : [...e, id])

  return (
    <AppShell>
      <div className="p-5 md:p-8 max-w-4xl mx-auto space-y-7">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1">
              <Sparkles className="h-5 w-5 text-brand" />
              <h1 className="text-2xl font-serif font-bold text-foreground">AI Recommendations</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Personalized, plain-language actions to improve your marketing performance.
              All suggestions are backed by your actual data.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-36 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={category === cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border',
                category === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Recommendations', value: RECS.length },
            { label: 'Applied',   value: applied.length, color: 'text-green' },
            { label: 'Pending',   value: RECS.length - applied.length - dismissed.length, color: 'text-amber' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
              <p className={cn('text-2xl font-bold', s.color ?? 'text-foreground')}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recommendation Cards */}
        <div className="space-y-3">
          {visible.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <Sparkles className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No recommendations in this category right now.</p>
            </div>
          ) : (
            visible.map((rec) => {
              const isApplied  = applied.includes(rec.id)
              const isExpanded = expanded.includes(rec.id)
              const Icon = rec.icon

              return (
                <div
                  key={rec.id}
                  className={cn(
                    'rounded-xl border bg-card overflow-hidden transition-all duration-200',
                    isApplied ? 'border-green/30' : 'border-border hover:shadow-sm'
                  )}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      {/* Category icon */}
                      <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', CATEGORY_COLORS[rec.category])}>
                        <Icon className="h-[18px] w-[18px]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{rec.category}</span>
                          <Badge variant="outline" className={cn('text-[10px] font-semibold', CONFIDENCE_COLORS[rec.confidence])}>
                            {rec.confidence} confidence
                          </Badge>
                          <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground border-border">
                            {rec.effort} to apply
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold text-foreground leading-snug">{rec.action}</p>

                        {/* Expandable Why */}
                        {isExpanded && (
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed border-t border-border pt-2">
                            {rec.why}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-brand">{rec.impact}</span>
                            <button
                              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
                              onClick={() => toggleExpand(rec.id)}
                              aria-expanded={isExpanded}
                            >
                              {isExpanded ? (
                                <><ChevronUp className="h-3 w-3" />Hide reasoning</>
                              ) : (
                                <><ChevronDown className="h-3 w-3" />Why this?</>
                              )}
                            </button>
                          </div>

                          {isApplied ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green">
                              <CheckCircle2 className="h-4 w-4" />Applied
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-muted-foreground hover:text-destructive"
                                onClick={() => setDismissed((d) => [...d, rec.id])}
                                aria-label="Dismiss recommendation"
                              >
                                <X className="h-3.5 w-3.5 mr-1" />
                                Dismiss
                              </Button>
                              <Button
                                size="sm"
                                className="h-7 text-xs gap-1"
                                onClick={() => setModal({ open: true, rec })}
                              >
                                Apply Now <ArrowRight className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <ConfirmModal
        open={modal.open}
        onOpenChange={(open) => setModal({ open })}
        title="Apply Recommendation"
        description={
          modal.rec
            ? `You are about to apply: "${modal.rec.action}". Estimated impact: ${modal.rec.impact}. This action will be applied immediately to your connected ad platform.`
            : ''
        }
        onConfirm={() => {
          if (modal.rec) setApplied((p) => [...p, modal.rec!.id])
        }}
      />
    </AppShell>
  )
}
