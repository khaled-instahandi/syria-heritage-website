"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Save,
  ArrowRight,
  MapPin,
  DollarSign,
  AlertCircle,
  Loader2,
  Check,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import InteractiveMap from "@/components/ui/interactive-map";
import MediaUpload from "@/components/ui/media-upload";
import {
  GovernorateSelect,
  DistrictSelect,
  SubDistrictSelect,
  NeighborhoodSelect,
} from "@/components/ui/location-select";
import { StatusSelect, DamageSelect } from "@/components/ui/status-select";
import {
  MosqueService,
  LocationService,
  MosqueMediaService,
} from "@/lib/services/mosque-service";
import { Governorate, District, SubDistrict, Neighborhood } from "@/lib/types";
import { toast } from "sonner";

export default function NewMosquePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
  const [afterFiles, setAfterFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    governorate_id: "",
    district_id: "",
    sub_district_id: "",
    neighborhood_id: "",
    address_text: "",
    latitude: "",
    capacityv:"",
    longitude: "",
    damage_level: "جزئي" as "جزئي" | "كامل",
    estimated_cost: "",
    is_reconstruction: false,
    status: "مفعل" as "مفعل" | "موقوف" | "مكتمل",
  });

  // وظيفة للتعامل مع تغيير قيم النموذج
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // وظيفة للتعامل مع النقر على الخريطة لتحديد الإحداثيات
  const handleMapClick = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
    toast.success(`تم تحديد الموقع: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  };

  // وظائف للتعامل مع تغيير المواقع
  const handleGovernorateChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      governorate_id: value,
      district_id: "",
      sub_district_id: "",
      neighborhood_id: "",
    }));
  };

  const handleDistrictChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      district_id: value,
      sub_district_id: "",
      neighborhood_id: "",
    }));
  };

  const handleSubDistrictChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      sub_district_id: value,
      neighborhood_id: "",
    }));
  };

  // وظائف للتعامل مع رفع الملفات
  const handleBeforeFilesChange = (files: File[]) => {
    setBeforeFiles(files);
  };

  const handleAfterFilesChange = (files: File[]) => {
    setAfterFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // التحقق من صحة البيانات
      if (!formData.name_ar.trim()) {
        throw new Error("اسم المسجد باللغة العربية مطلوب");
      }
      if (!formData.name_en.trim()) {
        throw new Error("اسم المسجد باللغة الإنجليزية مطلوب");
      }
      if (!formData.governorate_id) {
        throw new Error("المحافظة مطلوبة");
      }
      if (!formData.district_id) {
        throw new Error("المنطقة مطلوبة");
      }
      if (!formData.sub_district_id) {
        throw new Error("الناحية مطلوبة");
      }
      if (!formData.neighborhood_id) {
        throw new Error("الحي مطلوب");
      }

      console.log("Form validation passed, creating mosque...");

      // إنشاء المسجد أولاً
      const mosque = await MosqueService.createMosque({
        name_ar: formData.name_ar.trim(),
        name_en: formData.name_en.trim(),
        governorate_id: parseInt(formData.governorate_id),
        district_id: parseInt(formData.district_id),
        sub_district_id: parseInt(formData.sub_district_id),
        neighborhood_id: parseInt(formData.neighborhood_id),
        address_text: formData.address_text.trim() || undefined,
        latitude: formData.latitude.trim() || undefined,
        longitude: formData.longitude.trim() || undefined,
        damage_level: formData.damage_level,
        estimated_cost: formData.estimated_cost.trim() || undefined,
        is_reconstruction: formData.is_reconstruction
        ,
        capacityv:formData.capacityv,
        status: formData.status,
      });

      console.log("Created mosque:", mosque); // للتشخيص
      console.log("Before files:", beforeFiles.length); // للتشخيص
      console.log("After files:", afterFiles.length); // للتشخيص

      // رفع الوسائط إذا كانت موجودة
      let uploadPromises = [];

      if (beforeFiles.length > 0) {
        console.log("Uploading before files:", beforeFiles);
        uploadPromises.push(
          MosqueMediaService.uploadMedia({
            mosque_id: mosque.id,
            media_stage: "before",
            is_main: false,
            media_order: 1,
            files: beforeFiles,
          })
        );
      }

      if (afterFiles.length > 0) {
        console.log("Uploading after files:", afterFiles);
        uploadPromises.push(
          MosqueMediaService.uploadMedia({
            mosque_id: mosque.id,
            media_stage: "after",
            is_main: false,
            media_order: 1,
            files: afterFiles,
          })
        );
      }

      // انتظار رفع جميع الوسائط
      if (uploadPromises.length > 0) {
        try {
          await Promise.all(uploadPromises);
          toast.success(
            `تم حفظ المسجد وتم رفع ${
              beforeFiles.length + afterFiles.length
            } صورة بنجاح!`
          );
        } catch (uploadError) {
          console.error("Media upload error:", uploadError);
          toast.warning(
            `تم حفظ المسجد بنجاح، لكن حدث خطأ في رفع بعض الصور. يمكنك رفعها لاحقاً من صفحة تحرير المسجد.`
          );
        }
      } else {
        toast.success("تم حفظ المسجد بنجاح!");
      }

      // الانتقال إلى صفحة عرض المساجد
      router.push("/dashboard/mosques");
    } catch (err: any) {
      console.error("Error creating mosque:", err);
      setError(
        err.message || "حدث خطأ أثناء إضافة المسجد. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <DashboardHeader
        title="إضافة مسجد جديد"
        description="إضافة مسجد جديد إلى قاعدة البيانات مع جميع التفاصيل والوسائط المطلوبة"
      />

      <div className="p-6">
        <div className="mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-600">
            <Link href="/dashboard" className="hover:text-emerald-600">
              لوحة التحكم
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/dashboard/mosques" className="hover:text-emerald-600">
              إدارة المساجد
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">إضافة مسجد جديد</span>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* النموذج الموحد */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name_ar">اسم المسجد (عربي) *</Label>
                    <Input
                      id="name_ar"
                      name="name_ar"
                      value={formData.name_ar}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المسجد باللغة العربية"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name_en">اسم المسجد (إنجليزي) *</Label>
                    <Input
                      id="name_en"
                      name="name_en"
                      value={formData.name_en}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المسجد باللغة الإنجليزية"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">الحالة</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="مفعل">مفعل</option>
                    <option value="موقوف">موقوف</option>
                    <option value="مكتمل">مكتمل</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="capacityv">عدد المصلين</Label>
                  <Input
                    id="capacityv"
                    name="capacityv"
                    value={formData.capacityv}
                    onChange={handleInputChange}
                    placeholder="أدخل عدد المصلين"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address_text">العنوان التفصيلي</Label>
                  <Textarea
                    id="address_text"
                    name="address_text"
                    value={formData.address_text}
                    onChange={handleInputChange}
                    placeholder="العنوان الكامل والتفصيلي للمسجد"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  معلومات الموقع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="governorate_id">المحافظة *</Label>
                    <GovernorateSelect
                      value={formData.governorate_id}
                      onValueChange={handleGovernorateChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district_id">المنطقة *</Label>
                    <DistrictSelect
                      value={formData.district_id}
                      onValueChange={handleDistrictChange}
                      parentId={
                        formData.governorate_id
                          ? parseInt(formData.governorate_id)
                          : undefined
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sub_district_id">الناحية *</Label>
                    <SubDistrictSelect
                      value={formData.sub_district_id}
                      onValueChange={handleSubDistrictChange}
                      parentId={
                        formData.district_id
                          ? parseInt(formData.district_id)
                          : undefined
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood_id">الحي *</Label>
                    <NeighborhoodSelect
                      value={formData.neighborhood_id}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          neighborhood_id: value,
                        }))
                      }
                      parentId={
                        formData.sub_district_id
                          ? parseInt(formData.sub_district_id)
                          : undefined
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">خط العرض</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="33.5138"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">خط الطول</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="36.2765"
                    />
                  </div>
                </div>

                {/* الخريطة التفاعلية لتحديد الموقع */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    تحديد الموقع على الخريطة
                  </Label>
                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <InteractiveMap
                      center={
                        formData.latitude && formData.longitude
                          ? [
                              parseFloat(formData.latitude),
                              parseFloat(formData.longitude),
                            ]
                          : [33.5138, 36.2765] // Damascus default
                      }
                      zoom={13}
                      className="w-full h-96"
                      interactive={true}
                      onLocationSelect={handleMapClick}
                      selectedLocation={
                        formData.latitude && formData.longitude
                          ? [
                              parseFloat(formData.latitude),
                              parseFloat(formData.longitude),
                            ]
                          : null
                      }
                      showCurrentMarker={false}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    💡 انقر على الخريطة لتحديد موقع المسجد وسيتم تحديث
                    الإحداثيات تلقائياً
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Damage and Cost Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  معلومات الضرر والتكلفة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="damage_level">مستوى الضرر *</Label>
                    <DamageSelect
                      value={formData.damage_level}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          damage_level: value as "جزئي" | "كامل",
                        }))
                      }
                      placeholder="اختر مستوى الضرر"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated_cost">
                      التكلفة المقدرة (ل.س)
                    </Label>
                    <Input
                      id="estimated_cost"
                      name="estimated_cost"
                      type="number"
                      value={formData.estimated_cost}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <StatusSelect
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: value as "مفعل" | "موقوف" | "مكتمل",
                      }))
                    }
                    placeholder="اختر حالة المسجد"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  الوسائط والصور
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* رسالة تعليمات */}
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      قم برفع الصور قبل وبعد الترميم لإظهار التقدم المحرز في
                      المشروع (اختياري). سيتم رفع الصور تلقائياً عند حفظ المسجد.
                    </AlertDescription>
                  </Alert>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* قسم صور قبل الترميم */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-red-700">
                        صور قبل الترميم
                      </h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            handleBeforeFilesChange(
                              Array.from(e.target.files || [])
                            )
                          }
                          className="hidden"
                          id="before-upload"
                        />
                        <label
                          htmlFor="before-upload"
                          className="cursor-pointer flex flex-col items-center gap-4"
                        >
                          <div className="p-4 bg-gray-100 rounded-full">
                            <Upload className="w-8 h-8 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              اختر صور قبل الترميم
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF حتى 10MB
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* معاينة الملفات المحددة */}
                      {beforeFiles.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">
                            الملفات المحددة ({beforeFiles.length})
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {beforeFiles.map((file, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt="معاينة"
                                  className="w-full h-20 object-cover rounded-lg border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    const newFiles = beforeFiles.filter(
                                      (_, i) => i !== index
                                    );
                                    handleBeforeFilesChange(newFiles);
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* قسم صور بعد الترميم */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-green-700">
                        صور بعد الترميم
                      </h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            handleAfterFilesChange(
                              Array.from(e.target.files || [])
                            )
                          }
                          className="hidden"
                          id="after-upload"
                        />
                        <label
                          htmlFor="after-upload"
                          className="cursor-pointer flex flex-col items-center gap-4"
                        >
                          <div className="p-4 bg-gray-100 rounded-full">
                            <Upload className="w-8 h-8 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              اختر صور بعد الترميم
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF حتى 10MB
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* معاينة الملفات المحددة */}
                      {afterFiles.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">
                            الملفات المحددة ({afterFiles.length})
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {afterFiles.map((file, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt="معاينة"
                                  className="w-full h-20 object-cover rounded-lg border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    const newFiles = afterFiles.filter(
                                      (_, i) => i !== index
                                    );
                                    handleAfterFilesChange(newFiles);
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Link href="/dashboard/mosques">
                <Button type="button" variant="outline" disabled={isLoading}>
                  إلغاء
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ المسجد والوسائط
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
