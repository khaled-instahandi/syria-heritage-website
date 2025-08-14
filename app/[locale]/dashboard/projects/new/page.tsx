"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMosques } from '../../../../../hooks/use-mosques'
import { toast } from "sonner"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { CreateProjectData, Mosque } from "../../../../../lib/types"
import { DashboardHeader } from "../../../../../components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { SearchableSelect } from "../../../../../components/ui/searchable-select"
import { Alert, AlertDescription } from "../../../../../components/ui/alert"
import { ArrowRight, AlertCircle, Building, DollarSign, Calendar, Save, Loader2 } from "lucide-react"
import api from "../../../../../lib/api"

interface FormData {
  mosque_id: number | null
  project_category: "ترميم" | "إعادة إعمار"
  status: "قيد الدراسة" | "قيد التنفيذ" | "مكتمل"
  total_cost: string
  progress_percentage: number
  approved_at: string
  published_at: string
}

const initialFormData: FormData = {
  mosque_id: null,
  project_category: "ترميم",
  status: "قيد الدراسة",
  total_cost: "",
  progress_percentage: 0,
  approved_at: "",
  published_at: ""
}

export default function NewProjectPage() {
  const t = useTranslations()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [mosques, setMosques] = useState<Mosque[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingMosques, setIsLoadingMosques] = useState(false)
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  // جلب المساجد
  useEffect(() => {
    const fetchMosques = async () => {
      setIsLoadingMosques(true)
      try {
        const response = await api.getMosques({ per_page: 1000 })
        setMosques(response.data)
      } catch (error: any) {
        console.error('Error fetching mosques:', error)
        toast.error('خطأ في جلب المساجد')
        setError('خطأ في جلب المساجد')
      } finally {
        setIsLoadingMosques(false)
      }
    }

    fetchMosques()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.mosque_id) {
      newErrors.mosque_id = "يجب اختيار المسجد"
    }

    if (!formData.total_cost.trim()) {
      newErrors.total_cost = "التكلفة الإجمالية مطلوبة"
    } else {
      const cost = parseFloat(formData.total_cost)
      if (isNaN(cost) || cost < 0) {
        newErrors.total_cost = "يجب أن تكون التكلفة رقماً صحيحاً وأكبر من صفر"
      }
    }

    if (formData.progress_percentage < 0 || formData.progress_percentage > 100) {
      newErrors.progress_percentage = "نسبة التقدم يجب أن تكون بين 0 و 100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!validateForm()) {
      return
    }

    setIsSaving(true)
    try {
      const saveData: CreateProjectData = {
        mosque_id: formData.mosque_id!,
        project_category: formData.project_category,
        status: formData.status,
        total_cost: formData.total_cost,
        progress_percentage: formData.progress_percentage
      }

      if (formData.approved_at) {
        saveData.approved_at = formData.approved_at
      }

      if (formData.published_at) {
        saveData.published_at = formData.published_at
      }

      await api.createProject(saveData)
      toast.success('تم إنشاء المشروع بنجاح')
      router.push('/dashboard/projects')
    } catch (error: any) {
      console.error('Error creating project:', error)
      const errorMessage = error.message || 'حدث خطأ في إنشاء المشروع'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // مسح الخطأ عند تغيير القيمة
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    setError("")
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="إضافة مشروع جديد"
        description="إنشاء مشروع ترميم أو إعادة إعمار جديد مع تحديد جميع التفاصيل المطلوبة"
      />

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-600">
            <Link href="/dashboard" className="hover:text-emerald-600">
              لوحة التحكم
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/dashboard/projects" className="hover:text-emerald-600">
              إدارة المشاريع
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">إضافة مشروع جديد</span>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-600" />
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* اختيار المسجد */}
                  <div>
                    <Label htmlFor="mosque_id">المسجد *</Label>
                    {isLoadingMosques ? (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جارٍ تحميل المساجد...
                      </div>
                    ) : (
                      <SearchableSelect
                        value={formData.mosque_id?.toString() || ""}
                        onValueChange={(value) => handleInputChange("mosque_id", parseInt(value))}
                        options={mosques.map((mosque) => ({
                          value: mosque.id.toString(),
                          label: mosque.name_ar,
                          description: `${mosque.governorate_ar}`
                        }))}
                        placeholder="اختر المسجد"
                        searchPlaceholder="البحث عن المسجد..."
                        emptyText="لا توجد مساجد متاحة"
                        clearable
                        className={errors.mosque_id ? "border-red-500" : ""}
                      />
                    )}
                    {errors.mosque_id && (
                      <p className="text-sm text-red-600">{errors.mosque_id}</p>
                    )}
                  </div>

                  {/* نوع المشروع */}
                  <div>
                    <Label htmlFor="project_category">نوع المشروع *</Label>
                    <Select
                      value={formData.project_category}
                      onValueChange={(value: "ترميم" | "إعادة إعمار") => 
                        handleInputChange("project_category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع المشروع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ترميم">ترميم</SelectItem>
                        <SelectItem value="إعادة إعمار">إعادة إعمار</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* حالة المشروع */}
                  <div>
                    <Label htmlFor="status">حالة المشروع</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "قيد الدراسة" | "قيد التنفيذ" | "مكتمل") => 
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر حالة المشروع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="قيد الدراسة">قيد الدراسة</SelectItem>
                        <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                        <SelectItem value="مكتمل">مكتمل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* نسبة التقدم */}
                  <div>
                    <Label htmlFor="progress_percentage">نسبة الإنجاز (%)</Label>
                    <Input
                      id="progress_percentage"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress_percentage}
                      onChange={(e) => handleInputChange("progress_percentage", Number(e.target.value))}
                      placeholder="0"
                      className={errors.progress_percentage ? "border-red-500" : ""}
                    />
                    {errors.progress_percentage && (
                      <p className="text-sm text-red-600">{errors.progress_percentage}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  المعلومات المالية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="total_cost">التكلفة الإجمالية (ل.س) *</Label>
                  <Input
                    id="total_cost"
                    type="number"
                    step="0.01"
                    value={formData.total_cost}
                    onChange={(e) => handleInputChange("total_cost", e.target.value)}
                    placeholder="0.00"
                    className={errors.total_cost ? "border-red-500" : ""}
                    required
                  />
                  {errors.total_cost && (
                    <p className="text-sm text-red-600">{errors.total_cost}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  التواريخ المهمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="approved_at">تاريخ الموافقة</Label>
                    <Input
                      id="approved_at"
                      type="date"
                      value={formData.approved_at}
                      onChange={(e) => handleInputChange("approved_at", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="published_at">تاريخ النشر</Label>
                    <Input
                      id="published_at"
                      type="date"
                      value={formData.published_at}
                      onChange={(e) => handleInputChange("published_at", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Link href="/dashboard/projects">
                <Button type="button" variant="outline" disabled={isSaving}>
                  إلغاء
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isSaving} 
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ المشروع
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
