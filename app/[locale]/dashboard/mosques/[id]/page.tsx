"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowRight,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react'
import Link from "next/link"
import MediaGallery from "@/components/ui/media-gallery"
import { MosqueService } from "@/lib/services/mosque-service"
import { Mosque } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { DeleteDialog } from "@/components/ui/delete-dialog"
import { getFullImageUrl } from "@/lib/data-transformers"

export default function MosqueDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const mosqueId = parseInt(params.id as string)

  const [mosque, setMosque] = useState<Mosque | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const [deleteDialog, setDeleteDialog] = useState(false)

  useEffect(() => {
    if (mosqueId) {
      loadMosque()
    }
  }, [mosqueId])

  const loadMosque = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await MosqueService.getMosque(mosqueId)
      setMosque(data)
    } catch (err: any) {
      console.error('Error loading mosque:', err)
      setError('حدث خطأ في تحميل بيانات المسجد')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await MosqueService.deleteMosque(mosqueId)
      toast.success('تم حذف المسجد بنجاح')
      router.push('/dashboard/mosques')
    } catch (err: any) {
      console.error('Error deleting mosque:', err)
      toast.error('حدث خطأ في حذف المسجد')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <DashboardHeader
          title="تفاصيل المسجد"
          description="عرض تفاصيل وبيانات المسجد"
        />
        <div className="p-6 flex justify-center items-center">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span>جاري تحميل بيانات المسجد...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <DashboardHeader
          title="تفاصيل المسجد"
          description="عرض تفاصيل وبيانات المسجد"
        />
        <div className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link href="/dashboard/mosques">
              <Button variant="outline">
                <ArrowRight className="w-4 h-4 ml-2" />
                العودة إلى قائمة المساجد
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!mosque) {
    return (
      <div className="min-h-screen">
        <DashboardHeader
          title="تفاصيل المسجد"
          description="عرض تفاصيل وبيانات المسجد"
        />
        <div className="p-6">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">المسجد غير موجود</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link href="/dashboard/mosques">
              <Button variant="outline">
                <ArrowRight className="w-4 h-4 ml-2" />
                العودة إلى قائمة المساجد
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getMainImage = () => {
    const mainImage = mosque.media?.find(media => media.is_main && media.type === 'image')
    const fullImageUrl = getFullImageUrl(mainImage?.file_url || '')
    return fullImageUrl
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={`تفاصيل المسجد: ${mosque.name_ar}`}
        description="عرض تفاصيل وبيانات المسجد"
      />

      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/dashboard" className="hover:text-emerald-600">
            لوحة التحكم
          </Link>
          <ArrowRight className="w-4 h-4" />
          <Link href="/dashboard/mosques" className="hover:text-emerald-600">
            إدارة المساجد
          </Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">{mosque.name_ar}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Link href={`/dashboard/mosques/${mosque.id}/edit`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Edit className="w-4 h-4 ml-2" />
              تحرير المسجد
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            حذف المسجد
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
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
                    <label className="text-sm font-medium text-slate-600">الاسم بالعربية</label>
                    <p className="text-lg font-semibold text-slate-900">{mosque.name_ar}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">الاسم بالإنجليزية</label>
                    <p className="text-lg font-semibold text-slate-900">{mosque.name_en}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">الحالة</label>
                  <div className="mt-1">
                    <Badge
                      className={`${mosque.status === "مفعل"
                          ? "bg-emerald-100 text-emerald-800"
                          : mosque.status === "مكتمل"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      {mosque.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">العنوان التفصيلي</label>
                  <p className="text-slate-900 mt-1 leading-relaxed">
                    {mosque.address_text || "غير محدد"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
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
                    <label className="text-sm font-medium text-slate-600">المحافظة</label>
                    <p className="text-slate-900 font-medium">{mosque.governorate_ar}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">المنطقة</label>
                    <p className="text-slate-900 font-medium">{mosque.district_ar}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">الناحية</label>
                    <p className="text-slate-900">{mosque.sub_district_ar}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">الحي</label>
                    <p className="text-slate-900">{mosque.neighborhood_ar}</p>
                  </div>
                </div>

                {(mosque.latitude && mosque.longitude) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">خط العرض</label>
                      <p className="text-slate-900 font-mono">{mosque.latitude}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">خط الطول</label>
                      <p className="text-slate-900 font-mono">{mosque.longitude}</p>
                    </div>
                  </div>
                )}

                {(mosque.latitude && mosque.longitude) && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = `https://www.google.com/maps?q=${mosque.latitude},${mosque.longitude}`
                        window.open(url, '_blank')
                      }}
                    >
                      <ExternalLink className="w-4 h-4 ml-2" />
                      عرض على الخريطة
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Damage & Cost Info */}
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
                    <label className="text-sm font-medium text-slate-600">مستوى الضرر</label>
                    <div className="mt-1">
                      <Badge variant={mosque.damage_level === "كامل" ? "destructive" : "secondary"}>
                        {mosque.damage_level}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">نوع العمل</label>
                    <div className="mt-1">
                      <Badge variant="outline" className={mosque.is_reconstruction ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}>
                        {mosque.is_reconstruction ? "إعادة إعمار" : "ترميم"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {mosque.estimated_cost && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">التكلفة المقدرة</label>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">
                      {formatCurrency(parseFloat(mosque.estimated_cost))}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Main Image */}
            {getMainImage() && (
              <Card>
                <CardHeader>
                  <CardTitle>الصورة الرئيسية</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={getMainImage()}
                    alt={mosque.name_ar}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Media Gallery */}
            {mosque.media && mosque.media.length > 0 && (
              <MediaGallery media={mosque.media} />
            )}

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  معلومات إضافية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">رقم المسجد</label>
                  <p className="text-slate-900 font-mono">#{mosque.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">تاريخ الإضافة</label>
                  <p className="text-slate-900">{formatDate(mosque.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">أضيف بواسطة</label>
                  <p className="text-slate-900">{mosque.created_by}</p>
                </div>
                {mosque.media && mosque.media.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">عدد الصور</label>
                    <p className="text-slate-900">{mosque.media.length} صورة</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/dashboard/mosques/${mosque.id}/projects`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 ml-2" />
                    عرض المشاريع
                  </Button>
                </Link>
                <Link href={`/dashboard/mosques/${mosque.id}/media`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 ml-2" />
                    إدارة الصور
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="حذف المسجد"
        description="هل أنت متأكد من رغبتك في حذف هذا المسجد؟ سيتم حذف جميع المشاريع والبيانات المرتبطة به نهائياً."
        itemName={mosque.name_ar}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  )
}
