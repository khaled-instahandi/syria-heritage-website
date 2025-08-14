"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProjectCard } from "@/components/ui/project-card"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { Search, Grid, List, Filter } from "lucide-react"
import { mockProjects } from "@/lib/mock-data"

export default function ProjectsPage() {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // خيارات الفلاتر
  const statusOptions = [
    { value: "all", label: "جميع الحالات" },
    { value: "قيد الدراسة", label: "قيد الدراسة" },
    { value: "قيد التنفيذ", label: "قيد التنفيذ" },
    { value: "مكتمل", label: "مكتمل" },
  ]

  const categoryOptions = [
    { value: "all", label: "جميع الفئات" },
    { value: "بحاجة ترميم", label: "بحاجة ترميم" },
    { value: "بحاجة إعادة إعمار", label: "بحاجة إعادة إعمار" },
    { value: "قيد الترميم", label: "قيد الترميم" },
    { value: "قيد إعادة الإعمار", label: "قيد إعادة الإعمار" },
    { value: "تم ترميمها", label: "تم ترميمها" },
    { value: "تمت إعادة إعمارها", label: "تمت إعادة إعمارها" },
  ]

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch = searchTerm === "" || project.mosque_id.toString().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesCategory = categoryFilter === "all" || project.project_category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setCategoryFilter("all")
  }

  // حساب عدد الفلاتر النشطة
  const activeFiltersCount = [statusFilter, categoryFilter].filter(filter => filter !== "all").length + (searchTerm ? 1 : 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">{t("projects.title")}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t("projects.description")}</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="البحث في المشاريع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="min-w-[180px]">
                <SearchableSelect
                  options={statusOptions}
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  placeholder="حالة المشروع"
                  searchPlaceholder="البحث في الحالات..."
                  clearable
                />
              </div>

              <div className="min-w-[200px]">
                <SearchableSelect
                  options={categoryOptions}
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                  placeholder="فئة المشروع"
                  searchPlaceholder="البحث في الفئات..."
                  clearable
                />
              </div>

              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="px-3"
                >
                  <Filter className="w-4 h-4 ml-2" />
                  إعادة تعيين ({activeFiltersCount})
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* عداد النتائج */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              عرض {filteredProjects.length} من أصل {mockProjects.length} مشروع
              {activeFiltersCount > 0 && (
                <span className="text-emerald-600 font-medium mr-2">
                  (تم تطبيق {activeFiltersCount} فلتر)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className={`grid gap-8 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">لا توجد مشاريع تطابق معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  )
}
