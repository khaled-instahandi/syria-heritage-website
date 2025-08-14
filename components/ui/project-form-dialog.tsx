"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Save, Plus } from "lucide-react"
import { Project, CreateProjectData, UpdateProjectData } from "@/lib/types"

interface ProjectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project | null
  onSave: (data: CreateProjectData | UpdateProjectData) => Promise<Project | null>
  mode: "create" | "edit"
}

interface FormData {
  mosque_ar: string
  mosque_en: string
  project_category: "ترميم" | "إعادة إعمار"
  status: "قيد الدراسة" | "قيد التنفيذ" | "مكتمل"
  total_cost: string
  progress_percentage: number
  approved_by: string
  approved_at: string
  published_at: string
}

const initialFormData: FormData = {
  mosque_ar: "",
  mosque_en: "",
  project_category: "ترميم",
  status: "قيد الدراسة",
  total_cost: "",
  progress_percentage: 0,
  approved_by: "",
  approved_at: "",
  published_at: ""
}

export function ProjectFormDialog({ 
  open, 
  onOpenChange, 
  project, 
  onSave, 
  mode 
}: ProjectFormDialogProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  // تحديث النموذج عند تغيير المشروع
  useEffect(() => {
    if (mode === "edit" && project) {
      setFormData({
        mosque_ar: project.mosque_ar || "",
        mosque_en: project.mosque_en || "",
        project_category: project.project_category,
        status: project.status,
        total_cost: project.total_cost || "",
        progress_percentage: project.progress_percentage || 0,
        approved_by: project.approved_by || "",
        approved_at: project.approved_at ? project.approved_at.split('T')[0] : "",
        published_at: project.published_at ? project.published_at.split('T')[0] : ""
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [mode, project, open])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.mosque_ar.trim()) {
      newErrors.mosque_ar = "اسم المسجد بالعربية مطلوب"
    }

    if (!formData.mosque_en.trim()) {
      newErrors.mosque_en = "اسم المسجد بالإنجليزية مطلوب"
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
    
    if (!validateForm()) {
      return
    }

    setIsSaving(true)
    try {
      const saveData = {
        ...formData,
        progress_percentage: Number(formData.progress_percentage)
      }

      const result = await onSave(saveData)
      if (result) {
        onOpenChange(false)
        setFormData(initialFormData)
      }
    } catch (error) {
      console.error('Error saving project:', error)
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
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto text-right">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center gap-2">
            {mode === "create" ? (
              <>
                <Plus className="w-5 h-5" />
                إضافة مشروع جديد
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                تعديل المشروع
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-right">
            {mode === "create" 
              ? "قم بإدخال تفاصيل المشروع الجديد" 
              : "قم بتعديل تفاصيل المشروع"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* اسم المسجد بالعربية */}
            <div className="space-y-2">
              <Label htmlFor="mosque_ar">اسم المسجد (العربية) *</Label>
              <Input
                id="mosque_ar"
                value={formData.mosque_ar}
                onChange={(e) => handleInputChange("mosque_ar", e.target.value)}
                placeholder="اسم المسجد بالعربية"
                className={errors.mosque_ar ? "border-red-500" : ""}
              />
              {errors.mosque_ar && (
                <p className="text-sm text-red-600">{errors.mosque_ar}</p>
              )}
            </div>

            {/* اسم المسجد بالإنجليزية */}
            <div className="space-y-2">
              <Label htmlFor="mosque_en">اسم المسجد (الإنجليزية) *</Label>
              <Input
                id="mosque_en"
                value={formData.mosque_en}
                onChange={(e) => handleInputChange("mosque_en", e.target.value)}
                placeholder="اسم المسجد بالإنجليزية"
                className={errors.mosque_en ? "border-red-500" : ""}
              />
              {errors.mosque_en && (
                <p className="text-sm text-red-600">{errors.mosque_en}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* نوع المشروع */}
            <div className="space-y-2">
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

            {/* حالة المشروع */}
            <div className="space-y-2">
              <Label htmlFor="status">حالة المشروع *</Label>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* التكلفة الإجمالية */}
            <div className="space-y-2">
              <Label htmlFor="total_cost">التكلفة الإجمالية (ليرة سورية) *</Label>
              <Input
                id="total_cost"
                type="number"
                step="0.01"
                value={formData.total_cost}
                onChange={(e) => handleInputChange("total_cost", e.target.value)}
                placeholder="0.00"
                className={errors.total_cost ? "border-red-500" : ""}
              />
              {errors.total_cost && (
                <p className="text-sm text-red-600">{errors.total_cost}</p>
              )}
            </div>

            {/* نسبة التقدم */}
            <div className="space-y-2">
              <Label htmlFor="progress_percentage">نسبة التقدم (%)</Label>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* الموافق عليه من قبل */}
            <div className="space-y-2">
              <Label htmlFor="approved_by">الموافق عليه من قبل</Label>
              <Input
                id="approved_by"
                value={formData.approved_by}
                onChange={(e) => handleInputChange("approved_by", e.target.value)}
                placeholder="اسم الموافق"
              />
            </div>

            {/* تاريخ الموافقة */}
            <div className="space-y-2">
              <Label htmlFor="approved_at">تاريخ الموافقة</Label>
              <Input
                id="approved_at"
                type="date"
                value={formData.approved_at}
                onChange={(e) => handleInputChange("approved_at", e.target.value)}
              />
            </div>

            {/* تاريخ النشر */}
            <div className="space-y-2">
              <Label htmlFor="published_at">تاريخ النشر</Label>
              <Input
                id="published_at"
                type="date"
                value={formData.published_at}
                onChange={(e) => handleInputChange("published_at", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جارٍ الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  {mode === "create" ? "إضافة المشروع" : "حفظ التغييرات"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
