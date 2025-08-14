export interface User {
  id: number
  name: string
  email: string
  phone: string
  role_id: number
  created_at: string
  updated_at: string
}

export interface Role {
  id: number
  role_name: string
}

export interface Governorate {
  id: number
  name: string
}

export interface District {
  id: number
  name: string
  governorate_id: number
}

export interface SubDistrict {
  id: number
  name: string
  district_id: number
}

export interface Neighborhood {
  id: number
  name: string
  sub_district_id: number
}

export interface Mosque {
  id: number
  name: string
  governorate_id: number
  district_id: number
  sub_district_id: number
  image_url?: string
  neighborhood_id: number
  address_text?: string
  description?: string
  latitude?: number
  longitude?: number
  damage_level: "جزئي" | "كامل"
  estimated_cost?: number
  is_reconstruction: boolean
  created_by: number
  status: "نشط" | "موقوف" | "مكتمل"
  created_at: string
  updated_at: string
}

export interface Project {
  id: number
  title?: string
  image_url?: string
  mosque_id: number
  project_category: "ترميم" | "إعادة إعمار"
  status: "قيد الدراسة" | "قيد التنفيذ" | "مكتمل"
  cost?: number
  total_cost?: number
  collected_amount?: number
  progress_percentage: number
  approved_by?: number
  approved_at?: string
  published_at?: string
  created_at: string
  start_date?: string
  end_date?: string
  description: string
  updated_at: string
}

export interface Donation {
  id: number
  project_id: number
  donor_name?: string
  amount: number
  payment_method: "كاش" | "حوالة" | "بطاقة" | "كاش شام" | "أخرى"
  receipt_url?: string
  donated_at?: string
  user_id?: number
  created_at: string
  updated_at: string
}

export interface ImportBatch {
  id: number
  uploaded_by: number
  file_name: string
  status: "جارٍ المراجعة" | "مكتملة" | "مرفوضة"
  note?: string
  created_at: string
  updated_at: string
}

export interface ImportedMosque {
  id: number
  batch_id: number
  name: string
  governorate: string
  district: string
  sub_district: string
  neighborhood: string
  address_text?: string
  damage_level: "جزئي" | "كامل"
  estimated_cost?: number
  is_reconstruction: boolean
  committee_name?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface MosqueMedia {
  id: number
  mosque_id: number
  type: "image" | "video"
  file_url: string
  is_main: boolean
  media_order: number
  media_stage: "before" | "after"
  created_at: string
  updated_at: string
}

export interface FeaturedMosque {
  id: number
  name_ar: string
  name_en: string
  governorate_ar: string
  governorate_en: string
  district_ar: string
  district_en: string
  sub_district_ar: string
  sub_district_en: string
  neighborhood_ar: string
  neighborhood_en: string
  address_text: string
  latitude: string
  longitude: string
  damage_level: string
  estimated_cost: string
  is_reconstruction: number
  created_by: string
  status: string
  created_at: string
  media: MosqueMedia[]
}

export interface FeaturedMosquesResponse {
  data: FeaturedMosque[]
}

export interface Log {
  id: number
  entity_type: string
  entity_id: number
  action: string
  performed_by: number
  description?: string
  created_at: string
  updated_at: string
}

export interface Tag {
  id: number
  name: string
}
