"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, ArrowRight, MapPin, DollarSign, AlertCircle, Loader2, Check } from 'lucide-react'
import Link from "next/link"
import InteractiveMap from "@/components/ui/interactive-map"
import MediaUpload from "@/components/ui/media-upload"
import { GovernorateSelect, DistrictSelect, SubDistrictSelect, NeighborhoodSelect } from "@/components/ui/location-select"
import { StatusSelect, DamageSelect } from "@/components/ui/status-select"
import { MosqueService, LocationService, MosqueMediaService } from "@/lib/services/mosque-service"
import { Governorate, District, SubDistrict, Neighborhood } from "@/lib/types"
import { toast } from "sonner"

export default function NewMosquePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [savedMosque, setSavedMosque] = useState<any>(null)
  const [step, setStep] = useState<"form" | "media">("form")

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    governorate_id: "",
    district_id: "",
    sub_district_id: "",
    neighborhood_id: "",
    address_text: "",
    latitude: "",
    longitude: "",
    damage_level: "جزئي" as "جزئي" | "كامل",
    estimated_cost: "",
    is_reconstruction: false,
    status: "نشط" as "نشط" | "موقوف" | "مكتمل",
  })

  // وظيفة للتعامل مع تغيير قيم النموذج
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  // وظيفة للتعامل مع النقر على الخريطة لتحديد الإحداثيات
  const handleMapClick = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }))
    toast.success(`تم تحديد الموقع: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
  }

  // وظائف للتعامل مع تغيير المواقع
  const handleGovernorateChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      governorate_id: value,
      district_id: "",
      sub_district_id: "",
      neighborhood_id: ""
    }))
  }

  const handleDistrictChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      district_id: value,
      sub_district_id: "",
      neighborhood_id: ""
    }))
  }

  const handleSubDistrictChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      sub_district_id: value,
      neighborhood_id: ""
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // التحقق من صحة البيانات
      if (!formData.name_ar.trim()) {
        throw new Error("اسم المسجد باللغة العربية مطلوب")
      }
      if (!formData.name_en.trim()) {
        throw new Error("اسم المسجد باللغة الإنجليزية مطلوب")
      }
      if (!formData.governorate_id) {
        throw new Error("المحافظة مطلوبة")
      }
      if (!formData.district_id) {
        throw new Error("المنطقة مطلوبة")
      }
      if (!formData.sub_district_id) {
        throw new Error("الناحية مطلوبة")
      }
      if (!formData.neighborhood_id) {
        throw new Error("الحي مطلوب")
      }

      // إنشاء المسجد
      const mosque = await MosqueService.createMosque({
        name_ar: formData.name_ar.trim(),
        name_en: formData.name_en.trim(),
        governorate_id: parseInt(formData.governorate_id),
        district_id: parseInt(formData.district_id),
        sub_district_id: parseInt(formData.sub_district_id),
        neighborhood_id: parseInt(formData.neighborhood_id),
        address_text: formData.address_text.trim() || undefined,
        latitude: formData.latitude.trim() || undefined,
        longitude: formData.longitude.trim() || undefined,
        damage_level: formData.damage_level,
        estimated_cost: formData.estimated_cost.trim() || undefined,
        is_reconstruction: formData.is_reconstruction,
        status: formData.status,
      })

      setSavedMosque(mosque)
      setStep("media")
      toast.success('تم حفظ المسجد بنجاح! يمكنك الآن إضافة الصور')
    } catch (err: any) {
      console.error('Error creating mosque:', err)
      setError(err.message || "حدث خطأ أثناء إضافة المسجد. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <DashboardHeader
        title={step === "form" ? "إضافة مسجد جديد" : "إضافة وسائط المسجد"}
        description={step === "form" 
          ? "إضافة مسجد جديد إلى قاعدة البيانات مع جميع التفاصيل المطلوبة"
          : "قم بإضافة صور قبل وبعد الترميم لإظهار التقدم المحرز"
        }
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
            <span className="text-slate-900 font-medium">
              {step === "form" ? "إضافة مسجد جديد" : "إضافة وسائط"}
            </span>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {step === "form" ? (
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
                    <Label htmlFor="name_ar">اسم المسجد (عربي) *</Label>
                    <Input
                      id="name_ar"
                      name="name_ar"
                      value={formData.name_ar}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المسجد باللغة العربية"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name_en">اسم المسجد (إنجليزي) *</Label>
                    <Input
                      id="name_en"
                      name="name_en"
                      value={formData.name_en}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المسجد باللغة الإنجليزية"
                      required
                    />
                  </div>
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

                <div>
                  <Label htmlFor="address_text">العنوان التفصيلي</Label>
                  <Textarea
                    id="address_text"
                    name="address_text"
                    value={formData.address_text}
                    onChange={handleInputChange}
                    placeholder="العنوان الكامل والتفصيلي للمسجد"
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
                  <div className="space-y-2">
                    <Label htmlFor="governorate_id">المحافظة *</Label>
                    <GovernorateSelect
                      value={formData.governorate_id}
                      onValueChange={handleGovernorateChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district_id">المنطقة *</Label>
                    <DistrictSelect
                      value={formData.district_id}
                      onValueChange={handleDistrictChange}
                      parentId={formData.governorate_id ? parseInt(formData.governorate_id) : undefined}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sub_district_id">الناحية *</Label>
                    <SubDistrictSelect
                      value={formData.sub_district_id}
                      onValueChange={handleSubDistrictChange}
                      parentId={formData.district_id ? parseInt(formData.district_id) : undefined}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood_id">الحي *</Label>
                    <NeighborhoodSelect
                      value={formData.neighborhood_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, neighborhood_id: value }))}
                      parentId={formData.sub_district_id ? parseInt(formData.sub_district_id) : undefined}
                      required
                    />
                  </div>
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

                {/* الخريطة التفاعلية لتحديد الموقع */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    تحديد الموقع على الخريطة
                  </Label>
                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <InteractiveMap
                      center={
                        formData.latitude && formData.longitude
                          ? [parseFloat(formData.latitude), parseFloat(formData.longitude)]
                          : [33.5138, 36.2765] // Damascus default
                      }
                      zoom={13}
                      className="w-full h-96"
                      interactive={true}
                      onLocationSelect={handleMapClick}
                      selectedLocation={
                        formData.latitude && formData.longitude
                          ? [parseFloat(formData.latitude), parseFloat(formData.longitude)]
                          : null
                      }
                      showCurrentMarker={false}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    💡 انقر على الخريطة لتحديد موقع المسجد وسيتم تحديث الإحداثيات تلقائياً
                  </p>
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
                  <div className="space-y-2">
                    <Label htmlFor="damage_level">مستوى الضرر *</Label>
                    <DamageSelect
                      value={formData.damage_level}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, damage_level: value as "جزئي" | "كامل" }))}
                      placeholder="اختر مستوى الضرر"
                    />
                  </div>
                  <div className="space-y-2">
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

                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <StatusSelect
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as "نشط" | "موقوف" | "مكتمل" }))}
                    placeholder="اختر حالة المسجد"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Link href="/dashboard/mosques">
                <Button type="button" variant="outline" disabled={isLoading}>
                  إلغاء
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
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
          ) : (
            <div className="space-y-6">
              {/* معلومات المسجد المحفوظ */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-900">
                        تم حفظ المسجد بنجاح!
                      </h3>
                      <p className="text-sm text-green-700">
                        {savedMosque?.name_ar} - يمكنك الآن إضافة الصور
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* مكون رفع الوسائط */}
              <MediaUpload
                mosqueId={savedMosque?.id}
                onMediaUpdate={() => {
                  // يمكن إضافة منطق تحديث هنا إذا لزم الأمر
                }}
              />

              {/* أزرار التحكم */}
              <div className="flex gap-4 justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep("form")}
                >
                  العودة للنموذج
                </Button>
                
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/mosques/${savedMosque?.id}`)}
                  >
                    عرض المسجد
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard/mosques")}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    إنهاء والعودة للقائمة
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
