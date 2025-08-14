"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { Project } from "@/lib/types"

interface DeleteProjectDialogProps {
  project: Project
  onDelete: (id: number) => Promise<boolean>
  children?: React.ReactNode
}

export function DeleteProjectDialog({ project, onDelete, children }: DeleteProjectDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const success = await onDelete(project.id)
      if (success) {
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="text-right">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">
            تأكيد حذف المشروع
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            هل أنت متأكد من رغبتك في حذف هذا المشروع؟
            <br />
            <span className="font-semibold text-slate-900">
              مسجد: {project.mosque_ar}
            </span>
            <br />
            <span className="text-sm text-slate-600">
              النوع: {project.project_category} | الحالة: {project.status}
            </span>
            <br />
            <br />
            <span className="text-red-600 font-medium">
              هذا الإجراء لا يمكن التراجع عنه.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 justify-start">
          <AlertDialogCancel disabled={isDeleting}>
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جارٍ الحذف...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 ml-2" />
                حذف المشروع
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
