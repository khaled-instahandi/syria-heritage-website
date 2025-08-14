"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
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
  Building,
  Send,
  SendHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { ImportedMosque, ImportedMosquesResponse } from "@/types/imported-mosques"
import { ImportedMosquesService } from "@/lib/services/imported-mosques"
import { MosqueDetailsDialog } from "@/components/ui/mosque-details-dialog"
import { EditImportedMosqueDialog } from "@/components/ui/edit-imported-mosque-dialog"

// Types for imported mosque data are now imported from types file

export default function ImportedMosquesPage() {
  const t = useTranslations()
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [importedMosques, setImportedMosques] = useState<ImportedMosque[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTransferring, setIsTransferring] = useState<{ [key: number]: boolean }>({})
  const [isTransferringAll, setIsTransferringAll] = useState(false)
  const [isDeleting, setIsDeleting] = useState<{ [key: number]: boolean }>({})
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedMosque, setSelectedMosque] = useState<ImportedMosque | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [mosqueToEdit, setMosqueToEdit] = useState<ImportedMosque | null>(null)

  // Fetch imported mosques data
  const fetchImportedMosques = async () => {
    setIsLoading(true)
    try {
      const data = await ImportedMosquesService.getImportedMosques()
      setImportedMosques(data.data)
    } catch (error) {
      console.error('Error fetching imported mosques:', error)
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات المساجد المستوردة",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Upload Excel file
  const uploadExcelFile = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      await ImportedMosquesService.importMosquesFromExcel(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      toast({
        title: "نجح الرفع",
        description: "تم رفع الملف وإستيراد البيانات بنجاح",
      })
      await fetchImportedMosques()
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "خطأ في الرفع",
        description: "فشل في رفع الملف، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setSelectedFile(null)
    }
  }

  // Transfer single mosque
  const transferMosque = async (mosqueId: number) => {
    setIsTransferring(prev => ({ ...prev, [mosqueId]: true }))

    try {
      await ImportedMosquesService.transferMosque(mosqueId)
      toast({
        title: "تم الترحيل",
        description: "تم ترحيل المسجد إلى جدول المساجد الرئيسي بنجاح",
      })
      await fetchImportedMosques()
    } catch (error) {
      console.error('Error transferring mosque:', error)
      toast({
        title: "خطأ في الترحيل",
        description: "فشل في ترحيل المسجد، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsTransferring(prev => ({ ...prev, [mosqueId]: false }))
    }
  }

  // Transfer all mosques
  const transferAllMosques = async () => {
    setIsTransferringAll(true)

    try {
      await ImportedMosquesService.transferAllMosques()
      toast({
        title: "تم الترحيل",
        description: "تم ترحيل جميع المساجد إلى جدول المساجد الرئيسي بنجاح",
      })
      await fetchImportedMosques()
    } catch (error) {
      console.error('Error transferring all mosques:', error)
      toast({
        title: "خطأ في الترحيل",
        description: "فشل في ترحيل المساجد، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsTransferringAll(false)
    }
  }

  // Delete imported mosque
  const deleteImportedMosque = async (mosqueId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المسجد؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return
    }

    setIsDeleting(prev => ({ ...prev, [mosqueId]: true }))

    try {
      await ImportedMosquesService.deleteImportedMosque(mosqueId)
      toast({
        title: "تم الحذف",
        description: "تم حذف المسجد بنجاح",
      })
      await fetchImportedMosques()
    } catch (error) {
      console.error('Error deleting mosque:', error)
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف المسجد، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(prev => ({ ...prev, [mosqueId]: false }))
    }
  }

  // Download template
  const downloadTemplate = async () => {
    try {
      const response = await fetch('/files/imported_mosques_template.xlsx')
      
      if (!response.ok) {
        throw new Error('Failed to fetch template file')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'imported_mosques_template.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({
        title: "تم التحميل",
        description: "تم تحميل قالب Excel بنجاح",
      })
    } catch (error) {
      console.error('Error downloading template:', error)
      toast({
        title: "خطأ في التحميل",
        description: "فشل في تحميل القالب، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    }
  }

  // Export data
  const exportData = async () => {
    try {
      const blob = await ImportedMosquesService.exportImportedMosques()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'imported_mosques_export.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({
        title: "تم التصدير",
        description: "تم تصدير البيانات بنجاح",
      })
    } catch (error) {
      console.error('Error exporting data:', error)
      toast({
        title: "خطأ في التصدير",
        description: "فشل في تصدير البيانات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchImportedMosques()
  }, [])

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
      const file = e.dataTransfer.files[0]
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel") {
        setSelectedFile(file)
        uploadExcelFile(file)
      } else {
        toast({
          title: "نوع ملف غير صحيح",
          description: "يرجى رفع ملف Excel (.xlsx أو .xls)",
          variant: "destructive",
        })
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      uploadExcelFile(file)
    }
  }

  const getDamageLevelBadge = (level: string) => {
    switch (level) {
      case "جزئي":
        return <Badge className="bg-yellow-100 text-yellow-800">جزئي</Badge>
      case "كامل":
        return <Badge className="bg-red-100 text-red-800">كامل</Badge>
      case "متوسط":
        return <Badge className="bg-orange-100 text-orange-800">متوسط</Badge>
      default:
        return <Badge variant="outline">{level}</Badge>
    }
  }

  const getReconstructionBadge = (isReconstruction: number) => {
    return isReconstruction === 1 ? (
      <Badge className="bg-green-100 text-green-800">إعادة إعمار</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800">ترميم</Badge>
    )
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="المساجد المستوردة"
        description="رفع وإدارة بيانات المساجد المستوردة من ملفات Excel وترحيلها إلى جدول المساجد الرئيسي"
      />

      <div className="p-6 space-y-6">
        {/* Upload Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                رفع ملف Excel للمساجد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
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
                      <p className="text-lg font-semibold text-slate-900 mb-2">جاري رفع الملف...</p>
                      <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                      <p className="text-sm text-slate-600 mt-2">{uploadProgress}% مكتمل</p>
                      {selectedFile && (
                        <p className="text-sm text-slate-500 mt-1">{selectedFile.name}</p>
                      )}
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
                  إرشادات رفع ملف المساجد
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• الحد الأقصى لحجم الملف: 10 ميجابايت</li>
                  <li>• تأكد من صحة البيانات قبل الرفع</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                إحصائيات المساجد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">إجمالي المساجد</span>
                </div>
                <span className="font-bold text-emerald-600">
                  {isLoading ? "..." : importedMosques.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">إعادة إعمار</span>
                </div>
                <span className="font-bold text-blue-600">
                  {isLoading ? "..." : importedMosques.filter(m => m.is_reconstruction === 1).length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="font-medium">ترميم</span>
                </div>
                <span className="font-bold text-amber-600">
                  {isLoading ? "..." : importedMosques.filter(m => m.is_reconstruction === 0).length}
                </span>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">إجمالي التكلفة</span>
                  <span className="font-bold text-slate-900">
                    {isLoading ? "..." :
                      new Intl.NumberFormat('ar-SY', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(
                        importedMosques.reduce((sum, m) => sum + parseFloat(m.estimated_cost), 0)
                      )
                    }
                  </span>
                </div>
              </div>

              {importedMosques.length > 0 && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={transferAllMosques}
                    disabled={isTransferringAll}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isTransferringAll ? (
                      <>
                        <Clock className="w-4 h-4 ml-2 animate-spin" />
                        جاري الترحيل...
                      </>
                    ) : (
                      <>
                        <SendHorizontal className="w-4 h-4 ml-2" />
                        ترحيل جميع المساجد
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Imported Mosques Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              المساجد المستوردة
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchImportedMosques}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Clock className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <Database className="w-4 h-4 ml-2" />
                )}
                تحديث البيانات
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
              >
                <Download className="w-4 h-4 ml-2" />
                تحميل قالب Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-2" />
                  <p className="text-slate-600">جاري تحميل بيانات المساجد...</p>
                </div>
              </div>
            ) : importedMosques.length === 0 ? (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">لا توجد مساجد مستوردة</h3>
                <p className="text-slate-500">قم برفع ملف Excel لاستيراد بيانات المساجد</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المسجد</TableHead>
                      <TableHead className="text-right">الموقع</TableHead>
                      <TableHead className="text-right">مستوى الضرر</TableHead>
                      <TableHead className="text-right">نوع المشروع</TableHead>
                      <TableHead className="text-right">التكلفة التقديرية</TableHead>
                      <TableHead className="text-right">اللجنة المسؤولة</TableHead>
                      <TableHead className="text-right">تاريخ الإضافة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedMosques.map((mosque) => (
                      <TableRow key={mosque.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-slate-900">{mosque.name_ar}</div>
                            <div className="text-sm text-slate-600">{mosque.name_en}</div>
                            <div className="text-xs text-slate-500">ID: {mosque.id} | Batch: {mosque.batch_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{mosque.governorate}</div>
                            <div className="text-slate-600">{mosque.district} - {mosque.sub_district}</div>
                            <div className="text-slate-500">{mosque.neighborhood}</div>
                            {mosque.address_text && (
                              <div className="text-xs text-slate-400 mt-1">{mosque.address_text}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getDamageLevelBadge(mosque.damage_level)}
                        </TableCell>
                        <TableCell>
                          {getReconstructionBadge(mosque.is_reconstruction)}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-green-600">
                            {new Intl.NumberFormat('ar-SY', {
                              style: 'currency',
                              currency: 'USD'
                            }).format(parseFloat(mosque.estimated_cost))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{mosque.committee_name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(mosque.created_at)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedMosque(mosque)
                                setIsDetailsDialogOpen(true)
                              }}
                              title="عرض التفاصيل"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setMosqueToEdit(mosque)
                                setIsEditDialogOpen(true)
                              }}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="تعديل البيانات"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => transferMosque(mosque.id)}
                              disabled={isTransferring[mosque.id]}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="ترحيل إلى جدول المساجد الرئيسي"
                            >
                              {isTransferring[mosque.id] ? (
                                <Clock className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteImportedMosque(mosque.id)}
                              disabled={isDeleting[mosque.id]}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="حذف المسجد"
                            >
                              {isDeleting[mosque.id] ? (
                                <Clock className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template Download Section */}
        <Card>
          <CardHeader>
            <CardTitle>قالب Excel للمساجد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-4">
              <div className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                  <div>
                    <h4 className="font-semibold">قالب بيانات المساجد</h4>
                    <p className="text-sm text-slate-600">للاستيراد من Excel</p>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mb-3">
                  يحتوي على: الاسم، الموقع، مستوى الضرر، التكلفة، نوع المشروع، اللجنة، الملاحظات
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={downloadTemplate}
                >
                  <Download className="w-4 h-4 ml-2" />
                  تحميل القالب
                </Button>
              </div>

             

         
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mosque Details Dialog */}
      <MosqueDetailsDialog
        mosque={selectedMosque}
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false)
          setSelectedMosque(null)
        }}
        onTransfer={transferMosque}
        isTransferring={selectedMosque ? isTransferring[selectedMosque.id] || false : false}
      />

      {/* Edit Mosque Dialog */}
      <EditImportedMosqueDialog
        mosque={mosqueToEdit}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setMosqueToEdit(null)
        }}
        onUpdate={fetchImportedMosques}
      />
    </div>
  )
}
