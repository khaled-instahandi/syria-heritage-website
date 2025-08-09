import { toast } from "sonner"

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
}

// الـ Base URL للباك اند
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://back-aamar.academy-lead.com/api'
const BASE_URL_HTTP = process.env.NEXT_PUBLIC_API_BASE_URL_HTTP || 'http://back-aamar.academy-lead.com/api'
// استخدام proxy في التطوير لتجنب مشاكل CORS/SSL
const PROXY_URL = '/api/proxy'

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
      data = await response.json()
    } else {
      data = { message: await response.text() }
    }

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || `HTTP error! status: ${response.status}`,
        errors: data.errors
      }
      throw error
    }

    return data
  }

  // معالجة الأخطاء وعرضها
  private handleError(error: any, showToast: boolean = true): void {
    console.error('API Error:', error)
    
    if (showToast) {
      let errorMessage = 'حدث خطأ غير متوقع'
      
      // معالجة أنواع مختلفة من الأخطاء
      if (error.message) {
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CERT_COMMON_NAME_INVALID')) {
          errorMessage = 'فشل في الاتصال بالخادم. تحقق من اتصالك بالإنترنت.'
        } else if (error.message.includes('ERR_NETWORK')) {
          errorMessage = 'خطأ في الشبكة. تحقق من اتصالك بالإنترنت.'
        } else if (error.message.includes('CORS')) {
          errorMessage = 'خطأ في إعدادات الخادم. يرجى المحاولة لاحقاً.'
        } else {
          errorMessage = error.message
        }
      }
      
      if (error.errors) {
        // عرض أخطاء التحقق
        Object.values(error.errors).flat().forEach((msg: any) => {
          toast.error(msg)
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

  // طلب GET
  async get<T>(endpoint: string, showErrorToast: boolean = true): Promise<T> {
    const apiUrl = process.env.NODE_ENV === 'development' ? BASE_URL_HTTP : this.baseURL
    
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
    const apiUrl = process.env.NODE_ENV === 'development' ? BASE_URL_HTTP : this.baseURL
    
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
    // تجربة عدة URLs بترتيب الأولوية
    const urlsToTry = []
    
    if (process.env.NODE_ENV === 'development') {
      // في التطوير، نجرب بالترتيب: Proxy -> HTTP -> HTTPS
      urlsToTry.push(PROXY_URL, BASE_URL_HTTP, this.baseURL)
    } else {
      // في الإنتاج، نستخدم HTTPS فقط
      urlsToTry.push(this.baseURL)
    }
    
    let lastError: any = null
    
    for (const url of urlsToTry) {
      try {
        console.log(`Trying to connect to: ${url}${endpoint}`)
        const response = await fetch(`${url}${endpoint}`, {
          method: 'POST',
          headers: this.getFormHeaders(),
          body: formData,
        })

        return await this.handleResponse<T>(response)
      } catch (error: any) {
        console.warn(`Failed to connect to ${url}:`, error.message)
        lastError = error
        continue
      }
    }
    
    // إذا فشلت جميع المحاولات
    const customError = {
      message: 'فشل في الاتصال بالخادم من جميع المسارات المتاحة. تحقق من أن الخادم يعمل.',
      status: 0,
      originalError: lastError
    }
    
    this.handleError(customError, showErrorToast)
    throw customError
  }

  // طلب PUT
  async put<T>(endpoint: string, data?: any, showErrorToast: boolean = true): Promise<T> {
    const apiUrl = process.env.NODE_ENV === 'development' ? BASE_URL_HTTP : this.baseURL
    
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
    const apiUrl = process.env.NODE_ENV === 'development' ? BASE_URL_HTTP : this.baseURL
    
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
      
      // معالجة خاصة لأخطاء تسجيل الدخول
      let errorMessage = 'فشل في تسجيل الدخول'
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CERT_COMMON_NAME_INVALID')) {
        errorMessage = 'فشل في الاتصال بالخادم. تحقق من أن الخادم يعمل أو جرب لاحقاً.'
      } else if (error.status === 401) {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      } else if (error.status === 422) {
        errorMessage = 'بيانات غير صحيحة. تحقق من البريد الإلكتروني وكلمة المرور'
      }
      
      toast.error(errorMessage)
      throw error
    }
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
}

export default api
