"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Image as ImageIcon,
  X,
  Star,
  Move,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MosqueMedia } from "@/lib/types";
import { MosqueMediaService } from "@/lib/services/mosque-service";
import { toast } from "sonner";
import { getFullImageUrl } from "@/lib/data-transformers";

interface MediaUploadProps {
  mosqueId: number;
  existingMedia?: MosqueMedia[];
  onMediaUpdate?: () => void;
  className?: string;
}

interface MediaFile {
  file: File;
  preview: string;
  id: string;
}

export function MediaUpload({
  mosqueId,
  existingMedia = [],
  onMediaUpdate,
  className,
}: MediaUploadProps) {
  const [beforeFiles, setBeforeFiles] = useState<MediaFile[]>([]);
  const [afterFiles, setAfterFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState<"before" | "after" | null>(null);
  const [settingMainMedia, setSettingMainMedia] = useState<number | null>(null);

  // تصفية الوسائط الموجودة
  const beforeMedia = existingMedia.filter(
    (media) => media.media_stage === "before"
  );
  const afterMedia = existingMedia.filter(
    (media) => media.media_stage === "after"
  );

  // إنشاء معاينة للملف
  const createFilePreview = useCallback((file: File): MediaFile => {
    return {
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    };
  }, []);

  // التعامل مع اختيار الملفات
  const handleFileSelect = useCallback(
    (files: FileList | null, stage: "before" | "after") => {
      if (!files) return;

      const validFiles = Array.from(files).filter((file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

        if (!isValidType) {
          toast.error(`${file.name} ليس صورة صالحة`);
          return false;
        }

        if (!isValidSize) {
          toast.error(`${file.name} حجم الملف كبير جداً (الحد الأقصى 10MB)`);
          return false;
        }

        return true;
      });

      const newFiles = validFiles.map(createFilePreview);

      if (stage === "before") {
        setBeforeFiles((prev) => [...prev, ...newFiles]);
      } else {
        setAfterFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [createFilePreview]
  );

  // التعامل مع السحب والإفلات
  const handleDrop = useCallback(
    (e: React.DragEvent, stage: "before" | "after") => {
      e.preventDefault();
      setDragOver(null);
      handleFileSelect(e.dataTransfer.files, stage);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, stage: "before" | "after") => {
      e.preventDefault();
      setDragOver(stage);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setDragOver(null);
  }, []);

  // حذف ملف معاينة
  const removeFile = useCallback(
    (fileId: string, stage: "before" | "after") => {
      const setter = stage === "before" ? setBeforeFiles : setAfterFiles;
      setter((prev) => {
        const updated = prev.filter((f) => f.id !== fileId);
        // تنظيف memory leak
        const removedFile = prev.find((f) => f.id === fileId);
        if (removedFile) {
          URL.revokeObjectURL(removedFile.preview);
        }
        return updated;
      });
    },
    []
  );

  // رفع الملفات
  const uploadFiles = useCallback(
    async (files: MediaFile[], stage: "before" | "after") => {
      if (files.length === 0) return;

      try {
        setUploading(true);

        await MosqueMediaService.uploadMedia({
          mosque_id: mosqueId,
          media_stage: stage,
          is_main: false,
          media_order: 1,
          files: files.map((f) => f.file),
        });

        // تنظيف الملفات المرفوعة
        files.forEach((file) => URL.revokeObjectURL(file.preview));

        if (stage === "before") {
          setBeforeFiles([]);
        } else {
          setAfterFiles([]);
        }

        toast.success(`تم رفع ${files.length} صورة بنجاح`);
        onMediaUpdate?.();
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("حدث خطأ أثناء رفع الصور");
      } finally {
        setUploading(false);
      }
    },
    [mosqueId, onMediaUpdate]
  );

  // حذف وسائط موجودة
  const deleteExistingMedia = useCallback(
    async (mediaId: number) => {
      try {
        await MosqueMediaService.deleteMedia(mediaId);
        toast.success("تم حذف الصورة بنجاح");
        onMediaUpdate?.();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("حدث خطأ أثناء حذف الصورة");
      }
    },
    [onMediaUpdate]
  );

  // تعيين صورة رئيسية
  const setMainMedia = useCallback(
    async (mediaId: number, stage: "before" | "after") => {
      try {
        setSettingMainMedia(mediaId);
        await MosqueMediaService.setMainMedia(mediaId);
        toast.success(
          `تم تعيين الصورة الرئيسية لمرحلة ${
            stage === "before" ? "قبل" : "بعد"
          } الترميم`
        );
        onMediaUpdate?.();
      } catch (error) {
        console.error("Set main media error:", error);
        toast.error("حدث خطأ أثناء تعيين الصورة الرئيسية");
      } finally {
        setSettingMainMedia(null);
      }
    },
    [onMediaUpdate]
  );

  // مكون منطقة الرفع
  const DropZone = ({
    stage,
    files,
  }: {
    stage: "before" | "after";
    files: MediaFile[];
  }) => (
    <Card
      className={cn(
        "border-2 border-dashed transition-colors",
        dragOver === stage
          ? "border-primary bg-primary/10"
          : "border-gray-300 hover:border-gray-400"
      )}
    >
      <CardContent className="p-6">
        <div
          onDrop={(e) => handleDrop(e, stage)}
          onDragOver={(e) => handleDragOver(e, stage)}
          onDragLeave={handleDragLeave}
          className="text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files, stage)}
              className="hidden"
              id={`upload-${stage}`}
            />
            <div className="p-4 bg-gray-100 rounded-full">
              <Upload className="w-8 h-8 text-gray-600" />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">
                صور {stage === "before" ? "قبل" : "بعد"} الترميم
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                اسحب الصور هنا أو
                <label
                  htmlFor={`upload-${stage}`}
                  className="text-primary hover:underline cursor-pointer mr-1"
                >
                  تصفح الملفات
                </label>
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 10MB</p>
            </div>
          </div>
        </div>

        {/* معاينة الملفات الجديدة */}
        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">الملفات المحددة ({files.length})</h4>
              <Button
                onClick={() => uploadFiles(files, stage)}
                disabled={uploading}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 ml-2" />
                    رفع الصور
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {files.map((file) => (
                <div key={file.id} className="relative group">
                  <img
                    src={file.preview}
                    alt="معاينة"
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(file.id, stage)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="bg-black/50 text-white text-xs p-1 rounded text-center truncate">
                      {file.file.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // مكون عرض الوسائط الموجودة
  const ExistingMedia = ({
    media,
    stage,
  }: {
    media: MosqueMedia[];
    stage: "before" | "after";
  }) => (
    <>
      {media.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              الصور الموجودة - {stage === "before" ? "قبل" : "بعد"} الترميم
              <Badge variant="secondary">{media.length}</Badge>
              {/* {media.length > 0 && !media.some(item => item.is_main) && (
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  ⚠️ لا توجد صورة رئيسية
                </Badge>
              )} */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative group transition-all duration-200 hover:scale-105",
                    item.is_main ? "ring-2 ring-yellow-400 ring-offset-2" : ""
                  )}
                >
                  <img
                    src={getFullImageUrl(item.file_url)}
                    alt="صورة المسجد"
                    className={cn(
                      "w-full h-24 object-cover rounded-lg border",
                      item.is_main
                        ? "border-yellow-400 border-2"
                        : "border-gray-200"
                    )}
                  />

                  {/* شارة الصورة الرئيسية */}
                  {item.is_main && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-yellow-500 text-white text-xs">
                        <Star className="w-3 h-3 ml-1" />
                        رئيسية
                      </Badge>
                    </div>
                  )}

                  {/* أزرار التحكم */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    {/* {!item.is_main && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setMainMedia(item.id, stage)}
                        className="p-2"
                        title="تعيين كصورة رئيسية"
                        disabled={settingMainMedia === item.id}
                      >
                        {settingMainMedia === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Star className="w-4 h-4" />
                        )}
                      </Button>
                    )} */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteExistingMedia(item.id)}
                      className="p-2"
                      title="حذف الصورة"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* رقم الترتيب */}
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="outline" className="bg-white/90">
                      {item.media_order}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* رسالة تعليمات */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          قم برفع الصور قبل وبعد الترميم لإظهار التقدم المحرز في المشروع. يمكنك
          رفع عدة صور لكل مرحلة وتحديد الصورة الرئيسية لكل قسم بالنقر على أيقونة
          النجمة.
          <br />
          💡 <strong>نصيحة:</strong> الصور الرئيسية ستظهر مع إطار ذهبي وعلامة
          "رئيسية".
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        {/* قسم صور قبل الترميم */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-700">
            صور قبل الترميم
          </h3>
          <DropZone stage="before" files={beforeFiles} />
          <ExistingMedia media={beforeMedia} stage="before" />
        </div>

        {/* قسم صور بعد الترميم */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700">
            صور بعد الترميم
          </h3>
          <DropZone stage="after" files={afterFiles} />
          <ExistingMedia media={afterMedia} stage="after" />
        </div>
      </div>
    </div>
  );
}

export default MediaUpload;
