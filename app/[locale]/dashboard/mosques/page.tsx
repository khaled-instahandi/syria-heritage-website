"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Edit, Eye, Trash2, MapPin, DollarSign, Filter, Download, Loader2, MoreVertical, CheckCircle } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { DeleteDialog } from "@/components/ui/delete-dialog"
import { GovernorateSelect } from "@/components/ui/location-select"
import { StatusSelect, DamageSelect } from "@/components/ui/status-select"
import { MosqueService, LocationService } from "@/lib/services/mosque-service"
import { Mosque, Governorate, District, SubDistrict, Neighborhood, MosqueFilters } from "@/lib/types"
import { toast } from "sonner"

export default function MosquesManagementPage() {
  const t = useTranslations()
  
  // حالة البيانات
  const [mosques, setMosques] = useState<Mosque[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  
  // حالة التقسيم
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalMosques, setTotalMosques] = useState(0)
  const [perPage] = useState(10)
  
  // حالة الفلاتر
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [damageFilter, setDamageFilter] = useState<string>("all")
  const [governorateFilter, setGovernorateFilter] = useState<string>("all")
  
  // البيانات المرجعية
  const [governorates, setGovernorates] = useState<Governorate[]>([])
  
  // حالة حوار الحذف
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    mosque: Mosque | null
  }>({
    open: false,
    mosque: null,
  })

  // تحميل البيانات المرجعية
  useEffect(() => {
    loadGovernorates()
  }, [])

  // تحميل المساجد عند تغيير الفلاتر
  useEffect(() => {
    loadMosques()
  }, [currentPage, searchTerm, statusFilter, damageFilter, governorateFilter])

  // تحميل المحافظات
  const loadGovernorates = async () => {
    try {
      const data = await LocationService.getGovernorates()
      setGovernorates(data)
    } catch (error) {
      console.error('Error loading governorates:', error)
    }
  }

  // تحميل المساجد
  const loadMosques = async () => {
    try {
      setLoading(true)
      
      const filters: MosqueFilters = {
        page: currentPage,
        per_page: perPage,
      }

      // إضافة فلاتر البحث
      if (searchTerm.trim()) {
        filters.name = searchTerm.trim()
      }

      if (statusFilter !== "all") {
        filters.status = statusFilter as "مفعل" | "موقوف" | "مكتمل"
      }

      if (damageFilter !== "all") {
        filters.damage_level = damageFilter as "جزئي" | "كامل"
      }

      if (governorateFilter !== "all") {
        filters.governorate_id = parseInt(governorateFilter)
      }

      const response = await MosqueService.getMosques(filters)
      
      setMosques(response.data)
      setCurrentPage(response.meta.current_page)
      setTotalPages(response.meta.last_page)
      setTotalMosques(response.meta.total)
      
    } catch (error) {
      console.error('Error loading mosques:', error)
      toast.error('حدث خطأ في تحميل المساجد')
    } finally {
      setLoading(false)
    }
  }

  // حذف مسجد
  const handleDeleteMosque = async () => {
    if (!deleteDialog.mosque) return
    
    try {
      setDeleting(true)
      await MosqueService.deleteMosque(deleteDialog.mosque.id)
      toast.success('تم حذف المسجد بنجاح')
      
      // إعادة تحميل البيانات
      await loadMosques()
      
      // إغلاق الحوار
      setDeleteDialog({ open: false, mosque: null })
    } catch (error) {
      console.error('Error deleting mosque:', error)
      toast.error('حدث خطأ في حذف المسجد')
    } finally {
      setDeleting(false)
    }
  }

  // تغيير حالة المسجد
  const handleStatusChange = async (mosqueId: number, newStatus: "مفعل" | "موقوف" | "مكتمل") => {
    try {
      // تحديث الحالة مباشرة على واجهة المستخدم أولاً للاستجابة السريعة
      setMosques(prev => prev.map(mosque => 
        mosque.id === mosqueId 
          ? { ...mosque, status: newStatus }
          : mosque
      ))

      // استدعاء API لتحديث الحالة
      await MosqueService.updateMosqueStatus(mosqueId, newStatus)
      
      toast.success(`تم تغيير حالة المسجد إلى "${newStatus}"`)
      
      // إعادة تحميل البيانات للتأكد من التحديث
      setTimeout(() => loadMosques(), 1000)
    } catch (error) {
      console.error('Error updating mosque status:', error)
      toast.error('حدث خطأ في تحديث حالة المسجد')
      // إعادة تحميل البيانات في حالة الفشل
      loadMosques()
    }
  }

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDamageFilter("all")
    setGovernorateFilter("all")
    setCurrentPage(1)
  }

  // تصدير البيانات
  const handleExport = async () => {
    toast.info('ميزة التصدير قيد التطوير')
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={t("dashboard.mosquesManagement")}
        description="إدارة وتتبع جميع المساجد المسجلة في النظام"
      />

      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="البحث في المساجد..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <GovernorateSelect
                  value={governorateFilter === "all" ? "" : governorateFilter}
                  onValueChange={(value) => setGovernorateFilter(value || "all")}
                  placeholder="جميع المحافظات"
                  size="default"
                  clearable={true}
                  className="min-w-[180px]"
                />

                <StatusSelect
                  value={statusFilter === "all" ? "" : statusFilter}
                  onValueChange={(value) => setStatusFilter(value || "all")}
                  placeholder="جميع الحالات"
                  size="default"
                  includeAll={true}
                  className="min-w-[150px]"
                />

                <DamageSelect
                  value={damageFilter === "all" ? "" : damageFilter}
                  onValueChange={(value) => setDamageFilter(value || "all")}
                  placeholder="جميع مستويات الضرر"
                  size="default"
                  includeAll={true}
                  className="min-w-[180px]"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-slate-50 transition-all duration-200 bg-transparent"
                  onClick={resetFilters}
                >
                  <Filter className="w-4 h-4 ml-2" />
                  إعادة تعيين
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-slate-50 transition-all duration-200 bg-transparent"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
                <Link href="/dashboard/mosques/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة مسجد
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mosques Table */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>قائمة المساجد ({totalMosques})</span>
              {loading && (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="mr-2 text-slate-600">جاري تحميل المساجد...</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">اسم المسجد</TableHead>
                        <TableHead className="text-right">الموقع</TableHead>
                        <TableHead className="text-right">مستوى الضرر</TableHead>
                        <TableHead className="text-right">التكلفة المقدرة</TableHead>
                        <TableHead className="text-right">نوع العمل</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">تاريخ الإضافة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mosques.map((mosque) => (
                        <TableRow key={mosque.id} className="hover:bg-slate-50 transition-colors duration-200">
                          <TableCell>
                            <div className="font-semibold text-slate-900">{mosque.name_ar}</div>
                            <div className="text-sm text-slate-600">{mosque.name_en}</div>
                            <div className="text-xs text-slate-500">ID: {mosque.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span>
                                {mosque.governorate_ar} - {mosque.district_ar}
                              </span>
                            </div>
                            <div className="text-sm text-slate-600 mt-1">
                              {mosque.sub_district_ar} - {mosque.neighborhood_ar}
                            </div>
                            {mosque.address_text && (
                              <div className="text-sm text-slate-600 mt-1">
                                {mosque.address_text.length > 30
                                  ? `${mosque.address_text.substring(0, 30)}...`
                                  : mosque.address_text}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={mosque.damage_level === "كامل" ? "destructive" : "secondary"}>
                              {mosque.damage_level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-emerald-600" />
                              <span className="font-semibold">
                                {mosque.estimated_cost ? formatCurrency(parseFloat(mosque.estimated_cost)) : "غير محدد"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={mosque.is_reconstruction ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}>
                              {mosque.is_reconstruction ? "إعادة إعمار" : "ترميم"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                mosque.status === "مفعل"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : mosque.status === "مكتمل"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {mosque.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(mosque.created_at)}</div>
                            <div className="text-xs text-slate-500">بواسطة: {mosque.created_by}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/mosques/${mosque.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-blue-50 transition-colors duration-200"
                                  title="عرض التفاصيل"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link href={`/dashboard/mosques/${mosque.id}/edit`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-emerald-50 transition-colors duration-200"
                                  title="تعديل المسجد"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              
                              {/* Dropdown لتغيير الحالة */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-slate-50 transition-colors duration-200"
                                    title="تغيير الحالة"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(mosque.id, "مفعل")}
                                    className={`cursor-pointer ${mosque.status === "مفعل" ? "bg-emerald-50 text-emerald-700" : ""}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                      مفعل
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(mosque.id, "موقوف")}
                                    className={`cursor-pointer ${mosque.status === "موقوف" ? "bg-amber-50 text-amber-700" : ""}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                      موقوف
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(mosque.id, "مكتمل")}
                                    className={`cursor-pointer ${mosque.status === "مكتمل" ? "bg-blue-50 text-blue-700" : ""}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      مكتمل
                                    </div>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                                onClick={() => setDeleteDialog({ open: true, mosque })}
                                title="حذف المسجد"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {mosques.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-slate-600">لا توجد مساجد تطابق معايير البحث</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-slate-600">
                      عرض {((currentPage - 1) * perPage) + 1} إلى {Math.min(currentPage * perPage, totalMosques)} من أصل {totalMosques} مسجد
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1 || loading}
                      >
                        السابق
                      </Button>
                      <span className="px-3 py-1 text-sm">
                        صفحة {currentPage} من {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || loading}
                      >
                        التالي
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, mosque: null })}
        title="حذف المسجد"
        description="هل أنت متأكد من رغبتك في حذف هذا المسجد؟ سيتم حذف جميع المشاريع والبيانات المرتبطة به نهائياً."
        itemName={deleteDialog.mosque?.name_ar || ""}
        onConfirm={handleDeleteMosque}
        isLoading={deleting}
      />
    </div>
  )
}
