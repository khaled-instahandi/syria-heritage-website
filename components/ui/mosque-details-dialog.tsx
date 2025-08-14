"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ImportedMosque } from "@/types/imported-mosques"
import { formatDate } from "@/lib/utils"
import { 
  Building, 
  MapPin, 
  DollarSign, 
  Users, 
  FileText, 
  Calendar,
  Send,
  X
} from "lucide-react"

interface MosqueDetailsDialogProps {
  mosque: ImportedMosque | null
  isOpen: boolean
  onClose: () => void
  onTransfer: (mosqueId: number) => void
  isTransferring: boolean
}

export function MosqueDetailsDialog({
  mosque,
  isOpen,
  onClose,
  onTransfer,
  isTransferring
}: MosqueDetailsDialogProps) {
  if (!mosque) return null

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building className="w-6 h-6" />
            تفاصيل المسجد
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">الاسم بالعربية</label>
              <p className="text-lg font-semibold text-slate-900">{mosque.name_ar}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">الاسم بالإنجليزية</label>
              <p className="text-lg font-semibold text-slate-900">{mosque.name_en}</p>
            </div>
          </div>

          <Separator />

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <MapPin className="w-5 h-5" />
              معلومات الموقع
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">المحافظة</label>
                <p className="text-slate-900">{mosque.governorate}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">المنطقة</label>
                <p className="text-slate-900">{mosque.district}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">الناحية</label>
                <p className="text-slate-900">{mosque.sub_district}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">الحي</label>
                <p className="text-slate-900">{mosque.neighborhood}</p>
              </div>
            </div>
            {mosque.address_text && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">العنوان التفصيلي</label>
                <p className="text-slate-900 bg-slate-50 p-3 rounded-md">{mosque.address_text}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Building className="w-5 h-5" />
              معلومات المشروع
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">مستوى الضرر</label>
                <div>{getDamageLevelBadge(mosque.damage_level)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">نوع المشروع</label>
                <div>{getReconstructionBadge(mosque.is_reconstruction)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">التكلفة التقديرية</label>
                <p className="text-lg font-semibold text-green-600">
                  {new Intl.NumberFormat('ar-SY', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(parseFloat(mosque.estimated_cost))}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">اللجنة المسؤولة</label>
                <p className="text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {mosque.committee_name}
                </p>
              </div>
            </div>
          </div>

          {mosque.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  الملاحظات
                </label>
                <p className="text-slate-900 bg-slate-50 p-4 rounded-md leading-relaxed">
                  {mosque.notes}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="w-5 h-5" />
              معلومات إضافية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <label className="text-slate-600">معرف المسجد</label>
                <p className="text-slate-900">#{mosque.id}</p>
              </div>
              <div className="space-y-2">
                <label className="text-slate-600">معرف الدفعة</label>
                <p className="text-slate-900">#{mosque.batch_id}</p>
              </div>
              <div className="space-y-2">
                <label className="text-slate-600">تاريخ الإضافة</label>
                <p className="text-slate-900">{formatDate(mosque.created_at)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-slate-600">آخر تحديث</label>
                <p className="text-slate-900">{formatDate(mosque.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => onTransfer(mosque.id)}
              disabled={isTransferring}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isTransferring ? (
                <>
                  <div className="w-4 h-4 ml-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الترحيل...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 ml-2" />
                  ترحيل إلى جدول المساجد
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 ml-2" />
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
