import { api, ApiResponse } from './api'

// أنواع البيانات للمساجد
export interface Mosque {
  id: number
  name: string
  governorate_id: number
  city: string
  district: string
  damage_level: string
  estimated_cost?: number
  description?: string
  status: string
  created_at: string
  updated_at: string
  images?: string[]
  coordinates?: {
    lat: number
    lng: number
  }
}

// أنواع البيانات للمشاريع
export interface Project {
  id: number
  mosque_id: number
  title: string
  description: string
  cost: number
  collected_amount: number
  status: string
  start_date: string
  end_date?: string
  created_at: string
  updated_at: string
  images?: string[]
  documents?: string[]
}

// أنواع البيانات للتبرعات
export interface Donation {
  id: number
  mosque_id?: number
  project_id?: number
  donor_name?: string
  donor_email?: string
  donor_phone?: string
  amount: number
  currency: string
  payment_method: string
  payment_status: string
  donated_at: string
  created_at: string
  updated_at: string
  message?: string
}

// أنواع البيانات للإحصائيات
export interface Statistics {
  totalMosques: number
  completedMosques: number
  inProgressMosques: number
  plannedMosques: number
  totalDonations: number
  totalCollected: number
  activeProjects: number
  completedProjects: number
}

// أنواع البيانات للمحافظات
export interface Governorate {
  id: number
  name: string
  mosques_count: number
  total_estimated_cost: number
  completed_mosques: number
}

// فئة إدارة بيانات المساجد
class MosquesService {
  // الحصول على جميع المساجد
  static async getAll(params?: {
    governorate_id?: number
    damage_level?: string
    status?: string
    page?: number
    limit?: number
    search?: string
  }): Promise<ApiResponse<{ data: Mosque[], total: number, current_page: number, last_page: number }>> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const endpoint = queryParams.toString() ? `/mosques?${queryParams}` : '/mosques'
    return api.get<ApiResponse<{ data: Mosque[], total: number, current_page: number, last_page: number }>>(endpoint)
  }

  // الحصول على مسجد واحد
  static async getById(id: number): Promise<ApiResponse<Mosque>> {
    return api.get<ApiResponse<Mosque>>(`/mosques/${id}`)
  }

  // إنشاء مسجد جديد
  static async create(mosquesData: Omit<Mosque, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Mosque>> {
    return api.post<ApiResponse<Mosque>>('/mosques', mosquesData)
  }

  // تحديث مسجد
  static async update(id: number, mosquesData: Partial<Mosque>): Promise<ApiResponse<Mosque>> {
    return api.put<ApiResponse<Mosque>>(`/mosques/${id}`, mosquesData)
  }

  // حذف مسجد
  static async delete(id: number): Promise<ApiResponse<any>> {
    return api.delete<ApiResponse<any>>(`/mosques/${id}`)
  }

  // رفع صور للمسجد
  static async uploadImages(id: number, images: File[]): Promise<ApiResponse<string[]>> {
    const formData = new FormData()
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image)
    })
    
    return api.postForm<ApiResponse<string[]>>(`/mosques/${id}/images`, formData)
  }

  // حذف صورة من المسجد
  static async deleteImage(mosqueId: number, imagePath: string): Promise<ApiResponse<any>> {
    return api.delete<ApiResponse<any>>(`/mosques/${mosqueId}/images`, true)
  }
}

// فئة إدارة بيانات المشاريع
class ProjectsService {
  // الحصول على جميع المشاريع
  static async getAll(params?: {
    mosque_id?: number
    status?: string
    page?: number
    limit?: number
    search?: string
  }): Promise<ApiResponse<{ data: Project[], total: number, current_page: number, last_page: number }>> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const endpoint = queryParams.toString() ? `/projects?${queryParams}` : '/projects'
    return api.get<ApiResponse<{ data: Project[], total: number, current_page: number, last_page: number }>>(endpoint)
  }

  // الحصول على مشروع واحد
  static async getById(id: number): Promise<ApiResponse<Project>> {
    return api.get<ApiResponse<Project>>(`/projects/${id}`)
  }

  // إنشاء مشروع جديد
  static async create(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'collected_amount'>): Promise<ApiResponse<Project>> {
    return api.post<ApiResponse<Project>>('/projects', projectData)
  }

  // تحديث مشروع
  static async update(id: number, projectData: Partial<Project>): Promise<ApiResponse<Project>> {
    return api.put<ApiResponse<Project>>(`/projects/${id}`, projectData)
  }

  // حذف مشروع
  static async delete(id: number): Promise<ApiResponse<any>> {
    return api.delete<ApiResponse<any>>(`/projects/${id}`)
  }

  // الحصول على مشاريع مسجد معين
  static async getByMosqueId(mosqueId: number): Promise<ApiResponse<Project[]>> {
    return api.get<ApiResponse<Project[]>>(`/mosques/${mosqueId}/projects`)
  }
}

