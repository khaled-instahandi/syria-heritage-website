"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  itemName?: string
  isLoading?: boolean
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "تأكيد الحذف",
  description,
  itemName,
  isLoading = false
}: DeleteConfirmationDialogProps) {
  const defaultDescription = itemName
    ? `هل أنت متأكد من حذف "${itemName}"؟ لا يمكن التراجع عن هذا الإجراء.`
    : "هل أنت متأكد من هذا الإجراء؟ لا يمكن التراجع عنه."

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center justify-center py-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? "جاري الحذف..." : "حذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
