"use client"

import { useState, useEffect } from 'react'
import { useAuth, useRequireAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast-messages'
import { MosquesService, type Mosque } from '@/lib/services'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Search, MapPin, Building2 } from 'lucide-react'

export default function MosquesExamplePage() {
  // التحقق من المصادقة
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth()
  const { user } = useAuth()
  const toast = useToast()

  // حالة البيانات
  const [mosques, setMosques] = useState<Mosque[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // تحميل البيانات
  useEffect(() => {
    if (isAuthenticated) {
      loadMosques()
    }
  }, [isAuthenticated, currentPage, searchTerm])

  const loadMosques = async () => {
    try {
      setLoading(true)
      
      const response = await MosquesService.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined
      })

      if (response.status === 'success' && response.data) {
        setMosques(response.data.data)
        setTotalPages(response.data.last_page)
      }
    } catch (error: any) {
      toast.error('فشل في تحميل بيانات المساجد')
      console.error('Error loading mosques:', error)
    } finally {
      setLoading(false)
    }
  }

  // حذف مسجد
  const handleDeleteMosque = async (mosqueId: number, mosqueName: string) => {
    if (!confirm(`هل أنت متأكد من حذف مسجد "${mosqueName}"؟`)) {
      return
    }

    const loadingToast = toast.loading('جاري حذف المسجد...')

    try {
      await MosquesService.delete(mosqueId)
      toast.dismissLoading(loadingToast, 'تم حذف المسجد بنجاح')
      
      // إعادة تحميل البيانات
      loadMosques()
    } catch (error: any) {
      toast.dismissWithError(loadingToast, 'فشل في حذف المسجد')
    }
  }

  // إذا كان المستخدم غير مصادق عليه
  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* العنوان */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة المساجد</h1>
          <p className="text-slate-600">مرحباً {user?.name}، يمكنك إدارة المساجد من هنا</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          إضافة مسجد جديد
        </Button>
      </div>

      {/* البحث */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="البحث في المساجد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* قائمة المساجد */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            المساجد ({mosques.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="mr-2">جاري تحميل البيانات...</span>
            </div>
          ) : mosques.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              لا توجد مساجد للعرض
            </div>
          ) : (
            <div className="space-y-4">
              {mosques.map((mosque) => (
                <div
                  key={mosque.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{mosque.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {mosque.city}
                      </div>
                      <Badge variant={
                        mosque.damage_level === 'كامل' ? 'destructive' : 
                        mosque.damage_level === 'جزئي' ? 'secondary' : 'default'
                      }>
                        {mosque.damage_level}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      تعديل
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteMosque(mosque.id, mosque.name)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* التنقل بين الصفحات */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                السابق
              </Button>
              <span className="text-sm text-slate-600">
                الصفحة {currentPage} من {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                التالي
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
