'use client'

import { useState, useMemo } from 'react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import { TrendingUp, Plus, Trash2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/* ── helpers ──────────────────────────────────────────────── */
function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)) }

function buildForecast(budget: number, audience: number, creative: number) {
  const base = budget / 1000
  const multiplier = 1 + (audience - 50) / 200 + (creative - 50) / 300
  return Array.from({ length: 8 }, (_, i) => {
    const week = `Wk ${i + 1}`
    const growth = 1 + i * 0.04
    const roas = clamp((3.2 + base * 0.4 + (audience - 50) * 0.02) * multiplier * growth, 1.5, 9)
    const conversions = Math.round((budget / 18) * multiplier * growth * (0.9 + Math.random() * 0.2))
    return { week, roas: +roas.toFixed(2), conversions }
  })
}

/* ── scenario type ─────────────────────────────────────────── */
interface Scenario {
  id: number
  label: string
  budget: number
  audience: number
  creative: number
  color: string
}

const COLORS = [
  'oklch(0.52 0.22 262)',  // brand
  'oklch(0.65 0.14 185)',  // teal
  'oklch(0.76 0.17 75)',   // amber
  'oklch(0.67 0.18 148)',  // green
]

const defaultScenario = (): Scenario => ({
  id: Date.now(),
  label: 'Scenario',
  budget: 5000,
  audience: 50,
  creative: 50,
  color: COLORS[0],
})

