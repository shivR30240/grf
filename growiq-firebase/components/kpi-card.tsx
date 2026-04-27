'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface KpiCardProps {
  label: string
  value: string
  change: number   // percentage change from previous period
  definition: string
  prefix?: string
  suffix?: string
  color?: 'brand' | 'teal' | 'amber' | 'rose' | 'green'
}

const colorMap = {
  brand: 'bg-brand/10 text-brand',
  teal:  'bg-teal/10 text-teal',
  amber: 'bg-amber/10 text-amber',
  rose:  'bg-rose/10 text-rose',
  green: 'bg-green/10 text-green',
}

export function KpiCard({
  label,
  value,
  change,
  definition,
  color = 'brand',
}: KpiCardProps) {
  const isPositive = change > 0
  const isNeutral  = change === 0
  const absChange  = Math.abs(change)

  return (
    <motion.div
      className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-200"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground leading-tight">{label}</span>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                aria-label={`What is ${label}?`}
              >
                <HelpCircle className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-56 text-xs leading-relaxed">
              {definition}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <p className="text-2xl font-bold tracking-tight text-foreground font-sans">
        {value}
      </p>

      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
            isNeutral
              ? 'bg-muted text-muted-foreground'
              : isPositive
                ? 'bg-green/10 text-green'
                : 'bg-rose/10 text-rose'
          )}
        >
          {isNeutral ? (
            <Minus className="h-3 w-3" />
          ) : isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {isNeutral ? '0%' : `${isPositive ? '+' : '-'}${absChange}%`}
        </span>
        <span className="text-xs text-muted-foreground">vs last period</span>
      </div>
    </motion.div>
  )
}
