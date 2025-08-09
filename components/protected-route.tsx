"use client"

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  requiredRoles?: string[]
  fallbackUrl?: string
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requiredRoles = [],
  fallbackUrl = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(fallbackUrl)
        return
      }

      if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requiredRoles.includes(user.role?.role_name || '')
        if (!hasRequiredRole) {
          router.push('/unauthorized')
          return
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requireAuth, requiredRoles, router, fallbackUrl])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-slate-600">جاري التحقق من الصلاحيات...</span>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role?.role_name || '')
    if (!hasRequiredRole) {
      return null
    }
  }

  return <>{children}</>
}

// مكون للحماية بناءً على الدور
export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['Admin', 'admin']}>
      {children}
    </ProtectedRoute>
  )
}

// مكون للحماية العامة
export function AuthProtectedRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireAuth={true}>
      {children}
    </ProtectedRoute>
  )
}
