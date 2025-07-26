"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Eye, Trash2, MapPin, DollarSign, Filter, Download } from "lucide-react"
import { mockMosques, getGovernorateById, getDistrictById, getProjectsByMosqueId } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { DeleteDialog } from "@/components/ui/delete-dialog"

export default function MosquesManagementPage() {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [damageFilter, setDamageFilter] = useState<string>("all")
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    mosque: any
  }>({
    open: false,
    mosque: null,
  })

  const filteredMosques = mockMosques.filter((mosque) => {
    const matchesSearch = searchTerm === "" || mosque.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || mosque.status === statusFilter
    const matchesDamage = damageFilter === "all" || mosque.damage_level === damageFilter

    return matchesSearch && matchesStatus && matchesDamage
  })

  const handleDeleteMosque = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Deleting mosque:", deleteDialog.mosque?.name)
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

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="نشط">نشط</option>
                  <option value="موقوف">موقوف</option>
                  <option value="مكتمل">مكتمل</option>
                </select>

                <select
                  value={damageFilter}
                  onChange={(e) => setDamageFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                >
                  <option value="all">جميع مستويات الضرر</option>
                  <option value="جزئي">ضرر جزئي</option>
                  <option value="كامل">ضرر كامل</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-slate-50 transition-all duration-200 bg-transparent"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-slate-50 transition-all duration-200 bg-transparent"
                >
                  <Filter className="w-4 h-4 ml-2" />
                  فلاتر متقدمة
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
            <CardTitle>قائمة المساجد ({filteredMosques.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم المسجد</TableHead>
                    <TableHead className="text-right">الموقع</TableHead>
                    <TableHead className="text-right">مستوى الضرر</TableHead>
                    <TableHead className="text-right">التكلفة المقدرة</TableHead>
                    <TableHead className="text-right">المشاريع</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">تاريخ الإضافة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMosques.map((mosque) => {
                    const governorate = getGovernorateById(mosque.governorate_id)
                    const district = getDistrictById(mosque.district_id)
                    const projects = getProjectsByMosqueId(mosque.id)

                    return (
                      <TableRow key={mosque.id} className="hover:bg-slate-50 transition-colors duration-200">
                        <TableCell>
                          <div className="font-semibold text-slate-900">{mosque.name}</div>
                          <div className="text-sm text-slate-600">ID: {mosque.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>
                              {governorate?.name} - {district?.name}
                            </span>
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
                              {mosque.estimated_cost ? formatCurrency(mosque.estimated_cost) : "غير محدد"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {projects.length} مشروع
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              mosque.status === "نشط"
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
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/mosques/${mosque.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-blue-50 transition-colors duration-200"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/dashboard/mosques/${mosque.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-emerald-50 transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                              onClick={() => setDeleteDialog({ open: true, mosque })}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredMosques.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600">لا توجد مساجد تطابق معايير البحث</p>
              </div>
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
        itemName={deleteDialog.mosque?.name || ""}
        onConfirm={handleDeleteMosque}
      />
    </div>
  )
}
