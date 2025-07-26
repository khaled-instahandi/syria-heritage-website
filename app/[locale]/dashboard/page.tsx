"use client"

import { useTranslations } from "next-intl"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2 as Mosque,
  DollarSign,
  TrendingUp,
  FileText,
  Upload,
  BarChart3,
  Plus,
  Eye,
  Edit,
  Calendar,
  MapPin,
  User,
} from "lucide-react"
import {
  getStatistics,
  mockProjects,
  mockDonations,
  mockMosques,
  getMosqueById,
  getGovernorateById,
} from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function DashboardPage() {
  const t = useTranslations()
  const stats = getStatistics()

  const recentProjects = mockProjects.slice(0, 5)
  const recentDonations = mockDonations.slice(0, 5)
  const recentMosques = mockMosques.slice(0, 3)

  const quickActions = [
    {
      title: "إضافة مسجد جديد",
      description: "تسجيل مسجد جديد في النظام",
      icon: Plus,
      href: "/dashboard/mosques/new",
      color: "bg-emerald-500",
    },
    {
      title: "رفع ملف Excel",
      description: "استيراد بيانات مساجد جديدة",
      icon: Upload,
      href: "/dashboard/import",
      color: "bg-blue-500",
    },
    {
      title: "إنشاء تقرير",
      description: "إنشاء تقرير مفصل",
      icon: BarChart3,
      href: "/dashboard/reports",
      color: "bg-purple-500",
    },
    {
      title: "إدارة التبرعات",
      description: "تسجيل ومتابعة التبرعات",
      icon: DollarSign,
      href: "/dashboard/donations",
      color: "bg-amber-500",
    },
  ]

  return (
    <div className="min-h-screen">
      <DashboardHeader title={t("dashboard.title")} description={t("dashboard.welcome")} />

      <div className="p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="إجمالي المساجد"
            value={stats.totalMosques}
            change={{ value: "+12%", type: "increase" }}
            icon={Mosque}
            color="from-emerald-500 to-emerald-600"
            bgColor="bg-emerald-50"
            description="مسجد مسجل في النظام"
          />
          <StatsCard
            title="إجمالي التبرعات"
            value={formatCurrency(stats.totalDonations).replace("US$", "$")}
            change={{ value: "+8%", type: "increase" }}
            icon={DollarSign}
            color="from-blue-500 to-blue-600"
            bgColor="bg-blue-50"
            description="تم جمعها من المتبرعين"
          />
          <StatsCard
            title="مساجد مكتملة"
            value={stats.completedMosques}
            change={{ value: "+25%", type: "increase" }}
            icon={TrendingUp}
            color="from-amber-500 to-amber-600"
            bgColor="bg-amber-50"
            description="مسجد تم إعادة إعماره"
          />
          <StatsCard
            title="مشاريع نشطة"
            value={stats.activeProjects}
            change={{ value: "-3%", type: "decrease" }}
            icon={FileText}
            color="from-purple-500 to-purple-600"
            bgColor="bg-purple-50"
            description="مشروع قيد التنفيذ"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t("dashboard.quickActions")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{action.title}</h3>
                    <p className="text-slate-600 text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>آخر المشاريع</CardTitle>
              <Link href="/dashboard/projects">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 ml-2" />
                  {t("dashboard.viewAll")}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => {
                  const mosque = getMosqueById(project.mosque_id)
                  const governorate = mosque ? getGovernorateById(mosque.governorate_id) : null

                  return (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{mosque?.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <MapPin className="w-3 h-3" />
                            {governorate?.name}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar className="w-3 h-3" />
                            {formatDate(project.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${
                            project.status === "مكتمل"
                              ? "bg-emerald-100 text-emerald-800"
                              : project.status === "قيد التنفيذ"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {project.status}
                        </Badge>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>آخر التبرعات</CardTitle>
              <Link href="/dashboard/donations">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 ml-2" />
                  {t("dashboard.viewAll")}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{donation.donor_name || "متبرع مجهول"}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span>{donation.payment_method}</span>
                          <span>•</span>
                          <span>{formatDate(donation.donated_at || donation.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-emerald-600">{formatCurrency(donation.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Mosques */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>آخر المساجد المضافة</CardTitle>
            <Link href="/dashboard/mosques">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 ml-2" />
                {t("dashboard.manageAll")}
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {recentMosques.map((mosque) => {
                const governorate = getGovernorateById(mosque.governorate_id)

                return (
                  <div
                    key={mosque.id}
                    className="group p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Mosque className="w-6 h-6 text-emerald-600" />
                      </div>
                      <Badge variant={mosque.damage_level === "كامل" ? "destructive" : "secondary"} className="text-xs">
                        {mosque.damage_level}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">{mosque.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      {governorate?.name}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        {mosque.estimated_cost ? formatCurrency(mosque.estimated_cost) : "غير محدد"}
                      </span>
                      <Link href={`/dashboard/mosques/${mosque.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
