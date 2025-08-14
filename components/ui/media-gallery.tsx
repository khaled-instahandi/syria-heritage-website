"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Image as ImageIcon, 
  Star, 
  ZoomIn, 
  ChevronLeft, 
  ChevronRight,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MosqueMedia } from "@/lib/types"

interface MediaGalleryProps {
  media: MosqueMedia[]
  className?: string
}

export function MediaGallery({ media, className }: MediaGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<MosqueMedia | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // تصفية الوسائط حسب المرحلة
  const beforeMedia = media.filter(item => item.media_stage === "before").sort((a, b) => a.media_order - b.media_order)
  const afterMedia = media.filter(item => item.media_stage === "after").sort((a, b) => a.media_order - b.media_order)

  // فتح معرض الصور
  const openGallery = (mediaItem: MosqueMedia, mediaList: MosqueMedia[]) => {
    const index = mediaList.findIndex(item => item.id === mediaItem.id)
    setCurrentIndex(index)
    setSelectedImage(mediaItem)
  }

  // التنقل في معرض الصور
  const navigateImage = (direction: "next" | "prev") => {
    const currentMedia = selectedImage?.media_stage === "before" ? beforeMedia : afterMedia
    const newIndex = direction === "next" 
      ? (currentIndex + 1) % currentMedia.length
      : (currentIndex - 1 + currentMedia.length) % currentMedia.length
    
    setCurrentIndex(newIndex)
    setSelectedImage(currentMedia[newIndex])
  }

  // مكون عرض مجموعة الصور
  const MediaSection = ({ 
    title, 
    mediaList, 
    stageColor 
  }: { 
    title: string
    mediaList: MosqueMedia[]
    stageColor: string 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className={`w-5 h-5 ${stageColor}`} />
          {title}
          <Badge variant="secondary">{mediaList.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mediaList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد صور متاحة</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaList.map((item, index) => (
              <div 
                key={item.id} 
                className="relative group cursor-pointer"
                onClick={() => openGallery(item, mediaList)}
              >
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-colors">
                  <img
                    src={item.file_url}
                    alt={`صورة المسجد ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* شارة الصورة الرئيسية */}
                {item.is_main && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-yellow-500 text-white text-xs">
                      <Star className="w-3 h-3 ml-1" />
                      رئيسية
                    </Badge>
                  </div>
                )}

                {/* رقم الترتيب */}
                <div className="absolute bottom-2 right-2">
                  <Badge variant="outline" className="bg-white/90 text-xs">
                    {item.media_order}
                  </Badge>
                </div>

                {/* أيقونة التكبير */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className={cn("space-y-6", className)}>
      {/* قسم صور قبل الترميم */}
      <MediaSection 
        title="صور قبل الترميم"
        mediaList={beforeMedia}
        stageColor="text-red-600"
      />

      {/* قسم صور بعد الترميم */}
      <MediaSection 
        title="صور بعد الترميم"
        mediaList={afterMedia}
        stageColor="text-green-600"
      />

      {/* معرض الصور المنبثق */}
      <Dialog 
        open={!!selectedImage} 
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="text-right">
              معرض صور المسجد - {selectedImage?.media_stage === "before" ? "قبل الترميم" : "بعد الترميم"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="relative flex-1 flex items-center justify-center bg-black/5">
              {/* الصورة الرئيسية */}
              <div className="relative max-w-full max-h-full">
                <img
                  src={selectedImage.file_url}
                  alt="صورة المسجد"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                />
                
                {/* شارة الصورة الرئيسية */}
                {selectedImage.is_main && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="w-4 h-4 ml-1" />
                      رئيسية
                    </Badge>
                  </div>
                )}
              </div>

              {/* أزرار التنقل */}
              {((selectedImage.media_stage === "before" && beforeMedia.length > 1) ||
                (selectedImage.media_stage === "after" && afterMedia.length > 1)) && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={() => navigateImage("next")}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={() => navigateImage("prev")}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* مؤشر الصورة الحالية */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Badge variant="outline" className="bg-white/90">
                  {currentIndex + 1} / {selectedImage.media_stage === "before" ? beforeMedia.length : afterMedia.length}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MediaGallery