// فئة إدارة بيانات التبرعات
class DonationsService {
  // الحصول على جميع التبرعات
  static async getAll(params?: {
    mosque_id?: number
    project_id?: number
    payment_status?: string
    payment_method?: string
    date_from?: string
    date_to?: string
    page?: number
    limit?: number
    search?: string
  }): Promise<ApiResponse<{ data: Donation[], total: number, current_page: number, last_page: number }>> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const endpoint = queryParams.toString() ? `/donations?${queryParams}` : '/donations'
    return api.get<ApiResponse<{ data: Donation[], total: number, current_page: number, last_page: number }>>(endpoint)
  }

  // الحصول على تبرع واحد
  static async getById(id: number): Promise<ApiResponse<Donation>> {
    return api.get<ApiResponse<Donation>>(`/donations/${id}`)
  }

  // إنشاء تبرع جديد
  static async create(donationData: Omit<Donation, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Donation>> {
    return api.post<ApiResponse<Donation>>('/donations', donationData)
  }

  // تحديث تبرع
  static async update(id: number, donationData: Partial<Donation>): Promise<ApiResponse<Donation>> {
    return api.put<ApiResponse<Donation>>(`/donations/${id}`, donationData)
  }

  // حذف تبرع
  static async delete(id: number): Promise<ApiResponse<any>> {
    return api.delete<ApiResponse<any>>(`/donations/${id}`)
  }

  // الحصول على تبرعات مسجد معين
  static async getByMosqueId(mosqueId: number): Promise<ApiResponse<Donation[]>> {
    return api.get<ApiResponse<Donation[]>>(`/mosques/${mosqueId}/donations`)
  }

  // الحصول على تبرعات مشروع معين
  static async getByProjectId(projectId: number): Promise<ApiResponse<Donation[]>> {
    return api.get<ApiResponse<Donation[]>>(`/projects/${projectId}/donations`)
  }
}

// فئة إدارة الإحصائيات
class StatisticsService {
  // الحصول على الإحصائيات العامة
  static async getGeneral(): Promise<ApiResponse<Statistics>> {
    return api.get<ApiResponse<Statistics>>('/statistics/general')
  }

  // الحصول على إحصائيات المحافظات
  static async getGovernorates(): Promise<ApiResponse<Governorate[]>> {
    return api.get<ApiResponse<Governorate[]>>('/statistics/governorates')
  }

  // الحصول على إحصائيات التبرعات الشهرية
  static async getMonthlyDonations(year?: number): Promise<ApiResponse<{ month: string, amount: number }[]>> {
    const endpoint = year ? `/statistics/donations/monthly?year=${year}` : '/statistics/donations/monthly'
    return api.get<ApiResponse<{ month: string, amount: number }[]>>(endpoint)
  }

  // الحصول على إحصائيات المشاريع
  static async getProjectsStats(): Promise<ApiResponse<{
    total: number
    completed: number
    in_progress: number
    planned: number
    completion_rate: number
  }>> {
    return api.get<ApiResponse<{
      total: number
      completed: number
      in_progress: number
      planned: number
      completion_rate: number
    }>>('/statistics/projects')
  }
}

// فئة إدارة المحافظات
class GovernoratesService {
  // الحصول على جميع المحافظات
  static async getAll(): Promise<ApiResponse<Governorate[]>> {
    return api.get<ApiResponse<Governorate[]>>('/governorates')
  }

  // الحصول على محافظة واحدة
  static async getById(id: number): Promise<ApiResponse<Governorate>> {
    return api.get<ApiResponse<Governorate>>(`/governorates/${id}`)
  }
}

// فئة إدارة رفع الملفات
class FileUploadService {
  // رفع ملف Excel للمساجد
  static async uploadMosquesExcel(file: File): Promise<ApiResponse<{
    imported: number
    errors: string[]
    warnings: string[]
  }>> {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.postForm<ApiResponse<{
      imported: number
      errors: string[]
      warnings: string[]
    }>>('/import/mosques', formData)
  }

  // رفع ملف Excel للتبرعات
  static async uploadDonationsExcel(file: File): Promise<ApiResponse<{
    imported: number
    errors: string[]
    warnings: string[]
  }>> {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.postForm<ApiResponse<{
      imported: number
      errors: string[]
      warnings: string[]
    }>>('/import/donations', formData)
  }

  // تحميل قالب Excel للمساجد
  static async downloadMosquesTemplate(): Promise<Blob> {
    // هذه دالة خاصة لتحميل الملفات
    const response = await fetch(`${api.getToken() ? 'https://back-aamar.academy-lead.com/api' : ''}/templates/mosques.xlsx`, {
      headers: api.getToken() ? { 'Authorization': `Bearer ${api.getToken()}` } : {}
    })
    
    if (!response.ok) {
      throw new Error('فشل في تحميل القالب')
    }
    
    return response.blob()
  }

  // تحميل قالب Excel للتبرعات
  static async downloadDonationsTemplate(): Promise<Blob> {
    const response = await fetch(`${api.getToken() ? 'https://back-aamar.academy-lead.com/api' : ''}/templates/donations.xlsx`, {
      headers: api.getToken() ? { 'Authorization': `Bearer ${api.getToken()}` } : {}
    })
    
    if (!response.ok) {
      throw new Error('فشل في تحميل القالب')
    }
    
    return response.blob()
  }
}

// تصدير جميع الخدمات
export {
  MosquesService,
  ProjectsService,
  DonationsService,
  StatisticsService,
  GovernoratesService,
  FileUploadService
}
