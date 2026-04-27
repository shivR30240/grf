'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Zap, Sun, Moon, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch {
      setError('Sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9 text-muted-foreground"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Zap className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight">GrowIQ</h1>
            <p className="text-sm text-muted-foreground mt-1">AI Marketing Optimization</p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-sm flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">Welcome</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to access your marketing dashboard
            </p>
          </div>

          {error && (
            <p className="text-xs text-center text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleSignIn}
            disabled={loading}
            className={cn(
              'w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-all duration-150',
              'hover:bg-muted hover:border-primary/30 hover:shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              'active:scale-[0.98]'
            )}
          >
            {loading ? (
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {loading ? 'Opening Google…' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-green-500" />
            <span>
              Your name and profile photo are pulled automatically from your Google account.
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Powered by Firebase Authentication · Your data is never shared.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 12.075 17.64 9.767 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.441 1.345l2.581-2.581C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
