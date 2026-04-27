'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Megaphone,
  TrendingUp,
  Lightbulb,
  GitBranch,
  Bell,
  ShieldCheck,
  Settings,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  ChevronLeft,
  ChevronRight,
  Zap,
  User,
  LogOut,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { PageTransition } from '@/components/page-transition'
import { GeminiChatbot } from '@/components/gemini-chatbot'
import { useAuth } from '@/components/auth-provider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/forecasting', label: 'Forecasting', icon: TrendingUp },
  { href: '/recommendations', label: 'Recommendations', icon: Lightbulb, badge: 4 },
  { href: '/attribution', label: 'Attribution', icon: GitBranch },
  { href: '/alerts', label: 'Alerts', icon: Bell, badge: 2 },
  { href: '/data-quality', label: 'Data Quality', icon: ShieldCheck },
]

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Portuguese']

// Context for sidebar state
const SidebarContext = createContext<{
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}>({ collapsed: false, setCollapsed: () => {} })

export function useSidebar() {
  return useContext(SidebarContext)
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [lang, setLang] = useState('English')
  const { user, signOut } = useAuth()
  const userInitials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase()

  useEffect(() => {
    setMounted(true)
    // Load sidebar state from localStorage
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved) setCollapsed(saved === 'true')
  }, [])

  // Save sidebar state
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebar-collapsed', String(collapsed))
    }
  }, [collapsed, mounted])

  const isDark = mounted ? theme === 'dark' : false

  // Check if this is the onboarding page
  if (pathname === '/onboarding') return <>{children}</>

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <TooltipProvider delayDuration={0}>
        <div className="flex h-screen bg-background overflow-hidden">
          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <motion.aside
            initial={false}
            animate={{
              width: collapsed ? 72 : 256,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className={cn(
              'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border',
              'md:relative md:z-auto',
              // Mobile: slide in/out
              mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            )}
            style={{
              transition: 'transform 0.3s ease-in-out',
            }}
            aria-label="Sidebar navigation"
          >
            {/* Logo */}
            <div className="flex h-16 items-center gap-2.5 px-4 border-b border-sidebar-border shrink-0 overflow-hidden">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Zap className="h-[18px] w-[18px] text-primary-foreground" strokeWidth={2.5} />
              </motion.div>
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-serif text-xl font-bold text-sidebar-foreground tracking-tight whitespace-nowrap"
                  >
                    GrowIQ
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Main navigation">
              <ul className="space-y-1" role="list">
                {NAV_ITEMS.map(({ href, label, icon: Icon, badge }, index) => {
                  const active = pathname === href
                  const navItem = (
                    <motion.li
                      key={href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                    >
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                          'transition-all duration-200',
                          collapsed && 'justify-center px-0',
                          active
                            ? 'text-sidebar-primary'
                            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
                        )}
                        aria-current={active ? 'page' : undefined}
                      >
                        {/* Active background indicator */}
                        {active && (
                          <motion.div
                            layoutId="nav-active"
                            className="absolute inset-0 rounded-lg bg-sidebar-accent"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                        {/* Hover background */}
                        {!active && (
                          <span className="absolute inset-0 rounded-lg bg-sidebar-accent/0 group-hover:bg-sidebar-accent/60 transition-colors duration-200" />
                        )}
                        <Icon
                          className={cn(
                            'relative z-10 h-[18px] w-[18px] shrink-0 transition-all duration-200',
                            active
                              ? 'text-sidebar-primary'
                              : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80'
                          )}
                          strokeWidth={active ? 2.5 : 2}
                        />
                        <AnimatePresence mode="wait">
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="relative z-10 whitespace-nowrap overflow-hidden"
                            >
                              {label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {badge && !collapsed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            <Badge className="relative z-10 ml-auto h-5 min-w-5 rounded-full px-1.5 text-[10px] font-bold bg-primary/20 text-primary border-0">
                              {badge}
                            </Badge>
                          </motion.div>
                        )}
                        {badge && collapsed && (
                          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </Link>
                    </motion.li>
                  )

                  // Wrap in tooltip when collapsed
                  if (collapsed) {
                    return (
                      <Tooltip key={href}>
                        <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          <span className="flex items-center gap-2">
                            {label}
                            {badge && (
                              <Badge className="h-4 min-w-4 rounded-full px-1 text-[9px] font-bold bg-primary/20 text-primary border-0">
                                {badge}
                              </Badge>
                            )}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    )
                  }
                  return navItem
                })}
              </ul>
            </nav>

            {/* Sidebar Footer */}
            <div className="shrink-0 border-t border-sidebar-border p-3 space-y-2">
              {/* Collapse toggle button - desktop only */}
              <div className="hidden md:block">
                <motion.button
                  onClick={() => setCollapsed(!collapsed)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium w-full',
                    'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60',
                    'transition-colors duration-200',
                    collapsed && 'justify-center px-0'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <motion.div
                    animate={{ rotate: collapsed ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronLeft className="h-[18px] w-[18px]" />
                  </motion.div>
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-nowrap"
                      >
                        Collapse
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Settings link */}
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/settings"
                      className={cn(
                        'group relative flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium',
                        'transition-all duration-200',
                        pathname === '/settings'
                          ? 'bg-sidebar-accent text-sidebar-primary'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                      )}
                    >
                      <Settings
                        className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-transform duration-300',
                          'group-hover:rotate-90',
                          pathname === '/settings'
                            ? 'text-sidebar-primary'
                            : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80'
                        )}
                        strokeWidth={pathname === '/settings' ? 2.5 : 2}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    Settings
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  href="/settings"
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                    'transition-all duration-200',
                    pathname === '/settings'
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                  )}
                >
                  <Settings
                    className={cn(
                      'h-[18px] w-[18px] shrink-0 transition-transform duration-300',
                      'group-hover:rotate-90',
                      pathname === '/settings'
                        ? 'text-sidebar-primary'
                        : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80'
                    )}
                    strokeWidth={pathname === '/settings' ? 2.5 : 2}
                  />
                  <span>Settings</span>
                </Link>
              )}
            </div>
          </motion.aside>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
            {/* Top Header */}
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 backdrop-blur-md px-4 md:px-6 shrink-0"
            >
              {/* Mobile hamburger */}
              <motion.button
                className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </motion.button>

              {/* Desktop sidebar toggle */}
              <motion.button
                className="hidden md:flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setCollapsed(!collapsed)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <motion.div
                  animate={{ rotate: collapsed ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </motion.button>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs font-medium">{lang}</span>
                      <ChevronDown className="h-3 w-3 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    {LANGUAGES.map((l) => (
                      <DropdownMenuItem
                        key={l}
                        className={cn('text-sm', l === lang && 'text-primary font-medium')}
                        onClick={() => setLang(l)}
                      >
                        {l}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Toggle */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {mounted && isDark ? (
                        <motion.div
                          key="sun"
                          initial={{ rotate: -90, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          exit={{ rotate: 90, scale: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Sun className="h-[18px] w-[18px]" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="moon"
                          initial={{ rotate: 90, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          exit={{ rotate: -90, scale: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Moon className="h-[18px] w-[18px]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                {/* Alert bell */}
                <Link href="/alerts">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
                      aria-label="View alerts"
                    >
                      <Bell className="h-[18px] w-[18px]" />
                      <motion.span
                        className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        aria-hidden="true"
                      />
                    </Button>
                  </motion.div>
                </Link>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 pl-2 pr-3 text-muted-foreground hover:text-foreground"
                        aria-label="User menu"
                      >
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {user?.photoURL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.photoURL} alt={user.displayName ?? 'User'} className="h-7 w-7 rounded-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-xs font-bold text-primary">{userInitials}</span>
                          )}
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-foreground">{user?.displayName ?? "User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        Profile & Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.header>

            {/* Page Content with Transition */}
            <main className="flex-1 overflow-y-auto" id="main-content">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </div>

        {/* Gemini Marketing Assistant — floats above all content */}
        <GeminiChatbot />
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}
