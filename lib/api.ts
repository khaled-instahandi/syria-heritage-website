import { toast } from "sonner"
import { FeaturedMosquesResponse } from "./types"

// نوع البيانات للمستخدم
export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: {
    id: number
    role_name: string
  }
  branch: any
  created_at: string
}

// نوع البيانات للتوثيق
export interface AuthResponse {
  status: string
  user: User
  authorisation: {
    token: string
    type: string
  }
}

// نوع البيانات للاستجابة العامة
export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  message?: string
  data?: T
  user?: User
  authorisation?: {
    token: string
    type: string
  }
}

// نوع البيانات للخطأ
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
  userMessage?: string
}

// الـ Base URL للباك اند
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://back-aamar.academy-lead.com/api'

// فئة إدارة الباك اند
class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL
    this.loadToken()
  }

  // تحميل التوكن من localStorage
  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken')
    }
  }

  // حفظ التوكن في localStorage
  private saveToken(token: string): void {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  // حذف التوكن
  private removeToken(): void {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  }

  // الحصول على headers الافتراضية
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }

  // الحصول على headers للـ FormData
  private getFormHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    }

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }

  // معالجة الاستجابة
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')

    let data: any
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json()
      } catch (parseError) {
        data = { message: `خطأ في تحليل الاستجابة: ${response.status} ${response.statusText}` }
      }
    } else {
      data = { message: await response.text() || `HTTP ${response.status}: ${response.statusText}` }
    }

    if (!response.ok) {
      const error: ApiError & { status: number } = {
        message: data.message || this.getStatusMessage(response.status),
        errors: data.errors,
        status: response.status
      }
      throw error
    }

    return data
  }

  // رسائل حالة HTTP مترجمة
  private getStatusMessage(status: number): string {
    const statusMessages: Record<number, string> = {
      400: 'طلب غير صالح - تحقق من البيانات المُرسلة',
      401: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      403: 'ليس لديك صلاحية للوصول',
      404: 'الخدمة المطلوبة غير موجودة',
      422: 'البيانات المدخلة غير صالحة',
      429: 'تم تجاوز عدد المحاولات المسموح',
      500: 'خطأ في الخادم - حاول لاحقاً',
      502: 'الخادم غير متاح حالياً',
      503: 'الخدمة متوقفة مؤقتاً',
      504: 'انتهت مهلة الاتصال بالخادم'
    }

    return statusMessages[status] || `خطأ HTTP: ${status}`
  }

  // معالجة الأخطاء وعرضها
  private handleError(error: any, showToast: boolean = true): void {
    console.error('API Error:', error)

    if (showToast) {
      let errorMessage = 'حدث خطأ غير متوقع'

      // معالجة أنواع مختلفة من الأخطاء
      if (error.message) {
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('ERR_CERT_COMMON_NAME_INVALID') ||
            error.message.includes('ERR_NETWORK') ||
            error.message.includes('ERR_INTERNET_DISCONNECTED')) {
          errorMessage = 'فشل في الاتصال بالخادم. تحقق من اتصالك بالإنترنت.'
        } else if (error.message.includes('CORS')) {
          errorMessage = 'خطأ في إعدادات الخادم. يرجى المحاولة لاحقاً.'
        } else if (error.message.includes('timeout')) {
          errorMessage = 'انتهت مهلة الاتصال. حاول مرة أخرى.'
        } else {
          errorMessage = error.message
        }
      }

      // عرض أخطاء التحقق من الصحة
      if (error.errors && typeof error.errors === 'object') {
        Object.entries(error.errors).forEach(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg: string) => {
              toast.error(`${this.translateFieldName(field)}: ${msg}`)
            })
          } else if (typeof messages === 'string') {
            toast.error(`${this.translateFieldName(field)}: ${messages}`)
          }
        })
      } else {
        toast.error(errorMessage)
      }
    }

    // إذا كان الخطأ 401 (غير مصرح)، قم بتسجيل الخروج
    if (error.status === 401) {
      this.logout()
    }
  }

  // ترجمة أسماء الحقول
  private translateFieldName(fieldName: string): string {
    const fieldTranslations: Record<string, string> = {
      'email': 'البريد الإلكتروني',
      'password': 'كلمة المرور',
      'name': 'الاسم',
      'phone': 'رقم الهاتف',
      'role': 'الدور',
      'branch': 'الفرع'
    }

    return fieldTranslations[fieldName] || fieldName
  }

  // طلب GET
  async get<T>(endpoint: string, showErrorToast: boolean = true): Promise<T> {
    const apiUrl = BASE_URL

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      return await this.handleResponse<T>(response)
    } catch (error) {
      this.handleError(error, showErrorToast)
      throw error
    }
  }

  // طلب POST
  async post<T>(endpoint: string, data?: any, showErrorToast: boolean = true): Promise<T> {
    const apiUrl = BASE_URL

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      })

      return await this.handleResponse<T>(response)
    } catch (error) {
      this.handleError(error, showErrorToast)
      throw error
    }
  }

  // طلب POST مع FormData
  async postForm<T>(endpoint: string, formData: FormData, showErrorToast: boolean = true): Promise<T> {

    try {
      console.log(`Sending FormData to: ${BASE_URL}${endpoint}`)
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getFormHeaders(),
        body: formData,
      })

      return await this.handleResponse<T>(response)
    } catch (error: any) {
      // console.warn(`Failed to connect:`, error.message)

      // إذا فشلت المحاولة الأولى في التطوير، جرب HTTP مباشرة
      if (process.env.NODE_ENV === 'development') {
        try {
          console.log(`Retrying with HTTP: ${BASE_URL}${endpoint}`)
          const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: this.getFormHeaders(),
            body: formData,
          })

          return await this.handleResponse<T>(response)
        } catch (httpError: any) {
          console.warn(`HTTP fallback also failed:`, httpError.message)
        }
      }

      // معالجة الخطأ النهائي
      const customError = {
        message: error.message,
        status: 0,
        originalError: error
      }

      this.handleError(customError, showErrorToast)
      throw customError
    }
  }

  // طلب PUT
  async put<T>(endpoint: string, data?: any, showErrorToast: boolean = true): Promise<T> {
    const apiUrl = process.env.NODE_ENV === 'development' ? BASE_URL : this.baseURL

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      })

      return await this.handleResponse<T>(response)
    } catch (error) {
      this.handleError(error, showErrorToast)
      throw error
    }
  }

  // طلب DELETE
  async delete<T>(endpoint: string, showErrorToast: boolean = true): Promise<T> {
    const apiUrl = process.env.NODE_ENV === 'development' ? BASE_URL : this.baseURL

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      return await this.handleResponse<T>(response)
    } catch (error) {
      this.handleError(error, showErrorToast)
      throw error
    }
  }

  // تسجيل الدخول
  async login(email: string, password: string): Promise<AuthResponse> {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    try {
      console.log('Attempting login with:', { email, baseURL: this.baseURL })
      const response = await this.postForm<AuthResponse>('/login', formData, false)

      if (response.status === 'success' && response.authorisation) {
        this.saveToken(response.authorisation.token)

        // حفظ بيانات المستخدم
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        toast.success('تم تسجيل الدخول بنجاح')
      }

      return response
    } catch (error: any) {
      console.error('Login error details:', error)

      // إنشاء رسالة خطأ محسنة
      const enhancedError = {
        ...error,
        userMessage: this.getLoginErrorMessage(error)
      }

      throw enhancedError
    }
  }

  // رسائل خطأ مخصصة لتسجيل الدخول
  private getLoginErrorMessage(error: any): string {
    if (!error) return 'حدث خطأ في تسجيل الدخول'

    // أخطاء الشبكة
    if (error.message?.includes('Failed to fetch') || 
        error.message?.includes('ERR_NETWORK') ||
        error.message?.includes('ERR_INTERNET_DISCONNECTED')) {
      return 'تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت'
    }

    // أخطاء SSL
    if (error.message?.includes('ERR_CERT') || 
        error.message?.includes('SSL') ||
        error.message?.includes('certificate')) {
      return 'مشكلة في أمان الاتصال. تحقق من إعدادات الشبكة'
    }

    // أخطاء المصادقة
    if (error.status === 401 || error.message?.includes('Unauthorized')) {
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
    }

    if (error.status === 403) {
      return 'ليس لديك صلاحية للوصول إلى هذا النظام'
    }

    if (error.status === 422) {
      return 'البيانات المدخلة غير صالحة. تحقق من صحة البريد الإلكتروني وكلمة المرور'
    }

    if (error.status === 429) {
      return 'تم تجاوز عدد المحاولات المسموح. انتظر قليلاً ثم حاول مرة أخرى'
    }

    if (error.status >= 500) {
      return 'خطأ في الخادم. حاول مرة أخرى لاحقاً'
    }

    // رسائل مخصصة من الخادم
    if (error.message && typeof error.message === 'string') {
      // إذا كانت الرسالة باللغة العربية، أعدها كما هي
      if (/[\u0600-\u06FF]/.test(error.message)) {
        return error.message
      }
    }

    return 'حدث خطأ في تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى'
  }

  // تسجيل الخروج
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await this.post('/logout', {}, false)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.removeToken()
      toast.success('تم تسجيل الخروج بنجاح')

      // إعادة توجيه إلى صفحة تسجيل الدخول
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  // التحقق من حالة المصادقة
  isAuthenticated(): boolean {
    return !!this.token
  }

  // الحصول على المستخدم الحالي
  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  // الحصول على التوكن الحالي
  getToken(): string | null {
    return this.token
  }

  // تحديث التوكن
  setToken(token: string): void {
    this.saveToken(token)
  }

  // تحديث بيانات المستخدم
  updateUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  // جلب المساجد المميزة
  async getFeaturedMosques(): Promise<FeaturedMosquesResponse> {
    try {
      const response = await this.get<FeaturedMosquesResponse>('/public/latest-mosques', false)
      return response
    } catch (error: any) {
      console.error('Error fetching featured mosques:', error)
      
      // في حالة فشل الطلب، أرجع بيانات فارغة بدلاً من إرسال خطأ
      return { data: [] }
    }
  }
}

