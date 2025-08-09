import type {
  User,
  Role,
  Governorate,
  District,
  SubDistrict,
  Neighborhood,
  Mosque,
  Project,
  Donation,
  MosqueMedia,
} from "./types"

export const mockRoles: Role[] = [
  { id: 1, role_name: "admin" },
  { id: 2, role_name: "finance" },
  { id: 3, role_name: "review" },
]

export const mockUsers: User[] = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "admin@awqaf.gov.sy",
    phone: "+963911234567",
    role_id: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "فاطمة أحمد",
    email: "finance@awqaf.gov.sy",
    phone: "+963911234568",
    role_id: 2,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

export const mockGovernorates: Governorate[] = [
  { id: 1, name: "دمشق" },
  { id: 2, name: "حلب" },
  { id: 3, name: "حمص" },
  { id: 4, name: "حماة" },
  { id: 5, name: "اللاذقية" },
]

export const mockDistricts: District[] = [
  { id: 1, name: "مركز دمشق", governorate_id: 1 },
  { id: 2, name: "مركز حلب", governorate_id: 2 },
  { id: 3, name: "مركز حمص", governorate_id: 3 },
]

export const mockSubDistricts: SubDistrict[] = [
  { id: 1, name: "الميدان", district_id: 1 },
  { id: 2, name: "الصالحية", district_id: 2 },
  { id: 3, name: "الخالدية", district_id: 3 },
]

export const mockNeighborhoods: Neighborhood[] = [
  { id: 1, name: "حي الأمين", sub_district_id: 1 },
  { id: 2, name: "حي النور", sub_district_id: 2 },
  { id: 3, name: "حي السلام", sub_district_id: 3 },
]

