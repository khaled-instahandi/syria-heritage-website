export interface ImportedMosque {
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

export interface ImportedMosquesResponse {
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

export interface ImportBatch {
  id: number
  file_name: string
  original_name: string
  total_records: number
  successful_records: number
  failed_records: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message?: string
  uploaded_by: string
  uploaded_at: string
  processed_at?: string
}

export interface ImportError {
  row: number
  field: string
  message: string
  value: any
}

export interface ImportResult {
  success: boolean
  batch_id: number
  total_records: number
  successful_records: number
  failed_records: number
  errors: ImportError[]
  message: string
}

export type DamageLevel = 'جزئي' | 'متوسط' | 'كامل' | 'بسيط'
export type ProjectType = 0 | 1 // 0 = ترميم, 1 = إعادة إعمار

export interface MosqueFormData {
  name_ar: string
  name_en: string
  governorate: string
  district: string
  sub_district: string
  neighborhood: string
  address_text?: string
  damage_level: DamageLevel
  estimated_cost: number
  is_reconstruction: ProjectType
  committee_name: string
  notes?: string
}

export interface ExcelTemplate {
  name_ar: string
  name_en: string
  governorate: string
  district: string
  sub_district: string
  neighborhood: string
  address_text: string
  damage_level: string
  estimated_cost: string
  is_reconstruction: string
  committee_name: string
  notes: string
}
