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
import { Save, ArrowRight, MapPin, DollarSign, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import InteractiveMap from "@/components/ui/interactive-map"
import MediaUpload from "@/components/ui/media-upload"
import { MosqueService, LocationService, MosqueMediaService } from "@/lib/services/mosque-service"
import { Mosque, Governorate, District, SubDistrict, Neighborhood } from "@/lib/types"
import { toast } from "sonner"

export default function EditMosquePage() {
  const router = useRouter()
  const params = useParams()
  const mosqueId = parseInt(params.id as string)

  const [mosque, setMosque] = useState<Mosque | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // البيانات المرجعية
  const [governorates, setGovernorates] = useState<Governorate[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([])
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  
  // حالة التحميل للبيانات المرجعية
  const [loadingGovernorates, setLoadingGovernorates] = useState(true)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingSubDistricts, setLoadingSubDistricts] = useState(false)
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false)
  
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

  // تحميل البيانات عند تحميل الصفحة
  useEffect(() => {
    if (mosqueId) {
      loadMosque()
      loadGovernorates()
    }
  }, [mosqueId])

  // تحميل المناطق عند تغيير المحافظة
  useEffect(() => {
    if (formData.governorate_id) {
      loadDistricts(parseInt(formData.governorate_id))
    } else {
      setDistricts([])
    }
  }, [formData.governorate_id])

  // تحميل النواحي عند تغيير المنطقة
  useEffect(() => {
    if (formData.district_id) {
      loadSubDistricts(parseInt(formData.district_id))
    } else {
      setSubDistricts([])
    }
  }, [formData.district_id])

  // تحميل الأحياء عند تغيير الناحية
  useEffect(() => {
    if (formData.sub_district_id) {
      loadNeighborhoods(parseInt(formData.sub_district_id))
    } else {
      setNeighborhoods([])
    }
  }, [formData.sub_district_id])

  // تحميل بيانات المسجد
  const loadMosque = async () => {
    try {
      setIsPageLoading(true)
      const data = await MosqueService.getMosque(mosqueId)
      setMosque(data)
      
      // تعبئة النموذج
      setFormData({
        name_ar: data.name_ar,
        name_en: data.name_en,
        governorate_id: "", // سيتم تحديدها بعد تحميل المحافظات
        district_id: "",
        sub_district_id: "",
        neighborhood_id: "",
        address_text: data.address_text || "",
        latitude: data.latitude || "",
        longitude: data.longitude || "",
        damage_level: data.damage_level,
        estimated_cost: data.estimated_cost || "",
        is_reconstruction: data.is_reconstruction === 1,
        status: data.status,
      })
    } catch (err: any) {
      console.error('Error loading mosque:', err)
      setError('حدث خطأ في تحميل بيانات المسجد')
    } finally {
      setIsPageLoading(false)
    }
  }

  // تحميل المحافظات
  const loadGovernorates = async () => {
    try {
      setLoadingGovernorates(true)
      const data = await LocationService.getGovernorates()
      setGovernorates(data)
    } catch (error) {
      console.error('Error loading governorates:', error)
      toast.error('حدث خطأ في تحميل المحافظات')
    } finally {
      setLoadingGovernorates(false)
    }
  }

  // تحميل المناطق
  const loadDistricts = async (governorateId: number) => {
    try {
      setLoadingDistricts(true)
      const data = await LocationService.getDistricts(governorateId)
      setDistricts(data)
    } catch (error) {
      console.error('Error loading districts:', error)
      toast.error('حدث خطأ في تحميل المناطق')
    } finally {
      setLoadingDistricts(false)
    }
  }

  // تحميل النواحي
  const loadSubDistricts = async (districtId: number) => {
    try {
      setLoadingSubDistricts(true)
      const data = await LocationService.getSubDistricts(districtId)
      setSubDistricts(data)
    } catch (error) {
      console.error('Error loading sub-districts:', error)
      toast.error('حدث خطأ في تحميل النواحي')
    } finally {
      setLoadingSubDistricts(false)
    }
  }

  // تحميل الأحياء
  const loadNeighborhoods = async (subDistrictId: number) => {
    try {
      setLoadingNeighborhoods(true)
      const data = await LocationService.getNeighborhoods(subDistrictId)
      setNeighborhoods(data)
    } catch (error) {
      console.error('Error loading neighborhoods:', error)
      toast.error('حدث خطأ في تحميل الأحياء')
    } finally {
      setLoadingNeighborhoods(false)
    }
  }

  // البحث عن المحافظة والمنطقة والناحية الحالية وتحديد قيمها
  useEffect(() => {
    if (mosque && governorates.length > 0) {
      const governorate = governorates.find(g => g.name_ar === mosque.governorate_ar)
      if (governorate) {
        setFormData(prev => ({ ...prev, governorate_id: governorate.id.toString() }))
      }
    }
  }, [mosque, governorates])

  useEffect(() => {
    if (mosque && districts.length > 0) {
      const district = districts.find(d => d.name_ar === mosque.district_ar)
      if (district) {
        setFormData(prev => ({ ...prev, district_id: district.id.toString() }))
      }
    }
  }, [mosque, districts])

  useEffect(() => {
    if (mosque && subDistricts.length > 0) {
      const subDistrict = subDistricts.find(sd => sd.name_ar === mosque.sub_district_ar)
      if (subDistrict) {
        setFormData(prev => ({ ...prev, sub_district_id: subDistrict.id.toString() }))
      }
    }
  }, [mosque, subDistricts])

  useEffect(() => {
    if (mosque && neighborhoods.length > 0) {
      const neighborhood = neighborhoods.find(n => n.name_ar === mosque.neighborhood_ar)
      if (neighborhood) {
        setFormData(prev => ({ ...prev, neighborhood_id: neighborhood.id.toString() }))
      }
    }
  }, [mosque, neighborhoods])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

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

      // تحديث المسجد
      await MosqueService.updateMosque(mosqueId, {
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

      setSuccess("تم تحديث بيانات المسجد بنجاح!")
      toast.success('تم تحديث المسجد بنجاح')

      // Redirect after success
      setTimeout(() => {
        router.push(`/dashboard/mosques/${mosqueId}`)
      }, 1500)
    } catch (err: any) {
      console.error('Error updating mosque:', err)
      setError(err.message || "حدث خطأ أثناء تحديث المسجد. يرجى المحاولة مرة أخرى.")
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
        <div className="">
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
                    <Label htmlFor="name_ar" className="text-slate-700 font-medium">
                      اسم المسجد (عربي) *
                    </Label>
                    <Input
                      id="name_ar"
                      name="name_ar"
                      value={formData.name_ar}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المسجد باللغة العربية"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_en" className="text-slate-700 font-medium">
                      اسم المسجد (إنجليزي) *
                    </Label>
                    <Input
                      id="name_en"
                      name="name_en"
                      value={formData.name_en}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المسجد باللغة الإنجليزية"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
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
                      disabled={loadingGovernorates}
                    >
                      <option value="">
                        {loadingGovernorates ? "جاري التحميل..." : "اختر المحافظة"}
                      </option>
                      {governorates.map((gov) => (
                        <option key={gov.id} value={gov.id}>
                          {gov.name_ar}
                        </option>
                      ))}
                    </select>
                    {loadingGovernorates && (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600 mt-1" />
                    )}
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
                      disabled={!formData.governorate_id || loadingDistricts}
                    >
                      <option value="">
                        {!formData.governorate_id
                          ? "اختر المحافظة أولاً"
                          : loadingDistricts
                            ? "جاري التحميل..."
                            : "اختر المنطقة"}
                      </option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name_ar}
                        </option>
                      ))}
                    </select>
                    {loadingDistricts && (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600 mt-1" />
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sub_district_id" className="text-slate-700 font-medium">
                      الناحية *
                    </Label>
                    <select
                      id="sub_district_id"
                      name="sub_district_id"
                      value={formData.sub_district_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      required
                      disabled={!formData.district_id || loadingSubDistricts}
                    >
                      <option value="">
                        {!formData.district_id
                          ? "اختر المنطقة أولاً"
                          : loadingSubDistricts
                            ? "جاري التحميل..."
                            : "اختر الناحية"}
                      </option>
                      {subDistricts.map((subDistrict) => (
                        <option key={subDistrict.id} value={subDistrict.id}>
                          {subDistrict.name_ar}
                        </option>
                      ))}
                    </select>
                    {loadingSubDistricts && (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600 mt-1" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood_id" className="text-slate-700 font-medium">
                      الحي *
                    </Label>
                    <select
                      id="neighborhood_id"
                      name="neighborhood_id"
                      value={formData.neighborhood_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      required
                      disabled={!formData.sub_district_id || loadingNeighborhoods}
                    >
                      <option value="">
                        {!formData.sub_district_id
                          ? "اختر الناحية أولاً"
                          : loadingNeighborhoods
                            ? "جاري التحميل..."
                            : "اختر الحي"}
                      </option>
                      {neighborhoods.map((neighborhood) => (
                        <option key={neighborhood.id} value={neighborhood.id}>
                          {neighborhood.name_ar}
                        </option>
                      ))}
                    </select>
                    {loadingNeighborhoods && (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600 mt-1" />
                    )}
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

            {/* Media Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  إدارة وسائط المسجد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MediaUpload
                  mosqueId={mosqueId}
                  existingMedia={mosque?.media || []}
                  onMediaUpdate={async () => {
                    // إعادة تحميل بيانات المسجد بعد تحديث الوسائط
                    try {
                      const updatedMosque = await MosqueService.getMosque(mosqueId)
                      setMosque(updatedMosque)
                    } catch (error) {
                      console.error('Error refreshing mosque data:', error)
                    }
                  }}
                />
              </CardContent>
            </Card>

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
