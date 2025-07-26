"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  MapPin,
  DollarSign,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  Building,
  Target,
} from "lucide-react"
import {
  mockProjects,
  getMosqueById,
  getGovernorateById,
  getDonationsByProjectId,
  getMainImageForMosque,
} from "@/lib/mock-data"
import { formatCurrency, formatDate, calculateProgress } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

export default function ProjectsManagementPage() {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  const filteredProjects = mockProjects.filter((project) => {
    const mosque = getMosqueById(project.mosque_id)
    const matchesSearch = searchTerm === "" || mosque?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesCategory = categoryFilter === "all" || project.project_category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const projectStats = {
    total: mockProjects.length,
    inProgress: mockProjects.filter((p) => p.status === "قيد التنفيذ").length,
    completed: mockProjects.filter((p) => p.status === "مكتمل").length,
    study: mockProjects.filter((p) => p.status === "قيد الدراسة").length,
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={t("dashboard.projectsManagement")}
        description="إدارة ومتابعة جميع مشاريع إعادة الإعمار والترميم"
      />

      <div className="p-6 space-y-6">
        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">إجمالي المشاريع</p>
                  <p className="text-3xl font-bold text-slate-900">{projectStats.total}</p>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">قيد التنفيذ</p>
                  <p className="text-3xl font-bold text-slate-900">{projectStats.inProgress}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">مكتملة</p>
                  <p className="text-3xl font-bold text-slate-900">{projectStats.completed}</p>
                </div>
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">قيد الدراسة</p>
                  <p className="text-3xl font-bold text-slate-900">{projectStats.study}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="البحث في المشاريع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="قيد الدراسة">قيد الدراسة</option>
                  <option value="قيد التنفيذ">قيد التنفيذ</option>
                  <option value="مكتمل">مكتمل</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع الفئات</option>
                  <option value="ترميم">ترميم</option>
                  <option value="إعادة إعمار">إعادة إعمار</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  جدول
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                >
                  بطاقات
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 ml-2" />
                  فلاتر متقدمة
                </Button>
                <Link href="/dashboard/projects/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 ml-2" />
                    مشروع جديد
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Display */}
        {viewMode === "table" ? (
          <Card>
            <CardHeader>
              <CardTitle>قائمة المشاريع ({filteredProjects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المشروع</TableHead>
                      <TableHead className="text-right">المسجد</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">التقدم</TableHead>
                      <TableHead className="text-right">التكلفة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => {
                      const mosque = getMosqueById(project.mosque_id)
                      const governorate = mosque ? getGovernorateById(mosque.governorate_id) : null
                      const donations = getDonationsByProjectId(project.id)
                      const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0)
                      const progress = project.total_cost ? calculateProgress(totalRaised, project.total_cost) : 0

                      return (
                        <TableRow key={project.id} className="hover:bg-slate-50">
                          <TableCell>
                            <div className="font-semibold text-slate-900">مشروع #{project.id}</div>
                            <div className="text-sm text-slate-600">{project.project_category}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{mosque?.name}</div>
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <MapPin className="w-3 h-3" />
                              {governorate?.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                project.project_category === "إعادة إعمار"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {project.project_category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{progress}%</span>
                                <span>{formatCurrency(totalRaised)}</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-emerald-600" />
                              <span className="font-semibold">
                                {project.total_cost ? formatCurrency(project.total_cost) : "غير محدد"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                project.status === "مكتمل"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : project.status === "قيد التنفيذ"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(project.created_at)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/projects/${project.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link href={`/dashboard/projects/${project.id}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const mosque = getMosqueById(project.mosque_id)
              const governorate = mosque ? getGovernorateById(mosque.governorate_id) : null
              const donations = getDonationsByProjectId(project.id)
              const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0)
              const progress = project.total_cost ? calculateProgress(totalRaised, project.total_cost) : 0
              const mainImage = mosque ? getMainImageForMosque(mosque.id) : "/placeholder.svg?height=200&width=300"

              return (
                <Card
                  key={project.id}
                  className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={mainImage || "/placeholder.svg"}
                      alt={mosque?.name || "مسجد"}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge
                        className={`${
                          project.project_category === "إعادة إعمار"
                            ? "bg-emerald-600 text-white"
                            : "bg-blue-600 text-white"
                        } shadow-lg`}
                      >
                        {project.project_category}
                      </Badge>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="secondary"
                        className={`bg-white/90 shadow-lg ${
                          project.status === "مكتمل"
                            ? "text-emerald-700"
                            : project.status === "قيد التنفيذ"
                              ? "text-blue-700"
                              : "text-amber-700"
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{mosque?.name}</h3>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{governorate?.name}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600">التقدم المحرز</span>
                        <span className="text-sm font-semibold text-emerald-600">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2 bg-slate-200" />
                      <div className="flex justify-between items-center mt-2 text-sm">
                        <span className="text-slate-600">{formatCurrency(totalRaised)} مُجمع</span>
                        <span className="font-semibold text-slate-900">
                          {project.total_cost ? formatCurrency(project.total_cost) : "غير محدد"} الهدف
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          <Eye className="w-4 h-4 ml-2" />
                          عرض
                        </Button>
                      </Link>
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <Button variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">لا توجد مشاريع تطابق معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  )
}
