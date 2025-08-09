"use client"

import { toast } from "sonner"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"

// أنواع الرسائل المختلفة
export type ToastType = 'success' | 'error' | 'warning' | 'info'

// إعدادات Toast مخصصة
interface ToastOptions {
  duration?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  dismissible?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

// دالة عرض رسالة نجاح
export function showSuccessToast(message: string, options?: ToastOptions) {
  toast.success(message, {
    duration: options?.duration || 4000,
    position: options?.position,
    dismissible: options?.dismissible ?? true,
    icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    className: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    action: options?.action
  })
}

// دالة عرض رسالة خطأ
export function showErrorToast(message: string, options?: ToastOptions) {
  toast.error(message, {
    duration: options?.duration || 6000,
    position: options?.position,
    dismissible: options?.dismissible ?? true,
    icon: <XCircle className="w-5 h-5 text-red-600" />,
    className: 'bg-red-50 border-red-200 text-red-900',
    action: options?.action
  })
}

// دالة عرض رسالة تحذير
export function showWarningToast(message: string, options?: ToastOptions) {
  toast.warning(message, {
    duration: options?.duration || 5000,
    position: options?.position,
    dismissible: options?.dismissible ?? true,
    icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
    className: 'bg-amber-50 border-amber-200 text-amber-900',
    action: options?.action
  })
}

// دالة عرض رسالة معلومات
export function showInfoToast(message: string, options?: ToastOptions) {
  toast.info(message, {
    duration: options?.duration || 4000,
    position: options?.position,
    dismissible: options?.dismissible ?? true,
    icon: <Info className="w-5 h-5 text-blue-600" />,
    className: 'bg-blue-50 border-blue-200 text-blue-900',
    action: options?.action
  })
}

// دالة عرض رسالة مخصصة
export function showCustomToast(
  message: string, 
  type: ToastType = 'info', 
  options?: ToastOptions
) {
  const toastFunctions = {
    success: showSuccessToast,
    error: showErrorToast,
    warning: showWarningToast,
    info: showInfoToast
  }

  toastFunctions[type](message, options)
}

// دالة عرض رسالة تحميل
export function showLoadingToast(message: string = 'جاري التحميل...') {
  return toast.loading(message, {
    className: 'bg-slate-50 border-slate-200 text-slate-900'
  })
}

// دالة إغلاق رسالة تحميل وعرض رسالة نجاح
export function dismissLoadingToast(toastId: string | number, successMessage?: string) {
  toast.dismiss(toastId)
  if (successMessage) {
    showSuccessToast(successMessage)
  }
}

// دالة إغلاق رسالة تحميل وعرض رسالة خطأ
export function dismissLoadingWithError(toastId: string | number, errorMessage: string) {
  toast.dismiss(toastId)
  showErrorToast(errorMessage)
}

// دالة عرض أخطاء التحقق من صحة البيانات
export function showValidationErrors(errors: Record<string, string[]>) {
  Object.entries(errors).forEach(([field, messages]) => {
    messages.forEach(message => {
      showErrorToast(`${field}: ${message}`)
    })
  })
}

// دالة عرض أخطاء الشبكة
export function showNetworkError() {
  showErrorToast('فشل في الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.', {
    duration: 8000,
    action: {
      label: 'إعادة محاولة',
      onClick: () => window.location.reload()
    }
  })
}

// دالة عرض خطأ عدم وجود صلاحية
export function showUnauthorizedError() {
  showErrorToast('ليس لديك صلاحية للوصول إلى هذا المورد.', {
    duration: 6000,
    action: {
      label: 'تسجيل الدخول',
      onClick: () => window.location.href = '/login'
    }
  })
}

// دالة عرض خطأ انتهاء الجلسة
export function showSessionExpiredError() {
  showErrorToast('انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.', {
    duration: 8000,
    action: {
      label: 'تسجيل الدخول',
      onClick: () => {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
  })
}

// دالة عرض رسالة نجاح العملية
export function showOperationSuccess(operation: string) {
  showSuccessToast(`تم ${operation} بنجاح`)
}

// دالة عرض رسالة فشل العملية
export function showOperationError(operation: string, error?: string) {
  const message = error || `فشل في ${operation}`
  showErrorToast(message)
}

// دالة إغلاق جميع الرسائل
export function dismissAllToasts() {
  toast.dismiss()
}

// Hook للتحكم في الرسائل
export function useToast() {
  return {
    success: showSuccessToast,
    error: showErrorToast,
    warning: showWarningToast,
    info: showInfoToast,
    custom: showCustomToast,
    loading: showLoadingToast,
    dismissLoading: dismissLoadingToast,
    dismissWithError: dismissLoadingWithError,
    validationErrors: showValidationErrors,
    networkError: showNetworkError,
    unauthorizedError: showUnauthorizedError,
    sessionExpiredError: showSessionExpiredError,
    operationSuccess: showOperationSuccess,
    operationError: showOperationError,
    dismissAll: dismissAllToasts
  }
}
