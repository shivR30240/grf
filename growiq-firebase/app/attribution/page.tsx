'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { GitBranch, Info, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const MODELS = [
  { value: 'linear',          label: 'Linear',           description: 'Equal credit to every touchpoint in the journey.' },
  { value: 'last-click',      label: 'Last Click',        description: 'All credit goes to the last ad clicked before purchase.' },
  { value: 'first-click',     label: 'First Click',       description: 'All credit goes to the first ad that introduced the customer.' },
  { value: 'time-decay',      label: 'Time Decay',        description: 'More credit to touchpoints closer to the purchase date.' },
  { value: 'data-driven',     label: 'Data-Driven (AI)',  description: 'AI distributes credit based on your actual conversion patterns.' },
]

const ATTRIBUTION_DATA: Record<string, { channel: string; credit: number; conversions: number; revenue: number; color: string }[]> = {
  linear: [
    { channel: 'Google Search', credit: 32, conversions: 196, revenue: 14100, color: 'oklch(0.52 0.22 262)' },
    { channel: 'Meta Ads',      credit: 24, conversions: 147, revenue: 10580, color: 'oklch(0.65 0.14 185)' },
    { channel: 'Google Shopping', credit: 21, conversions: 128, revenue: 9200, color: 'oklch(0.76 0.17 75)' },
    { channel: 'Email',         credit: 14, conversions: 86,  revenue: 6190, color: 'oklch(0.67 0.18 148)' },
    { channel: 'Organic',       credit:  9, conversions: 55,  revenue: 3960, color: 'oklch(0.62 0.22 25)' },
  ],
  'last-click': [
    { channel: 'Google Search', credit: 48, conversions: 293, revenue: 21100, color: 'oklch(0.52 0.22 262)' },
    { channel: 'Meta Ads',      credit: 18, conversions: 110, revenue: 7920, color: 'oklch(0.65 0.14 185)' },
    { channel: 'Google Shopping', credit: 21, conversions: 128, revenue: 9200, color: 'oklch(0.76 0.17 75)' },
    { channel: 'Email',         credit:  8, conversions:  49, revenue: 3530, color: 'oklch(0.67 0.18 148)' },
    { channel: 'Organic',       credit:  5, conversions:  31, revenue: 2230, color: 'oklch(0.62 0.22 25)' },
  ],
  'first-click': [
    { channel: 'Google Search', credit: 20, conversions: 122, revenue: 8800, color: 'oklch(0.52 0.22 262)' },
    { channel: 'Meta Ads',      credit: 38, conversions: 232, revenue: 16700, color: 'oklch(0.65 0.14 185)' },
    { channel: 'Google Shopping', credit: 14, conversions: 86, revenue: 6190, color: 'oklch(0.76 0.17 75)' },
    { channel: 'Email',         credit: 16, conversions: 98, revenue: 7060, color: 'oklch(0.67 0.18 148)' },
    { channel: 'Organic',       credit: 12, conversions: 73, revenue: 5260, color: 'oklch(0.62 0.22 25)' },
  ],
  'time-decay': [
    { channel: 'Google Search', credit: 40, conversions: 244, revenue: 17600, color: 'oklch(0.52 0.22 262)' },
    { channel: 'Meta Ads',      credit: 22, conversions: 134, revenue: 9650, color: 'oklch(0.65 0.14 185)' },
    { channel: 'Google Shopping', credit: 22, conversions: 134, revenue: 9650, color: 'oklch(0.76 0.17 75)' },
    { channel: 'Email',         credit: 12, conversions:  73, revenue: 5260, color: 'oklch(0.67 0.18 148)' },
    { channel: 'Organic',       credit:  4, conversions:  24, revenue: 1730, color: 'oklch(0.62 0.22 25)' },
  ],
  'data-driven': [
    { channel: 'Google Search', credit: 35, conversions: 214, revenue: 15400, color: 'oklch(0.52 0.22 262)' },
    { channel: 'Meta Ads',      credit: 28, conversions: 171, revenue: 12300, color: 'oklch(0.65 0.14 185)' },
    { channel: 'Google Shopping', credit: 20, conversions: 122, revenue: 8780, color: 'oklch(0.76 0.17 75)' },
    { channel: 'Email',         credit: 11, conversions:  67, revenue: 4830, color: 'oklch(0.67 0.18 148)' },
    { channel: 'Organic',       credit:  6, conversions:  37, revenue: 2660, color: 'oklch(0.62 0.22 25)' },
  ],
}