// إنشاء instance مشترك
export const apiClient = new ApiClient()

// دوال مساعدة للاستخدام المباشر
export const api = {
  // طلبات البيانات
  get: <T>(endpoint: string, showErrorToast?: boolean) =>
    apiClient.get<T>(endpoint, showErrorToast),

  post: <T>(endpoint: string, data?: any, showErrorToast?: boolean) =>
    apiClient.post<T>(endpoint, data, showErrorToast),

  postForm: <T>(endpoint: string, formData: FormData, showErrorToast?: boolean) =>
    apiClient.postForm<T>(endpoint, formData, showErrorToast),

  put: <T>(endpoint: string, data?: any, showErrorToast?: boolean) =>
    apiClient.put<T>(endpoint, data, showErrorToast),

  delete: <T>(endpoint: string, showErrorToast?: boolean) =>
    apiClient.delete<T>(endpoint, showErrorToast),

  // المصادقة
  login: (email: string, password: string) =>
    apiClient.login(email, password),

  logout: () =>
    apiClient.logout(),

  isAuthenticated: () =>
    apiClient.isAuthenticated(),

  getCurrentUser: () =>
    apiClient.getCurrentUser(),

  getToken: () =>
    apiClient.getToken(),

  setToken: (token: string) =>
    apiClient.setToken(token),

  updateUser: (user: User) =>
    apiClient.updateUser(user),

  // جلب المساجد المميزة
  getFeaturedMosques: () =>
    apiClient.getFeaturedMosques(),
}

export default api
