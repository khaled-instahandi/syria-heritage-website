"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  MapPin,
  DollarSign,
  Filter,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  ExternalLink
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { PublicMosqueService } from "@/lib/services/public-mosque-service"
import { Mosque } from "@/lib/types"
import { StatusSelect, DamageSelect } from "@/components/ui/status-select"
import { GovernorateSelect, DistrictSelect, SubDistrictSelect, NeighborhoodSelect } from "@/components/ui/location-select"
import { getFullImageUrl } from "@/lib/data-transformers"

export default function MosquesPage() {
  const t = useTranslations()

  // State management
  const [mosques, setMosques] = useState<Mosque[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    governorate_id: "",
    district_id: "",
    sub_district_id: "",
    neighborhood_id: "",
    damage_level: "all" as "جزئي" | "كامل" | "all",
    status: "all" as "نشط" | "موقوف" | "مكتمل" | "all",
    is_reconstruction: undefined as boolean | undefined,
    per_page: 12
  })

  // Load mosques function
  const loadMosques = async (page: number = 1) => {
    try {
      setLoading(true)
      setError("")

      const response = await PublicMosqueService.getPublicMosques({
        page,
        per_page: filters.per_page,
        search: filters.search || undefined,
        governorate_id: filters.governorate_id ? parseInt(filters.governorate_id) : undefined,
        district_id: filters.district_id ? parseInt(filters.district_id) : undefined,
        sub_district_id: filters.sub_district_id ? parseInt(filters.sub_district_id) : undefined,
        neighborhood_id: filters.neighborhood_id ? parseInt(filters.neighborhood_id) : undefined,
        damage_level: filters.damage_level === "all" ? undefined : filters.damage_level,
        status: filters.status === "all" ? undefined : filters.status,
        is_reconstruction: filters.is_reconstruction
      })

      setMosques(response.data)
      setCurrentPage(response.meta.current_page)
      setTotalPages(response.meta.last_page)
      setTotal(response.meta.total)
    } catch (error) {
      console.error('Error loading mosques:', error)
      setError('حدث خطأ في تحميل المساجد. يرجى المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount and filter changes
  useEffect(() => {
    loadMosques(1)
  }, [filters])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadMosques(1)
  }

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value }

      // Reset dependent filters when parent changes
      if (key === 'governorate_id') {
        newFilters.district_id = ""
        newFilters.sub_district_id = ""
        newFilters.neighborhood_id = ""
      } else if (key === 'district_id') {
        newFilters.sub_district_id = ""
        newFilters.neighborhood_id = ""
      } else if (key === 'sub_district_id') {
        newFilters.neighborhood_id = ""
      }

      return newFilters
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      governorate_id: "",
      district_id: "",
      sub_district_id: "",
      neighborhood_id: "",
      damage_level: "all",
      status: "all",
      is_reconstruction: undefined,
      per_page: 12
    })
  }

  // Get main image for mosque
  const getMainImage = (mosque: Mosque) => {
    // console.log(`Getting image for mosque ${mosque.id}:`, mosque.media);

    if (!mosque.media || mosque.media.length === 0) {
      // console.log(`No media found for mosque ${mosque.id}`)
      return getFullImageUrl("/placeholder.jpg")
    }

    // First try to find the main image in "after" stage
    const mainMedia = mosque.media.find(m => m.is_main && m.media_stage === "after")
    if (mainMedia?.file_url) {
      // console.log(`Found main after image for mosque ${mosque.id}:`, mainMedia.file_url)
      return getFullImageUrl(mainMedia.file_url)
    }

    // Then try to find any "after" stage image
    const afterMedia = mosque.media.find(m => m.media_stage === "after")
    if (afterMedia?.file_url) {
      // console.log(`Found after image for mosque ${mosque.id}:`, afterMedia.file_url)
      return getFullImageUrl(afterMedia.file_url)
    }

    // Then try to find any "before" stage image
    const beforeMedia = mosque.media.find(m => m.media_stage === "before")
    if (beforeMedia?.file_url) {
      // console.log(`Found before image for mosque ${mosque.id}:`, beforeMedia.file_url)
      return getFullImageUrl(beforeMedia.file_url)
    }

    // Finally, get the first image regardless of stage
    const firstMedia = mosque.media[0]
    if (firstMedia?.file_url) {
      // console.log(`Found first image for mosque ${mosque.id}:`, firstMedia.file_url)
      return getFullImageUrl(firstMedia.file_url)
    }

    // console.log(`No valid image found for mosque ${mosque.id}, using placeholder`)
    return getFullImageUrl("/placeholder.jpg")
  }

  // Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadMosques(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            المساجد السورية
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            استكشف المساجد السورية ومشاريع الترميم والإعمار الجارية
          </p>
          <div className="mt-4 text-emerald-600 font-medium">
            إجمالي المساجد: {total}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Basic Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="البحث في المساجد..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:w-auto"
              >
                <Filter className="w-4 h-4 ml-2" />
                {showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}
              </Button>

              <Button type="submit" className="lg:w-auto bg-emerald-600 hover:bg-emerald-700">
                بحث
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Location Filters */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">المحافظة</label>
                    <GovernorateSelect
                      value={filters.governorate_id}
                      onValueChange={(value) => handleFilterChange('governorate_id', value)}
                      placeholder="اختر المحافظة"
                      clearable
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">المنطقة</label>
                    <DistrictSelect
                      value={filters.district_id}
                      onValueChange={(value) => handleFilterChange('district_id', value)}
                      parentId={filters.governorate_id ? parseInt(filters.governorate_id) : undefined}
                      placeholder="اختر المنطقة"
                      clearable
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">الناحية</label>
                    <SubDistrictSelect
                      value={filters.sub_district_id}
                      onValueChange={(value) => handleFilterChange('sub_district_id', value)}
                      parentId={filters.district_id ? parseInt(filters.district_id) : undefined}
                      placeholder="اختر الناحية"
                      clearable
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">الحي</label>
                    <NeighborhoodSelect
                      value={filters.neighborhood_id}
                      onValueChange={(value) => handleFilterChange('neighborhood_id', value)}
                      parentId={filters.sub_district_id ? parseInt(filters.sub_district_id) : undefined}
                      placeholder="اختر الحي"
                      clearable
                    />
                  </div>

                  {/* Status Filters */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">الحالة</label>
                    <StatusSelect
                      value={filters.status}
                      onValueChange={(value) => handleFilterChange('status', value)}
                      placeholder="اختر الحالة"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">مستوى الضرر</label>
                    <DamageSelect
                      value={filters.damage_level}
                      onValueChange={(value) => handleFilterChange('damage_level', value)}
                      placeholder="اختر مستوى الضرر"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">نوع العمل</label>
                    <select
                      value={filters.is_reconstruction === undefined ? "all" : filters.is_reconstruction ? "reconstruction" : "restoration"}
                      onChange={(e) => {
                        const value = e.target.value === "all" ? undefined : e.target.value === "reconstruction"
                        handleFilterChange('is_reconstruction', value)
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">جميع الأنواع</option>
                      <option value="restoration">ترميم</option>
                      <option value="reconstruction">إعادة إعمار</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      مسح الفلاتر
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-slate-600">جاري تحميل المساجد...</p>
          </div>
        )}

        {/* Mosques Grid */}
        {!loading && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mosques.map((mosque) => (
                <Card key={mosque.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-48">
                    <Image
                      src={getMainImage(mosque)}
                      alt={mosque.name_ar}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.jpg"
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={`
                          ${mosque.status === "نشط" ? "bg-green-500" :
                            mosque.status === "مكتمل" ? "bg-blue-500" : "bg-red-500"}
                        `}
                      >
                        {mosque.status}
                      </Badge>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge variant="outline" className="bg-white/90">
                        {mosque.damage_level}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                        {mosque.name_ar}
                      </h3>

                      <div className="flex items-center text-slate-600 text-sm">
                        <MapPin className="w-4 h-4 ml-1 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {mosque.governorate_ar} - {mosque.district_ar}
                        </span>
                      </div>

                      {mosque.address_text && (
                        <p className="text-slate-600 text-sm line-clamp-2">
                          {mosque.address_text}
                        </p>
                      )}

                      {mosque.estimated_cost && (
                        <div className="flex items-center text-emerald-600 text-sm font-medium">
                          <DollarSign className="w-4 h-4 ml-1" />
                          <span>{formatCurrency(parseFloat(mosque.estimated_cost))}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center">
                          <User className="w-3 h-3 ml-1" />
                          <span>{mosque.created_by}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 ml-1" />
                          <span>{new Date(mosque.created_at).toLocaleDateString('ar')}</span>
                        </div>
                      </div>

                      {mosque.media && mosque.media.length > 0 && (
                        <div className="flex items-center text-slate-500 text-xs">
                          <span>{mosque.media.length} صورة</span>
                        </div>
                      )}

                      <div className="pt-2">
                        <Link href={`/mosques/${mosque.id}`}>
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                            <ExternalLink className="w-4 h-4 ml-2" />
                            عرض التفاصيل
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {mosques.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد مساجد</h3>
                <p className="text-slate-600 mb-4">لم يتم العثور على مساجد تطابق معايير البحث</p>
                <Button variant="outline" onClick={clearFilters}>
                  مسح الفلاتر
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  السابق
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                        className={currentPage === pageNum ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  التالي
                </Button>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center mt-6 text-slate-600 text-sm">
              عرض {((currentPage - 1) * filters.per_page) + 1} إلى {Math.min(currentPage * filters.per_page, total)} من أصل {total} مسجد
            </div>
          </>
        )}
      </div>
    </div>
  )
}
