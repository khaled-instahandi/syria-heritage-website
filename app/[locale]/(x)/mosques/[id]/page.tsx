"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
  Clock
} from "lucide-react"
import {
  mockMosques,
  getGovernorateById,
  getDistrictById,
  getProjectsByMosqueId,
  getDonationsByMosqueId,
  getMainImageForMosque,
  getAllImagesForMosque,
  mockProjects,
  mockDonations
} from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function MosqueDetailsPage() {
  const params = useParams()
  const t = useTranslations()
  const mosqueId = parseInt(params.id as string)
  
  const [mosque, setMosque] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [donations, setDonations] = useState<any[]>([])
  const [images, setImages] = useState<string[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // تحميل بيانات المسجد
    const mosqueData = mockMosques.find(m => m.id === mosqueId)
    if (mosqueData) {
      setMosque(mosqueData)
      setProjects(getProjectsByMosqueId(mosqueId))
      setDonations(getDonationsByMosqueId(mosqueId))
      setImages(getAllImagesForMosque(mosqueId))
    }
    setLoading(false)
  }, [mosqueId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">{t('mosques.details.loading')}</p>
        </div>
      </div>
    )
  }

  if (!mosque) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-24 h-24 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('mosques.details.notFound')}</h1>
          <p className="text-slate-600 mb-6">{t('mosques.details.notFoundDesc')}</p>
          <Link href="/mosques">
            <Button>{t('mosques.details.backToMosques')}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const governorate = getGovernorateById(mosque.governorate_id)
  const district = getDistrictById(mosque.district_id)
  const totalRaised = projects.reduce((sum, project) => sum + (project.collected_amount || 0), 0)
  const totalTarget = projects.reduce((sum, project) => sum + (project.cost || 0), 0)
  const progressPercentage = totalTarget > 0 ? (totalRaised / totalTarget) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/mosques">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowRight className="w-4 h-4 ml-2" />
                {t('mosques.details.backToMosquesList')}
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  variant={mosque.damage_level === "كامل" ? "destructive" : "secondary"} 
                  className="text-sm"
                >
                  {t(`mosques.damageLevel.${mosque.damage_level === "جزئي" ? "partial" : "complete"}`)}
                </Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {mosque.status}
                </Badge>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{mosque.name}</h1>
              
              <div className="flex items-center gap-2 text-emerald-100 mb-6">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">
                  {governorate?.name} - {district?.name}
                </span>
              </div>

              {mosque.address_text && (
                <p className="text-emerald-100 text-lg mb-6">{mosque.address_text}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-emerald-300" />
                    <span className="text-emerald-100 text-sm">{t('mosques.details.activeProjects')}</span>
                  </div>
                  <span className="text-2xl font-bold">{projects.length}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-emerald-300" />
                    <span className="text-emerald-100 text-sm">{t('mosques.details.estimatedCost')}</span>
                  </div>
                  <span className="text-xl font-bold">
                    {mosque.estimated_cost ? formatCurrency(mosque.estimated_cost) : t('mosques.details.undefined')}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={images[selectedImageIndex] || mosque.image_url || "/placeholder.svg"}
                  alt={mosque.name}
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
                          ? 'border-white shadow-lg scale-110' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`صورة ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {images.length > 5 && (
                    <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">+{images.length - 5}</span>
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">{t('mosques.details.tabs.overview')}</TabsTrigger>
                <TabsTrigger value="projects">{t('mosques.details.tabs.projects')}</TabsTrigger>
                <TabsTrigger value="donations">{t('mosques.details.tabs.donations')}</TabsTrigger>
                <TabsTrigger value="gallery">{t('mosques.details.tabs.gallery')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {t('mosques.details.overview.description')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 leading-relaxed">
                        {mosque.description || "مسجد تاريخي في منطقة " + district?.name + " بمحافظة " + governorate?.name + ". يحتاج إلى أعمال ترميم وإعادة إعمار للحفاظ على تراثه المعماري الأصيل."}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Progress Overview */}
                  {projects.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          {t('mosques.details.overview.projectsProgress')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">{t('mosques.details.overview.totalRaised')}</span>
                            <span className="font-bold text-emerald-600">
                              {formatCurrency(totalRaised)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">{t('mosques.details.overview.totalTarget')}</span>
                            <span className="font-bold text-slate-900">
                              {formatCurrency(totalTarget)}
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-3" />
                          <div className="text-center">
                            <span className="text-2xl font-bold text-emerald-600">
                              {progressPercentage.toFixed(1)}%
                            </span>
                            <span className="text-slate-600 text-sm block">{t('mosques.details.overview.completionRate')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Specifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {t('mosques.details.overview.specifications')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">{t('mosques.details.overview.damageType')}</span>
                          <Badge variant={mosque.damage_level === "كامل" ? "destructive" : "secondary"}>
                            {mosque.damage_level}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">{t('mosques.details.overview.status')}</span>
                          <Badge variant="outline">{mosque.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">{t('mosques.details.overview.governorate')}</span>
                          <span className="font-medium">{governorate?.name}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">{t('mosques.details.overview.district')}</span>
                          <span className="font-medium">{district?.name}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">{t('mosques.details.overview.registrationDate')}</span>
                          <span className="font-medium">{formatDate(mosque.created_at)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">{t('mosques.details.overview.lastUpdate')}</span>
                          <span className="font-medium">{formatDate(mosque.updated_at)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <div className="space-y-6">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <Card key={project.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
                              <p className="text-slate-600">{project.description}</p>
                            </div>
                            <Badge 
                              variant={
                                project.status === "مكتمل" ? "default" :
                                project.status === "قيد التنفيذ" ? "secondary" : "outline"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-emerald-50 rounded-lg">
                              <div className="text-2xl font-bold text-emerald-600">
                                {formatCurrency(project.collected_amount || 0)}
                              </div>
                              <div className="text-sm text-slate-600">{t('mosques.details.projects.raised')}</div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                              <div className="text-2xl font-bold text-slate-900">
                                {formatCurrency(project.cost)}
                              </div>
                              <div className="text-sm text-slate-600">{t('mosques.details.projects.target')}</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {((project.collected_amount || 0) / project.cost * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm text-slate-600">{t('mosques.details.projects.completionRate')}</div>
                            </div>
                          </div>

                          <Progress 
                            value={(project.collected_amount || 0) / project.cost * 100} 
                            className="mb-4" 
                          />

                          <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                            <span>{t('mosques.details.projects.startDate')}: {formatDate(project.start_date)}</span>
                            {project.end_date && (
                              <span>{t('mosques.details.projects.endDate')}: {formatDate(project.end_date)}</span>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <Link href={`/projects/${project.id}`} className="flex-1">
                              <Button className="w-full" size="sm">
                                {t('mosques.details.projects.viewDetails')}
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              <Heart className="w-4 h-4 ml-2" />
                              {t('mosques.details.projects.donate')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t('mosques.details.projects.noProjects')}</h3>
                        <p className="text-slate-600">{t('mosques.details.projects.noProjectsDesc')}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="donations" className="mt-6">
                <div className="space-y-6">
                  {donations.length > 0 ? (
                    <div>
                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-emerald-600">
                              {donations.length}
                            </div>
                            <div className="text-sm text-slate-600">{t('mosques.details.donations.totalDonations')}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatCurrency(donations.reduce((sum, d) => sum + d.amount, 0))}
                            </div>
                            <div className="text-sm text-slate-600">{t('mosques.details.donations.totalAmount')}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-amber-600">
                              {formatCurrency(donations.reduce((sum, d) => sum + d.amount, 0) / donations.length)}
                            </div>
                            <div className="text-sm text-slate-600">{t('mosques.details.donations.averageDonation')}</div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>{t('mosques.details.donations.latestDonations')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {donations.slice(0, 10).map((donation) => (
                              <div key={donation.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-emerald-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {donation.donor_name || t('mosques.details.donations.anonymousDonor')}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                      {formatDate(donation.donated_at || donation.created_at)}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-left">
                                  <div className="font-bold text-emerald-600">
                                    {formatCurrency(donation.amount)}
                                  </div>
                                  <div className="text-sm text-slate-600">
                                    {donation.payment_method}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Heart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t('mosques.details.donations.noDonations')}</h3>
                        <p className="text-slate-600">{t('mosques.details.donations.noDonationsDesc')}</p>
                      </CardContent>
                    </Card>
                  )}
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
                            src={image}
                            alt={t('mosques.details.gallery.imageAlt', { number: index + 1 })}
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
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t('mosques.details.gallery.noImages')}</h3>
                        <p className="text-slate-600">{t('mosques.details.gallery.noImagesDesc')}</p>
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
                <CardTitle>{t('mosques.details.sidebar.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
                  <Heart className="w-4 h-4 ml-2" />
                  {t('mosques.details.sidebar.donateToMosque')}
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 ml-2" />
                  {t('mosques.details.sidebar.share')}
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 ml-2" />
                  {t('mosques.details.sidebar.downloadReport')}
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 ml-2" />
                  {t('mosques.details.sidebar.viewOnMap')}
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
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
            </Card>

            {/* Related Mosques */}
            <Card>
              <CardHeader>
                <CardTitle>{t('mosques.details.sidebar.relatedMosques')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMosques
                    .filter(m => m.id !== mosqueId && m.governorate_id === mosque.governorate_id)
                    .slice(0, 3)
                    .map((relatedMosque) => (
                      <Link key={relatedMosque.id} href={`/mosques/${relatedMosque.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                          <Image
                            src={relatedMosque.image_url || "/placeholder.svg"}
                            alt={relatedMosque.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{relatedMosque.name}</div>
                            <div className="text-sm text-slate-600 truncate">
                              {getDistrictById(relatedMosque.district_id)?.name}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
