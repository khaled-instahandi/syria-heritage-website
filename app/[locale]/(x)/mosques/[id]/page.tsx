"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DonationDialog } from "@/components/ui/donation-dialog";
import {
  ArrowRight,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  Users,
  Target,
  TrendingUp,
  Image as ImageIcon,
  FileText,
  Heart,
  Share2,
  Download,
  Eye,
  Phone,
  Mail,
  Globe,
  Clock,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { Mosque, Project } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { getFullImageUrl } from "@/lib/data-transformers";

export default function MosqueDetailsPage() {
  const params = useParams();
  const t = useTranslations();
  const mosqueId = parseInt(params.id as string);

  const [mosque, setMosque] = useState<Mosque | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMosqueData();
  }, [mosqueId]);

  const loadMosqueData = async () => {
    try {
      setLoading(true);
      setError(null);

      // جلب بيانات المسجد من الباك إند
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://back-aamar.academy-lead.com/api"
        }/public/onemosquse/${mosqueId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("فشل في جلب بيانات المسجد");
      }

      const data = await response.json();

      if (data.data) {
        setMosque(data.data);

        // معالجة الوسائط إذا كانت موجودة
        if (data.data.media && Array.isArray(data.data.media)) {
          const mediaUrls = data.data.media.map((media: any) => media.file_url);
          setImages(mediaUrls);
        }
      }
    } catch (error: any) {
      console.error("Error loading mosque data:", error);
      setError(error.message || "حدث خطأ في جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">{t("mosques.details.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-24 h-24 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">حدث خطأ</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={loadMosqueData}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  if (!mosque) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-24 h-24 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {t("mosques.details.notFound")}
          </h1>
          <p className="text-slate-600 mb-6">
            {t("mosques.details.notFoundDesc")}
          </p>
          <Link href="/mosques">
            <Button>{t("mosques.details.backToMosques")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  // دالة لفتح الخريطة
  const openMap = () => {
    if (mosque.latitude && mosque.longitude) {
      const lat = parseFloat(mosque.latitude);
      const lng = parseFloat(mosque.longitude);

      // إنشاء رابط Google Maps
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&t=m`;

      // فتح الخريطة في نافذة جديدة
      window.open(googleMapsUrl, "_blank");
    } else {
      // في حالة عدم وجود إحداثيات، البحث بالاسم والموقع
      const searchQuery = encodeURIComponent(
        `${mosque.name_ar} ${mosque.governorate_ar} ${mosque.district_ar} Syria`
      );
      const googleMapsSearchUrl = `https://www.google.com/maps/search/${searchQuery}`;
      window.open(googleMapsSearchUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/mosques">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                {t("mosques.details.backToMosquesList")}
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant={
                    mosque.damage_level === "كامل" ? "destructive" : "secondary"
                  }
                  className="text-sm"
                >
                  {t(
                    `mosques.damageLevel.${
                      mosque.damage_level === "جزئي" ? "partial" : "complete"
                    }`
                  )}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/20 text-white border-white/30"
                >
                  {mosque.status}
                </Badge>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                {mosque[`name_${params.locale}`]}
              </h1>

              <div className="flex items-center gap-2 text-emerald-100 mb-6">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">
                  {mosque[`governorate_${params.locale}`]} -{" "}
                  {mosque[`district_${params.locale}`]}
                </span>
              </div>

              {mosque.address_text && (
                <p className="text-emerald-100 text-lg mb-6">
                  {mosque.address_text}
                </p>
              )}

              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-emerald-300" />
                    <span className="text-emerald-100 text-sm">
                      {t("mosques.details.estimatedCost")}
                    </span>
                  </div>
                  <span className="text-xl font-bold">
                    {mosque.estimated_cost
                      ? formatCurrency(parseFloat(mosque.estimated_cost))
                      : t("mosques.details.undefined")}
                  </span>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-emerald-300" />
                    <span className="text-emerald-100 text-sm">
                      {t("mosques.details.total_donations")}
                    </span>
                  </div>
                  <span className="text-xl font-bold">
                    {mosque.total_donations
                      ? formatCurrency(parseFloat(mosque.total_donations))
                      : t("mosques.details.undefined")}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={
                    getFullImageUrl(images[selectedImageIndex]) ||
                    "/placeholder.svg"
                  }
                  alt={mosque.name_ar}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 mt-4 justify-center">
                  {images.slice(0, 5).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-white shadow-lg scale-110"
                          : "border-white/30 hover:border-white/60"
                      }`}
                    >
                      <Image
                        src={getFullImageUrl(image)}
                        alt={`صورة ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {images.length > 5 && (
                    <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        +{images.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">
                  {t("mosques.details.tabs.overview")}
                </TabsTrigger>
                <TabsTrigger value="gallery">
                  {t("mosques.details.tabs.gallery")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {t("mosques.details.overview.description")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 leading-relaxed">
                        {params.locale === "ar"
                          ? `مسجد تاريخي في منطقة ${mosque.district_ar} بمحافظة ${mosque.governorate_ar}. يحتاج إلى أعمال ترميم وإعادة إعمار للحفاظ على طابعه المعماري الأصيل.`
                          : `A historic mosque in ${mosque.district_en}, ${mosque.governorate_en}. It needs restoration and reconstruction work to preserve its original architectural character.`}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Specifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {t("mosques.details.overview.specifications")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">
                            {t("mosques.details.overview.damageType")}
                          </span>
                          <Badge
                            variant={
                              mosque.damage_level === "كامل"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {mosque.damage_level}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">
                            {t("mosques.details.overview.status")}
                          </span>
                          <Badge variant="outline">{mosque.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">
                            {t("mosques.details.overview.governorate")}
                          </span>
                          <span className="font-medium">
                            {mosque[`governorate_${params.locale}`]}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">
                            {t("mosques.details.overview.district")}
                          </span>
                          <span className="font-medium">
                            {mosque[`district_${params.locale}`]}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">
                            {t("mosques.details.overview.subDistrict")}
                          </span>
                          <span className="font-medium">
                            {mosque[`sub_district_${params.locale}`]}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">
                            {t("mosques.details.overview.neighborhood")}
                          </span>
                          <span className="font-medium">
                            {mosque[`neighborhood_${params.locale}`]}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">
                            {t("mosques.details.overview.projectType")}
                          </span>
                          <span className="font-medium">
                            {mosque.project_category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">
                            {t("mosques.details.overview.damageLevel")}
                          </span>
                          <span className="font-medium">
                            {mosque.damage_level}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">
                            {t("mosques.details.overview.registrationDate")}
                          </span>
                          <span className="font-medium">
                            {formatDate(mosque.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">
                            {t("mosques.details.overview.createdBy")}
                          </span>
                          <span className="font-medium">
                            {mosque.created_by}
                          </span>
                        </div>
                        {/* capacityv */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">
                            {t("mosques.details.overview.capacityv")}
                          </span>
                          <span className="font-medium">
                            {mosque.capacityv || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6">
                <div className="space-y-6">
                  {images.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <Image
                            src={getFullImageUrl(image)}
                            alt={t("mosques.details.gallery.imageAlt", {
                              number: index + 1,
                            })}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <ImageIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {t("mosques.details.gallery.noImages")}
                        </h3>
                        <p className="text-slate-600">
                          {t("mosques.details.gallery.noImagesDesc")}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("mosques.details.sidebar.quickActions")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <DonationDialog
                  mosqueId={mosque.id}
                  mosqueName={mosque[`name_${params.locale}`]}
                />
                {/* <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 ml-2" />
                  {t('mosques.details.sidebar.share')}
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 ml-2" />
                  {t('mosques.details.sidebar.downloadReport')}
                </Button> */}
                <Button variant="outline" className="w-full" onClick={openMap}>
                  <Eye className="w-4 h-4 ml-2" />
                  {t("mosques.details.sidebar.viewOnMap")}
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            {/* <Card>
              <CardHeader>
                <CardTitle>{t('mosques.details.sidebar.contactInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="font-medium">{t('mosques.details.sidebar.phone')}</div>
                    <div className="text-sm text-slate-600">+963-XX-XXXXXXX</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="font-medium">{t('mosques.details.sidebar.email')}</div>
                    <div className="text-sm text-slate-600">info@mosque.org</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="font-medium">{t('mosques.details.sidebar.website')}</div>
                    <div className="text-sm text-slate-600">www.mosque.org</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="font-medium">{t('mosques.details.sidebar.visitingHours')}</div>
                    <div className="text-sm text-slate-600">{t('mosques.details.sidebar.dailyHours')}</div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Related Mosques */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("mosques.details.sidebar.relatedMosques")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4">
                  <p className="text-slate-600 text-sm">
                    سيتم إضافة المساجد ذات الصلة قريباً
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
