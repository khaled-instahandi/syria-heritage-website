import { api } from "../api"
import { MosquesResponse, Mosque, PublicMosqueFilters } from "../types"

export class PublicMosqueService {
  // جلب قائمة المساجد العامة مع الفلترة والتقسيم
  static async getPublicMosques(filters: PublicMosqueFilters = {}): Promise<MosquesResponse> {
    try {
      return await api.getPublicMosques(filters)
    } catch (error) {
      console.error('Error fetching public mosques:', error)
      throw error
    }
  }

  // جلب تفاصيل مسجد عام واحد
  static async getPublicMosque(id: number): Promise<Mosque> {
    try {
      const response = await api.getPublicMosque(id)
      return response.data
    } catch (error) {
      console.error('Error fetching public mosque:', error)
      throw error
    }
  }
}