export const mockMosques: Mosque[] = [
  {
    id: 1,
    name: "مسجد خالد بن الوليد",
    governorate_id: 3,
    image_url:"/images/1.jpeg",
    district_id: 3,
    sub_district_id: 3,
    neighborhood_id: 3,
    address_text: "شارع خالد بن الوليد، حمص",
    description: "مسجد تاريخي يقع في قلب مدينة حمص، يُعتبر من أهم المعالم الدينية في المنطقة. تعرض المسجد لأضرار جسيمة خلال الأحداث وهو بحاجة ماسة لأعمال إعادة إعمار شاملة للحفاظ على تراثه المعماري الأصيل.",
    latitude: 34.7298,
    longitude: 36.7075,
    damage_level: "كامل",
    estimated_cost: 150000,
    is_reconstruction: true,
    created_by: 1,
    status: "نشط",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "مسجد الأموي الكبير",
    governorate_id: 1,
    district_id: 1,
    sub_district_id: 1,
    image_url:"/images/2.jpg",
    neighborhood_id: 1,
    address_text: "البلدة القديمة، دمشق",
    description: "أحد أهم وأقدم المساجد في العالم الإسلامي، يقع في البلدة القديمة بدمشق. يتميز بعمارته الأموية الفريدة وفسيفسائه التاريخية. يحتاج إلى أعمال ترميم دقيقة للحفاظ على تراثه المعماري النفيس.",
    latitude: 33.5138,
    longitude: 36.3061,
    damage_level: "جزئي",
    estimated_cost: 200000,
    is_reconstruction: false,
    created_by: 1,
    status: "نشط",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "مسجد النور",
    governorate_id: 2,
    district_id: 2,
    sub_district_id: 2,
    neighborhood_id: 2,
    image_url:"/images/3.jpg",
    address_text: "حي الصالحية، حلب",
    description: "مسجد عريق في مدينة حلب التاريخية، كان بمثابة منارة علمية ودينية في المنطقة. تعرض لأضرار بالغة وهو بحاجة لأعمال إعادة إعمار كاملة لاستعادة دوره الحيوي في خدمة المجتمع المحلي.",
    latitude: 36.2021,
    longitude: 37.1343,
    damage_level: "كامل",
    estimated_cost: 80000,
    is_reconstruction: true,
    created_by: 1,
    status: "نشط",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

export const mockProjects: Project[] = [
  {
    id: 1,
    title: "إعادة إعمار مسجد خالد بن الوليد",
    mosque_id: 1,
    project_category: "إعادة إعمار",
    image_url:"/images/1.jpeg",
    status: "قيد التنفيذ",
    cost: 150000,
    total_cost: 150000,
    collected_amount: 75000,
    progress_percentage: 50,
    approved_by: 1,
    start_date: "2024-01-01T00:00:00Z",
    end_date: "2024-12-31T00:00:00Z",
    approved_at: "2024-01-15T00:00:00Z",
    published_at: "2024-01-20T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    description: "إعادة إعمار شاملة لمسجد خالد بن الوليد تشمل الهيكل الأساسي والديكورات والأعمال الكهربائية والصحية",
  },
  {
    id: 2,
    title: "ترميم مسجد الأموي الكبير",
    mosque_id: 2,
    project_category: "ترميم",
    status: "قيد التنفيذ",
    image_url:"/images/2.jpg",
    cost: 200000,
    total_cost: 200000,
    collected_amount: 120000,
    progress_percentage: 60,
    approved_by: 1,
    start_date: "2024-01-15T00:00:00Z",
    approved_at: "2024-01-10T00:00:00Z",
    published_at: "2024-01-15T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    description: "أعمال ترميم دقيقة للحفاظ على التراث المعماري للمسجد الأموي الكبير",
  },
  {
    id: 3,
    title: "إعادة إعمار مسجد النور",
    mosque_id: 3,
    project_category: "إعادة إعمار",
    image_url:"/images/3.jpg",
    status: "قيد الدراسة",
    cost: 80000,
    total_cost: 80000,
    collected_amount: 45000,
    progress_percentage: 56,
    approved_by: 1,
    start_date: "2024-02-01T00:00:00Z",
    end_date: "2024-10-31T00:00:00Z",
    approved_at: "2024-01-05T00:00:00Z",
    published_at: "2024-01-10T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    description: "إعادة إعمار مسجد النور في حلب لاستعادة دوره في خدمة المجتمع",
  },
  {
    id: 4,
    title: "أعمال الكهرباء والإنارة",
    mosque_id: 1,
    project_category: "ترميم",
    image_url:"/images/1.jpeg",
    status: "مكتمل",
    cost: 25000,
    total_cost: 25000,
    collected_amount: 25000,
    progress_percentage: 100,
    approved_by: 1,
    start_date: "2023-10-01T00:00:00Z",
    end_date: "2023-12-31T00:00:00Z",
    approved_at: "2023-09-15T00:00:00Z",
    published_at: "2023-09-20T00:00:00Z",
    created_at: "2023-09-01T00:00:00Z",
    updated_at: "2023-12-31T00:00:00Z",
    description: "تجديد شبكة الكهرباء والإنارة الداخلية والخارجية للمسجد",
  },
]

export const mockDonations: Donation[] = [
  {
    id: 1,
    project_id: 1,
    donor_name: "محمد أحمد الحسن",
    amount: 5000,
    payment_method: "حوالة",
    donated_at: "2024-01-15T00:00:00Z",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: 2,
    project_id: 2,
    donor_name: "سارة محمد النور",
    amount: 3000,
    payment_method: "بطاقة",
    donated_at: "2024-01-20T00:00:00Z",
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },
  {
    id: 3,
    project_id: 3,
    donor_name: "علي حسن العلي",
    amount: 2500,
    payment_method: "كاش شام",
    donated_at: "2024-01-25T00:00:00Z",
    created_at: "2024-01-25T00:00:00Z",
    updated_at: "2024-01-25T00:00:00Z",
  },
  {
    id: 4,
    project_id: 1,
    donor_name: "فاطمة يوسف",
    amount: 10000,
    payment_method: "حوالة",
    donated_at: "2024-02-01T00:00:00Z",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: 5,
    project_id: 1,
    donor_name: "أحمد سليمان",
    amount: 1500,
    payment_method: "كاش",
    donated_at: "2024-02-05T00:00:00Z",
    created_at: "2024-02-05T00:00:00Z",
    updated_at: "2024-02-05T00:00:00Z",
  },
  {
    id: 6,
    project_id: 2,
    donor_name: "نور الدين محمد",
    amount: 7500,
    payment_method: "بطاقة",
    donated_at: "2024-02-10T00:00:00Z",
    created_at: "2024-02-10T00:00:00Z",
    updated_at: "2024-02-10T00:00:00Z",
  },
  {
    id: 7,
    project_id: 1,
    donor_name: "خديجة الأحمد",
    amount: 3500,
    payment_method: "حوالة",
    donated_at: "2024-02-15T00:00:00Z",
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
  },
  {
    id: 8,
    project_id: 3,
    donor_name: "عبد الرحمن خالد",
    amount: 2000,
    payment_method: "كاش شام",
    donated_at: "2024-02-20T00:00:00Z",
    created_at: "2024-02-20T00:00:00Z",
    updated_at: "2024-02-20T00:00:00Z",
  },
  {
    id: 9,
    project_id: 2,
    donor_name: "مريم العلي",
    amount: 4000,
    payment_method: "بطاقة",
    donated_at: "2024-02-25T00:00:00Z",
    created_at: "2024-02-25T00:00:00Z",
    updated_at: "2024-02-25T00:00:00Z",
  },
  {
    id: 10,
    project_id: 1,
    donor_name: "يوسف الحسين",
    amount: 6000,
    payment_method: "حوالة",
    donated_at: "2024-03-01T00:00:00Z",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
  {
    id: 11,
    project_id: 4,
    donor_name: "زينب محمود",
    amount: 5000,
    payment_method: "بطاقة",
    donated_at: "2023-11-15T00:00:00Z",
    created_at: "2023-11-15T00:00:00Z",
    updated_at: "2023-11-15T00:00:00Z",
  },
  {
    id: 12,
    project_id: 4,
    donor_name: "حسام الدين أحمد",
    amount: 3000,
    payment_method: "كاش",
    donated_at: "2023-12-01T00:00:00Z",
    created_at: "2023-12-01T00:00:00Z",
    updated_at: "2023-12-01T00:00:00Z",
  },
]

export const mockMosqueMedia: MosqueMedia[] = [
  {
    id: 1,
    mosque_id: 1,
    type: "image",
    file_url: "/placeholder.svg?height=300&width=400&text=مسجد+خالد+بن+الوليد",
    is_main: true,
    media_order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    mosque_id: 2,
    type: "image",
    file_url: "/placeholder.svg?height=300&width=400&text=مسجد+الأموي+الكبير",
    is_main: true,
    media_order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    mosque_id: 3,
    type: "image",
    file_url: "/placeholder.svg?height=300&width=400&text=مسجد+النور",
    is_main: true,
    media_order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Helper functions to get related data
export const getMosqueById = (id: number): Mosque | undefined => {
  return mockMosques.find((mosque) => mosque.id === id)
}

export const getProjectsByMosqueId = (mosqueId: number): Project[] => {
  return mockProjects.filter((project) => project.mosque_id === mosqueId)
}

export const getDonationsByProjectId = (projectId: number): Donation[] => {
  return mockDonations.filter((donation) => donation.project_id === projectId)
}

export const getGovernorateById = (id: number): Governorate | undefined => {
  return mockGovernorates.find((gov) => gov.id === id)
}

export const getDistrictById = (id: number): District | undefined => {
  return mockDistricts.find((district) => district.id === id)
}

export const getMosqueMediaByMosqueId = (mosqueId: number): MosqueMedia[] => {
  return mockMosqueMedia.filter((media) => media.mosque_id === mosqueId)
}

export const getMainImageForMosque = (mosqueId: number): string => {
  const media = mockMosqueMedia.find((m) => m.mosque_id === mosqueId && m.is_main)
  return media?.file_url || "/placeholder.svg?height=300&width=400&text=مسجد"
}

export const getAllImagesForMosque = (mosqueId: number): string[] => {
  const media = mockMosqueMedia.filter((m) => m.mosque_id === mosqueId && m.type === "image")
  const additionalImages = [
    "/images/1.jpeg",
    "/images/2.jpg", 
    "/images/3.jpg",
    "/images/bg-hero.jpg",
    "/images/mosque-hero.png"
  ]
  
  const mosqueImages = media.map(m => m.file_url)
  
  // Add some additional images for demo purposes
  return mosqueImages.length > 0 ? [...mosqueImages, ...additionalImages.slice(0, 4)] : additionalImages.slice(0, 3)
}

export const getDonationsByMosqueId = (mosqueId: number): Donation[] => {
  const mosqueProjects = getProjectsByMosqueId(mosqueId)
  const projectIds = mosqueProjects.map(p => p.id)
  return mockDonations.filter(donation => projectIds.includes(donation.project_id))
}

// Statistics calculations
export const getStatistics = () => {
  const totalMosques = mockMosques.length
  const totalDonations = mockDonations.reduce((sum, donation) => sum + donation.amount, 0)
  const completedMosques = mockMosques.filter((mosque) => mosque.status === "مكتمل").length
  const activeProjects = mockProjects.filter((project) => project.status !== "مكتمل").length

  return {
    totalMosques,
    totalDonations,
    completedMosques,
    activeProjects,
  }
}
