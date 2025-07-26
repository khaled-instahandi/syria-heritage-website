"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, ArrowRight, Upload, MapPin, DollarSign, Calendar, AlertCircle } from 'lucide-react'
import Link from "next/link"

export default function NewMosquePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    governorate_id: "",
    district_id: "",
    sub_district_id: "",
    neighborhood_id: "",
    address_text: "",
    latitude: "",
    longitude: "",
    damage_level: "جزئي",
    estimated_cost: "",
    is_reconstruction: false,
    status: "نشط",
    description: "",
    historical_period: "",
    architectural_style: "",
    condition: "",
    last_restoration: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to mosques list
      router.push("/dashboard/mosques")
    } catch (err) {
      setError("حدث خطأ أثناء إضافة المسجد. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <DashboardHeader
        title="إضافة مسجد جديد"
        description="إضافة مسجد جديد إلى قاعدة البيانات مع جميع التفاصيل المطلوبة"
      />

      <div className="p-6">
        <div className="mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-600">
            <Link href="/dashboard" className="hover:text-emerald-600">
              لوحة التحكم
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/dashboard/mosques" className="hover:text-emerald-600">
              إدارة المساجد
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">إضافة مسجد جديد</span>
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
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">اسم المسجد *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المسجد"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">الحالة</Label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="نشط">نشط</option>
                      <option value="موقوف">موقوف</option>
                      <option value="مكتمل">مكتمل</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="وصف مختصر عن المسجد وأهميته التاريخية"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  معلومات الموقع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="governorate_id">المحافظة *</Label>
                    <select
                      id="governorate_id"
                      name="governorate_id"
                      value={formData.governorate_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">اختر المحافظة</option>
                      <option value="1">دمشق</option>
                      <option value="2">حلب</option>
                      <option value="3">حمص</option>
                      <option value="4">حماة</option>
                      <option value="5">اللاذقية</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="district_id">المنطقة *</Label>
                    <select
                      id="district_id"
                      name="district_id"
                      value={formData.district_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">اختر المنطقة</option>
                      <option value="1">المدينة القديمة</option>
                      <option value="2">الميدان</option>
                      <option value="3">الصالحية</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sub_district_id">الناحية</Label>
                    <select
                      id="sub_district_id"
                      name="sub_district_id"
                      value={formData.sub_district_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">اختر الناحية</option>
                      <option value="1">الناحية الأولى</option>
                      <option value="2">الناحية الثانية</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="neighborhood_id">الحي</Label>
                    <select
                      id="neighborhood_id"
                      name="neighborhood_id"
                      value={formData.neighborhood_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">اختر الحي</option>
                      <option value="1">الحي الأول</option>
                      <option value="2">الحي الثاني</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address_text">العنوان التفصيلي</Label>
                  <Textarea
                    id="address_text"
                    name="address_text"
                    value={formData.address_text}
                    onChange={handleInputChange}
                    placeholder="العنوان الكامل والتفصيلي للمسجد"
                    rows={2}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">خط العرض</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="33.5138"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">خط الطول</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="36.2765"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Damage and Cost Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  معلومات الضرر والتكلفة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="damage_level">مستوى الضرر *</Label>
                    <select
                      id="damage_level"
                      name="damage_level"
                      value={formData.damage_level}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="جزئي">ضرر جزئي</option>
                      <option value="كامل">ضرر كامل</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="estimated_cost">التكلفة المقدرة (ل.س)</Label>
                    <Input
                      id="estimated_cost"
                      name="estimated_cost"
                      type="number"
                      value={formData.estimated_cost}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_reconstruction"
                    name="is_reconstruction"
                    checked={formData.is_reconstruction}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <Label htmlFor="is_reconstruction">يحتاج إعادة إعمار كاملة</Label>
                </div>
              </CardContent>
            </Card>

            {/* Historical Information */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  المعلومات التاريخية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="historical_period">الفترة التاريخية</Label>
                    <Input
                      id="historical_period"
                      name="historical_period"
                      value={formData.historical_period}
                      onChange={handleInputChange}
                      placeholder="العصر الأموي، العصر العثماني، إلخ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="architectural_style">الطراز المعماري</Label>
                    <Input
                      id="architectural_style"
                      name="architectural_style"
                      value={formData.architectural_style}
                      onChange={handleInputChange}
                      placeholder="أموي، عثماني، مملوكي، إلخ"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="condition">الحالة العامة</Label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">اختر الحالة</option>
                      <option value="ممتازة">ممتازة</option>
                      <option value="جيدة">جيدة</option>
                      <option value="متوسطة">متوسطة</option>
                      <option value="سيئة">سيئة</option>
                      <option value="متهدمة">متهدمة</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="last_restoration">آخر ترميم</Label>
                    <Input
                      id="last_restoration"
                      name="last_restoration"
                      type="date"
                      value={formData.last_restoration}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Link href="/dashboard/mosques">
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
                    حفظ المسجد
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
