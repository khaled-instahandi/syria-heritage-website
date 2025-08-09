"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { api, User } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const currentUser = api.getCurrentUser()
      const isAuth = api.isAuthenticated()
      
      if (isAuth && currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await api.login(email, password)
      
      if (response.status === 'success') {
        setUser(response.user)
        router.push('/dashboard')
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await api.logout()
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    api.updateUser(updatedUser)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && api.isAuthenticated(),
    isLoading,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook للحماية - يتطلب تسجيل الدخول
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}

// Hook للتحقق من الصلاحيات
export function usePermissions() {
  const { user } = useAuth()

  const hasRole = (roleName: string): boolean => {
    return user?.role?.role_name === roleName
  }

  const isAdmin = (): boolean => {
    return hasRole('Admin') || hasRole('admin')
  }

  const canAccess = (requiredRoles: string[]): boolean => {
    if (!user?.role) return false
    return requiredRoles.includes(user.role.role_name)
  }

  return {
    hasRole,
    isAdmin,
    canAccess,
    userRole: user?.role?.role_name
  }
}
