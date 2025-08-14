import { toast } from "sonner"
import { 
  FeaturedMosquesResponse, 
  Statistics, 
  MosquesResponse, 
  GovernoratesResponse, 
  DistrictsResponse, 
  SubDistrictsResponse, 
  NeighborhoodsResponse,
  MosqueFilters,
  Mosque
} from "./types"

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
      'X-Requested-With': 'XMLHttpRequest', // Laravel يتوقع هذا للـ AJAX requests
    }

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
      console.log('Using token for request:', this.token.substring(0, 20) + '...')
    } else if (includeAuth) {
      console.warn('No token available for authenticated request!')
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
      console.log(`=== Sending FormData to: ${BASE_URL}${endpoint} ===`)
      
      const headers = this.getFormHeaders()
      console.log('Request headers:', headers)
      
      // تسجيل محتويات FormData للتشخيص
      console.log('=== FormData contents in postForm ===')
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
        } else {
          console.log(`${key}: ${value}`)
        }
      }
      
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: formData,
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      return await this.handleResponse<T>(response)
    } catch (error: any) {
      console.error('postForm error:', error)

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

  // جلب الإحصائيات العامة
  async getStatistics(): Promise<Statistics> {
    try {
      const response = await this.get<Statistics>('/public/stats', false)
      return response
    } catch (error: any) {
      console.error('Error fetching statistics:', error)
      
      // في حالة فشل الطلب، أرجع بيانات افتراضية
      return {
        damaged_mosques: 0,
        total_projects: 0,
        completed_projects: 0,
        total_donations: 0
      }
    }
  }

  // ==================== إدارة المساجد ====================

  // جلب قائمة المساجد مع الفلترة والتقسيم
  async getMosques(filters: MosqueFilters = {}): Promise<MosquesResponse> {
    const params = new URLSearchParams()
    
    // إضافة معايير البحث والفلترة
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())
    if (filters.name) params.append('name', filters.name)
    if (filters.governorate_id) params.append('governorate_id', filters.governorate_id.toString())
    if (filters.district_id) params.append('district_id', filters.district_id.toString())
    if (filters.sub_district_id) params.append('sub_district_id', filters.sub_district_id.toString())
    if (filters.neighborhood_id) params.append('neighborhood_id', filters.neighborhood_id.toString())
    if (filters.damage_level) params.append('damage_level', filters.damage_level)
    if (filters.status) params.append('status', filters.status)
    if (filters.is_reconstruction !== undefined) params.append('is_reconstruction', filters.is_reconstruction ? '1' : '0')
    if (filters.created_from) params.append('created_from', filters.created_from)
    if (filters.created_to) params.append('created_to', filters.created_to)

    const queryString = params.toString()
    const endpoint = queryString ? `/mosques?${queryString}` : '/mosques'
    
    return await this.get<MosquesResponse>(endpoint)
  }

  // جلب تفاصيل مسجد واحد
  async getMosque(id: number): Promise<{ data: Mosque }> {
    return await this.get<{ data: Mosque }>(`/mosques/${id}`)
  }

  // إنشاء مسجد جديد
  async createMosque(data: {
    name_ar: string
    name_en: string
    governorate_id: number
    district_id: number
    sub_district_id: number
    neighborhood_id: number
    address_text?: string
    latitude?: string
    longitude?: string
    damage_level: "جزئي" | "كامل"
    estimated_cost?: string
    is_reconstruction: boolean
    status: "نشط" | "موقوف" | "مكتمل"
  }): Promise<{ data: Mosque }> {
    const formData = new FormData()
    
    formData.append('name_ar', data.name_ar)
    formData.append('name_en', data.name_en)
    formData.append('governorate_id', data.governorate_id.toString())
    formData.append('district_id', data.district_id.toString())
    formData.append('sub_district_id', data.sub_district_id.toString())
    formData.append('neighborhood_id', data.neighborhood_id.toString())
    formData.append('damage_level', data.damage_level)
    formData.append('is_reconstruction', data.is_reconstruction ? '1' : '0')
    formData.append('status', data.status)
    
    if (data.address_text) formData.append('address_text', data.address_text)
    if (data.latitude) formData.append('latitude', data.latitude)
    if (data.longitude) formData.append('longitude', data.longitude)
    if (data.estimated_cost) formData.append('estimated_cost', data.estimated_cost)

    return await this.postForm<{ data: Mosque }>('/mosques', formData)
  }

  // تحديث مسجد
  async updateMosque(id: number, data: {
    name_ar?: string
    name_en?: string
    governorate_id?: number
    district_id?: number
    sub_district_id?: number
    neighborhood_id?: number
    address_text?: string
    latitude?: string
    longitude?: string
    damage_level?: "جزئي" | "كامل"
    estimated_cost?: string
    is_reconstruction?: boolean
    status?: "نشط" | "موقوف" | "مكتمل"
  }): Promise<{ data: Mosque }> {
    const formData = new FormData()
    
    // إضافة _method للـ PUT request
    formData.append('_method', 'PUT')
    
    if (data.name_ar) formData.append('name_ar', data.name_ar)
    if (data.name_en) formData.append('name_en', data.name_en)
    if (data.governorate_id) formData.append('governorate_id', data.governorate_id.toString())
    if (data.district_id) formData.append('district_id', data.district_id.toString())
    if (data.sub_district_id) formData.append('sub_district_id', data.sub_district_id.toString())
    if (data.neighborhood_id) formData.append('neighborhood_id', data.neighborhood_id.toString())
    if (data.damage_level) formData.append('damage_level', data.damage_level)
    if (data.is_reconstruction !== undefined) formData.append('is_reconstruction', data.is_reconstruction ? '1' : '0')
    if (data.status) formData.append('status', data.status)
    if (data.address_text) formData.append('address_text', data.address_text)
    if (data.latitude) formData.append('latitude', data.latitude)
    if (data.longitude) formData.append('longitude', data.longitude)
    if (data.estimated_cost) formData.append('estimated_cost', data.estimated_cost)

    return await this.postForm<{ data: Mosque }>(`/mosques/${id}`, formData)
  }

  // حذف مسجد
  async deleteMosque(id: number): Promise<{ message: string }> {
    return await this.delete<{ message: string }>(`/mosques/${id}`)
  }

  // ==================== البيانات المرجعية ====================

  // جلب المحافظات
  async getGovernorates(): Promise<GovernoratesResponse> {
    return await this.get<GovernoratesResponse>('/governorates')
  }

  // جلب المناطق
  async getDistricts(governorateId?: number): Promise<DistrictsResponse> {
    const endpoint = governorateId ? `/districts?governorate_id=${governorateId}` : '/districts'
    return await this.get<DistrictsResponse>(endpoint)
  }

  // جلب النواحي
  async getSubDistricts(districtId?: number): Promise<SubDistrictsResponse> {
    const endpoint = districtId ? `/sub-districts?district_id=${districtId}` : '/sub-districts'
    return await this.get<SubDistrictsResponse>(endpoint)
  }

  // جلب الأحياء
  async getNeighborhoods(subDistrictId?: number): Promise<NeighborhoodsResponse> {
    const endpoint = subDistrictId ? `/neighborhoods?sub_district_id=${subDistrictId}` : '/neighborhoods'
    return await this.get<NeighborhoodsResponse>(endpoint)
  }

  // ==================== إدارة وسائط المساجد ====================

  // رفع وسائط جديدة للمسجد
  async uploadMosqueMedia(data: {
    mosque_id: number
    media_stage: "before" | "after"
    is_main?: boolean
    media_order?: number
    files: File[]
  }): Promise<any> {
    // التحقق من صحة البيانات قبل الإرسال
    if (!data.mosque_id) {
      throw new Error('معرف المسجد مطلوب')
    }
    if (!data.media_stage) {
      throw new Error('مرحلة الوسائط مطلوبة')
    }
    if (!data.files || data.files.length === 0) {
      throw new Error('الملفات مطلوبة')
    }

    console.log('=== Starting media upload ===')
    console.log('Input data:', {
      mosque_id: data.mosque_id,
      media_stage: data.media_stage,
      is_main: data.is_main,
      media_order: data.media_order,
      filesCount: data.files.length,
      fileNames: data.files.map(f => f.name)
    })

    const formData = new FormData()
    
    // إضافة البيانات الأساسية بشكل صريح
    console.log('Adding mosque_id:', data.mosque_id, typeof data.mosque_id)
    formData.append('mosque_id', String(data.mosque_id))
    
    console.log('Adding media_stage:', data.media_stage, typeof data.media_stage)
    formData.append('media_stage', String(data.media_stage))
    
    console.log('Adding is_main:', data.is_main, typeof data.is_main)
    formData.append('is_main', String(data.is_main ? 1 : 0))
    
    console.log('Adding media_order:', data.media_order, typeof data.media_order)
    formData.append('media_order', String(data.media_order || 1))
    
    // إضافة الملفات - جرب كلا الطريقتين
    data.files.forEach((file, index) => {
      formData.append('files[]', file, file.name)
      console.log(`Added file ${index} as files[]:`, file.name, file.size, file.type)
    })

    // أضف أيضاً كـ files بدون []
    data.files.forEach((file, index) => {
      formData.append('files', file, file.name)
      console.log(`Added file ${index} as files:`, file.name, file.size, file.type)
    })

    // التحقق من محتويات FormData قبل الإرسال
    console.log('=== FormData contents before sending ===')
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
      } else {
        console.log(`${key}: ${value}`)
      }
    }

    return await this.postForm<any>('/mosque-media', formData)
  }

  // جلب وسائط مسجد معين
  async getMosqueMedia(mosqueId: number): Promise<any> {
    return await this.get<any>(`/mosque-media?mosque_id=${mosqueId}`)
  }

  // حذف وسائط
  async deleteMosqueMedia(mediaId: number): Promise<any> {
    return await this.delete<any>(`/mosque-media/${mediaId}`)
  }

  // تحديث ترتيب الوسائط
  async updateMosqueMediaOrder(mediaId: number, newOrder: number): Promise<any> {
    return await this.put<any>(`/mosque-media/${mediaId}`, {
      media_order: newOrder
    })
  }

  // تحديد الصورة الرئيسية
  async setMainMosqueMedia(mediaId: number): Promise<any> {
    // استخدام PUT request مع تحديث is_main
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('is_main', '1')
    
    return await this.postForm<any>(`/mosque-media/${mediaId}`, formData)
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

  // جلب الإحصائيات العامة
  getStatistics: () =>
    apiClient.getStatistics(),

  // ==================== إدارة المساجد ====================
  
  // جلب قائمة المساجد مع الفلترة والتقسيم
  getMosques: (filters?: MosqueFilters) =>
    apiClient.getMosques(filters),

  // جلب تفاصيل مسجد واحد
  getMosque: (id: number) =>
    apiClient.getMosque(id),

  // إنشاء مسجد جديد
  createMosque: (data: {
    name_ar: string
    name_en: string
    governorate_id: number
    district_id: number
    sub_district_id: number
    neighborhood_id: number
    address_text?: string
    latitude?: string
    longitude?: string
    damage_level: "جزئي" | "كامل"
    estimated_cost?: string
    is_reconstruction: boolean
    status: "نشط" | "موقوف" | "مكتمل"
  }) =>
    apiClient.createMosque(data),

  // تحديث مسجد
  updateMosque: (id: number, data: {
    name_ar?: string
    name_en?: string
    governorate_id?: number
    district_id?: number
    sub_district_id?: number
    neighborhood_id?: number
    address_text?: string
    latitude?: string
    longitude?: string
    damage_level?: "جزئي" | "كامل"
    estimated_cost?: string
    is_reconstruction?: boolean
    status?: "نشط" | "موقوف" | "مكتمل"
  }) =>
    apiClient.updateMosque(id, data),

  // حذف مسجد
  deleteMosque: (id: number) =>
    apiClient.deleteMosque(id),

  // ==================== البيانات المرجعية ====================

  // جلب المحافظات
  getGovernorates: () =>
    apiClient.getGovernorates(),

  // جلب المناطق
  getDistricts: (governorateId?: number) =>
    apiClient.getDistricts(governorateId),

  // جلب النواحي
  getSubDistricts: (districtId?: number) =>
    apiClient.getSubDistricts(districtId),

  // جلب الأحياء
  getNeighborhoods: (subDistrictId?: number) =>
    apiClient.getNeighborhoods(subDistrictId),

  // ==================== إدارة وسائط المساجد ====================

  // رفع وسائط جديدة للمسجد
  uploadMosqueMedia: (data: {
    mosque_id: number
    media_stage: "before" | "after"
    is_main?: boolean
    media_order?: number
    files: File[]
  }) =>
    apiClient.uploadMosqueMedia(data),

  // جلب وسائط مسجد معين
  getMosqueMedia: (mosqueId: number) =>
    apiClient.getMosqueMedia(mosqueId),

  // حذف وسائط
  deleteMosqueMedia: (mediaId: number) =>
    apiClient.deleteMosqueMedia(mediaId),

  // تحديث ترتيب الوسائط
  updateMosqueMediaOrder: (mediaId: number, newOrder: number) =>
    apiClient.updateMosqueMediaOrder(mediaId, newOrder),

  // تحديد الصورة الرئيسية
  setMainMosqueMedia: (mediaId: number) =>
    apiClient.setMainMosqueMedia(mediaId),

  // ==================== المساجد العامة ====================

  // جلب المساجد العامة (بدون توثيق)
  getPublicMosques: async (filters: {
    page?: number
    per_page?: number
    search?: string
    governorate_id?: number
    district_id?: number
    sub_district_id?: number
    neighborhood_id?: number
    damage_level?: "جزئي" | "كامل" | "all"
    status?: "نشط" | "موقوف" | "مكتمل" | "all"
    is_reconstruction?: boolean
  } = {}): Promise<MosquesResponse> => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        params.append(key, value.toString())
      }
    })

    const response = await fetch(`${BASE_URL}/public/mosques?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch public mosques')
    }

    return await response.json()
  },

  // جلب تفاصيل مسجد عام (بدون توثيق)
  getPublicMosque: async (id: number): Promise<{ data: Mosque }> => {
    const response = await fetch(`${BASE_URL}/api/public/mosques/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch public mosque')
    }

    return await response.json()
  },
}

export default api
