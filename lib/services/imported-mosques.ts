// Import types locally to avoid circular dependencies
import { api } from "../api"
interface ImportedMosque {
  id: number
  batch_id: number
  name_ar: string
  name_en: string
  governorate: string
  district: string
  sub_district: string
  neighborhood: string
  address_text: string
  damage_level: string
  estimated_cost: string
  is_reconstruction: number
  committee_name: string
  notes: string
  created_at: string
  updated_at: string
}

interface ImportedMosquesResponse {
  data: ImportedMosque[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}



export class ImportedMosquesService {
  /**
   * Fetch all imported mosques
   */
  static async getImportedMosques(page: number = 1, perPage: number = 10): Promise<ImportedMosquesResponse> {
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('per_page', perPage.toString())
      
      const endpoint = `/imported-mosques?${params.toString()}`
      return await api.get<ImportedMosquesResponse>(endpoint)
    } catch (error) {
      console.error('Error fetching imported mosques:', error)
      throw error
    }
  }

  /**
   * Upload Excel file to import mosques
   */
  static async importMosquesFromExcel(file: File): Promise<any> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      return await api.postForm(`/imported-mosques/import`, formData)
    } catch (error) {
      console.error('Error importing mosques from Excel:', error)
      throw error
    }
  }

  /**
   * Transfer a single mosque to main mosques table
   */
  static async transferMosque(mosqueId: number): Promise<any> {
    try {
      return await api.post(`/imported-mosques/${mosqueId}/transfer`)
    } catch (error) {
      console.error('Error transferring mosque:', error)
      throw error
    }
  }

  /**
   * Transfer all imported mosques to main mosques table
   */
  static async transferAllMosques(): Promise<any> {
    try {
      return await api.post(`/imported-mosques/transfer-all`)
    } catch (error) {
      console.error('Error transferring all mosques:', error)
      throw error
    }
  }

  /**
   * Delete an imported mosque
   */
  static async deleteImportedMosque(mosqueId: number): Promise<void> {
    try {
      await api.delete(`/imported-mosques/${mosqueId}`)
    } catch (error) {
      console.error('Error deleting imported mosque:', error)
      throw error
    }
  }

  /**
   * Get mosque details by ID
   */
  static async getImportedMosqueById(mosqueId: number): Promise<ImportedMosque> {
    try {
      const response = await api.get<{ data: ImportedMosque }>(`/imported-mosques/${mosqueId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching imported mosque details:', error)
      throw error
    }
  }

  /**
   * Export imported mosques to Excel
   */
  static async exportImportedMosques(): Promise<Blob> {
    try {
      // For blob responses, we need to use fetch directly
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://back-aamar.academy-lead.com/api'
      const token = api.getToken()
      
      const response = await fetch(`${BASE_URL}/imported-mosques/export`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to export imported mosques')
      }
      
      return await response.blob()
    } catch (error) {
      console.error('Error exporting imported mosques:', error)
      throw error
    }
  }

  /**
   * Download mosque template Excel file
   */
  static async downloadTemplate(): Promise<Blob> {
    try {
      // For blob responses, we need to use fetch directly
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://back-aamar.academy-lead.com/api'
      const token = api.getToken()
      
      const response = await fetch(`${BASE_URL}/imported-mosques/template`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to download template')
      }
      
      return await response.blob()
    } catch (error) {
      console.error('Error downloading template:', error)
      throw error
    }
  }
}
