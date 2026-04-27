'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const data = [
  { day: 'Apr 1',  revenue: 4200,  spend: 1100, conversions: 38 },
  { day: 'Apr 3',  revenue: 3800,  spend: 1050, conversions: 34 },
  { day: 'Apr 5',  revenue: 5100,  spend: 1200, conversions: 46 },
  { day: 'Apr 7',  revenue: 4700,  spend: 1150, conversions: 42 },
  { day: 'Apr 9',  revenue: 5500,  spend: 1300, conversions: 51 },
  { day: 'Apr 11', revenue: 6100,  spend: 1350, conversions: 57 },
  { day: 'Apr 13', revenue: 5800,  spend: 1280, conversions: 54 },
  { day: 'Apr 15', revenue: 6700,  spend: 1400, conversions: 62 },
]

const customTooltipStyle = {
  borderRadius: '0.5rem',
  border: '1px solid hsl(var(--border))',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

export function DashboardChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-sm text-foreground">Performance Over Time</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Revenue vs. ad spend — last 15 days</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="oklch(0.52 0.22 262)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="oklch(0.52 0.22 262)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="oklch(0.65 0.14 185)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="oklch(0.65 0.14 185)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: 'oklch(0.50 0.03 262)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'oklch(0.50 0.03 262)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
              fontSize: 12,
              ...customTooltipStyle,
            }}
            formatter={(val: number, name: string) => [
              `$${val.toLocaleString()}`,
              name === 'revenue' ? 'Revenue' : 'Ad Spend',
            ]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: 11, color: 'oklch(0.50 0.03 262)' }}>
                {value === 'revenue' ? 'Revenue' : 'Ad Spend'}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="oklch(0.52 0.22 262)"
            strokeWidth={2}
            fill="url(#revGrad)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="spend"
            stroke="oklch(0.65 0.14 185)"
            strokeWidth={2}
            fill="url(#spendGrad)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
