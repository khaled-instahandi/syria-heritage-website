"use client"

import type React from "react"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  AlertTriangle,
  FileText,
  Database,
} from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function ImportPage() {
  const t = useTranslations()
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Mock import batches data
  const importBatches = [
    {
      id: 1,
      fileName: "mosques_damascus_2024.xlsx",
      status: "مكتملة",
      uploadedBy: "أحمد محمد",
      recordsCount: 45,
      successCount: 43,
      errorCount: 2,
      createdAt: "2024-01-15T10:30:00Z",
      note: "تم استيراد مساجد دمشق بنجاح",
    },
    {
      id: 2,
      fileName: "mosques_aleppo_2024.xlsx",
      status: "جارٍ المراجعة",
      uploadedBy: "فاطمة أحمد",
      recordsCount: 67,
      successCount: 0,
      errorCount: 0,
      createdAt: "2024-01-14T14:20:00Z",
      note: null,
    },
    {
      id: 3,
      fileName: "mosques_homs_2024.xlsx",
      status: "مرفوضة",
      uploadedBy: "محمد علي",
      recordsCount: 23,
      successCount: 0,
      errorCount: 23,
      createdAt: "2024-01-13T09:15:00Z",
      note: "أخطاء في تنسيق البيانات",
    },
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مكتملة":
        return <Badge className="bg-emerald-100 text-emerald-800">مكتملة</Badge>
      case "جارٍ المراجعة":
        return <Badge className="bg-amber-100 text-amber-800">جارٍ المراجعة</Badge>
      case "مرفوضة":
        return <Badge className="bg-red-100 text-red-800">مرفوضة</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "مكتملة":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case "جارٍ المراجعة":
        return <Clock className="w-5 h-5 text-amber-600" />
      case "مرفوضة":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <FileText className="w-5 h-5 text-slate-600" />
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={t("dashboard.importBatches")}
        description="استيراد بيانات المساجد من ملفات Excel وإدارة دفعات الاستيراد"
      />

      <div className="p-6 space-y-6">
        {/* Upload Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                رفع ملف جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-emerald-600 animate-bounce" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900 mb-2">جاري الرفع...</p>
                      <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                      <p className="text-sm text-slate-600 mt-2">{uploadProgress}% مكتمل</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                      <FileSpreadsheet className="w-8 h-8 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900 mb-2">
                        اسحب وأفلت ملف Excel هنا أو انقر للاختيار
                      </p>
                      <p className="text-slate-600 mb-4">يدعم ملفات .xlsx و .xls فقط</p>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
                          <Upload className="w-4 h-4 ml-2" />
                          اختيار ملف
                        </Button>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Guidelines */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  إرشادات الرفع
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• تأكد من أن الملف يحتوي على الأعمدة المطلوبة</li>
                  <li>• الحد الأقصى لحجم الملف: 10 ميجابايت</li>
                  <li>• يجب أن تكون البيانات باللغة العربية</li>
                  <li>• تحقق من صحة البيانات قبل الرفع</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الاستيراد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">مكتملة</span>
                </div>
                <span className="font-bold text-emerald-600">
                  {importBatches.filter((b) => b.status === "مكتملة").length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="font-medium">قيد المراجعة</span>
                </div>
                <span className="font-bold text-amber-600">
                  {importBatches.filter((b) => b.status === "جارٍ المراجعة").length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium">مرفوضة</span>
                </div>
                <span className="font-bold text-red-600">
                  {importBatches.filter((b) => b.status === "مرفوضة").length}
                </span>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">إجمالي السجلات</span>
                  <span className="font-bold text-slate-900">
                    {importBatches.reduce((sum, b) => sum + b.recordsCount, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Import History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>سجل الاستيراد</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 ml-2" />
                تحميل القالب
              </Button>
              <Button variant="outline" size="sm">
                <Database className="w-4 h-4 ml-2" />
                تصدير البيانات
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الملف</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">السجلات</TableHead>
                    <TableHead className="text-right">النجح/الفشل</TableHead>
                    <TableHead className="text-right">رفع بواسطة</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الملاحظات</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importBatches.map((batch) => (
                    <TableRow key={batch.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getStatusIcon(batch.status)}
                          <div>
                            <div className="font-medium text-slate-900">{batch.fileName}</div>
                            <div className="text-sm text-slate-600">ID: {batch.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(batch.status)}</TableCell>
                      <TableCell>
                        <span className="font-semibold">{batch.recordsCount}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {batch.successCount > 0 && (
                            <Badge className="bg-emerald-100 text-emerald-800 text-xs">✓ {batch.successCount}</Badge>
                          )}
                          {batch.errorCount > 0 && (
                            <Badge className="bg-red-100 text-red-800 text-xs">✗ {batch.errorCount}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{batch.uploadedBy}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(batch.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600 max-w-xs truncate">
                          {batch.note || "لا توجد ملاحظات"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Template Download */}
        <Card>
          <CardHeader>
            <CardTitle>قوالب الاستيراد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                  <div>
                    <h4 className="font-semibold">قالب المساجد</h4>
                    <p className="text-sm text-slate-600">لاستيراد بيانات المساجد</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل القالب
                </Button>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">قالب المشاريع</h4>
                    <p className="text-sm text-slate-600">لاستيراد بيانات المشاريع</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل القالب
                </Button>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <FileSpreadsheet className="w-8 h-8 text-purple-600" />
                  <div>
                    <h4 className="font-semibold">قالب التبرعات</h4>
                    <p className="text-sm text-slate-600">لاستيراد بيانات التبرعات</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل القالب
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
