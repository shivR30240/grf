'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Pause,
  Play,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CAMPAIGNS = [
  { id: 1, name: 'Spring Sale — Retargeting',   platform: 'Google', status: 'active',  spend: 2340,  conversions: 184, roas: 6.2,  cpa: 12.72, trend: 12 },
  { id: 2, name: 'Brand Awareness — Broad',     platform: 'Meta',   status: 'active',  spend: 1820,  conversions: 43,  roas: 2.1,  cpa: 42.33, trend: -8 },
  { id: 3, name: 'Google Shopping — All Prods', platform: 'Google', status: 'active',  spend: 3100,  conversions: 271, roas: 4.9,  cpa: 11.44, trend: 5  },
  { id: 4, name: 'Summer Preview — Prospecting',platform: 'Meta',   status: 'active',  spend: 980,   conversions: 61,  roas: 3.4,  cpa: 16.07, trend: 22 },
  { id: 5, name: 'Competitor Conquest',         platform: 'Google', status: 'paused',  spend: 440,   conversions: 18,  roas: 1.8,  cpa: 24.44, trend: -3 },
  { id: 6, name: 'Local Search Ads',            platform: 'Google', status: 'active',  spend: 670,   conversions: 55,  roas: 5.1,  cpa: 12.18, trend: 9  },
  { id: 7, name: 'Instagram Stories — TOFU',    platform: 'Meta',   status: 'paused',  spend: 210,   conversions: 8,   roas: 1.4,  cpa: 26.25, trend: -14},
]

type SortKey = 'spend' | 'conversions' | 'roas' | 'cpa'
type SortDir = 'asc' | 'desc' | null

const platformColors: Record<string, string> = {
  Google: 'bg-brand/10 text-brand border-brand/20',
  Meta:   'bg-teal/10 text-teal border-teal/20',
}

const statusColors = {
  active: 'bg-green/10 text-green border-green/20',
  paused: 'bg-muted text-muted-foreground border-border',
}

export default function CampaignsPage() {
  const [search, setSearch]         = useState('')
  const [platform, setPlatform]     = useState('all')
  const [status, setStatus]         = useState('all')
  const [sortKey, setSortKey]       = useState<SortKey>('roas')
  const [sortDir, setSortDir]       = useState<SortDir>('desc')
  const [page, setPage]             = useState(1)
  const PER_PAGE = 5

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = CAMPAIGNS
    .filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (platform === 'all' || c.platform === platform) &&
      (status === 'all' || c.status === status)
    )
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0
      return sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]
    })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === 'desc' ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />
      : <ChevronsUpDown className="h-3 w-3 ml-1 opacity-40" />

  return (
    <AppShell>
      <div className="p-5 md:p-8 max-w-7xl mx-auto space-y-7">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and monitor all your active and paused ad campaigns.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns…"
              className="pl-9 h-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              aria-label="Search campaigns"
            />
          </div>
          <Select value={platform} onValueChange={(v) => { setPlatform(v); setPage(1) }}>
            <SelectTrigger className="w-40 h-9 text-sm" aria-label="Filter by platform">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="Google">Google</SelectItem>
              <SelectItem value="Meta">Meta</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1) }}>
            <SelectTrigger className="w-36 h-9 text-sm" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Campaigns', value: filtered.length.toString() },
            { label: 'Active',          value: filtered.filter((c) => c.status === 'active').length.toString() },
            { label: 'Total Spend',     value: `$${filtered.reduce((s, c) => s + c.spend, 0).toLocaleString()}` },
            { label: 'Avg. ROAS',       value: `${(filtered.reduce((s, c) => s + c.roas, 0) / (filtered.length || 1)).toFixed(1)}×` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className="text-xl font-bold text-foreground mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-64 font-semibold text-xs uppercase tracking-wide">Campaign</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide">Platform</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide">Status</TableHead>
                  <TableHead
                    className="cursor-pointer select-none font-semibold text-xs uppercase tracking-wide"
                    onClick={() => handleSort('spend')}
                  >
                    <span className="flex items-center">Spend <SortIcon k="spend" /></span>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none font-semibold text-xs uppercase tracking-wide"
                    onClick={() => handleSort('conversions')}
                  >
                    <span className="flex items-center">Conv. <SortIcon k="conversions" /></span>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none font-semibold text-xs uppercase tracking-wide"
                    onClick={() => handleSort('roas')}
                  >
                    <span className="flex items-center">ROAS <SortIcon k="roas" /></span>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none font-semibold text-xs uppercase tracking-wide"
                    onClick={() => handleSort('cpa')}
                  >
                    <span className="flex items-center">CPA <SortIcon k="cpa" /></span>
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wide">Trend</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center text-muted-foreground text-sm">
                      No campaigns found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((c) => (
                    <TableRow key={c.id} className="group cursor-pointer hover:bg-muted/40">
                      <TableCell className="font-medium text-sm text-foreground">{c.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-xs font-semibold', platformColors[c.platform])}>
                          {c.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-xs font-semibold capitalize', statusColors[c.status as keyof typeof statusColors])}>
                          {c.status === 'active' ? (
                            <><Play className="h-2.5 w-2.5 mr-1 fill-current" />{c.status}</>
                          ) : (
                            <><Pause className="h-2.5 w-2.5 mr-1 fill-current" />{c.status}</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium">${c.spend.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{c.conversions.toLocaleString()}</TableCell>
                      <TableCell className="text-sm font-semibold">{c.roas}×</TableCell>
                      <TableCell className="text-sm">${c.cpa.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={cn(
                          'inline-flex items-center gap-1 text-xs font-semibold',
                          c.trend > 0 ? 'text-green' : c.trend < 0 ? 'text-rose' : 'text-muted-foreground'
                        )}>
                          {c.trend > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                          {c.trend > 0 ? '+' : ''}{c.trend}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`View ${c.name}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Prev</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
