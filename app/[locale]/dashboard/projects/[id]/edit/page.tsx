"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, ArrowRight, Building, DollarSign, Calendar, AlertCircle, Target, Loader2 } from "lucide-react"
import Link from "next/link"
import { mockProjects } from "@/lib/mock-data"

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    mosque_id: "",
    project_category: "ترميم",
    status: "قيد الدراسة",
    total_cost: "",
    progress_percentage: "0",
    description: "",
    start_date: "",
    end_date: "",
    priority: "medium",
    objectives: "",
    expected_outcomes: "",
    required_materials: "",
    team_members: "",
    milestones: "",
  })

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const project = mockProjects.find((p) => p.id.toString() === projectId)
        if (project) {
          setFormData({
            mosque_id: project.mosque_id.toString(),
            project_category: project.project_category,
            status: project.status,
            total_cost: project.total_cost?.toString() || "",
            progress_percentage: project.progress_percentage?.toString() || "0",
            description: project.description || "",
            start_date: project.start_date || "",
            end_date: project.end_date || "",
            priority: (project as any).priority || "medium",
            objectives: (project as any).objectives || "",
            expected_outcomes: (project as any).expected_outcomes || "",
            required_materials: (project as any).required_materials || "",
            team_members: (project as any).team_members || "",
            milestones: (project as any).milestones || "",
          })
        }
      } catch (err) {
        setError("حدث خطأ في تحميل بيانات المشروع")
      } finally {
        setIsPageLoading(false)
      }
    }

    loadProjectData()
  }, [projectId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess("تم تحديث بيانات المشروع بنجاح!")

      setTimeout(() => {
        router.push("/dashboard/projects")
      }, 1500)
    } catch (err) {
      setError("حدث خطأ أثناء تحديث المشروع. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen">
        <DashboardHeader title="تحديث المشروع" description="جاري تحميل بيانات المشروع..." />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-slate-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader title="تحديث المشروع" description="تعديل وتحديث معلومات المشروع وتفاصيله" />

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
            <span className="text-slate-900 font-medium">تحديث المشروع</span>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
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
                    <select
                      id="mosque_id"
                      name="mosque_id"
                      value={formData.mosque_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      required
                    >
                      <option value="">اختر المسجد</option>
                      <option value="1">الجامع الأموي الكبير</option>
                      <option value="2">مسجد خالد بن الوليد</option>
                      <option value="3">مسجد السيدة زينب</option>
                      <option value="4">مسجد التكية السليمانية</option>
                    </select>
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
                    <Label htmlFor="priority" className="text-slate-700 font-medium">
                      الأولوية
                    </Label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    >
                      <option value="low">منخفضة</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">عالية</option>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700 font-medium">
                    وصف المشروع
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="وصف تفصيلي للمشروع وأهدافه"
                    rows={4}
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <DollarSign className="w-5 h-5" />
                  المعلومات المالية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
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
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Calendar className="w-5 h-5" />
                  الجدول الزمني
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-slate-700 font-medium">
                      تاريخ البداية
                    </Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="text-slate-700 font-medium">
                      تاريخ الانتهاء المتوقع
                    </Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Target className="w-5 h-5" />
                  تفاصيل المشروع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="objectives" className="text-slate-700 font-medium">
                    الأهداف
                  </Label>
                  <Textarea
                    id="objectives"
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleInputChange}
                    placeholder="الأهداف الرئيسية للمشروع"
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expected_outcomes" className="text-slate-700 font-medium">
                    النتائج المتوقعة
                  </Label>
                  <Textarea
                    id="expected_outcomes"
                    name="expected_outcomes"
                    value={formData.expected_outcomes}
                    onChange={handleInputChange}
                    placeholder="النتائج والمخرجات المتوقعة من المشروع"
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="required_materials" className="text-slate-700 font-medium">
                    المواد المطلوبة
                  </Label>
                  <Textarea
                    id="required_materials"
                    name="required_materials"
                    value={formData.required_materials}
                    onChange={handleInputChange}
                    placeholder="قائمة بالمواد والأدوات المطلوبة"
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team_members" className="text-slate-700 font-medium">
                    أعضاء الفريق
                  </Label>
                  <Textarea
                    id="team_members"
                    name="team_members"
                    value={formData.team_members}
                    onChange={handleInputChange}
                    placeholder="أسماء أعضاء فريق العمل ومسؤولياتهم"
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="milestones" className="text-slate-700 font-medium">
                    المعالم الرئيسية
                  </Label>
                  <Textarea
                    id="milestones"
                    name="milestones"
                    value={formData.milestones}
                    onChange={handleInputChange}
                    placeholder="المعالم والمراحل الرئيسية للمشروع"
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
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
