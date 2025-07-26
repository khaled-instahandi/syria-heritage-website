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
import { Save, ArrowRight, MapPin, DollarSign, Calendar, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { mockMosques } from "@/lib/mock-data"

export default function EditMosquePage() {
  const router = useRouter()
  const params = useParams()
  const mosqueId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
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

  useEffect(() => {
    // Simulate loading mosque data
    const loadMosqueData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mosque = mockMosques.find((m) => m.id.toString() === mosqueId)
        if (mosque) {
          setFormData({
            name: mosque.name,
            governorate_id: mosque.governorate_id.toString(),
            district_id: mosque.district_id.toString(),
            sub_district_id: mosque.sub_district_id?.toString() || "",
            neighborhood_id: mosque.neighborhood_id?.toString() || "",
            address_text: mosque.address_text || "",
            latitude: mosque.latitude?.toString() || "",
            longitude: mosque.longitude?.toString() || "",
            damage_level: mosque.damage_level,
            estimated_cost: mosque.estimated_cost?.toString() || "",
            is_reconstruction: mosque.is_reconstruction || false,
            status: mosque.status,
            description: (mosque as any).description || "",
            historical_period: (mosque as any).historical_period || "",
            architectural_style: (mosque as any).architectural_style || "",
            condition: (mosque as any).condition || "",
            last_restoration: (mosque as any).last_restoration || "",
          })
        }
      } catch (err) {
        setError("حدث خطأ في تحميل بيانات المسجد")
      } finally {
        setIsPageLoading(false)
      }
    }

    loadMosqueData()
  }, [mosqueId])

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
    setSuccess("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess("تم تحديث بيانات المسجد بنجاح!")

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/mosques")
      }, 1500)
    } catch (err) {
      setError("حدث خطأ أثناء تحديث المسجد. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen">
        <DashboardHeader title="تحديث المسجد" description="جاري تحميل بيانات المسجد..." />
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
      <DashboardHeader title="تحديث المسجد" description="تعديل وتحديث معلومات المسجد في قاعدة البيانات" />

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-600">
            <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
              لوحة التحكم
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/dashboard/mosques" className="hover:text-emerald-600 transition-colors">
              إدارة المساجد
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">تحديث المسجد</span>
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
                  <MapPin className="w-5 h-5" />
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">
                      اسم المسجد *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المسجد"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-slate-700 font-medium">
                      الحالة
                    </Label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    >
                      <option value="نشط">نشط</option>
                      <option value="موقوف">موقوف</option>
                      <option value="مكتمل">مكتمل</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700 font-medium">
                    الوصف
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="وصف مختصر عن المسجد وأهميته التاريخية"
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <MapPin className="w-5 h-5" />
                  معلومات الموقع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="governorate_id" className="text-slate-700 font-medium">
                      المحافظة *
                    </Label>
                    <select
                      id="governorate_id"
                      name="governorate_id"
                      value={formData.governorate_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
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
                  <div className="space-y-2">
                    <Label htmlFor="district_id" className="text-slate-700 font-medium">
                      المنطقة *
                    </Label>
                    <select
                      id="district_id"
                      name="district_id"
                      value={formData.district_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      required
                    >
                      <option value="">اختر المنطقة</option>
                      <option value="1">المدينة القديمة</option>
                      <option value="2">الميدان</option>
                      <option value="3">الصالحية</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_text" className="text-slate-700 font-medium">
                    العنوان التفصيلي
                  </Label>
                  <Textarea
                    id="address_text"
                    name="address_text"
                    value={formData.address_text}
                    onChange={handleInputChange}
                    placeholder="العنوان الكامل والتفصيلي للمسجد"
                    rows={2}
                    className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude" className="text-slate-700 font-medium">
                      خط العرض
                    </Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="33.5138"
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude" className="text-slate-700 font-medium">
                      خط الطول
                    </Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="36.2765"
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Damage and Cost Information */}
            <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <DollarSign className="w-5 h-5" />
                  معلومات الضرر والتكلفة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="damage_level" className="text-slate-700 font-medium">
                      مستوى الضرر *
                    </Label>
                    <select
                      id="damage_level"
                      name="damage_level"
                      value={formData.damage_level}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      required
                    >
                      <option value="جزئي">ضرر جزئي</option>
                      <option value="كامل">ضرر كامل</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated_cost" className="text-slate-700 font-medium">
                      التكلفة المقدرة (ل.س)
                    </Label>
                    <Input
                      id="estimated_cost"
                      name="estimated_cost"
                      type="number"
                      value={formData.estimated_cost}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="is_reconstruction"
                    name="is_reconstruction"
                    checked={formData.is_reconstruction}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 transition-all duration-200"
                  />
                  <Label htmlFor="is_reconstruction" className="text-slate-700 font-medium cursor-pointer">
                    يحتاج إعادة إعمار كاملة
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Historical Information */}
            {/* <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Calendar className="w-5 h-5" />
                  المعلومات التاريخية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="historical_period" className="text-slate-700 font-medium">
                      الفترة التاريخية
                    </Label>
                    <Input
                      id="historical_period"
                      name="historical_period"
                      value={formData.historical_period}
                      onChange={handleInputChange}
                      placeholder="العصر الأموي، العصر العثماني، إلخ"
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="architectural_style" className="text-slate-700 font-medium">
                      الطراز المعماري
                    </Label>
                    <Input
                      id="architectural_style"
                      name="architectural_style"
                      value={formData.architectural_style}
                      onChange={handleInputChange}
                      placeholder="أموي، عثماني، مملوكي، إلخ"
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition" className="text-slate-700 font-medium">
                      الحالة العامة
                    </Label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    >
                      <option value="">اختر الحالة</option>
                      <option value="ممتازة">ممتازة</option>
                      <option value="جيدة">جيدة</option>
                      <option value="متوسطة">متوسطة</option>
                      <option value="سيئة">سيئة</option>
                      <option value="متهدمة">متهدمة</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_restoration" className="text-slate-700 font-medium">
                      آخر ترميم
                    </Label>
                    <Input
                      id="last_restoration"
                      name="last_restoration"
                      type="date"
                      value={formData.last_restoration}
                      onChange={handleInputChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6">
              <Link href="/dashboard/mosques">
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
