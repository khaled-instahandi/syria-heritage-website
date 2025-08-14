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
  DollarSign,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  Building,
  Target,
  RefreshCw,
  X,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { useProjects } from "@/hooks/use-projects"
import { useMosques } from "@/hooks/use-mosques"
import { ProjectFormDialog } from "@/components/ui/project-form-dialog"
import { DeleteProjectDialog } from "@/components/ui/delete-project-dialog"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { Project } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function ProjectsManagementPage() {
  const t = useTranslations()
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const router = useRouter()
  const { mosques, isLoading: mosquesLoading } = useMosques()
  const {
    projects,
    loading,
    error,
    pagination,
    filters,
    stats,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    setFilters,
    resetFilters,
    refresh
  } = useProjects({
    autoFetch: true,
    initialFilters: {
      per_page: 10
    }
  })

  const handleSearch = (searchTerm: string) => {
    setFilters({ search: searchTerm, page: 1 })
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value === "all" ? undefined : value, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setFilters({ page })
  }

  const handleCreateProject = async (data: any) => {
    return await createProject(data)
  }

  const handleUpdateProject = async (data: any) => {
    if (!editingProject) return null
    const result = await updateProject(editingProject.id, data)
    setEditingProject(null)
    return result
  }

  const handleDeleteProject = async (id: number) => {
    return await deleteProject(id)
  }

  const handleRefresh = () => {
    refresh()
  }

  // إعداد خيارات الفلاتر
  const statusOptions = [
    { value: "all", label: "جميع الحالات" },
    { value: "قيد الدراسة", label: "قيد الدراسة" },
    { value: "قيد التنفيذ", label: "قيد التنفيذ" },
    { value: "مكتمل", label: "مكتمل" },
  ]

  const categoryOptions = [
    { value: "all", label: "جميع الفئات" },
    { value: "ترميم", label: "ترميم" },
    { value: "إعادة إعمار", label: "إعادة إعمار" },
  ]

  const mosqueOptions = [
    { value: "all", label: "جميع المساجد" },
    ...mosques.map(mosque => ({
      value: mosque.id.toString(),
      label: mosque.name_ar,
      description: mosque.governorate_ar
    }))
  ]

  const governorateOptions = [
    { value: "all", label: "جميع المحافظات" },
    ...Array.from(new Set(mosques.map(mosque => mosque.governorate_ar)))
      .map(governorate => ({
        value: governorate,
        label: governorate
      }))
  ]

  // حساب عدد الفلاتر النشطة
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    value && value !== "" && value !== "all" && key !== "page" && key !== "per_page"
  ).length

  if (error) {
    return (
      <div className="min-h-screen">
        <DashboardHeader
          title={t("dashboard.projectsManagement")}
          description="إدارة ومتابعة جميع مشاريع إعادة الإعمار والترميم"
        />
        <div className="p-6">
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 ml-2" />
                إعادة المحاولة
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
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
                  <p className="text-3xl font-bold text-slate-900">{stats.inProgress}</p>
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
                  <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
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
                  <p className="text-3xl font-bold text-slate-900">{stats.planning}</p>
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
                    value={filters.search || ""}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="min-w-[180px]">
                    <SearchableSelect
                      options={statusOptions}
                      value={filters.status || "all"}
                      onValueChange={(value) => handleFilterChange("status", value)}
                      placeholder="حالة المشروع"
                      searchPlaceholder="البحث في الحالات..."
                      clearable
                      size="default"
                    />
                  </div>

                  <div className="min-w-[180px]">
                    <SearchableSelect
                      options={categoryOptions}
                      value={filters.project_category || "all"}
                      onValueChange={(value) => handleFilterChange("project_category", value)}
                      placeholder="فئة المشروع"
                      searchPlaceholder="البحث في الفئات..."
                      clearable
                      size="default"
                    />
                  </div>

                  {/* <div className="min-w-[200px]">
                    <SearchableSelect
                      options={mosqueOptions}
                      value={filters.mosque_id?.toString() || "all"}
                      onValueChange={(value) => handleFilterChange("mosque_id", value === "all" ? "all" : value)}
                      placeholder="اختر المسجد"
                      searchPlaceholder="البحث في المساجد..."
                      loading={mosquesLoading}
                      clearable
                      size="default"
                    />
                  </div> */}

                  <div className="min-w-[180px]">
                    <SearchableSelect
                      options={governorateOptions}
                      value={filters.governorate || "all"}
                      onValueChange={(value) => handleFilterChange("governorate", value)}
                      placeholder="المحافظة"
                      searchPlaceholder="البحث في المحافظات..."
                      clearable
                      size="default"
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    className="px-3 relative"
                    disabled={activeFiltersCount === 0}
                  >
                    <Filter className="w-4 h-4 ml-2" />
                    إعادة تعيين
                    {activeFiltersCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </div>
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
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                  تحديث
                </Button>
                {/* <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button> */}
                <Button
                // projects/new
                  onClick={() =>
                    router.push("/dashboard/projects/new")
                  }
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  مشروع جديد
                </Button>
              </div>
            </div>

            {/* مؤشر الفلاتر النشطة */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Filter className="w-4 h-4" />
                  <span>الفلاتر النشطة ({activeFiltersCount}):</span>
                  <div className="flex flex-wrap gap-2">
                    {filters.search && (
                      <Badge variant="secondary" className="gap-1">
                        البحث: {filters.search}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0"
                          onClick={() => handleFilterChange("search", "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.status && filters.status !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        الحالة: {filters.status}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0"
                          onClick={() => handleFilterChange("status", "all")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.project_category && filters.project_category !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        الفئة: {filters.project_category}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0"
                          onClick={() => handleFilterChange("project_category", "all")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.mosque_id && filters.mosque_id !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        المسجد: {mosques.find(m => m.id.toString() === filters.mosque_id?.toString())?.name_ar || filters.mosque_id}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0"
                          onClick={() => handleFilterChange("mosque_id", "all")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {filters.governorate && filters.governorate !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        المحافظة: {filters.governorate}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0"
                          onClick={() => handleFilterChange("governorate", "all")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects Display */}
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
              <p className="text-slate-600">جارٍ تحميل المشاريع...</p>
            </CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 text-lg mb-4">لا توجد مشاريع</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة أول مشروع
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "table" ? (
          <Card>
            <CardHeader>
              <CardTitle>قائمة المشاريع ({pagination.totalItems})</CardTitle>
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
                    {projects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="font-semibold text-slate-900">مشروع #{project.id}</div>
                          <div className="text-sm text-slate-600">{project.project_category}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{project.mosque_ar}</div>
                          <div className="text-sm text-slate-600">{project.mosque_en}</div>
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
                              <span>{project.progress_percentage}%</span>
                            </div>
                            <Progress value={project.progress_percentage} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold">
                              {project.total_cost ? formatCurrency(parseFloat(project.total_cost)) : "غير محدد"}
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              // projects/[id]/edit
                              onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <DeleteProjectDialog 
                              project={project} 
                              onDelete={handleDeleteProject}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-slate-600">
                    عرض {((pagination.currentPage - 1) * pagination.perPage) + 1} إلى{' '}
                    {Math.min(pagination.currentPage * pagination.perPage, pagination.totalItems)} من{' '}
                    {pagination.totalItems} مشروع
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      السابق
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{project.mosque_ar}</h3>
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
                    <p className="text-sm text-slate-600">{project.mosque_en}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">التقدم المحرز</span>
                      <span className="text-sm font-semibold text-emerald-600">
                        {project.progress_percentage}%
                      </span>
                    </div>
                    <Progress value={project.progress_percentage} className="h-2 bg-slate-200" />
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <Badge
                        variant="secondary"
                        className={`${
                          project.status === "مكتمل"
                            ? "text-emerald-700"
                            : project.status === "قيد التنفيذ"
                              ? "text-blue-700"
                              : "text-amber-700"
                        }`}
                      >
                        {project.status}
                      </Badge>
                      <span className="font-semibold text-slate-900">
                        {project.total_cost ? formatCurrency(parseFloat(project.total_cost)) : "غير محدد"}
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
                    <Button 
                      variant="outline"
                      onClick={() => setEditingProject(project)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <DeleteProjectDialog 
                      project={project} 
                      onDelete={handleDeleteProject}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ProjectFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
        onSave={handleCreateProject}
      />

      <ProjectFormDialog
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
        mode="edit"
        project={editingProject}
        onSave={handleUpdateProject}
      />
    </div>
  )
}
