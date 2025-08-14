
import { api } from "../api"
import { 
  MosquesResponse, 
  Mosque, 
  MosqueFilters,
  GovernoratesResponse,
  DistrictsResponse,
  SubDistrictsResponse,
  NeighborhoodsResponse 
} from "../types"

export class MosqueService {
  // جلب قائمة المساجد مع الفلترة والتقسيم
  static async getMosques(filters: MosqueFilters = {}): Promise<MosquesResponse> {
    try {
      return await api.getMosques(filters)
    } catch (error) {
      console.error('Error fetching mosques:', error)
      throw error
    }
  }

  // جلب تفاصيل مسجد واحد
  static async getMosque(id: number): Promise<Mosque> {
    try {
      const response = await api.getMosque(id)
      return response.data
    } catch (error) {
      console.error('Error fetching mosque:', error)
      throw error
    }
  }

  // إنشاء مسجد جديد
  static async createMosque(data: {
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
    status: "مفعل" | "موقوف" | "مكتمل"
  }): Promise<Mosque> {
    try {
      const response = await api.createMosque(data)
      return response.data
    } catch (error) {
      console.error('Error creating mosque:', error)
      throw error
    }
  }

  // تحديث مسجد
  static async updateMosque(id: number, data: {
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
    status?: "مفعل" | "موقوف" | "مكتمل"
  }): Promise<Mosque> {
    try {
      const response = await api.updateMosque(id, data)
      return response.data
    } catch (error) {
      console.error('Error updating mosque:', error)
      throw error
    }
  }

  // حذف مسجد
  static async deleteMosque(id: number): Promise<boolean> {
    try {
      await api.deleteMosque(id)
      return true
    } catch (error) {
      console.error('Error deleting mosque:', error)
      throw error
    }
  }

  // تحديث حالة المسجد فقط
  static async updateMosqueStatus(id: number, status: "مفعل" | "موقوف" | "مكتمل"): Promise<Mosque> {
    try {
      // استخدام نفس endpoint التحديث لكن مع إرسال الحالة فقط
      const response = await api.updateMosque(id, { status })
      return response.data
    } catch (error) {
      console.error('Error updating mosque status:', error)
      throw error
    }
  }

  // تصفية المساجد حسب الاسم
  static async searchMosques(searchTerm: string, page = 1, perPage = 10): Promise<MosquesResponse> {
    return this.getMosques({
      name: searchTerm,
      page,
      per_page: perPage
    })
  }

  // تصفية المساجد حسب المحافظة
  static async getMosquesByGovernorate(governorateId: number, page = 1): Promise<MosquesResponse> {
    return this.getMosques({
      governorate_id: governorateId,
      page
    })
  }

  // تصفية المساجد حسب مستوى الضرر
  static async getMosquesByDamageLevel(damageLevel: "جزئي" | "كامل", page = 1): Promise<MosquesResponse> {
    return this.getMosques({
      damage_level: damageLevel,
      page
    })
  }

  // تصفية المساجد حسب الحالة
  static async getMosquesByStatus(status: "مفعل" | "موقوف" | "مكتمل", page = 1): Promise<MosquesResponse> {
    return this.getMosques({
      status,
      page
    })
  }
}

// خدمة البيانات المرجعية
export class LocationService {
  // جلب المحافظات
  static async getGovernorates() {
    try {
      const response = await api.getGovernorates()
      return response.data
    } catch (error) {
      console.error('Error fetching governorates:', error)
      throw error
    }
  }

  // جلب المناطق
  static async getDistricts(governorateId?: number) {
    try {
      const response = await api.getDistricts(governorateId)
      return response.data
    } catch (error) {
      console.error('Error fetching districts:', error)
      throw error
    }
  }

  // جلب النواحي
  static async getSubDistricts(districtId?: number) {
    try {
      const response = await api.getSubDistricts(districtId)
      return response.data
    } catch (error) {
      console.error('Error fetching sub-districts:', error)
      throw error
    }
  }

  // جلب الأحياء
  static async getNeighborhoods(subDistrictId?: number) {
    try {
      const response = await api.getNeighborhoods(subDistrictId)
      return response.data
    } catch (error) {
      console.error('Error fetching neighborhoods:', error)
      throw error
    }
  }
}

// خدمة الوسائط للمساجد
export class MosqueMediaService {
  // رفع وسائط جديدة للمسجد
  static async uploadMedia(data: {
    mosque_id: number
    media_stage: "before" | "after"
    is_main?: boolean
    media_order?: number
    files: File[]
  }): Promise<any> {
    try {
      return await api.uploadMosqueMedia(data)
    } catch (error) {
      console.error('Error uploading media:', error)
      throw error
    }
  }

  // جلب وسائط مسجد معين
  static async getMosqueMedia(mosqueId: number): Promise<any> {
    try {
      return await api.getMosqueMedia(mosqueId)
    } catch (error) {
      console.error('Error fetching media:', error)
      throw error
    }
  }

  // حذف وسائط
  static async deleteMedia(mediaId: number): Promise<any> {
    try {
      return await api.deleteMosqueMedia(mediaId)
    } catch (error) {
      console.error('Error deleting media:', error)
      throw error
    }
  }

  // تحديث ترتيب الوسائط
  static async updateMediaOrder(mediaId: number, newOrder: number): Promise<any> {
    try {
      return await api.updateMosqueMediaOrder(mediaId, newOrder)
    } catch (error) {
      console.error('Error updating media order:', error)
      throw error
    }
  }

  // تحديد الصورة الرئيسية
  static async setMainMedia(media: MediaFile): Promise<any> {
    try {
      return await api.setMainMosqueMedia(media)
    } catch (error) {
      console.error('Error setting main media:', error)
      throw error
    }
  }
}
