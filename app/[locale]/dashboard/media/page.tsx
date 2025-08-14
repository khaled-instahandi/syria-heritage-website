"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Eye, Trash2, Upload, Filter, Download, ImageIcon, Video, FileText, Calendar, User, MapPin } from 'lucide-react'
import { formatDate, formatFileSize } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

// Mock media data
const mockMedia = [
  {
    id: 1,
    filename: "mosque-damascus-1.jpg",
    originalName: "مسجد دمشق الكبير.jpg",
    type: "image",
    size: 2048576,
    url: "/images/mosque-hero.png",
    mosqueId: 1,
    mosqueName: "الجامع الأموي الكبير",
    uploadedBy: "أحمد محمد",
    uploadedAt: "2024-01-15T10:30:00Z",
    isMain: true,
    description: "صورة رئيسية للمسجد من الخارج",
    tags: ["مسجد", "دمشق", "مساجد"],
  },
  {
    id: 2,
    filename: "restoration-video-1.mp4",
    originalName: "فيديو الترميم.mp4",
    type: "video",
    size: 15728640,
    url: "/videos/restoration.mp4",
    mosqueId: 2,
    mosqueName: "مسجد خالد بن الوليد",
    uploadedBy: "سارة أحمد",
    uploadedAt: "2024-01-14T14:20:00Z",
    isMain: false,
    description: "فيديو توثيقي لعملية الترميم",
    tags: ["ترميم", "فيديو", "توثيق"],
  },
  {
    id: 3,
    filename: "blueprint-plan.pdf",
    originalName: "مخطط المسجد.pdf",
    type: "document",
    size: 1024000,
    url: "/documents/blueprint.pdf",
    mosqueId: 1,
    mosqueName: "الجامع الأموي الكبير",
    uploadedBy: "محمد علي",
    uploadedAt: "2024-01-13T09:15:00Z",
    isMain: false,
    description: "مخطط هندسي للمسجد",
    tags: ["مخطط", "هندسة", "تصميم"],
  },
]

export default function MediaManagementPage() {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [mosqueFilter, setMosqueFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  const filteredMedia = mockMedia.filter((media) => {
    const matchesSearch =
      searchTerm === "" ||
      media.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      media.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || media.type === typeFilter
    const matchesMosque = mosqueFilter === "all" || media.mosqueId.toString() === mosqueFilter

    return matchesSearch && matchesType && matchesMosque
  })

  const mediaStats = {
    total: mockMedia.length,
    images: mockMedia.filter((m) => m.type === "image").length,
    videos: mockMedia.filter((m) => m.type === "video").length,
    documents: mockMedia.filter((m) => m.type === "document").length,
    totalSize: mockMedia.reduce((sum, m) => sum + m.size, 0),
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5 text-blue-600" />
      case "video":
        return <Video className="w-5 h-5 text-purple-600" />
      case "document":
        return <FileText className="w-5 h-5 text-emerald-600" />
      default:
        return <FileText className="w-5 h-5 text-slate-600" />
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="إدارة الوسائط"
        description="إدارة الصور والفيديوهات والمستندات المرتبطة بالمساجد والمشاريع"
      />

      <div className="p-6 space-y-6">
        {/* Media Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">إجمالي الملفات</p>
                  <p className="text-3xl font-bold text-slate-900">{mediaStats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">الصور</p>
                  <p className="text-3xl font-bold text-slate-900">{mediaStats.images}</p>
                </div>
                <ImageIcon className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">الفيديوهات</p>
                  <p className="text-3xl font-bold text-slate-900">{mediaStats.videos}</p>
                </div>
                <Video className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">المستندات</p>
                  <p className="text-3xl font-bold text-slate-900">{mediaStats.documents}</p>
                </div>
                <FileText className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">الحجم الإجمالي</p>
                  <p className="text-2xl font-bold text-slate-900">{formatFileSize(mediaStats.totalSize)}</p>
                </div>
                <Upload className="w-8 h-8 text-slate-600" />
              </div>
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
                    placeholder="البحث في الملفات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="image">صور</option>
                  <option value="video">فيديوهات</option>
                  <option value="document">مستندات</option>
                </select>

                <select
                  value={mosqueFilter}
                  onChange={(e) => setMosqueFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">جميع المساجد</option>
                  <option value="1">الجامع الأموي الكبير</option>
                  <option value="2">مسجد خالد بن الوليد</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  شبكة
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  جدول
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 ml-2" />
                  فلاتر متقدمة
                </Button>
                <Link href="/dashboard/media/upload">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Upload className="w-4 h-4 ml-2" />
                    رفع ملفات
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Display */}
        {viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((media) => (
              <Card key={media.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  {media.type === "image" ? (
                    <div className="relative h-48 bg-slate-100">
                      <Image
                        src={media.url || "/placeholder.svg"}
                        alt={media.originalName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {media.isMain && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-emerald-600 text-white">رئيسية</Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      {getFileIcon(media.type)}
                      <span className="mr-2 text-slate-600 font-medium">{media.type.toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-slate-900 truncate" title={media.originalName}>
                      {media.originalName}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{media.description}</p>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{media.mosqueName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{media.uploadedBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(media.uploadedAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{formatFileSize(media.size)}</span>
                      <div className="flex gap-1">
                        {media.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Link href={`/dashboard/media/${media.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 ml-2" />
                        عرض
                      </Button>
                    </Link>
                    <Link href={`/dashboard/media/${media.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>قائمة الملفات ({filteredMedia.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الملف</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">المسجد</TableHead>
                      <TableHead className="text-right">الحجم</TableHead>
                      <TableHead className="text-right">رفع بواسطة</TableHead>
                      <TableHead className="text-right">تاريخ الرفع</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedia.map((media) => (
                      <TableRow key={media.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {media.type === "image" ? (
                              <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                                <Image
                                  src={media.url || "/placeholder.svg"}
                                  alt={media.originalName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                {getFileIcon(media.type)}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-slate-900">{media.originalName}</div>
                              <div className="text-sm text-slate-600">{media.filename}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              media.type === "image"
                                ? "bg-blue-100 text-blue-800"
                                : media.type === "video"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {media.type === "image" ? "صورة" : media.type === "video" ? "فيديو" : "مستند"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{media.mosqueName}</div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{formatFileSize(media.size)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span>{media.uploadedBy}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(media.uploadedAt)}</div>
                        </TableCell>
                        <TableCell>
                          {media.isMain ? (
                            <Badge className="bg-emerald-100 text-emerald-800">رئيسية</Badge>
                          ) : (
                            <Badge variant="outline">عادية</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/media/${media.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/dashboard/media/${media.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
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
        )}

        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">لا توجد ملفات تطابق معايير البحث</p>
            <Link href="/dashboard/media/upload">
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                <Upload className="w-4 h-4 ml-2" />
                رفع ملفات جديدة
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
