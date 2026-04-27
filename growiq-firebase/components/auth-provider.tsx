'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)

      if (!firebaseUser && pathname !== '/login') {
        router.replace('/login')
      }

      if (firebaseUser && pathname === '/login') {
        router.replace('/')
      }
    })

    return () => unsubscribe()
  }, [pathname, router])

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      router.replace('/')
    } catch (error: any) {
      // user closed popup — ignore
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Sign-in error:', error)
      }
    }
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    router.replace('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
