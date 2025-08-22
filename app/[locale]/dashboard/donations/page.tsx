"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { getFullImageUrl } from "@/lib/data-transformers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function DonationsManagementPage() {
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [donations, setDonations] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    count: 0,
    avgDonation: 0,
    thisMonth: 0,
  });

  const fetchDonations = async () => {
    try {
      setLoading(true);
      let url = `${BASE_URL}/donations?page=${currentPage}`;

      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      if (paymentMethodFilter !== "all") {
        url += `&payment_method=${paymentMethodFilter}`;
      }
      if (dateFilter !== "all") {
        url += `&date_filter=${dateFilter}`;
      }
      const token = localStorage.getItem("authToken");
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setDonations(data.data);
      setTotalPages(data.meta.last_page);

      // Update stats
      const total = data.data.reduce(
        (sum: number, d: any) => sum + parseFloat(d.amount),
        0
      );
      setStats({
        total,
        count: data.meta.total,
        avgDonation: total / data.meta.total,
        thisMonth: data.data
          .filter(
            (d: any) =>
              new Date(d.created_at).getMonth() === new Date().getMonth()
          )
          .reduce((sum: number, d: any) => sum + parseFloat(d.amount), 0),
      });
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    donationId: number,
    action: "approve" | "reject"
  ) => {
    try {
      const response = await fetch(
        `${BASE_URL}/donations/${donationId}/${action}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data = await response.json();
      if (data.receipt_url) {
        window.open(data.receipt_url, "_blank");
      }

      toast.success(
        action === "approve" ? "تم قبول التبرع بنجاح" : "تم رفض التبرع"
      );
      fetchDonations(); // Refresh the list
    } catch (error) {
      console.error("Error updating donation status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة التبرع");
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [currentPage, searchTerm, paymentMethodFilter, dateFilter]);

  const paymentMethods = [
    {
      method: "كاش",
      count: donations.filter((d) => d.payment_method === "كاش").length,
    },
    {
      method: "حوالة",
      count: donations.filter((d) => d.payment_method === "حوالة").length,
    },
    {
      method: "بطاقة",
      count: donations.filter((d) => d.payment_method === "بطاقة").length,
    },
    {
      method: "كاش شام",
      count: donations.filter((d) => d.payment_method === "كاش شام").length,
    },
  ];

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
                  <p className="text-emerald-600 text-sm font-medium">
                    إجمالي التبرعات
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {formatCurrency(stats.total)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    عدد التبرعات
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.count}
                  </p>
                </div>
                <Receipt className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">
                    متوسط التبرع
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {formatCurrency(stats.avgDonation)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">
                    هذا الشهر
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {formatCurrency(stats.thisMonth)}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods Chart */}

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

                {/* <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع التواريخ</option>
                  <option value="today">اليوم</option>
                  <option value="week">هذا الأسبوع</option>
                  <option value="month">هذا الشهر</option>
                  <option value="year">هذا العام</option>
                </select> */}
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
            <CardTitle>قائمة التبرعات ({donations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم التبرع</TableHead>
                    <TableHead className="text-right">المتبرع</TableHead>
                    <TableHead className="text-right">المسجد</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">طريقة الدفع</TableHead>
                    <TableHead className="text-right">تاريخ التبرع</TableHead>
                    <TableHead className="text-right">الإيصال</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="font-semibold text-slate-900">
                          #{donation.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {donation.donor_name || "متبرع مجهول"}
                            </div>
                            {donation.user && (
                              <div className="text-sm text-slate-600">
                                {donation.user}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{donation.mosque}</div>
                        <div className="text-sm text-slate-600">
                          {donation.mosqueall?.name_ar}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-emerald-600 text-lg">
                          {formatCurrency(parseFloat(donation.amount))}
                        </div>
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
                        <div className="text-sm">
                          {formatDate(
                            donation.donated_at || donation.created_at
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {donation.receipt_url ? (
                          <Badge className="bg-emerald-100 text-emerald-800 cursor-pointer">
                            <a
                              href={
                                "https://back-aamar.academy-lead.com/" +
                                donation.receipt_url
                              }
                              target="_blank"
                            >
                              متوفر
                            </a>
                          </Badge>
                        ) : (
                          <Badge variant="outline">غير متوفر</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            donation.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : donation.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {donation.status === "pending"
                            ? "قيد المراجعة"
                            : donation.status === "approved"
                            ? "مقبول"
                            : "مرفوض"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {donation.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                                onClick={() =>
                                  handleStatusChange(donation.id, "approve")
                                }
                              >
                                قبول
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() =>
                                  handleStatusChange(donation.id, "reject")
                                }
                              >
                                رفض
                              </Button>
                            </>
                          )}
                          {/* <Link
                            href={`/dashboard/donations/${donation.id}/edit`}
                          >
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link> */}
                          {/* {donation.receipt_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(donation.receipt_url, "_blank")
                              }
                            >
                              <Receipt className="w-4 h-4" />
                            </Button>
                          )} */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {donations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">
                  لا توجد تبرعات تطابق معايير البحث
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  السابق
                </Button>
                <span className="mx-2 py-1">
                  الصفحة {currentPage} من {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  التالي
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
