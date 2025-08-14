"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Heart, Calendar, User, DollarSign, Target } from "lucide-react"
import {
  mockProjects,
  getMosqueById,
  getGovernorateById,
  getDonationsByProjectId,
  getMainImageForMosque,
} from "@/lib/mock-data"
import { formatCurrency, formatDate, calculateProgress } from "@/lib/utils"

export default function ProjectDetailPage() {
  const t = useTranslations()
  const params = useParams()
  const projectId = Number.parseInt(params.id as string)

  const project = mockProjects.find((p) => p.id === projectId)
  const mosque = project ? getMosqueById(project.mosque_id) : null
  const governorate = mosque ? getGovernorateById(mosque.governorate_id) : null
  const donations = project ? getDonationsByProjectId(project.id) : []
  const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0)
  const progress = project?.total_cost ? calculateProgress(totalRaised, project.total_cost) : 0
  const mainImage = mosque ? getMainImageForMosque(mosque.id) : "/placeholder.svg?height=400&width=600"

  if (!project || !mosque) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">المشروع غير موجود</h1>
          <p className="text-slate-600">لم يتم العثور على المشروع المطلوب</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-96">
            <Image src={project.image_url || "/placeholder.svg"} alt={mosque.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex gap-3 mb-4">
                <Badge
                  className={`${project.project_category === "إعادة إعمار" ? "bg-emerald-600" : "bg-blue-600"} text-white`}
                >
                  {t(
                    `projects.category.${project.project_category === "إعادة إعمار" ? "reconstruction" : "restoration"}`,
                  )}
                </Badge>
                <Badge variant="secondary" className="bg-white/90 text-slate-700">
                  {t(
                    `projects.status.${project.status === "قيد الدراسة" ? "study" : project.status === "قيد التنفيذ" ? "progress" : "completed"}`,
                  )}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-2">{mosque.name}</h1>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{governorate?.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">تفاصيل المشروع</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">نوع المشروع</p>
                      <p className="font-semibold">{project.project_category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">التكلفة الإجمالية</p>
                      <p className="font-semibold">
                        {project.total_cost ? formatCurrency(project.total_cost) : "غير محدد"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600"> تاريخ البناء</p>
                      <p className="font-semibold">{formatDate(project.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">مستوى الضرر</p>
                      <p className="font-semibold">{mosque.damage_level}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">وصف المشروع</h3>
                  <p className="text-slate-600 leading-relaxed">
                    يهدف هذا المشروع إلى {project.project_category === "إعادة إعمار" ? "إعادة بناء" : "ترميم"}{" "}
                    {mosque.name}
                    الواقع في {governorate?.name}. يشمل المشروع أعمال{" "}
                    {project.project_category === "إعادة إعمار" ? "البناء الكامل" : "الترميم والصيانة"}
                    للمسجد وتجهيزه بالمرافق اللازمة لاستقبال المصلين.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Donations */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">آخر التبرعات</h2>
                <div className="space-y-4">
                  {donations.slice(0, 5).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{donation.donor_name || "متبرع مجهول"}</p>
                        <p className="text-sm text-slate-600">
                          {formatDate(donation.donated_at || donation.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{formatCurrency(donation.amount)}</p>
                        <p className="text-sm text-slate-600">{donation.payment_method}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">تقدم المشروع</h3>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">النسبة المحققة</span>
                    <span className="text-sm font-semibold text-emerald-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3 bg-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </Progress>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-600">المبلغ التم جمع</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(totalRaised)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">الهدف المطلوب</span>
                    <span className="font-bold">
                      {project.total_cost ? formatCurrency(project.total_cost) : "غير محدد"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">المتبقي</span>
                    <span className="font-bold text-slate-900">
                      {project.total_cost ? formatCurrency(project.total_cost - totalRaised) : "غير محدد"}
                    </span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Heart className="w-5 h-5 ml-2" />
                  {t("projects.donate")}
                </Button>
              </CardContent>
            </Card>

            {/* Mosque Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">معلومات المسجد</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">الموقع</p>
                    <p className="font-semibold">{mosque.address_text || "غير محدد"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">مستوى الضرر</p>
                    <Badge variant={mosque.damage_level === "كامل" ? "destructive" : "secondary"}>
                      {mosque.damage_level}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">التكلفة المقدرة</p>
                    <p className="font-semibold">
                      {mosque.estimated_cost ? formatCurrency(mosque.estimated_cost) : "غير محدد"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">حالة المسجد</p>
                    <Badge variant="outline">{mosque.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
