"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, ArrowRight, Building, DollarSign, Calendar, AlertCircle, Target } from 'lucide-react'
import Link from "next/link"

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
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

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to projects list
      router.push("/dashboard/projects")
    } catch (err) {
      setError("حدث خطأ أثناء إضافة المشروع. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsLoading(false)
    }
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
                  <div>
                    <Label htmlFor="mosque_id">المسجد *</Label>
                    <select
                      id="mosque_id"
                      name="mosque_id"
                      value={formData.mosque_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">اختر المسجد</option>
                      <option value="1">الجامع الأموي الكبير</option>
                      <option value="2">مسجد خالد بن الوليد</option>
                      <option value="3">مسجد السيدة زينب</option>
                      <option value="4">مسجد التكية السليمانية</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="project_category">نوع المشروع *</Label>
                    <select
                      id="project_category"
                      name="project_category"
                      value={formData.project_category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="ترميم">ترميم</option>
                      <option value="إعادة إعمار">إعادة إعمار</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="status">حالة المشروع</Label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="قيد الدراسة">قيد الدراسة</option>
                      <option value="قيد التنفيذ">قيد التنفيذ</option>
                      <option value="مكتمل">مكتمل</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="priority">الأولوية</Label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="low">منخفضة</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">عالية</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="progress_percentage">نسبة الإنجاز (%)</Label>
                    <Input
                      id="progress_percentage"
                      name="progress_percentage"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress_percentage}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">وصف المشروع</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="وصف تفصيلي للمشروع وأهدافه"
                    rows={4}
                  />
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
                    name="total_cost"
                    type="number"
                    value={formData.total_cost}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  الجدول الزمني
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">تاريخ البداية</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">تاريخ الانتهاء المتوقع</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  تفاصيل المشروع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="objectives">الأهداف</Label>
                  <Textarea
                    id="objectives"
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleInputChange}
                    placeholder="الأهداف الرئيسية للمشروع"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="expected_outcomes">النتائج المتوقعة</Label>
                  <Textarea
                    id="expected_outcomes"
                    name="expected_outcomes"
                    value={formData.expected_outcomes}
                    onChange={handleInputChange}
                    placeholder="النتائج والمخرجات المتوقعة من المشروع"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="required_materials">المواد المطلوبة</Label>
                  <Textarea
                    id="required_materials"
                    name="required_materials"
                    value={formData.required_materials}
                    onChange={handleInputChange}
                    placeholder="قائمة بالمواد والأدوات المطلوبة"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="team_members">أعضاء الفريق</Label>
                  <Textarea
                    id="team_members"
                    name="team_members"
                    value={formData.team_members}
                    onChange={handleInputChange}
                    placeholder="أسماء أعضاء فريق العمل ومسؤولياتهم"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="milestones">المعالم الرئيسية</Label>
                  <Textarea
                    id="milestones"
                    name="milestones"
                    value={formData.milestones}
                    onChange={handleInputChange}
                    placeholder="المعالم والمراحل الرئيسية للمشروع"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Link href="/dashboard/projects">
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
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
