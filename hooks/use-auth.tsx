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
      console.log(response);

      if (response.status === 'success') {
        setUser(response.user)
        router.push('/dashboard')
      }
    } catch (error: any) {
      // تمرير خطأ مفصل مع معلومات أكثر وضوحاً
      const enhancedError = {
        ...error,
        userMessage: getErrorMessage(error)
      }
      throw enhancedError
    } finally {
      setIsLoading(false)
    }
  }

  // دالة لتحويل الأخطاء إلى رسائل مفهومة
  const getErrorMessage = (error: any): string => {
    if (!error) return 'حدث خطأ غير متوقع'

    // أخطاء الشبكة
    if (error.message?.includes('Failed to fetch') || 
        error.message?.includes('ERR_NETWORK') ||
        error.message?.includes('ERR_INTERNET_DISCONNECTED')) {
      return 'تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى'
    }

    // أخطاء SSL/HTTPS
    if (error.message?.includes('ERR_CERT') || 
        error.message?.includes('SSL') ||
        error.message?.includes('certificate')) {
      return 'مشكلة في أمان الاتصال. تحقق من إعدادات الشبكة'
    }

    // خطأ 401 - بيانات خاطئة
    if (error.status === 401 || error.message?.includes('Unauthorized')) {
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
    }

    // خطأ 403 - ممنوع
    if (error.status === 403) {
      return 'ليس لديك صلاحية للوصول إلى هذا النظام'
    }

    // خطأ 422 - بيانات غير صالحة
    if (error.status === 422) {
      return 'البيانات المدخلة غير صالحة. تحقق من صحة البريد الإلكتروني وكلمة المرور'
    }

    // خطأ 429 - طلبات كثيرة
    if (error.status === 429) {
      return 'تم تجاوز عدد المحاولات المسموح. انتظر قليلاً ثم حاول مرة أخرى'
    }

    // خطأ 500 - خطأ في الخادم
    if (error.status >= 500) {
      return 'خطأ في الخادم. حاول مرة أخرى لاحقاً أو تواصل مع الدعم الفني'
    }

    // رسائل خطأ مخصصة من الخادم
    if (error.message && typeof error.message === 'string') {
      // ترجمة بعض الرسائل الإنجليزية الشائعة
      const translations: Record<string, string> = {
        'Invalid credentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        'User not found': 'لم يتم العثور على المستخدم',
        'Account disabled': 'الحساب معطل. تواصل مع الإدارة',
        'Too many attempts': 'تم تجاوز عدد المحاولات المسموح',
        'Server error': 'خطأ في الخادم',
        'Unauthorized': 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      }

      const translatedMessage = translations[error.message]
      if (translatedMessage) return translatedMessage

      // إذا كانت الرسالة باللغة العربية، أعدها كما هي
      if (/[\u0600-\u06FF]/.test(error.message)) {
        return error.message
      }
    }

    // رسالة افتراضية
    return 'حدث خطأ في تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى'
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
