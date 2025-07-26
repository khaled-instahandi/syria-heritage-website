"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  DollarSign,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  CreditCard,
  User,
  Receipt,
} from "lucide-react"
import { mockDonations, mockProjects, getMosqueById } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function DonationsManagementPage() {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  const filteredDonations = mockDonations.filter((donation) => {
    const matchesSearch =
      searchTerm === "" ||
      donation.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.id.toString().includes(searchTerm)
    const matchesPayment = paymentMethodFilter === "all" || donation.payment_method === paymentMethodFilter

    return matchesSearch && matchesPayment
  })

  const donationStats = {
    total: mockDonations.reduce((sum, d) => sum + d.amount, 0),
    count: mockDonations.length,
    avgDonation: mockDonations.reduce((sum, d) => sum + d.amount, 0) / mockDonations.length,
    thisMonth: mockDonations
      .filter((d) => new Date(d.created_at).getMonth() === new Date().getMonth())
      .reduce((sum, d) => sum + d.amount, 0),
  }

  const paymentMethods = [
    { method: "كاش", count: mockDonations.filter((d) => d.payment_method === "كاش").length },
    { method: "حوالة", count: mockDonations.filter((d) => d.payment_method === "حوالة").length },
    { method: "بطاقة", count: mockDonations.filter((d) => d.payment_method === "بطاقة").length },
    { method: "كاش شام", count: mockDonations.filter((d) => d.payment_method === "كاش شام").length },
  ]

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={t("dashboard.donationsManagement")}
        description="إدارة ومتابعة جميع التبرعات والمساهمات"
      />

      <div className="p-6 space-y-6">
        {/* Donation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">إجمالي التبرعات</p>
                  <p className="text-3xl font-bold text-slate-900">{formatCurrency(donationStats.total)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">عدد التبرعات</p>
                  <p className="text-3xl font-bold text-slate-900">{donationStats.count}</p>
                </div>
                <Receipt className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">متوسط التبرع</p>
                  <p className="text-3xl font-bold text-slate-900">{formatCurrency(donationStats.avgDonation)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">هذا الشهر</p>
                  <p className="text-3xl font-bold text-slate-900">{formatCurrency(donationStats.thisMonth)}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods Chart */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>طرق الدفع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method, index) => {
                  const percentage = (method.count / mockDonations.length) * 100
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                        <span className="font-medium">{method.method}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600 w-12">{method.count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/donations/new">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 ml-2" />
                  تسجيل تبرع جديد
                </Button>
              </Link>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 ml-2" />
                تصدير التبرعات
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Receipt className="w-4 h-4 ml-2" />
                إنشاء إيصال
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="البحث في التبرعات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <select
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع طرق الدفع</option>
                  <option value="كاش">كاش</option>
                  <option value="حوالة">حوالة</option>
                  <option value="بطاقة">بطاقة</option>
                  <option value="كاش شام">كاش شام</option>
                  <option value="أخرى">أخرى</option>
                </select>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع التواريخ</option>
                  <option value="today">اليوم</option>
                  <option value="week">هذا الأسبوع</option>
                  <option value="month">هذا الشهر</option>
                  <option value="year">هذا العام</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 ml-2" />
                  فلاتر متقدمة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donations Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة التبرعات ({filteredDonations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم التبرع</TableHead>
                    <TableHead className="text-right">المتبرع</TableHead>
                    <TableHead className="text-right">المشروع</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">طريقة الدفع</TableHead>
                    <TableHead className="text-right">تاريخ التبرع</TableHead>
                    <TableHead className="text-right">الإيصال</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations.map((donation) => {
                    const project = mockProjects.find((p) => p.id === donation.project_id)
                    const mosque = project ? getMosqueById(project.mosque_id) : null

                    return (
                      <TableRow key={donation.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="font-semibold text-slate-900">#{donation.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium">{donation.donor_name || "متبرع مجهول"}</div>
                              {donation.user_id && <div className="text-sm text-slate-600">ID: {donation.user_id}</div>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{mosque?.name || "غير محدد"}</div>
                          <div className="text-sm text-slate-600">مشروع #{project?.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-emerald-600 text-lg">{formatCurrency(donation.amount)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              donation.payment_method === "بطاقة"
                                ? "bg-blue-100 text-blue-800"
                                : donation.payment_method === "حوالة"
                                  ? "bg-purple-100 text-purple-800"
                                  : donation.payment_method === "كاش شام"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            <CreditCard className="w-3 h-3 ml-1" />
                            {donation.payment_method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(donation.donated_at || donation.created_at)}</div>
                        </TableCell>
                        <TableCell>
                          {donation.receipt_url ? (
                            <Badge className="bg-emerald-100 text-emerald-800">متوفر</Badge>
                          ) : (
                            <Badge variant="outline">غير متوفر</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/donations/${donation.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/dashboard/donations/${donation.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm">
                              <Receipt className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredDonations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">لا توجد تبرعات تطابق معايير البحث</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
