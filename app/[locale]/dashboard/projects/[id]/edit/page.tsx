"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { useMosques } from '../../../../../../hooks/use-mosques'
import { useProjects } from '../../../../../../hooks/use-projects'
import { toast } from "sonner"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { UpdateProjectData, Mosque, Project } from "../../../../../../lib/types"
import { DashboardHeader } from "../../../../../../components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card"
import { Button } from "../../../../../../components/ui/button"
import { Input } from "../../../../../../components/ui/input"
import { Label } from "../../../../../../components/ui/label"
import { Textarea } from "../../../../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select"
import { SearchableSelect } from "../../../../../../components/ui/searchable-select"
import { Alert, AlertDescription } from "../../../../../../components/ui/alert"
import { ArrowRight, AlertCircle, Building, DollarSign, Calendar, Save, Loader2, Target, RefreshCw } from "lucide-react"

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const { mosques, isLoading: isLoadingMosques } = useMosques()
  const { updateProject, projects, loading: projectsLoading } = useProjects({ autoFetch: true })

  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    mosque_id: "",
    project_category: "ترميم",
    status: "قيد الدراسة",
    total_cost: "",
    progress_percentage: "0",
  })

  // جلب بيانات المشروع
  useEffect(() => {
    const findProject = () => {
      if (!projectId || projectsLoading) return
      
      // إذا كان المشروع محمل مسبقاً ولم يتغير ID، لا نعيد التحميل
      if (project && project.id === parseInt(projectId)) {
        setIsPageLoading(false)
        return
      }
      
      setIsPageLoading(true)
      setError("")
      
      try {
        // البحث عن المشروع المطلوب
        const foundProject = projects.find(p => p.id === parseInt(projectId))
        
        if (foundProject) {
          setProject(foundProject)
          setFormData({
            mosque_id: foundProject.mosque_id?.toString() || "",
            project_category: foundProject.project_category,
            status: foundProject.status,
            total_cost: foundProject.total_cost?.toString() || "",
            progress_percentage: foundProject.progress_percentage?.toString() || "0",
          })
        } else if (!projectsLoading && projects.length > 0) {
          setError('المشروع غير موجود')
        }
      } catch (error: any) {
        console.error('Error finding project:', error)
        setError('خطأ في جلب بيانات المشروع')
      } finally {
        if (!projectsLoading) {
          setIsPageLoading(false)
        }
      }
    }

    findProject()
  }, [projectId, projects, projectsLoading, project])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Memoized mosque data for current project
  const currentMosque = useMemo(() => {
    return project ? mosques.find(m => m.id === project.mosque_id) : null
  }, [project, mosques])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // التحقق من البيانات المطلوبة
      if (!formData.mosque_id) {
        setError("يرجى اختيار المسجد")
        return
      }

      if (!formData.total_cost) {
        setError("يرجى إدخال التكلفة الإجمالية")
        return
      }

      const saveData: UpdateProjectData = {
        mosque_id: parseInt(formData.mosque_id),
        project_category: formData.project_category as "ترميم" | "إعادة إعمار",
        status: formData.status as "قيد الدراسة" | "قيد التنفيذ" | "مكتمل",
        total_cost: formData.total_cost,
        progress_percentage: parseInt(formData.progress_percentage) || 0,
      }

      const result = await updateProject(parseInt(projectId), saveData)
      
      if (result) {
        setSuccess("تم تحديث بيانات المشروع بنجاح!")
        toast.success("تم تحديث المشروع بنجاح!")

        setTimeout(() => {
          router.push("/dashboard/projects")
        }, 1500)
      } else {
        setError("حدث خطأ أثناء تحديث المشروع")
      }
    } catch (err: any) {
      const errorMessage = err.message || "حدث خطأ أثناء تحديث المشروع. يرجى المحاولة مرة أخرى."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [formData, projectId, updateProject, router])

  if (isPageLoading || projectsLoading) {
    return (
      <div className="min-h-screen">
        <DashboardHeader 
          title="تحديث المشروع" 
          description="جاري تحميل بيانات المشروع..." 
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-slate-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="min-h-screen">
        <DashboardHeader 
          title="خطأ في تحميل المشروع" 
          description="لم يتم العثور على المشروع المطلوب" 
        />
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
            <div className="mt-6">
              <Link href="/dashboard/projects">
                <Button variant="outline">
                  <ArrowRight className="w-4 h-4 ml-2" />
                  العودة إلى قائمة المشاريع
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title={`تحديث المشروع #${projectId}`}
        description={project ? `تعديل مشروع ${project.project_category} - ${currentMosque?.name_ar || 'غير محدد'}` : "تعديل وتحديث معلومات المشروع وتفاصيله"}
      />

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-600">
            <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
              لوحة التحكم
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/dashboard/projects" className="hover:text-emerald-600 transition-colors">
              إدارة المشاريع
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">تحديث المشروع #{projectId}</span>
          </div>

          {/* معلومات المشروع الحالية */}
          {project && (
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Building className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        {currentMosque?.name_ar || 'مسجد غير محدد'}
                      </h3>
                      <p className="text-sm text-blue-700">
                        {project.project_category} - {project.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600">نسبة الإنجاز</p>
                    <p className="text-lg font-bold text-blue-900">{project.progress_percentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setError("")
                    window.location.reload()
                  }}
                  className="text-red-600 hover:bg-red-100"
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                  إعادة المحاولة
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-emerald-200 bg-emerald-50 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-800">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                  <Building className="w-5 h-5" />
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mosque_id" className="text-slate-700 font-medium">
                      المسجد *
                    </Label>
                    {isLoadingMosques ? (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جارٍ تحميل المساجد...
                      </div>
                    ) : (
                      <SearchableSelect
                        value={formData.mosque_id?.toString() || ""}
                        onValueChange={(value) => handleInputChange({ target: { name: "mosque_id", value } } as any)}
                        options={mosques.map((mosque) => ({
                          value: mosque.id.toString(),
                          label: mosque.name_ar,
                          description: `${mosque.governorate_ar}`
                        }))}
                        placeholder="اختر المسجد"
                        searchPlaceholder="البحث عن المسجد..."
                        emptyText="لا توجد مساجد متاحة"
                        clearable
                        className="w-full"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project_category" className="text-slate-700 font-medium">
                      نوع المشروع *
                    </Label>
                    <select
                      id="project_category"
                      name="project_category"
                      value={formData.project_category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      required
                    >
                      <option value="ترميم">ترميم</option>
                      <option value="إعادة إعمار">إعادة إعمار</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-slate-700 font-medium">
                      حالة المشروع
                    </Label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    >
                      <option value="قيد الدراسة">قيد الدراسة</option>
                      <option value="قيد التنفيذ">قيد التنفيذ</option>
                      <option value="مكتمل">مكتمل</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="progress_percentage" className="text-slate-700 font-medium">
                      نسبة الإنجاز (%)
                    </Label>
                    <Input
                      id="progress_percentage"
                      name="progress_percentage"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress_percentage}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total_cost" className="text-slate-700 font-medium">
                      التكلفة الإجمالية (ل.س) *
                    </Label>
                    <Input
                      id="total_cost"
                      name="total_cost"
                      type="number"
                      value={formData.total_cost}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* معلومات إضافية */}
            <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Target className="w-5 h-5" />
                  معلومات المشروع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">المسجد</Label>
                    <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">
                      {currentMosque?.name_ar || 'غير محدد'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">المحافظة</Label>
                    <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">
                      {currentMosque?.governorate_ar || 'غير محدد'}
                    </p>
                  </div>
                </div>
                
                {project && (
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium"> تاريخ البناء</Label>
                      <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">
                        {new Date(project.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">آخر تحديث</Label>
                      <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">
                        {project.updated_at ? new Date(project.updated_at).toLocaleDateString('ar-SA') : 'لم يتم التحديث'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6">
              <Link href="/dashboard/projects">
                <Button
                  type="button"
                  variant="outline"
                  className="px-8 py-2 hover:bg-slate-50 transition-all duration-200 bg-transparent"
                >
                  إلغاء
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2 bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    جاري التحديث...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
