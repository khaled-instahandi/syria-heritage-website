import { FeaturedMosque } from "./types"

// تحويل بيانات المسجد من API إلى تنسيق Project للعرض
export interface DisplayProject {
  id: number
  title: string
  image_url: string
  mosque_id: number
  project_category: "ترميم" | "إعادة إعمار"
  status: "قيد الدراسة" | "قيد التنفيذ" | "مكتمل"
  cost?: number
  total_cost?: number
  collected_amount?: number
  progress_percentage: number
  created_at: string
  description: string
  location: string
  damage_level: string
}

export function transformMosqueToProject(mosque: FeaturedMosque, locale: string = 'ar'): DisplayProject {
  // الحصول على الصورة الرئيسية
  const mainImage = mosque.media.find(m => m.is_main)?.file_url
  const afterImage = mosque.media.find(m => m.media_stage === 'after' && m.is_main)?.file_url
  const anyImage = mosque.media[0]?.file_url

  // تحديد الصورة المستخدمة
  const imageUrl = afterImage || mainImage || anyImage || '/placeholder.jpg'

  // تحديد العنوان حسب اللغة
  const title = locale === 'ar' ? mosque.name_ar : mosque.name_en

  // تحديد الموقع حسب اللغة
  const location = locale === 'ar'
    ? `${mosque.neighborhood_ar}، ${mosque.district_ar}، ${mosque.governorate_ar}`
    : `${mosque.neighborhood_en}, ${mosque.district_en}, ${mosque.governorate_en}`

  // تحديد نوع المشروع بناءً على is_reconstruction
  const projectCategory = mosque.is_reconstruction === 1 ? "إعادة إعمار" : "ترميم"

  // تحديد حالة المشروع بناءً على status
  let status: "قيد الدراسة" | "قيد التنفيذ" | "مكتمل"
  switch (mosque.status) {
    case "مكتمل":
      status = "مكتمل"
      break
    case "قيد التنفيذ":
      status = "قيد التنفيذ"
      break
    default:
      status = "قيد الدراسة"
  }

  // حساب تقديري للتقدم بناءً على الحالة
  let progress_percentage = 0
  if (status === "مكتمل") {
    progress_percentage = 100
  } else if (status === "قيد التنفيذ") {
    progress_percentage = Math.floor(Math.random() * 40) + 30 // 30-70%
  } else {
    progress_percentage = Math.floor(Math.random() * 20) + 5 // 5-25%
  }

  const estimatedCost = parseFloat(mosque.estimated_cost) || 0
  const collectedAmount = Math.floor(estimatedCost * (progress_percentage / 100))

  return {
    id: mosque.id,
    title,
    image_url: imageUrl,
    mosque_id: mosque.id,
    project_category: projectCategory,
    status,
    cost: estimatedCost,
    total_cost: estimatedCost,
    collected_amount: collectedAmount,
    progress_percentage,
    created_at: mosque.created_at,
    description: `${projectCategory} ${title} في ${location}. ${mosque.address_text ? `العنوان: ${mosque.address_text}` : ''}`,
    location,
    damage_level: mosque.damage_level
  }
}

// دالة لتحويل قائمة من المساجد إلى مشاريع للعرض
export function transformMosquesToProjects(mosques: FeaturedMosque[], locale: string = 'ar'): DisplayProject[] {
  return mosques.map(mosque => transformMosqueToProject(mosque, locale))
}

// دالة للحصول على الصورة الكاملة مع BASE_URL
export function getFullImageUrl(imageUrl: string): string {
  if (!imageUrl) return '/placeholder.jpg'
  
  // إذا كان الرابط يبدأ بـ /storage، أضف BASE_URL
  if (imageUrl.startsWith('/storage')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://back-aamar.academy-lead.com/api'
    // إزالة /api من النهاية إذا كان موجوداً
    const cleanBaseUrl = baseUrl.replace('/api', '')
    const fullUrl = `${cleanBaseUrl}${imageUrl}`
    // console.log(`Converting image URL: ${imageUrl} -> ${fullUrl}`)
    return fullUrl
  }
  
  // إذا كان رابط كامل، أرجعه كما هو
  if (imageUrl.startsWith('http')) {
    return imageUrl
  }

  // وإلا أرجع الرابط كما هو (للصور المحلية)
  return imageUrl
}