const JOURNEY_STEPS = [
  { id: 1, channel: 'Meta Ads',       action: 'First impression — video ad', type: 'awareness' },
  { id: 2, channel: 'Organic Search', action: 'Searched brand name', type: 'consideration' },
  { id: 3, channel: 'Google Search',  action: 'Clicked product ad', type: 'consideration' },
  { id: 4, channel: 'Email',          action: 'Opened promo email', type: 'consideration' },
  { id: 5, channel: 'Google Shopping', action: 'Clicked shopping ad → Purchase', type: 'conversion' },
]

const stepColors = {
  awareness:     'bg-brand/10 text-brand border-brand/30',
  consideration: 'bg-teal/10 text-teal border-teal/30',
  conversion:    'bg-green/10 text-green border-green/30',
}

export default function AttributionPage() {
  const [model, setModel] = useState('data-driven')
  const data = ATTRIBUTION_DATA[model]

  const currentModel = MODELS.find((m) => m.value === model)!

  return (
    <AppShell>
      <div className="p-5 md:p-8 max-w-7xl mx-auto space-y-7">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="h-5 w-5 text-brand" />
            <h1 className="text-2xl font-serif font-bold text-foreground">Attribution</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            See which marketing channels deserve credit for your sales — and how that changes depending on the method you use.
          </p>
        </div>

        {/* Model Selector */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Attribution Model</h2>
            <TooltipProvider delayDuration={200}>
              <UITooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/50 hover:text-muted-foreground" aria-label="What is an attribution model?">
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-64 text-xs leading-relaxed">
                  An attribution model decides how to split the credit for a sale among all the ads a customer saw before buying. Different models tell different stories about what&apos;s working.
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Attribution model">
            {MODELS.map((m) => (
              <button
                key={m.value}
                role="radio"
                aria-checked={model === m.value}
                onClick={() => setModel(m.value)}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-sm font-medium border transition-all text-left',
                  model === m.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                )}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            <span className="font-semibold text-foreground">{currentModel.label}:</span>{' '}
            {currentModel.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Credit Distribution by Channel</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'oklch(0.50 0.03 262)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="channel" tick={{ fontSize: 11, fill: 'oklch(0.50 0.03 262)' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.5rem', fontSize: 12 }}
                  formatter={(v: number) => [`${v}%`, 'Credit']}
                />
                <Bar dataKey="credit" radius={[0, 4, 4, 0]}>
                  {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Channel breakdown table */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Channel Breakdown</h2>
            <div className="space-y-2">
              {data.map((d) => (
                <div key={d.channel} className="flex items-center gap-3 py-2 border-b border-border/60 last:border-0">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-sm font-medium text-foreground flex-1">{d.channel}</span>
                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div>
                      <p className="text-sm font-bold text-foreground tabular-nums">{d.credit}%</p>
                      <p className="text-[10px] text-muted-foreground">credit</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground tabular-nums">{d.conversions}</p>
                      <p className="text-[10px] text-muted-foreground">conv.</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-foreground tabular-nums">${d.revenue.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">revenue</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Typical Customer Journey */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Typical Customer Journey</h2>
            <TooltipProvider delayDuration={200}>
              <UITooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/50 hover:text-muted-foreground" aria-label="Journey info">
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-60 text-xs leading-relaxed">
                  This shows the average path your customers take from first seeing an ad to making a purchase — based on your last 30 days of conversion data.
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {JOURNEY_STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={cn('rounded-lg border px-3 py-2 min-w-[120px]', stepColors[step.type as keyof typeof stepColors])}>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{step.channel}</p>
                  <p className="text-xs font-medium mt-0.5 leading-snug">{step.action}</p>
                </div>
                {i < JOURNEY_STEPS.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4 flex-wrap pt-1">
            {[
              { color: 'bg-brand/20 border-brand/30 text-brand', label: 'Awareness' },
              { color: 'bg-teal/20 border-teal/30 text-teal', label: 'Consideration' },
              { color: 'bg-green/20 border-green/30 text-green', label: 'Conversion' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={cn('h-2.5 w-2.5 rounded-full border', l.color)} />
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
