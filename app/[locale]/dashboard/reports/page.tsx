"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  FileText,
  DollarSign,
  Building,
  MapPin,
  Target,
} from "lucide-react"
import { getStatistics, mockProjects, mockDonations } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"

export default function ReportsPage() {
  const t = useTranslations()
  const [dateRange, setDateRange] = useState("month")
  const [reportType, setReportType] = useState("overview")

  const stats = getStatistics()

  // Mock chart data
  const monthlyDonations = [
    { month: "يناير", amount: 45000 },
    { month: "فبراير", amount: 52000 },
    { month: "مارس", amount: 48000 },
    { month: "أبريل", amount: 61000 },
    { month: "مايو", amount: 55000 },
    { month: "يونيو", amount: 67000 },
  ]

  const projectsByStatus = [
    { status: "مكتمل", count: mockProjects.filter((p) => p.status === "مكتمل").length, color: "bg-emerald-500" },
    {
      status: "قيد التنفيذ",
      count: mockProjects.filter((p) => p.status === "قيد التنفيذ").length,
      color: "bg-blue-500",
    },
    {
      status: "قيد الدراسة",
      count: mockProjects.filter((p) => p.status === "قيد الدراسة").length,
      color: "bg-amber-500",
    },
  ]

  const donationsByMethod = [
    { method: "حوالة", count: mockDonations.filter((d) => d.payment_method === "حوالة").length },
    { method: "بطاقة", count: mockDonations.filter((d) => d.payment_method === "بطاقة").length },
    { method: "كاش", count: mockDonations.filter((d) => d.payment_method === "كاش").length },
    { method: "كاش شام", count: mockDonations.filter((d) => d.payment_method === "كاش شام").length },
  ]

  const reportTemplates = [
    {
      title: "تقرير المشاريع الشامل",
      description: "تقرير مفصل عن جميع المشاريع وحالتها",
      icon: Building,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "تقرير التبرعات المالي",
      description: "تحليل مالي شامل للتبرعات والمساهمات",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "تقرير المساجد الجغرافي",
      description: "توزيع المساجد حسب المحافظات والمناطق",
      icon: MapPin,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "تقرير ا��أداء الشهري",
      description: "تقرير شهري عن الإنجازات والتقدم",
      icon: TrendingUp,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
    },
  ]

  return (
    <div className="min-h-screen">
      <DashboardHeader title={t("dashboard.reports")} description="تقارير وإحصائيات شاملة عن الحملة" />

      <div className="p-6 space-y-6">
        {/* Report Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="overview">نظرة عامة</option>
                  <option value="projects">تقرير المشاريع</option>
                  <option value="donations">تقرير التبرعات</option>
                  <option value="mosques">تقرير المساجد</option>
                  <option value="financial">التقرير المالي</option>
                </select>

                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="week">هذا الأسبوع</option>
                  <option value="month">هذا الشهر</option>
                  <option value="quarter">هذا الربع</option>
                  <option value="year">هذا العام</option>
                  <option value="custom">فترة مخصصة</option>
                </select>

                <div className="flex gap-2">
                  <Input type="date" className="w-40" />
                  <Input type="date" className="w-40" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 ml-2" />
                  فلاتر متقدمة
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Download className="w-4 h-4 ml-2" />
                  تصدير التقرير
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">إجمالي المساجد</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalMosques}</p>
                  <p className="text-emerald-600 text-sm mt-1">+12% من الشهر الماضي</p>
                </div>
                <Building className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">إجمالي التبرعات</p>
                  <p className="text-3xl font-bold text-slate-900">{formatCurrency(stats.totalDonations)}</p>
                  <p className="text-blue-600 text-sm mt-1">+8% من الشهر الماضي</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">مشاريع مكتملة</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.completedMosques}</p>
                  <p className="text-amber-600 text-sm mt-1">+25% من الشهر الماضي</p>
                </div>
                <Target className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">مشاريع مفعلة</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.activeProjects}</p>
                  <p className="text-purple-600 text-sm mt-1">-3% من الشهر الماضي</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Donations Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                التبرعات الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyDonations.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{item.month}</span>
                    <div className="flex items-center gap-3 flex-1 mx-4">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(item.amount / 70000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 w-20 text-left">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects by Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                المشاريع حسب الحالة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectsByStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 ${item.color} rounded-full`}></div>
                      <span className="font-medium">{item.status}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${(item.count / mockProjects.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donations by Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>التبرعات حسب طريقة الدفع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {donationsByMethod.map((method, index) => (
                <div key={index} className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{method.count}</div>
                  <div className="text-sm text-slate-600">{method.method}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {((method.count / mockDonations.length) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>قوالب التقارير</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reportTemplates.map((template, index) => (
                <Card
                  key={index}
                  className={`group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-0 ${template.bgColor}`}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${template.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <template.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{template.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{template.description}</p>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <FileText className="w-4 h-4 ml-2" />
                      إنشاء التقرير
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>التقارير الأخيرة</CardTitle>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 ml-2" />
              عرض الكل
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "تقرير المشاريع - يناير 2024",
                  type: "مشاريع",
                  date: "2024-01-15",
                  size: "2.4 MB",
                  status: "مكتمل",
                },
                {
                  title: "تقرير التبرعات - ديسمبر 2023",
                  type: "تبرعات",
                  date: "2024-01-01",
                  size: "1.8 MB",
                  status: "مكتمل",
                },
                {
                  title: "التقرير المالي الربعي",
                  type: "مالي",
                  date: "2023-12-31",
                  size: "3.2 MB",
                  status: "مكتمل",
                },
              ].map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{report.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <Badge variant="outline" className="text-xs">
                          {report.type}
                        </Badge>
                        <span>{report.date}</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-800">{report.status}</Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