/* ── Slider component ──────────────────────────────────────── */
function SliderField({
  label, value, min, max, step = 1, prefix = '', suffix = '',
  tooltip, onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number
  prefix?: string; suffix?: string; tooltip?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">{label}</label>
          {tooltip && (
            <TooltipProvider delayDuration={200}>
              <UITooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/50 hover:text-muted-foreground" aria-label={`Info: ${label}`}>
                    <Info className="h-3 w-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-52 text-xs">{tooltip}</TooltipContent>
              </UITooltip>
            </TooltipProvider>
          )}
        </div>
        <span className="text-sm font-bold text-foreground tabular-nums">
          {prefix}{value.toLocaleString()}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary h-1.5 cursor-pointer"
        aria-label={label}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground/60">
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────── */
export default function ForecastingPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: 1, label: 'Current Plan', budget: 5000, audience: 50, creative: 50, color: COLORS[0] },
    { id: 2, label: 'Aggressive Growth', budget: 9000, audience: 70, creative: 75, color: COLORS[1] },
  ])
  const [activeId, setActiveId] = useState(1)
  const [metric, setMetric] = useState<'roas' | 'conversions'>('roas')

  const active = scenarios.find((s) => s.id === activeId) ?? scenarios[0]

  const updateActive = (patch: Partial<Scenario>) =>
    setScenarios((prev) => prev.map((s) => (s.id === activeId ? { ...s, ...patch } : s)))

  const addScenario = () => {
    if (scenarios.length >= 4) return
    const next: Scenario = {
      ...defaultScenario(),
      label: `Scenario ${scenarios.length + 1}`,
      color: COLORS[scenarios.length % COLORS.length],
    }
    setScenarios((p) => [...p, next])
    setActiveId(next.id)
  }

  const removeScenario = (id: number) => {
    if (scenarios.length <= 1) return
    const remaining = scenarios.filter((s) => s.id !== id)
    setScenarios(remaining)
    if (activeId === id) setActiveId(remaining[0].id)
  }

  // Build chart data across all scenarios
  const chartData = useMemo(() => {
    const weeks = buildForecast(scenarios[0].budget, scenarios[0].audience, scenarios[0].creative).map((d) => d.week)
    return weeks.map((week, i) => {
      const row: Record<string, string | number> = { week }
      scenarios.forEach((sc) => {
        const d = buildForecast(sc.budget, sc.audience, sc.creative)[i]
        row[`${sc.id}_${metric}`] = d[metric]
      })
      return row
    })
  }, [scenarios, metric])

  // Summary cards for active scenario (last week projection)
  const projection = useMemo(() => {
    const data = buildForecast(active.budget, active.audience, active.creative)
    const last = data[data.length - 1]
    return {
      roas: last.roas,
      conversions: last.conversions,
      revenue: (active.budget * last.roas).toLocaleString(undefined, { maximumFractionDigits: 0 }),
    }
  }, [active])

  return (
    <AppShell>
      <div className="p-5 md:p-8 max-w-7xl mx-auto space-y-7">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-brand" />
            <h1 className="text-2xl font-serif font-bold text-foreground">Forecasting & Simulation</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Adjust your budget, audience, and creative to see how your results could change. Compare scenarios side-by-side.
          </p>
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          {/* Controls Panel */}
          <div className="space-y-5">
            {/* Scenario Tabs */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Scenarios</h2>
                <Button
                  size="sm" variant="outline" className="h-7 text-xs gap-1.5"
                  onClick={addScenario}
                  disabled={scenarios.length >= 4}
                >
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>
              <div className="space-y-1.5">
                {scenarios.map((sc) => (
                  <div
                    key={sc.id}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors',
                      activeId === sc.id ? 'bg-accent' : 'hover:bg-muted/60'
                    )}
                    onClick={() => setActiveId(sc.id)}
                  >
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: sc.color }} />
                    <input
                      className="flex-1 bg-transparent text-sm font-medium text-foreground focus:outline-none min-w-0"
                      value={sc.label}
                      onChange={(e) => setScenarios((p) => p.map((s) => s.id === sc.id ? { ...s, label: e.target.value } : s))}
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Scenario name"
                    />
                    {scenarios.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeScenario(sc.id) }}
                        className="text-muted-foreground/50 hover:text-destructive transition-colors"
                        aria-label={`Remove ${sc.label}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: active.color }} />
                <h2 className="text-sm font-semibold text-foreground">{active.label}</h2>
              </div>
              <SliderField
                label="Monthly Budget"
                value={active.budget} min={500} max={20000} step={100}
                prefix="$"
                tooltip="Total ad spend across all platforms per month."
                onChange={(v) => updateActive({ budget: v })}
              />
              <SliderField
                label="Audience Targeting"
                value={active.audience} min={0} max={100} suffix="%"
                tooltip="How refined your audience is — 0% = very broad, 100% = highly specific (e.g. lookalike + retargeting)."
                onChange={(v) => updateActive({ audience: v })}
              />
              <SliderField
                label="Creative Quality"
                value={active.creative} min={0} max={100} suffix="%"
                tooltip="Estimated quality of your ads based on visual appeal, copy clarity, and A/B test history."
                onChange={(v) => updateActive({ creative: v })}
              />
            </div>

            {/* Projection Summary */}
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-5 space-y-3">
              <h2 className="text-sm font-semibold text-foreground">8-Week Projection — {active.label}</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Proj. ROAS', value: `${projection.roas}×` },
                  { label: 'Conversions', value: projection.conversions },
                  { label: 'Est. Revenue', value: `$${projection.revenue}` },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg font-bold text-foreground">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">Forecast Chart — 8 Weeks</h2>
              <div className="flex gap-2">
                {(['roas', 'conversions'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetric(m)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold border transition-all capitalize',
                      metric === m
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                    )}
                  >
                    {m === 'roas' ? 'ROAS' : 'Conversions'}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'oklch(0.50 0.03 262)' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: 'oklch(0.50 0.03 262)' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => metric === 'roas' ? `${v}×` : v}
                />
                {metric === 'roas' && (
                  <ReferenceLine y={4} stroke="oklch(0.76 0.17 75)" strokeDasharray="4 4" label={{ value: 'Target 4×', fontSize: 10, fill: 'oklch(0.76 0.17 75)' }} />
                )}
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '0.5rem',
                    fontSize: 12,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                  formatter={(val: number, name: string) => {
                    const sc = scenarios.find((s) => name.startsWith(String(s.id)))
                    return [metric === 'roas' ? `${val}×` : val, sc?.label ?? name]
                  }}
                />
                <Legend
                  formatter={(name) => {
                    const sc = scenarios.find((s) => name.startsWith(String(s.id)))
                    return <span style={{ fontSize: 11, color: 'oklch(0.50 0.03 262)' }}>{sc?.label}</span>
                  }}
                />
                {scenarios.map((sc) => (
                  <Line
                    key={sc.id}
                    type="monotone"
                    dataKey={`${sc.id}_${metric}`}
                    stroke={sc.color}
                    strokeWidth={activeId === sc.id ? 2.5 : 1.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                    strokeDasharray={activeId !== sc.id ? '5 3' : undefined}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>

            {/* Scenario comparison table */}
            <div className="border-t border-border pt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="text-left pb-2">Scenario</th>
                    <th className="text-right pb-2">Budget</th>
                    <th className="text-right pb-2">Proj. ROAS</th>
                    <th className="text-right pb-2">Proj. Conv.</th>
                    <th className="text-right pb-2">Est. Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scenarios.map((sc) => {
                    const data = buildForecast(sc.budget, sc.audience, sc.creative)
                    const last = data[data.length - 1]
                    return (
                      <tr
                        key={sc.id}
                        className={cn('cursor-pointer transition-colors', activeId === sc.id ? 'bg-accent/50' : 'hover:bg-muted/30')}
                        onClick={() => setActiveId(sc.id)}
                      >
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: sc.color }} />
                            <span className="font-medium text-foreground">{sc.label}</span>
                          </div>
                        </td>
                        <td className="py-2 text-right tabular-nums">${sc.budget.toLocaleString()}</td>
                        <td className="py-2 text-right tabular-nums font-semibold text-brand">{last.roas}×</td>
                        <td className="py-2 text-right tabular-nums">{last.conversions}</td>
                        <td className="py-2 text-right tabular-nums font-medium">
                          ${(sc.budget * last.roas).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
